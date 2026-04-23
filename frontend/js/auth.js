(function () {
  var SESSION_KEY = 'astra_session';
  var USERS_KEY = 'astra_users';

  try {
    if (!localStorage.getItem(SESSION_KEY)) {
      var sk = ['aatra_session', 'safeher_session'];
      for (var si = 0; si < sk.length; si++) {
        var sv = localStorage.getItem(sk[si]);
        if (sv) {
          localStorage.setItem(SESSION_KEY, sv);
          localStorage.removeItem(sk[si]);
          break;
        }
      }
    }
    if (!localStorage.getItem(USERS_KEY)) {
      var uk = ['aatra_users', 'safeher_users'];
      for (var ui = 0; ui < uk.length; ui++) {
        var uv = localStorage.getItem(uk[ui]);
        if (uv) {
          localStorage.setItem(USERS_KEY, uv);
          localStorage.removeItem(uk[ui]);
          break;
        }
      }
    }
  } catch (e) {
    /* ignore */
  }

  function inPagesFolder() {
    return /\/pages\//.test(location.pathname) || location.href.indexOf('/pages/') !== -1;
  }

  function loginPath() {
    return inPagesFolder() ? '../login.html' : 'login.html';
  }

  function getUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  window.astraGetSession = getSession;

  window.requireAuth = function () {
    if (!getSession()) {
      location.replace(loginPath());
    }
  };

  window.astraLogin = function (email, password) {
    var e = (email || '').trim().toLowerCase();
    if (!e || !password) return { ok: false, msg: 'Enter email and password.' };
    var users = getUsers();
    var u = users.find(function (x) {
      return (x.email || '').toLowerCase() === e && x.password === password;
    });
    if (!u) return { ok: false, msg: 'Invalid email or password.' };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: u.email, name: u.name || '' }));
    return { ok: true };
  };

  window.astraRegister = function (data) {
    var email = (data.email || '').trim().toLowerCase();
    if (!email || !data.password) return { ok: false, msg: 'Email and password are required.' };
    var users = getUsers();
    if (users.some(function (x) { return (x.email || '').toLowerCase() === email; })) {
      return { ok: false, msg: 'An account with this email already exists. Sign in instead.' };
    }
    users.push({
      email: email,
      name: (data.name || '').trim(),
      phone: (data.phone || '').trim(),
      city: (data.city || '').trim(),
      concern: data.concern || '',
      password: data.password,
      contacts: Array.isArray(data.contacts) ? data.contacts : []
    });
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: email, name: (data.name || '').trim() }));
    return { ok: true };
  };

  window.astraLogout = function () {
    localStorage.removeItem(SESSION_KEY);
    location.href = loginPath();
  };

  window.astraGetCurrentUser = function () {
    var s = getSession();
    if (!s) return null;
    var users = getUsers();
    return users.find(function (x) { return (x.email || '').toLowerCase() === (s.email || '').toLowerCase(); }) || null;
  };

  window.astraGetEmergencyContacts = function () {
    var u = window.astraGetCurrentUser();
    if (!u || !u.contacts) return [];
    return u.contacts.filter(function (c) { return c && (c.name || c.phone); });
  };

  window.astraSaveEmergencyContacts = function (contacts) {
    var s = getSession();
    if (!s) return false;
    var users = getUsers();
    var i = users.findIndex(function (x) {
      return (x.email || '').toLowerCase() === (s.email || '').toLowerCase();
    });
    if (i === -1) return false;
    users[i].contacts = contacts;
    saveUsers(users);
    return true;
  };

  window.initNavAuth = function () {
    var el = document.getElementById('navUserName');
    var s = getSession();
    if (el && s) el.textContent = s.name || s.email || '';
  };

  window.astraDigitsOnly = function (phone) {
    return String(phone || '').replace(/\D/g, '');
  };

  window.renderSosContactGrid = function (containerId) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var list = window.astraGetEmergencyContacts();
    box.textContent = '';
    if (!list.length) {
      var empty = document.createElement('p');
      empty.style.cssText =
        'grid-column:1/-1;text-align:center;padding:24px;color:var(--gray-400);font-size:15px';
      empty.appendChild(document.createTextNode('No emergency contacts yet. '));
      var a = document.createElement('a');
      a.href = inPagesFolder() ? 'emergency.html' : 'pages/emergency.html';
      a.style.cssText = 'color:var(--primary);font-weight:600';
      a.textContent = 'Add contacts here';
      empty.appendChild(a);
      empty.appendChild(document.createTextNode('.'));
      box.appendChild(empty);
      return;
    }
    var colors = ['var(--primary)', 'var(--blue)', 'var(--teal)', 'var(--accent)', 'var(--orange)'];
    list.forEach(function (c, idx) {
      var letter = (c.name || '?').charAt(0).toUpperCase();
      var digits = window.astraDigitsOnly(c.phone);
      var card = document.createElement('div');
      card.className = 'contact-card anim visible';
      var av = document.createElement('div');
      av.className = 'c-avatar';
      av.style.background = colors[idx % colors.length];
      av.textContent = letter;
      card.appendChild(av);
      var h4 = document.createElement('h4');
      h4.textContent = c.name || 'Contact';
      card.appendChild(h4);
      var p = document.createElement('p');
      p.textContent = c.phone || '';
      card.appendChild(p);
      if (digits) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'call-btn';
        btn.textContent = '📞 Call Now';
        btn.addEventListener('click', function () {
          window.callHelpline(digits);
        });
        card.appendChild(btn);
      }
      box.appendChild(card);
    });
  };
})();
