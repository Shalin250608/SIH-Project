const express = require('express');
const router = express.Router();
const { db, hashPassword, verifyPassword, createToken, verifyToken } = require('../db');

// Middleware to extract logged-in user from Bearer token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication token required' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session token' });
  }
  req.user = payload;
  next();
}

// Optional auth middleware (doesn't fail if token absent)
function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { name, mobile, password, district, is_sc } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required' });
    }
    const cleanMobile = (mobile || '').replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, error: 'Valid 10-digit mobile number required' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE mobile = ?').get(cleanMobile);
    if (existing) {
      return res.status(409).json({ success: false, error: 'A citizen account with this mobile number already exists. Please log in.' });
    }

    const { salt, hash } = hashPassword(password);
    const scFlag = is_sc === false || is_sc === 0 ? 0 : 1;
    const cleanDistrict = district || 'Ahmedabad';

    const result = db.prepare(`
      INSERT INTO users (name, mobile, password_hash, salt, district, is_sc, role)
      VALUES (?, ?, ?, ?, ?, ?, 'citizen')
    `).run(name.trim(), cleanMobile, hash, salt, cleanDistrict, scFlag);

    const user = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      mobile: cleanMobile,
      district: cleanDistrict,
      is_sc: scFlag,
      role: 'citizen'
    };

    const token = createToken({ id: user.id, mobile: user.mobile, role: user.role, name: user.name });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      user,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { mobile, password } = req.body;
    const cleanMobile = (mobile || '').replace(/\D/g, '');

    if (!cleanMobile || !password) {
      return res.status(400).json({ success: false, error: 'Mobile and password are required' });
    }

    const row = db.prepare('SELECT * FROM users WHERE mobile = ?').get(cleanMobile);
    if (!row) {
      return res.status(401).json({ success: false, error: 'Mobile number not found. Please register first.' });
    }

    const isValid = verifyPassword(password, row.salt, row.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Try demo password (1234 or admin123).' });
    }

    const user = {
      id: row.id,
      name: row.name,
      mobile: row.mobile,
      district: row.district,
      is_sc: row.is_sc,
      role: row.role
    };

    const token = createToken({ id: user.id, mobile: user.mobile, role: user.role, name: user.name });

    return res.json({
      success: true,
      message: 'Logged in successfully',
      user,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  try {
    const row = db.prepare('SELECT id, name, mobile, district, is_sc, role, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }
    return res.json({ success: true, user: row });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve profile' });
  }
});

module.exports = {
  router,
  authMiddleware,
  optionalAuthMiddleware
};