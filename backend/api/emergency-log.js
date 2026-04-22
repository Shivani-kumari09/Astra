/**
 * Astra — server-side log when a user confirms an emergency dial intent.
 * Lives in `backend/api`. Expose as POST /api/emergency-log from your server (e.g. Express on Render).
 * No database — events appear in server logs for operational awareness.
 */

const KNOWN_SHORT = new Set([
  '112', '100', '101', '102', '108', '1091', '1098', '1930', '181', '139'
]);

function digitsOnly(v) {
  return String(v || '').replace(/\D/g, '').slice(0, 20);
}

function isAllowedNumber(d) {
  if (!d || d.length < 2) return false;
  if (d.length <= 4) return KNOWN_SHORT.has(d);
  if (d.length >= 8 && d.length <= 15) return true;
  return false;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = {};
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    body = req.body;
  } else if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body || '{}');
    } catch {
      return res.status(400).json({ ok: false, error: 'invalid_json' });
    }
  }

  const number = digitsOnly(body.number);
  const label = String(body.label || '')
    .replace(/[\r\n<>]/g, ' ')
    .slice(0, 120);

  if (!isAllowedNumber(number)) {
    return res.status(400).json({ ok: false, error: 'invalid_number' });
  }

  const payload = {
    event: 'emergency_dial_intent',
    number,
    label: label || undefined,
    at: new Date().toISOString()
  };

  if (process.env.ASTRA_LOG_VERBOSE === '1' || process.env.SAFEHER_LOG_VERBOSE === '1') {
    payload.source = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
  }

  console.log(JSON.stringify(payload));

  return res.status(204).end();
};
