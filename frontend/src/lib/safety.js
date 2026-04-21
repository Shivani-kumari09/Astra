function emergencyLogPostUrl() {
  const fromEnv = String(import.meta.env.VITE_API_URL || '')
    .trim()
    .replace(/\/$/, '');
  if (fromEnv) return `${fromEnv}/api/emergency-log`;
  if (typeof window === 'undefined') return '';
  const { protocol, origin } = window.location;
  if (!protocol || protocol === 'file:') return '';
  const sameOrigin = (origin && origin !== 'null' ? origin : '') + '/api/emergency-log';
  return sameOrigin.startsWith('http') ? sameOrigin : '';
}

export function astraLogEmergencyDialIntent(digits, label) {
  try {
    if (typeof fetch !== 'function' || typeof window === 'undefined') return;
    const url = emergencyLogPostUrl();
    if (!url) return;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: digits, label: label || '' }),
      keepalive: true
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export function astraEmergencyTel(rawNumber, label) {
  const digits = String(rawNumber || '').replace(/\D/g, '');
  if (!digits) {
    alert('Invalid number.');
    return;
  }
  const line = label ? `${label} (${digits})` : digits;
  if (!confirm(`Call ${line} now?\n\nYour phone will open the dialer.`)) return;
  astraLogEmergencyDialIntent(digits, label || '');
  window.location.href = `tel:${digits}`;
}

export function callHelpline(num) {
  astraEmergencyTel(num, null);
}

export function openSmsToNumber(digits, body) {
  if (!digits) return;
  window.location.href = 'sms:' + digits + '?body=' + encodeURIComponent(body);
}

export function buildSosMessage(mapUrl) {
  let t = '🆘 SOS — I need help right now. (Astra)';
  if (mapUrl) t += '\n\nMy location: ' + mapUrl;
  else t += '\n\n(I could not attach GPS — please call me.)';
  return t;
}

export function shareLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported on this browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const url = `https://maps.google.com/?q=${lat},${lng}`;
      const msg = `🆘 I am sharing my live location: ${url}`;
      if (navigator.share) {
        navigator.share({ title: 'My Location – Astra', text: msg, url }).catch(() => {});
      } else {
        prompt('Copy and share this link with someone you trust:', url);
      }
    },
    () => alert('Location access denied. Please enable GPS.')
  );
}
