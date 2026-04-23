import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    concern: 'General safety & awareness',
    pass: '',
    c1n: '',
    c1p: '',
    c2n: '',
    c2p: ''
  });

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function doSignup() {
    const { name, phone, email, city, concern, pass, c1n, c1p, c2n, c2p } = form;
    if (!name || !phone || !email || !pass) {
      alert('Please fill in all required fields.');
      return;
    }
    if (pass.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    const contacts = [];
    if (c1n || c1p) contacts.push({ name: c1n, phone: c1p });
    if (c2n || c2p) contacts.push({ name: c2n, phone: c2p });
    const r = register({ name, phone, email, city, concern, password: pass, contacts });
    if (!r.ok) {
      alert(r.msg);
      return;
    }
    setDone(true);
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/login" className="nav-logo">
          <div className="logo-icon">🛡️</div>
          Astra
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/login">Sign in</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <div className="signup-wrap">
        <div className="signup-box">
          {!done ? (
            <div id="formWrap">
              <div style={{ fontSize: 40, marginBottom: 16 }}>🛡️</div>
              <h1>Join Astra Free</h1>
              <p className="sub">Join 2 million women who stay safer with Astra every day</p>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Your city" />
              </div>
              <div className="form-group">
                <label>Primary Concern</label>
                <select value={form.concern} onChange={(e) => set('concern', e.target.value)}>
                  <option>General safety & awareness</option>
                  <option>Commuting / travel safety</option>
                  <option>Workplace harassment</option>
                  <option>Domestic violence support</option>
                  <option>Cyber safety</option>
                  <option>Legal aid needed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Create Password</label>
                <input type="password" value={form.pass} onChange={(e) => set('pass', e.target.value)} placeholder="At least 8 characters" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', margin: '24px 0 12px' }}>Emergency contacts</p>
              <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 16 }}>
                Who should we alert when you use SOS? You can edit these anytime after sign up.
              </p>
              <div className="form-group">
                <label>Emergency contact 1 — name</label>
                <input type="text" value={form.c1n} onChange={(e) => set('c1n', e.target.value)} placeholder="e.g. Maa" />
              </div>
              <div className="form-group">
                <label>Emergency contact 1 — phone</label>
                <input type="tel" value={form.c1p} onChange={(e) => set('c1p', e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label>Emergency contact 2 — name</label>
                <input type="text" value={form.c2n} onChange={(e) => set('c2n', e.target.value)} placeholder="e.g. Brother" />
              </div>
              <div className="form-group">
                <label>Emergency contact 2 — phone</label>
                <input type="tel" value={form.c2p} onChange={(e) => set('c2p', e.target.value)} placeholder="+91 87654 32109" />
              </div>
              <button type="button" className="btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={doSignup}>
                Create Free Account 🛡️
              </button>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', marginTop: 14 }}>
                By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>. Your data is encrypted and never sold.
              </p>
              <div className="divider-or">or</div>
              <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--gray-700)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <div className="success-state" style={{ display: 'block' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h2>Welcome to Astra!</h2>
              <p>Your free account is ready. Add your emergency contacts to activate full protection.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link to="/sos" className="btn-sos" style={{ justifyContent: 'center' }}>
                  🆘 Open SOS Alert
                </Link>
                <Link to="/emergency" className="btn-outline" style={{ textAlign: 'center' }}>
                  Manage emergency contacts
                </Link>
                <button type="button" className="btn-outline" style={{ textAlign: 'center' }} onClick={() => navigate('/')}>
                  Explore Astra
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
