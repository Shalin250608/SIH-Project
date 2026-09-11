const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const crypto = require('node:crypto');

const DB_PATH = path.join(__dirname, 'sparkline.db');
const JWT_SECRET = process.env.JWT_SECRET || 'sparkline_sih2026_super_secret_key_9921';

// Open / create the database
const db = new DatabaseSync(DB_PATH);

// Initialize schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mobile TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      district TEXT,
      is_sc INTEGER DEFAULT 1,
      role TEXT DEFAULT 'citizen',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref_id TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      applicant_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      district TEXT NOT NULL,
      annual_income REAL NOT NULL,
      is_sc INTEGER DEFAULT 1,
      scheme_code TEXT NOT NULL,
      scheme_name TEXT NOT NULL,
      purpose_type TEXT NOT NULL,
      specific_purpose TEXT,
      project_cost REAL NOT NULL,
      loan_amount REAL NOT NULL,
      promoter_contribution REAL NOT NULL,
      interest_rate REAL NOT NULL,
      tenure_years INTEGER NOT NULL,
      moratorium_months INTEGER DEFAULT 0,
      monthly_emi REAL NOT NULL,
      partner_name TEXT,
      partner_district TEXT,
      status TEXT DEFAULT 'SUBMITTED',
      officer_notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS application_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref_id TEXT NOT NULL,
      status TEXT NOT NULL,
      action_by TEXT NOT NULL,
      note TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS policy_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed default policy settings
  const ceilingCheck = db.prepare("SELECT value FROM policy_settings WHERE key = 'income_ceiling'").get();
  if (!ceilingCheck) {
    db.prepare("INSERT INTO policy_settings (key, value) VALUES ('income_ceiling', '300000')").run();
  }

  // Seed default demo citizen user
  const userCheck = db.prepare("SELECT id FROM users WHERE mobile = '9876543210'").get();
  if (!userCheck) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('1234', salt, 1000, 64, 'sha512').toString('hex');
    db.prepare(`
      INSERT INTO users (name, mobile, password_hash, salt, district, is_sc, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('Ramesh Vankar', '9876543210', hash, salt, 'Ahmedabad', 1, 'citizen');
  }

  // Seed default officer user
  const officerCheck = db.prepare("SELECT id FROM users WHERE mobile = '9800000001'").get();
  if (!officerCheck) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('admin123', salt, 1000, 64, 'sha512').toString('hex');
    db.prepare(`
      INSERT INTO users (name, mobile, password_hash, salt, district, is_sc, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('S. K. Mehta (GSCDC Officer)', '9800000001', hash, salt, 'Ahmedabad', 1, 'officer');
  }

  // Seed 1 initial realistic application if none exist
  const appCount = db.prepare("SELECT COUNT(*) as count FROM applications").get();
  if (appCount.count === 0) {
    const refId = 'SPARK-2026-GJ-88412';
    db.prepare(`
      INSERT INTO applications (
        ref_id, user_id, applicant_name, mobile, district, annual_income,
        is_sc, scheme_code, scheme_name, purpose_type, specific_purpose,
        project_cost, loan_amount, promoter_contribution, interest_rate,
        tenure_years, moratorium_months, monthly_emi, partner_name,
        partner_district, status, officer_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      refId, 1, 'Ramesh Vankar', '9876543210', 'Ahmedabad', 180000,
      1, 'MFS', 'Micro Financing Scheme (MFS)', 'business', 'small_shop',
      140000, 140000, 0, 6.5,
      5, 3, 2739, 'GSCDC Head Office - Gandhinagar',
      'Gandhinagar', 'UNDER_VERIFICATION', 'Application received and undergoing scrutiny at GSCDC Ahmedabad branch.'
    );

    db.prepare(`
      INSERT INTO application_history (ref_id, status, action_by, note)
      VALUES (?, ?, ?, ?)
    `).run(refId, 'SUBMITTED', 'Citizen Portal', 'Dossier submitted online with project cost ₹1,40,000 for Small Grocery Shop.');

    db.prepare(`
      INSERT INTO application_history (ref_id, status, action_by, note)
      VALUES (?, ?, ?, ?)
    `).run(refId, 'UNDER_VERIFICATION', 'S. K. Mehta (GSCDC Officer)', 'Caste certificate verified via Gujarat e-Samaj Kalyan records. Field inspection scheduled.');
  }
}

// Password helpers
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, storedHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === storedHash;
}

// Lightweight secure session tokens (HMAC-SHA256)
function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

// Generate application reference number (e.g., SPARK-2026-GJ-58219)
function generateRefId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SPARK-2026-GJ-${randomNum}`;
}

// Initialize on module load
initSchema();

module.exports = {
  db,
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  generateRefId
};