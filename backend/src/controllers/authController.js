const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../db');

const SALT_ROUNDS = 12;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Signup: hash plain password once with bcrypt, store only the hash.
 * Never re-hash password_hash from the client.
 */
async function signup(req, res) {
  try {
    const { email, password, name } = req.body || {};
    const normEmail = normalizeEmail(email);
    const plain = String(password || '');

    if (!normEmail || !plain) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' });
    }
    if (plain.length < 8) {
      return res.status(400).json({ ok: false, error: 'Password must be at least 8 characters.' });
    }

    console.log('[auth:signup] attempt', { email: normEmail });

    const pool = getPool();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normEmail]);
    if (existing.rows.length > 0) {
      console.log('[auth:signup] conflict — email already registered', { email: normEmail });
      return res.status(409).json({ ok: false, error: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(plain, SALT_ROUNDS);

    const insert = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [normEmail, password_hash, String(name || '').trim()]
    );

    const row = insert.rows[0];
    console.log('[auth:signup] success', { id: row.id, email: row.email });

    return res.status(201).json({
      ok: true,
      message: 'Account created successfully.',
      user: { id: row.id, email: row.email, name: row.name }
    });
  } catch (err) {
    console.error('[auth:signup] error', err.code || err.name, err.message);
    return res.status(500).json({ ok: false, error: 'Server error during signup.' });
  }
}

/**
 * Login: load user by normalized email, bcrypt.compare(plain, stored_hash).
 * Order matters: bcrypt.compare(plainPassword, hashFromDb) — not the reverse.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    const normEmail = normalizeEmail(email);
    const plain = String(password || '');

    if (!normEmail || !plain) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' });
    }

    console.log('[auth:login] attempt', { email: normEmail });

    const pool = getPool();
    const result = await pool.query(
      'SELECT id, email, password_hash, name FROM users WHERE email = $1',
      [normEmail]
    );

    if (result.rows.length === 0) {
      console.log('[auth:login] no row for email (same response as bad password)', { email: normEmail });
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const stored = user.password_hash;

    if (!stored || typeof stored !== 'string') {
      console.error('[auth:login] user missing password_hash', { userId: user.id, email: normEmail });
      return res.status(500).json({ ok: false, error: 'Account data is incomplete. Please reset your password.' });
    }

    const match = await bcrypt.compare(plain, stored);
    console.log('[auth:login] bcrypt.compare result', { email: normEmail, match });

    if (!match) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[auth:login] JWT_SECRET is not set');
      return res.status(500).json({ ok: false, error: 'Server misconfiguration.' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '7d' });

    console.log('[auth:login] success', { id: user.id, email: user.email });

    return res.json({
      ok: true,
      message: 'Signed in successfully.',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('[auth:login] error', err.code || err.name, err.message);
    return res.status(500).json({ ok: false, error: 'Server error during login.' });
  }
}

module.exports = { signup, login, normalizeEmail };
