import { Link } from 'react-router-dom';
import SiteFooter from '../components/SiteFooter';
import { useSos } from '../context/SosContext';

export default function Home() {
  const { triggerSOS, triggerFakeCall, shareLocation, callHelpline } = useSos();

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="dot" /> Women Safety Platform for India
          </div>
          <h1>
            Every Woman
            <br />
            Deserves to Feel <span>Safe</span>
          </h1>
          <p>Real-time SOS alerts, safe route mapping, and legal resources — all in one place.</p>
          <div className="hero-btns">
            <button type="button" className="btn-sos" onClick={triggerSOS}>
              🆘 Tap SOS Now
            </button>
            <Link to="/resources" className="btn-outline">
              Learn More →
            </Link>
          </div>
          <div className="trust-row">
            <span className="trust-pill">2M+ Women Protected</span>
            <span className="trust-pill">500+ NGO Partners</span>
            <span className="trust-pill">24/7 Support</span>
            <span className="trust-pill">100% Free</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="app-card">
            <h3>Astra Dashboard</h3>
            <p className="sub">Your personal safety hub</p>
            <div className="status-card">
              <div className="status-dot">✓</div>
              <div>
                <div className="s-title">You are Safe</div>
                <div className="s-sub">Last check-in: 2 mins ago · Location active</div>
              </div>
            </div>
            <div className="quick-grid">
              <button type="button" className="quick-btn" style={{ background: 'var(--accent-light)' }} onClick={shareLocation}>
                <span className="q-icon">📍</span>
                <span className="q-label" style={{ color: 'var(--accent)' }}>
                  Share Location
                </span>
              </button>
              <button type="button" className="quick-btn" style={{ background: 'var(--blue-light)' }} onClick={() => callHelpline('1091')}>
                <span className="q-icon">📞</span>
                <span className="q-label" style={{ color: 'var(--blue)' }}>
                  Call Helpline
                </span>
              </button>
              <button type="button" className="quick-btn" style={{ background: 'var(--teal-light)' }} onClick={() => callHelpline('100')}>
                <span className="q-icon">🚔</span>
                <span className="q-label" style={{ color: 'var(--teal)' }}>
                  Contact Police
                </span>
              </button>
              <button type="button" className="quick-btn" style={{ background: 'var(--orange-light)' }} onClick={triggerFakeCall}>
                <span className="q-icon">📱</span>
                <span className="q-label" style={{ color: 'var(--orange)' }}>
                  Fake Call
                </span>
              </button>
            </div>
            <div className="alert-strip">
              <div className="alert-dot" />
              <div>
                <div className="a-title">ACTIVE ALERT IN YOUR AREA</div>
                <div className="a-msg">Unsafe area reported nearby — stay alert and use safe routes.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="helplines-bar">
        <div className="helpline-item" onClick={() => callHelpline('112')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && callHelpline('112')}>
          <div className="h-num">112</div>
          <div className="h-name">All Emergency</div>
        </div>
        <div className="helpline-item" onClick={() => callHelpline('100')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && callHelpline('100')}>
          <div className="h-num">100</div>
          <div className="h-name">Police</div>
        </div>
        <div className="helpline-item" onClick={() => callHelpline('1091')} role="button" tabIndex={0}>
          <div className="h-num">1091</div>
          <div className="h-name">Women Helpline</div>
        </div>
        <div className="helpline-item" onClick={() => callHelpline('108')} role="button" tabIndex={0}>
          <div className="h-num">108</div>
          <div className="h-name">Ambulance</div>
        </div>
        <div className="helpline-item" onClick={() => callHelpline('1098')} role="button" tabIndex={0}>
          <div className="h-num">1098</div>
          <div className="h-name">Child Helpline</div>
        </div>
        <div className="helpline-item" onClick={() => callHelpline('1930')} role="button" tabIndex={0}>
          <div className="h-num">1930</div>
          <div className="h-name">Cyber Crime</div>
        </div>
      </div>

      <section className="features" id="features">
        <div className="section-label">Our Features</div>
        <h2 className="section-title">Tools That Keep You Safe</h2>
        <p className="section-sub">Designed for every Indian woman — at home, on the road, or in the city</p>
        <div className="features-grid">
          <Link to="/sos" className="feat-card anim" style={{ color: 'inherit' }}>
            <div className="feat-icon" style={{ background: 'var(--accent-light)' }}>
              🆘
            </div>
            <h3>One-Tap SOS</h3>
            <p>Instantly alert your emergency contacts with live GPS location, audio recording, and panic message.</p>
            <span className="feat-link">Activate SOS →</span>
          </Link>
          <Link to="/routes" className="feat-card anim" style={{ color: 'inherit' }}>
            <div className="feat-icon" style={{ background: 'var(--primary-light)' }}>
              🗺️
            </div>
            <h3>Safe Route Finder</h3>
            <p>Get AI-powered route suggestions avoiding unsafe areas, dark alleys, and low police coverage zones.</p>
            <span className="feat-link">Find Safe Route →</span>
          </Link>
          <div className="feat-card anim" style={{ cursor: 'pointer' }} onClick={triggerFakeCall} role="button" tabIndex={0}>
            <div className="feat-icon" style={{ background: 'var(--blue-light)' }}>
              📱
            </div>
            <h3>Fake Call Trigger</h3>
            <p>Receive a fake incoming call to exit uncomfortable situations safely — just shake your phone or tap.</p>
            <span className="feat-link">Try Fake Call →</span>
          </div>
          <Link to="/resources" className="feat-card anim" style={{ color: 'inherit' }}>
            <div className="feat-icon" style={{ background: 'var(--orange-light)' }}>
              ⚖️
            </div>
            <h3>Legal Aid Centre</h3>
            <p>Access know-your-rights guides, FIR templates, and connect with verified women lawyers for free.</p>
            <span className="feat-link">Get Legal Help →</span>
          </Link>
        </div>
      </section>

      <section className="how" id="how">
        <div className="section-label" style={{ textAlign: 'center' }}>
          How It Works
        </div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          3 Steps to Activate Your Safety Shield
        </h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 48px' }}>
          Simple, fast, and always with you
        </p>
        <div className="steps-grid">
          <div className="step-card anim">
            <div className="step-num">1</div>
            <h3>Sign Up Free</h3>
            <p>
              Create your account and add trusted emergency contacts — family or friends who will be alerted instantly
              during an emergency.
            </p>
          </div>
          <div className="step-card anim">
            <div className="step-num">2</div>
            <h3>Set Your Safe Zone</h3>
            <p>Define your home, workplace, and daily routes. We monitor them for risk and alert you about unsafe areas nearby.</p>
          </div>
          <div className="step-card anim">
            <div className="step-num">3</div>
            <h3>Stay Protected 24/7</h3>
            <p>Shake your phone or press SOS anytime. We alert your contacts, record audio, and automatically contact emergency services.</p>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="s-num">2M+</div>
          <div className="s-lbl">Women Protected</div>
        </div>
        <div className="stat-item">
          <div className="s-num">50K+</div>
          <div className="s-lbl">SOS Alerts Handled</div>
        </div>
        <div className="stat-item">
          <div className="s-num">500+</div>
          <div className="s-lbl">NGO Partners</div>
        </div>
        <div className="stat-item">
          <div className="s-num">98%</div>
          <div className="s-lbl">Users Feel Safer</div>
        </div>
      </div>

      <section className="resources">
        <div className="section-label">Resources</div>
        <h2 className="section-title">Everything You Need, In One Place</h2>
        <p className="section-sub">From legal help to mental health support — we&apos;ve got you covered</p>
        <div className="res-grid">
          <Link to="/resources#rights" className="res-card anim" style={{ color: 'inherit' }}>
            <div className="r-icon">⚖️</div>
            <h3>Know Your Rights</h3>
            <p>Indian laws that protect women — IPC, POSH Act, Domestic Violence Act explained simply.</p>
          </Link>
          <Link to="/resources#fir" className="res-card anim" style={{ color: 'inherit' }}>
            <div className="r-icon">📄</div>
            <h3>File an FIR</h3>
            <p>Step-by-step guide and template to file a police complaint. Know what to say and your rights.</p>
          </Link>
          <Link to="/resources#cyber" className="res-card anim" style={{ color: 'inherit' }}>
            <div className="r-icon">💻</div>
            <h3>Cyber Safety</h3>
            <p>Protect yourself from cyberstalking, revenge porn, and online harassment. Report and recover.</p>
          </Link>
          <Link to="/resources#mental" className="res-card anim" style={{ color: 'inherit' }}>
            <div className="r-icon">🧠</div>
            <h3>Mental Health</h3>
            <p>Free counselling resources, hotlines, and guided self-help for trauma and anxiety.</p>
          </Link>
        </div>
      </section>

      <section className="cta-banner">
        <h2>Your Safety Is Not Optional</h2>
        <p>Join 2 million women who trust Astra every single day — it&apos;s completely free.</p>
        <Link to="/signup" className="btn-white">
          🛡️ Get Astra Free
        </Link>
      </section>

      <SiteFooter />
    </>
  );
}
