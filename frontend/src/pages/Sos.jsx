import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useSos } from '../context/SosContext';
import SiteFooter from '../components/SiteFooter';
import { callHelpline, astraEmergencyTel } from '../lib/safety';

const colors = ['var(--primary)', 'var(--blue)', 'var(--teal)', 'var(--accent)', 'var(--orange)'];

export default function Sos() {
  const { getEmergencyContacts, digitsOnly } = useAuth();
  const { triggerSOS, shareLocation } = useSos();
  const list = getEmergencyContacts();

  return (
    <>
      <div className="sos-page">
        <div className="sos-hero">
          <button type="button" className="sos-big-btn" onClick={triggerSOS}>
            🆘
          </button>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10, color: 'var(--red)' }}>Press for Emergency SOS</h1>
          <p style={{ fontSize: 16, color: 'var(--gray-700)', maxWidth: 480, margin: '0 auto 20px' }}>
            Your location will be shared with your emergency contacts and local police will be notified immediately.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn-primary" onClick={shareLocation}>
              📍 Share My Location
            </button>
            <button type="button" className="btn-outline" style={{ borderColor: 'var(--red)', color: 'var(--red)' }} onClick={() => callHelpline('112')}>
              📞 Call 112 Now
            </button>
          </div>
        </div>

        <div className="ecall-wrap">
          <div className="ecall-panel" aria-label="Emergency phone calls">
            <div className="ecall-head">Emergency calls</div>
            <h2 className="ecall-title">Dial emergency services</h2>
            <p className="ecall-sub">Tap a button to call. Works on your phone — you will be asked to confirm before the dialer opens.</p>
            <button type="button" className="ecall-main" onClick={() => astraEmergencyTel('112', 'SOS — National emergency')}>
              🆘 SOS — Call 112
            </button>
            <div className="ecall-grid">
              <button type="button" className="ecall-btn ec-police" onClick={() => astraEmergencyTel('112', 'Police')}>
                <span>Call Police</span>
                <span className="ec-num">112</span>
              </button>
              <button type="button" className="ecall-btn ec-women" onClick={() => astraEmergencyTel('1091', 'Women helpline')}>
                <span>Women Helpline</span>
                <span className="ec-num">1091</span>
              </button>
              <button type="button" className="ecall-btn ec-amb" onClick={() => astraEmergencyTel('108', 'Ambulance')}>
                <span>Call Ambulance</span>
                <span className="ec-num">108</span>
              </button>
            </div>
            <p className="ecall-note">
              Use 112 for any life-threatening emergency. 1091 is for women in distress. 108 connects to medical ambulance services.
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your Emergency Contacts</h2>
        <p style={{ fontSize: 15, color: 'var(--gray-400)', marginBottom: 24 }}>
          These people will be notified with your location when you press SOS.{' '}
          <Link to="/emergency" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Edit contacts
          </Link>
        </p>
        <div className="contacts-grid">
          {!list.length ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 24, color: 'var(--gray-400)', fontSize: 15 }}>
              No emergency contacts yet.{' '}
              <Link to="/emergency" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Add contacts here
              </Link>
              .
            </p>
          ) : (
            list.map((c, idx) => {
              const d = digitsOnly(c.phone);
              const letter = (c.name || '?').charAt(0).toUpperCase();
              return (
                <div key={`${c.phone}-${idx}`} className="contact-card anim visible">
                  <div className="c-avatar" style={{ background: colors[idx % colors.length] }}>
                    {letter}
                  </div>
                  <h4>{c.name || 'Contact'}</h4>
                  <p>{c.phone || ''}</p>
                  {d ? (
                    <button type="button" className="call-btn" onClick={() => callHelpline(d)}>
                      📞 Call Now
                    </button>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Safety Tips in an Emergency</h2>
        <div className="tip-box">
          <p>
            🏃 <strong>Move to a public place</strong> — a shop, restaurant, or any crowded area. Avoid isolated streets, parking lots, or
            empty stairwells.
          </p>
        </div>
        <div className="tip-box" style={{ background: 'var(--blue-light)', borderColor: 'var(--blue)' }}>
          <p>
            📢 <strong>Make noise</strong> — shout &quot;FIRE!&quot; instead of &quot;HELP!&quot; as it attracts more attention in public spaces.
          </p>
        </div>
        <div className="tip-box" style={{ background: 'var(--teal-light)', borderColor: 'var(--teal)' }}>
          <p>
            📱 <strong>Call 112</strong> — India&apos;s single emergency number for police, fire, and ambulance. Works even without network balance.
          </p>
        </div>
        <div className="tip-box" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
          <p>
            🔋 <strong>Keep phone charged</strong> — Enable Astra&apos;s low-battery mode so SOS works even at 5% battery.
          </p>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
