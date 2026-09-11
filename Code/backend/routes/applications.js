const express = require('express');
const router = express.Router();
const { db, generateRefId } = require('../db');
const { authMiddleware, optionalAuthMiddleware } = require('./auth');

// Map statuses to step index (1-5)
const STATUS_STEP_MAP = {
  'SUBMITTED': 1,
  'UNDER_VERIFICATION': 2,
  'DOCS_APPROVED': 3,
  'SANCTIONED': 4,
  'DISBURSED': 5,
  'REJECTED': -1
};

// POST /api/applications/submit
router.post('/submit', optionalAuthMiddleware, (req, res) => {
  try {
    const data = req.body || {};

    const applicantName = (data.applicantName || req.user?.name || 'Applicant').trim();
    const mobile = ((data.mobile || req.user?.mobile || '').replace(/\D/g, '')) || '9876543210';
    const district = data.district || 'Ahmedabad';
    const annualIncome = Number(data.annualIncome || 0);
    const isSC = (data.isSC === false || data.isSC === 0) ? 0 : 1;

    const schemeCode = data.schemeCode || 'MFS';
    const schemeName = data.schemeName || 'Micro Financing Scheme';
    const purposeType = data.purposeType || 'business';
    const specificPurpose = data.specificPurpose || '';

    const projectCost = Number(data.projectCost || 100000);
    const loanAmount = Number(data.loanAmount || (projectCost * 0.9));
    const promoterContribution = Number(data.promoterContribution || (projectCost - loanAmount));
    const interestRate = Number(data.interestRate || 6.5);
    const tenureYears = Number(data.tenureYears || 5);
    const moratoriumMonths = Number(data.moratoriumMonths || 0);
    const monthlyEMI = Number(data.monthlyEMI || 0);

    const partnerName = data.partnerName || 'GSCDC District Office';
    const partnerDistrict = data.partnerDistrict || district;

    // Generate unique reference ID
    let refId = generateRefId();
    while (db.prepare('SELECT id FROM applications WHERE ref_id = ?').get(refId)) {
      refId = generateRefId();
    }

    const userId = req.user?.id || null;

    db.prepare(`
      INSERT INTO applications (
        ref_id, user_id, applicant_name, mobile, district, annual_income,
        is_sc, scheme_code, scheme_name, purpose_type, specific_purpose,
        project_cost, loan_amount, promoter_contribution, interest_rate,
        tenure_years, moratorium_months, monthly_emi, partner_name,
        partner_district, status, officer_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?)
    `).run(
      refId, userId, applicantName, mobile, district, annualIncome,
      isSC, schemeCode, schemeName, purposeType, specificPurpose,
      projectCost, loanAmount, promoterContribution, interestRate,
      tenureYears, moratoriumMonths, monthlyEMI, partnerName,
      partnerDistrict, 'Dossier successfully registered on citizen portal.'
    );

    // Record initial timeline event
    db.prepare(`
      INSERT INTO application_history (ref_id, status, action_by, note)
      VALUES (?, 'SUBMITTED', 'Citizen Portal', ?)
    `).run(refId, `Application submitted for ₹${loanAmount.toLocaleString('en-IN')} under ${schemeName}. Assigned to ${partnerName}.`);

    const appRecord = db.prepare('SELECT * FROM applications WHERE ref_id = ?').get(refId);

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      refId,
      application: appRecord
    });
  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ success: false, error: 'Failed to record application in portal' });
  }
});

// GET /api/applications/track/:refId
router.get('/track/:refId', (req, res) => {
  try {
    const rawRef = (req.params.refId || '').trim().toUpperCase();
    if (!rawRef) {
      return res.status(400).json({ success: false, error: 'Reference ID is required' });
    }

    const app = db.prepare('SELECT * FROM applications WHERE UPPER(ref_id) = ?').get(rawRef);
    if (!app) {
      return res.status(404).json({
        success: false,
        error: `No application found for Reference Number ${rawRef}. Please verify the number.`
      });
    }

    const history = db.prepare('SELECT * FROM application_history WHERE ref_id = ? ORDER BY timestamp ASC').all(app.ref_id);

    const currentStep = STATUS_STEP_MAP[app.status] || 1;
    const isRejected = app.status === 'REJECTED';

    return res.json({
      success: true,
      application: app,
      history,
      currentStep,
      isRejected
    });
  } catch (err) {
    console.error('Track error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve application tracking details' });
  }
});

// GET /api/applications/my
router.get('/my', authMiddleware, (req, res) => {
  try {
    const apps = db.prepare(`
      SELECT * FROM applications
      WHERE user_id = ? OR mobile = ?
      ORDER BY created_at DESC
    `).all(req.user.id, req.user.mobile);

    return res.json({
      success: true,
      applications: apps
    });
  } catch (err) {
    console.error('My applications error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch citizen applications' });
  }
});

module.exports = router;