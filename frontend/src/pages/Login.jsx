import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (session) navigate('/', { replace: true });
  }, [session, navigate]);

  function submit() {
    setErr('');
    const r = login(email, pass);
    if (r.ok) navigate('/', { replace: true });
    else setErr(r.msg);
  }

  return (
    <div className="auth-shell">
      <header className="auth-nav">
        <Link to="/login" className="nav-logo">
          <div className="logo-icon">🛡️</div>
          Astra
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn-outline" style={{ padding: '10px 20px', fontSize: 14 }}>
            Create account
          </Link>
        </div>
      </header>
      <main className="auth-main">
        <div className="auth-card">
          <div style={{ fontSize: 44, marginBottom: 12 }}>🛡️</div>
          <h1>Welcome back</h1>
          <p className="sub">Sign in to access your safety dashboard, SOS alerts, and emergency contacts.</p>
          {err ? (
            <div className="auth-error show" style={{ display: 'block' }}>
              {err}
            </div>
          ) : (
            <div className="auth-error" />
          )}
          <div className="form-group">
            <label htmlFor="lEmail">Email</label>
            <input
              id="lEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lPass">Password</label>
            <input
              id="lPass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>
          <button type="button" className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={submit}>
            Sign in
          </button>
          <p className="auth-foot">
            New to Astra?{' '}
            <Link to="/signup">Sign up free</Link>
          </p>
          <div className="emergency-note">
            <strong>Emergency:</strong> This app does not replace emergency services. In danger, call{' '}
            <a href="tel:112" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              112
            </a>{' '}
            or your saved contacts from the app after you sign in.
          </div>
        </div>
      </main>
    </div>
  );
}
