import { Link } from 'react-router-dom';
import SiteFooter from '../components/SiteFooter';
import { callHelpline } from '../lib/safety';

const gov = [
  { num: '112', name: 'All Emergency Services', desc: 'Single emergency number for police, fire, and ambulance. Works without network balance.', bg: 'var(--red)' },
  { num: '1091', name: 'Women Helpline', desc: 'National Women Helpline. For any distress situation — harassment, abuse, violence.', bg: 'var(--primary)' },
  { num: '100', name: 'Police', desc: 'Local police emergency number. Available 24/7 across all states.', bg: 'var(--blue)' },
  { num: '108', name: 'Ambulance', desc: 'Emergency medical services. Free ambulance to the nearest hospital.', bg: 'var(--teal)' },
  { num: '1930', name: 'Cyber Crime', desc: 'National Cyber Crime Reporting Helpline. For online harassment, cyberstalking, and fraud.', bg: 'var(--orange)' },
  { num: '1098', name: 'Child Helpline', desc: 'For children in distress or danger. Also assists mothers and families.', bg: 'var(--accent)' }
];

const ngo = [
  { label: 'iCall', num: '9152987821', desc: 'Free psychological counselling in Hindi and English. Mon–Sat, 8am–10pm.', bg: 'var(--primary)', size: 26 },
  { label: 'SNEHI', num: '04424640050', desc: 'Emotional support and mental health counselling. Available 8am–10pm daily.', bg: 'var(--accent)', size: 26 },
  { label: 'Vandrevala', num: '18602662345', desc: '24/7 mental health helpline in multiple languages. Free and confidential.', bg: 'var(--teal)', size: 24 }
];

export default function Helplines() {
  return (
    <>
      <div className="page-hero">
        <span className="section-label">Emergency Helplines</span>
        <h1>Help Is Just One Call Away</h1>
        <p>Save these numbers. Call anytime — day or night. All numbers are free to call.</p>
      </div>
      <section className="helplines-section">
        <div className="section-label">Government Helplines</div>
        <h2 className="section-title">Official Emergency Numbers</h2>
        <p className="section-sub">These are government-run, free, and available 24/7.</p>
        <div className="hl-grid" style={{ marginBottom: 60 }}>
          {gov.map((h) => (
            <div key={h.num} className="hl-card anim">
              <div className="hl-num" style={{ color: h.bg }}>
                {h.num}
              </div>
              <div className="hl-name">{h.name}</div>
              <div className="hl-desc">{h.desc}</div>
              <button type="button" className="call-now" style={{ background: h.bg }} onClick={() => callHelpline(h.num)}>
                📞 Call {h.num}
              </button>
            </div>
          ))}
        </div>
        <div className="section-label">NGO &amp; Support Lines</div>
        <h2 className="section-title">Counselling &amp; Support Organisations</h2>
        <p className="section-sub">Free mental health and legal support from trusted organisations</p>
        <div className="hl-grid">
          {ngo.map((h) => (
            <div key={h.num} className="hl-card anim">
              <div className="hl-num" style={{ color: h.bg, fontSize: h.size }}>
                {h.label}
              </div>
              <div className="hl-name">{h.num}</div>
              <div className="hl-desc">{h.desc}</div>
              <button type="button" className="call-now" style={{ background: h.bg }} onClick={() => callHelpline(h.num)}>
                📞 Call {h.label}
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="cta-banner">
        <h2>Save These Numbers Today</h2>
        <p>Share Astra with every woman you know. Safety is a right, not a privilege.</p>
        <Link to="/signup" className="btn-white">
          🛡️ Join Astra Free
        </Link>
      </section>
      <footer>
        <div className="emergency-strip">
          <span className="e-icon">🚨</span>
          <p>
            <strong>In an emergency, always call 112.</strong> Astra does not replace emergency services.
          </p>
        </div>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">🛡️</div>
              Astra
            </div>
            <p>India&apos;s most trusted women safety platform.</p>
          </div>
          <div className="footer-col">
            <h4>Helplines</h4>
            <ul>
              <li>
                <a href="#">Police — 100</a>
              </li>
              <li>
                <a href="#">Women — 1091</a>
              </li>
              <li>
                <a href="#">Emergency — 112</a>
              </li>
              <li>
                <a href="#">Cyber — 1930</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Tools</h4>
            <ul>
              <li>
                <Link to="/sos">SOS Alert</Link>
              </li>
              <li>
                <Link to="/routes">Safe Routes</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li>
                <Link to="/resources">Legal Aid</Link>
              </li>
              <li>
                <Link to="/resources#mental">Mental Health</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Astra. In an emergency call 112.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}
