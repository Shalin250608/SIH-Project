const express = require('express');
const router = express.Router();
const { db } = require('../db');

// GET /api/policy/income-ceiling
router.get('/income-ceiling', (req, res) => {
  try {
    const row = db.prepare("SELECT value FROM policy_settings WHERE key = 'income_ceiling'").get();
    const ceiling = row ? Number(row.value) : 300000;
    return res.json({ success: true, incomeCeiling: ceiling });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch policy' });
  }
});

// PUT /api/policy/income-ceiling
router.put('/income-ceiling', (req, res) => {
  try {
    const { ceiling } = req.body;
    const num = Number(ceiling);
    if (isNaN(num) || num < 50000) {
      return res.status(400).json({ success: false, error: 'Invalid income ceiling value' });
    }

    db.prepare(`
      INSERT INTO policy_settings (key, value, updated_at)
      VALUES ('income_ceiling', ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(String(num));

    return res.json({ success: true, incomeCeiling: num, message: 'Income ceiling updated successfully' });
  } catch (err) {
    console.error('Update ceiling error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update income ceiling' });
  }
});

module.exports = router;