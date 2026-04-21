import { useEffect } from 'react';
import SiteFooter from '../components/SiteFooter';
import { attachRouteMapListeners, planRoute } from '../lib/routesMap';
import 'leaflet/dist/leaflet.css';

export default function RoutesPage() {
  useEffect(() => {
    attachRouteMapListeners();
  }, []);

  return (
    <>
      <div className="page-hero">
        <span className="section-label">Safe Routes</span>
        <h1>Find the Safest Path Home</h1>
        <p>AI-powered route suggestions that avoid unsafe areas, dark alleys, and low police coverage zones.</p>
      </div>
      <div className="routes-wrap">
        <div className="route-search">
          <h2>🗺️ Plan a Safe Route</h2>
          <div className="search-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="fromLoc">From (optional)</label>
              <input id="fromLoc" type="text" placeholder="Area, city — or leave blank for GPS" autoComplete="street-address" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="toLoc">To (Destination)</label>
              <input id="toLoc" type="text" placeholder="Where are you going? (include city)" autoComplete="off" />
            </div>
            <button type="button" id="routeFindBtn" className="btn-primary" style={{ height: 46, padding: '0 24px' }} onClick={() => planRoute()}>
              Find Safe Route →
            </button>
          </div>
          <p className="route-hint">
            Leave <strong>From</strong> empty and allow location access to start from where you are now. Routes use OpenStreetMap + walking paths
            (falls back to driving roads if needed).
          </p>
          <div id="routeResult" style={{ display: 'none', marginTop: 20, background: 'var(--teal-light)', borderRadius: 12, padding: 16, color: 'var(--teal)', fontWeight: 600, fontSize: 15, lineHeight: 1.55 }} />
        </div>
        <div className="route-map-wrap">
          <div id="routeMap" role="application" aria-label="Route map" />
          <div className="map-legend-onmap">
            <div>
              <span style={{ color: '#11A596', fontWeight: 800 }}>━</span> Suggested route on map
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-400)', marginTop: 4 }}>© OpenStreetMap contributors</div>
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Safety Zones Near You</h2>
        <div className="safety-zones">
          <div className="zone-card anim" style={{ background: 'var(--teal-light)' }}>
            <div className="zone-icon" style={{ background: 'rgba(17,165,150,.15)' }}>
              🚔
            </div>
            <div>
              <h4>Police Patrol Areas</h4>
              <p>High police presence — safest to walk through</p>
            </div>
          </div>
          <div className="zone-card anim" style={{ background: 'var(--blue-light)' }}>
            <div className="zone-icon" style={{ background: 'rgba(51,118,231,.15)' }}>
              💡
            </div>
            <div>
              <h4>Well-lit Streets</h4>
              <p>Street lights active — reduced risk at night</p>
            </div>
          </div>
          <div className="zone-card anim" style={{ background: 'var(--primary-light)' }}>
            <div className="zone-icon" style={{ background: 'rgba(142,36,119,.15)' }}>
              🏪
            </div>
            <div>
              <h4>Safe Shops &amp; Venues</h4>
              <p>Registered safe spaces where you can seek help</p>
            </div>
          </div>
          <div className="zone-card anim" style={{ background: 'var(--accent-light)' }}>
            <div className="zone-icon" style={{ background: 'rgba(243,80,130,.15)' }}>
              📍
            </div>
            <div>
              <h4>User-reported</h4>
              <p>Areas flagged safe by nearby Astra users</p>
            </div>
          </div>
          <div className="zone-card anim" style={{ background: '#fff0f0' }}>
            <div className="zone-icon" style={{ background: 'rgba(224,44,44,.15)' }}>
              ⚠️
            </div>
            <div>
              <h4>Avoid After Dark</h4>
              <p>Areas with higher incident reports at night</p>
            </div>
          </div>
          <div className="zone-card anim" style={{ background: 'var(--orange-light)' }}>
            <div className="zone-icon" style={{ background: 'rgba(243,125,30,.15)' }}>
              🏥
            </div>
            <div>
              <h4>Hospital &amp; Help Points</h4>
              <p>Medical and emergency assistance available 24/7</p>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
