/*import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useSos } from '../context/SosContext';

const link = ({ isActive }) => (isActive ? 'active' : undefined);

export default function Navbar() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const { triggerSOS } = useSos();
  const [open, setOpen] = useState(false);

  const display = session?.name || session?.email || '';

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo" onClick={() => setOpen(false)}>
        <div className="logo-icon">🛡️</div>
        Astra
      </NavLink>
      <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
        <li>
          <NavLink to="/" className={link} end onClick={() => setOpen(false)}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/sos" className={link} onClick={() => setOpen(false)}>
            SOS Alert
          </NavLink>
        </li>
        <li>
          <NavLink to="/routes" className={link} onClick={() => setOpen(false)}>
            Safe Routes
          </NavLink>
        </li>
        <li>
          <NavLink to="/resources" className={link} onClick={() => setOpen(false)}>
            Resources
          </NavLink>
        </li>
        <li>
          <NavLink to="/helplines" className={link} onClick={() => setOpen(false)}>
            Helplines
          </NavLink>
        </li>
        <li>
          <NavLink to="/emergency" className={link} onClick={() => setOpen(false)}>
            Emergency contacts
          </NavLink>
        </li>
      </ul>
      <div
        className="hamburger"
        id="hamburger"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </div>
      <div className="nav-actions">
        <span className="nav-user" id="navUserName">
          {display}
        </span>
        <button
          type="button"
          className="nav-logout"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Log out
        </button>
      </div>
      <a href="#sos" className="nav-sos" onClick={(e) => { e.preventDefault(); triggerSOS(); }}>
        🆘 SOS
      </a>
    </nav>
  );
}
/*