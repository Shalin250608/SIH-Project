const express = require('express');
const router = express.Router();
const { db } = require('../db');

const VALID_STATUSES = [
  'SUBMITTED',
  'UNDER_VERIFICATION',
  'DOCS_APPROVED',
  'SANCTIONED',
  'DISBURSED',
  'REJECTED'
];

// GET /api/officer/applications
router.get('/applications', (req, res) => {
  try {
    const { status, district, search } = req.query;

    let query = 'SELECT * FROM applications WHERE 1=1';
    const params = [];

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (district && district !== 'ALL') {
      query += ' AND district = ?';
      params.push(district);
    }
    if (search) {
      query += ' AND (ref_id LIKE ? OR applicant_name LIKE ? OR mobile LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY created_at DESC';

    const apps = db.prepare(query).all(...params);
    return res.json({
      success: true,
      count: apps.length,
      applications: apps
    });
  } catch (err) {
    console.error('Officer get applications error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch applications for review' });
  }
});

// GET /api/officer/stats
router.get('/stats', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as c, SUM(loan_amount) as s FROM applications').get();
    const submitted = db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'SUBMITTED'").get().c;
    const underVerification = db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'UNDER_VERIFICATION'").get().c;
    const docsApproved = db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'DOCS_APPROVED'").get().c;
    const sanctioned = db.prepare("SELECT COUNT(*) as c, SUM(loan_amount) as s FROM applications WHERE status = 'SANCTIONED'").get();
    const disbursed = db.prepare("SELECT COUNT(*) as c, SUM(loan_amount) as s FROM applications WHERE status = 'DISBURSED'").get();
    const rejected = db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'REJECTED'").get().c;

    return res.json({
      success: true,
      stats: {
        totalApplications: total.c,
        totalRequestedAmount: total.s || 0,
        submitted,
        underVerification,
        docsApproved,
        sanctionedCount: sanctioned.c,
        sanctionedAmount: sanctioned.s || 0,
        disbursedCount: disbursed.c,
        disbursedAmount: disbursed.s || 0,
        rejected
      }
    });
  } catch (err) {
    console.error('Officer stats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to compute portal statistics' });
  }
});

// PUT /api/officer/applications/:refId/status
router.put('/applications/:refId/status', (req, res) => {
  try {
    const rawRef = (req.params.refId || '').trim().toUpperCase();
    const { status, notes, officerName } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const app = db.prepare('SELECT * FROM applications WHERE UPPER(ref_id) = ?').get(rawRef);
    if (!app) {
      return res.status(404).json({ success: false, error: `Application ${rawRef} not found` });
    }

    const officer = officerName || 'GSCDC Verification Officer';
    const noteText = notes || `Status updated to ${status} by ${officer}.`;

    // Update application record
    db.prepare(`
      UPDATE applications
      SET status = ?, officer_notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, noteText, app.id);

    // Insert history entry
    db.prepare(`
      INSERT INTO application_history (ref_id, status, action_by, note)
      VALUES (?, ?, ?, ?)
    `).run(app.ref_id, status, officer, noteText);

    const updatedApp = db.prepare('SELECT * FROM applications WHERE id = ?').get(app.id);

    return res.json({
      success: true,
      message: `Application ${app.ref_id} successfully updated to ${status}`,
      application: updatedApp
    });
  } catch (err) {
    console.error('Status update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update application status' });
  }
});

module.exports = router;