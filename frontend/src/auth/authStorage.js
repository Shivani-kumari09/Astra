const SESSION_KEY = 'astra_session';
const USERS_KEY = 'astra_users';

function migrate() {
  try {
    if (!localStorage.getItem(SESSION_KEY)) {
      for (const k of ['aatra_session', 'safeher_session']) {
        const v = localStorage.getItem(k);
        if (v) {
          localStorage.setItem(SESSION_KEY, v);
          localStorage.removeItem(k);
          break;
        }
      }
    }
    if (!localStorage.getItem(USERS_KEY)) {
      for (const k of ['aatra_users', 'safeher_users']) {
        const v = localStorage.getItem(k);
        if (v) {
          localStorage.setItem(USERS_KEY, v);
          localStorage.removeItem(k);
          break;
        }
      }
    }
  } catch {
    /* ignore */
  }
}

migrate();

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(data) {
  if (data) localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  else localStorage.removeItem(SESSION_KEY);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function login(email, password) {
  const e = (email || '').trim().toLowerCase();
  const p = String(password || '').trim();
  if (!e || !p) return { ok: false, msg: 'Enter email and password.' };
  const users = getUsers();
  const byEmail = users.find((x) => (x.email || '').toLowerCase() === e);
  if (import.meta.env.DEV) {
    const stored = byEmail ? String(byEmail.password || '') : '';
    const looksHashed = /^\$2[aby]\$\d{2}\$/.test(stored);
    console.log('[authStorage:login]', {
      email: e,
      userFound: !!byEmail,
      looksBcrypt: looksHashed,
      plainLen: p.length,
      storedLen: stored.length
    });
    if (byEmail && looksHashed) {
      console.warn(
        '[authStorage:login] Stored password looks bcrypt-hashed. Local demo auth expects plain text, or use a backend API with bcrypt.compare().'
      );
    }
  }
  const u = users.find((x) => (x.email || '').toLowerCase() === e && String(x.password || '').trim() === p);
  if (!u) return { ok: false, msg: 'Invalid email or password.' };
  setSession({ email: u.email, name: u.name || '' });
  return { ok: true };
}

export function register(data) {
  const email = (data.email || '').trim().toLowerCase();
  const password = String(data.password || '').trim();
  if (!email || !password) return { ok: false, msg: 'Email and password are required.' };
  const users = getUsers();
  if (users.some((x) => (x.email || '').toLowerCase() === email)) {
    return { ok: false, msg: 'An account with this email already exists. Sign in instead.' };
  }
  if (import.meta.env.DEV) {
    console.log('[authStorage:register]', { email, passwordLen: password.length });
  }
  users.push({
    email,
    name: (data.name || '').trim(),
    phone: (data.phone || '').trim(),
    city: (data.city || '').trim(),
    concern: data.concern || '',
    password,
    contacts: Array.isArray(data.contacts) ? data.contacts : []
  });
  saveUsers(users);
  setSession({ email, name: (data.name || '').trim() });
  return { ok: true };
}

export function getCurrentUser() {
  const s = getSession();
  if (!s) return null;
  const users = getUsers();
  return users.find((x) => (x.email || '').toLowerCase() === (s.email || '').toLowerCase()) || null;
}

export function getEmergencyContacts() {
  const u = getCurrentUser();
  if (!u || !u.contacts) return [];
  return u.contacts.filter((c) => c && (c.name || c.phone));
}

export function saveEmergencyContacts(contacts) {
  const s = getSession();
  if (!s) return false;
  const users = getUsers();
  const i = users.findIndex((x) => (x.email || '').toLowerCase() === (s.email || '').toLowerCase());
  if (i === -1) return false;
  users[i].contacts = contacts;
  saveUsers(users);
  return true;
}

export function digitsOnly(phone) {
  return String(phone || '').replace(/\D/g, '');
}
