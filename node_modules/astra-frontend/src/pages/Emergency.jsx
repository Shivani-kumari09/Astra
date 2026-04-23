import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import SiteFooter from '../components/SiteFooter';
import { astraEmergencyTel } from '../lib/safety';

const MAX = 5;

export default function Emergency() {
  const { getEmergencyContacts, saveEmergencyContacts } = useAuth();
  const [rows, setRows] = useState([]);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const list = getEmergencyContacts();
    if (!list.length) {
      setRows([
        { name: '', phone: '' },
        { name: '', phone: '' }
      ]);
    } else {
      setRows(list.map((c) => ({ name: c.name || '', phone: c.phone || '' })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  function addRow() {
    if (rows.length >= MAX) return;
    setRows((r) => [...r, { name: '', phone: '' }]);
  }

  function save(e) {
    e.preventDefault();
    const contacts = rows.filter((x) => x.name.trim() || x.phone.trim()).map((x) => ({ name: x.name.trim(), phone: x.phone.trim() }));
    saveEmergencyContacts(contacts);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  return (
    <>
      <div className="ec-page">
        <h1>Emergency contacts</h1>
        <p className="lead">
          People you trust will be referenced when you use SOS and location sharing. Add up to five contacts with name and phone (include country
          code, e.g. +91).
        </p>
        <div className="ecall-wrap" style={{ marginBottom: 32 }}>
          <div className="ecall-panel" aria-label="Emergency phone calls">
            <div className="ecall-head">Emergency calls</div>
            <h2 className="ecall-title">Dial emergency services</h2>
            <p className="ecall-sub">Confirm when prompted, then your phone dialer will open.</p>
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
            <p className="ecall-note">These calls use your device only — no server or API keys.</p>
          </div>
        </div>
        <div className="card">
          <form onSubmit={save}>
            {rows.map((row, i) => (
              <div key={i} className="contact-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setRows((r) => r.map((x, j) => (j === i ? { ...x, name: v } : x)));
                    }}
                    placeholder="e.g. Maa"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={row.phone}
                    onChange={(e) => {
                      const v = e.target.value;
                      setRows((r) => r.map((x, j) => (j === i ? { ...x, phone: v } : x)));
                    }}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            ))}
            <button type="button" className="btn-outline" style={{ marginBottom: 20 }} onClick={addRow}>
              + Add another contact
            </button>
            <button type="submit" className="btn-primary">
              Save contacts
            </button>
          </form>
          <div className={`saved-toast${toast ? ' show' : ''}`}>Contacts saved.</div>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--gray-400)' }}>
          Tip: After saving, open{' '}
          <Link to="/sos" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            SOS Alert
          </Link>{' '}
          to quickly call them.
        </p>
      </div>
      <SiteFooter compact />
    </>
  );
}
