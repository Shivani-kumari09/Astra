 import { Link } from 'react-router-dom';

export default function SiteFooter({ compact }) {
  if (compact) {
    return (
      <footer>
        <div className="emergency-strip">
          <span className="e-icon">🚨</span>
          <p>
            <strong>In an emergency, always call 112.</strong>
          </p>
        </div>
        <div className="footer-bottom" style={{ border: 'none', paddingTop: 0 }}>
          <p>© 2026 Astra</p>
        </div>
      </footer>
    );
  }
  return (
    <footer>
      <div className="emergency-strip">
        <span className="e-icon">🚨</span>
        <p>
          <strong>In an emergency, always call 112 (All-in-one emergency number).</strong> Astra is a support
          platform and does not replace emergency services.
        </p>
      </div>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-icon">🛡️</div> Astra
          </div>
          <p>India&apos;s most trusted women safety platform. Protecting women 24/7 across every city and village.</p>
        </div>
        <div className="footer-col">
          <h4>Safety Tools</h4>
          <ul>
            <li>
              <Link to="/sos">SOS Alert</Link>
            </li>
            <li>
              <Link to="/routes">Safe Routes</Link>
            </li>
            <li>
              <a href="#">Fake Call</a>
            </li>
            <li>
              <a href="#">Location Sharing</a>
            </li>
            <li>
              <a href="#">Safe Check-In</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li>
              <Link to="/resources#rights">Know Your Rights</Link>
            </li>
            <li>
              <Link to="/resources#fir">File an FIR</Link>
            </li>
            <li>
              <Link to="/resources#cyber">Cyber Safety</Link>
            </li>
            <li>
              <Link to="/resources#mental">Mental Health</Link>
            </li>
            <li>
              <Link to="/helplines">All Helplines</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>More</h4>
          <ul>
            <li>
              <Link to="/signup">Sign up</Link>
            </li>
            <li>
              <a href="#">Volunteer</a>
            </li>
            <li>
              <a href="#">Partner NGOs</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Astra. In an emergency always call 112.</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
