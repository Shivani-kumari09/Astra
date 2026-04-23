import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  astraEmergencyTel,
  buildSosMessage,
  callHelpline,
  openSmsToNumber,
  shareLocation as shareLocationFn
} from '../lib/safety';

const SosContext = createContext(null);

function astraSosDigits(phone, digitsOnlyFn) {
  if (typeof digitsOnlyFn === 'function') return digitsOnlyFn(phone);
  return String(phone || '').replace(/\D/g, '');
}

export function SosProvider({ children }) {
  const { getEmergencyContacts, digitsOnly } = useAuth();
  const [sosOpen, setSosOpen] = useState(false);
  const [fakeOpen, setFakeOpen] = useState(false);
  const [phase, setPhase] = useState('countdown'); // countdown | actions
  const [count, setCount] = useState(5);
  const [finalize, setFinalize] = useState(null); // { mapUrl, bodyText, contacts: [{name,phone,digits}] }
  const timerRef = useRef(null);
  const finalizeStarted = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancelSOS = useCallback(() => {
    clearTimer();
    finalizeStarted.current = false;
    setSosOpen(false);
    setPhase('countdown');
    setCount(5);
    setFinalize(null);
  }, []);

  const runFinalize = useCallback(
    (mapUrl) => {
      const contacts = getEmergencyContacts();
      const withDigits = contacts
        .map((c) => ({
          name: (c.name || 'Contact').trim() || 'Contact',
          phone: c.phone || '',
          digits: astraSosDigits(c.phone, digitsOnly)
        }))
        .filter((c) => c.digits.length >= 8);
      const bodyText = buildSosMessage(mapUrl);
      setFinalize({ mapUrl, bodyText, contacts: withDigits });
      setPhase('actions');
      if (withDigits.length) {
        const lines = withDigits.map((c) => `${c.name}: ${c.phone}`).join('\n');
        alert('SOS — Tap OK, then use Call or SMS for each contact:\n\n' + lines);
      } else {
        alert('SOS — No emergency numbers found. Add contacts in Emergency contacts, or call 112 now.');
      }
    },
    [getEmergencyContacts, digitsOnly]
  );

  const triggerSOS = useCallback(() => {
    finalizeStarted.current = false;
    setPhase('countdown');
    setCount(5);
    setFinalize(null);
    setSosOpen(true);
  }, []);

  useEffect(() => {
    if (!sosOpen || phase !== 'countdown') return;
    let n = 5;
    setCount(5);
    clearTimer();
    timerRef.current = setInterval(() => {
      n -= 1;
      setCount(n);
      if (n <= 0) clearTimer();
    }, 1000);
    return clearTimer;
  }, [sosOpen, phase]);

  useEffect(() => {
    if (!sosOpen || phase !== 'countdown' || count > 0 || finalizeStarted.current) return;
    finalizeStarted.current = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
          runFinalize(url);
        },
        () => runFinalize(null),
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
      );
    } else {
      runFinalize(null);
    }
  }, [sosOpen, phase, count, runFinalize]);

  const triggerFakeCall = useCallback(() => setFakeOpen(true), []);
  const endFakeCall = useCallback(() => setFakeOpen(false), []);
  const shareLocation = useCallback(() => shareLocationFn(), []);

  const value = useMemo(
    () => ({
      triggerSOS,
      cancelSOS,
      triggerFakeCall,
      endFakeCall,
      shareLocation,
      callHelpline,
      astraEmergencyTel
    }),
    [triggerSOS, cancelSOS, triggerFakeCall, endFakeCall, shareLocation]
  );

  return (
    <SosContext.Provider value={value}>
      {children}
      {sosOpen && (
        <div
          className="modal-backdrop open"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && cancelSOS()}
        >
          <div className="modal-box" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            {phase === 'countdown' && (
              <>
                <button type="button" className="modal-close" onClick={cancelSOS}>
                  ✕
                </button>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🆘</div>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--red)', marginBottom: 10 }}>
                  SOS Alert Activating
                </h2>
                <p style={{ color: 'var(--gray-700)', fontSize: 15, marginBottom: 24 }}>
                  Preparing to notify your emergency contacts in
                </p>
                <div style={{ fontSize: 72, fontWeight: 700, color: 'var(--red)', marginBottom: 24 }}>{count}</div>
                <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 28 }}>
                  Allow location when asked so SMS can include your map link.
                </p>
                <button
                  type="button"
                  onClick={cancelSOS}
                  style={{
                    background: 'var(--gray-100)',
                    border: 'none',
                    borderRadius: 12,
                    padding: '14px 28px',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: "'Inter',sans-serif"
                  }}
                >
                  Cancel — I am Safe
                </button>
              </>
            )}
            {phase === 'actions' && finalize && (
              <div style={{ textAlign: 'center', padding: 12 }}>
                <div style={{ fontSize: 52 }}>🆘</div>
                <h2 style={{ color: 'var(--red)', fontSize: 22, margin: '12px 0 8px', fontWeight: 700 }}>
                  Notify your contacts
                </h2>
                <p style={{ color: 'var(--gray-700)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  This app cannot send messages by itself. Use Call or SMS for each person below. If you are in
                  immediate danger, dial 112.
                </p>
                {finalize.contacts.length === 0 ? (
                  <p style={{ color: 'var(--orange)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
                    No saved numbers with a valid phone. Add contacts under Emergency contacts.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      marginBottom: 18,
                      textAlign: 'left'
                    }}
                  >
                    {finalize.contacts.map((c) => (
                      <div
                        key={c.phone + c.name}
                        style={{ background: 'var(--gray-100)', borderRadius: 12, padding: '12px 14px' }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                          {c.name} · {c.phone}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ flex: 1, minWidth: 120, padding: '10px 14px', fontSize: 13 }}
                            onClick={() => {
                              if (!confirm(`Call ${c.name} now?\n\nYour phone will open the dialer.`)) return;
                              window.location.href = `tel:${c.digits}`;
                            }}
                          >
                            📞 Call
                          </button>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{
                              flex: 1,
                              minWidth: 120,
                              padding: '10px 14px',
                              fontSize: 13,
                              borderColor: 'var(--primary)',
                              color: 'var(--primary)'
                            }}
                            onClick={() => openSmsToNumber(c.digits, finalize.bodyText)}
                          >
                            💬 SMS
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="btn-sos"
                  style={{ width: '100%', marginBottom: 10, justifyContent: 'center' }}
                  onClick={() => astraEmergencyTel('112', 'Emergency 112')}
                >
                  📞 Call 112 (emergency)
                </button>
                <button
                  type="button"
                  style={{
                    background: 'var(--gray-100)',
                    border: 'none',
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: 'inherit'
                  }}
                  onClick={cancelSOS}
                >
                  I am safe — close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {fakeOpen && (
        <div
          className="modal-backdrop open"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && endFakeCall()}
        >
          <div
            className="modal-box"
            style={{ textAlign: 'center', background: 'var(--dark)', color: 'var(--white)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 14, color: 'var(--gray-400)', marginBottom: 8 }}>Incoming Call</div>
            <div style={{ fontSize: 64, marginBottom: 12 }}>👩</div>
            <h2 style={{ fontSize: 22, marginBottom: 4 }}>Maa (Mom)</h2>
            <p style={{ fontSize: 14, color: 'var(--gray-400)', marginBottom: 32 }}>Astra Fake Call</p>
            <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
              <button
                type="button"
                onClick={endFakeCall}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--red)',
                  border: 'none',
                  fontSize: 28,
                  cursor: 'pointer'
                }}
              >
                📵
              </button>
              <button
                type="button"
                onClick={endFakeCall}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--teal)',
                  border: 'none',
                  fontSize: 28,
                  cursor: 'pointer'
                }}
              >
                📞
              </button>
            </div>
            <p style={{ marginTop: 24, fontSize: 12, color: 'var(--gray-400)' }}>
              This is a fake call to help you exit unsafe situations safely.
            </p>
          </div>
        </div>
      )}
    </SosContext.Provider>
  );
}

export function useSos() {
  const v = useContext(SosContext);
  if (!v) throw new Error('useSos must be used within SosProvider');
  return v;
}
