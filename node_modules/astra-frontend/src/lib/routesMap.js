import L from 'leaflet';

let map;
let routeLayerGroup;

function el(id) {
  return document.getElementById(id);
}

function initMapIfNeeded() {
  var container = el('routeMap');
  if (!container || map) return;
  map = L.map('routeMap', { scrollWheelZoom: true }).setView([20.5937, 78.9629], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);
  routeLayerGroup = L.layerGroup().addTo(map);
  setTimeout(function () {
    map.invalidateSize();
  }, 100);
}

function clearRoute() {
  if (routeLayerGroup) routeLayerGroup.clearLayers();
}

/** Bias toward India so short names like "Clement Town" / "Rajpur road" resolve locally. */
var GEO_BIAS_LAT = 20.5937;
var GEO_BIAS_LON = 78.9629;

function coordsFromPhotonFeature(f) {
    if (!f || !f.geometry || !f.geometry.coordinates) return null;
    var g = f.geometry;
    var c = g.coordinates;
    if (g.type === 'Point') return { lon: c[0], lat: c[1] };
    if (g.type === 'MultiPoint' && c[0]) return { lon: c[0][0], lat: c[0][1] };
    return null;
  }

  function geocodePhotonRaw(searchQuery) {
    var url =
      'https://photon.komoot.io/api/?q=' +
      encodeURIComponent(searchQuery) +
      '&limit=1&lat=' +
      GEO_BIAS_LAT +
      '&lon=' +
      GEO_BIAS_LON;
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('NETWORK');
      return r.json();
    });
  }

  function geocodeNominatim(searchQuery) {
    var url =
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
      encodeURIComponent(searchQuery);
    return fetch(url, { headers: { 'Accept-Language': 'en' } })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (arr) {
        if (!arr || !arr.length) return null;
        return {
          lon: parseFloat(arr[0].lon),
          lat: parseFloat(arr[0].lat),
          label: arr[0].display_name || searchQuery
        };
      });
  }

  function pointFromPhotonJson(d, labelFallback) {
    if (!d || !d.features || !d.features.length) return null;
    var pt = coordsFromPhotonFeature(d.features[0]);
    if (!pt) return null;
    pt.label = (d.features[0].properties && d.features[0].properties.name) || labelFallback;
    return pt;
  }

  /** Try Photon (biased to India), then Photon with ", India", then Nominatim. */
  function geocodePhoton(query) {
    var trimmed = (query || '').trim();
    var withIndia = /\bindia\b|\bbharat\b|भारत/i.test(trimmed) ? trimmed : trimmed + ', India';
    return geocodePhotonRaw(trimmed)
      .then(function (d) {
        var pt = pointFromPhotonJson(d, trimmed);
        if (pt) return pt;
        return geocodePhotonRaw(withIndia);
      })
      .then(function (dOrPt) {
        if (
          dOrPt &&
          typeof dOrPt.lat === 'number' &&
          typeof dOrPt.lon === 'number' &&
          isFinite(dOrPt.lat) &&
          isFinite(dOrPt.lon)
        )
          return dOrPt;
        var pt = pointFromPhotonJson(dOrPt, trimmed);
        if (pt) return pt;
        return geocodeNominatim(withIndia);
      })
      .catch(function () {
        throw new Error('NETWORK');
      });
  }

  function fetchOsrmRoute(profile, lon1, lat1, lon2, lat2) {
    var base =
      'https://router.project-osrm.org/route/v1/' +
      profile +
      '/' +
      lon1 +
      ',' +
      lat1 +
      ';' +
      lon2 +
      ',' +
      lat2 +
      '?overview=full&geometries=geojson';
    return fetch(base).then(function (r) {
      if (!r.ok) return null;
      return r.json().catch(function () {
        return null;
      });
    });
  }

  function getRoute(lon1, lat1, lon2, lat2) {
    return fetchOsrmRoute('foot', lon1, lat1, lon2, lat2).then(function (data) {
      if (data && data.code === 'Ok' && data.routes && data.routes[0]) return data;
      return fetchOsrmRoute('driving', lon1, lat1, lon2, lat2).then(function (d2) {
        return d2 && d2.code === 'Ok' && d2.routes && d2.routes[0] ? d2 : null;
      });
    });
  }

  function formatDuration(sec) {
    if (sec < 3600) return Math.round(sec / 60) + ' min';
    var h = Math.floor(sec / 3600);
    var m = Math.round((sec % 3600) / 60);
    return h + ' h ' + m + ' min';
  }

  function formatDist(m) {
    if (m < 1000) return Math.round(m) + ' m';
    return (m / 1000).toFixed(1) + ' km';
  }

  function showResult(html) {
    var res = el('routeResult');
    if (!res) return;
    res.style.display = 'block';
    res.innerHTML = html;
  }

function setLoading(on) {
  var btn = document.getElementById('routeFindBtn');
  if (btn) {
    btn.disabled = on;
    btn.textContent = on ? 'Finding route…' : 'Find Safe Route →';
  }
}

export function planRoute() {
    initMapIfNeeded();
    var fromQ = el('fromLoc') ? el('fromLoc').value.trim() : '';
    var toQ = el('toLoc') ? el('toLoc').value.trim() : '';
    if (!toQ) {
      alert('Please enter a destination.');
      return;
    }

    setLoading(true);
    clearRoute();

    var chain = Promise.resolve();

    var fromPt = null;
    if (fromQ) {
      chain = chain.then(function () {
        return geocodePhoton(fromQ);
      }).then(function (pt) {
        fromPt = pt;
        if (!pt) throw new Error('FROM_GEOCODE');
        return pt;
      });
    } else {
      chain = chain.then(function () {
        return new Promise(function (resolve, reject) {
          if (!navigator.geolocation) reject(new Error('NO_GEO'));
          navigator.geolocation.getCurrentPosition(
            function (pos) {
              resolve({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                label: 'Your location'
              });
            },
            function () {
              reject(new Error('NO_GEO'));
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
          );
        });
      }).then(function (pt) {
        fromPt = pt;
        return pt;
      });
    }

    chain
      .then(function () {
        return geocodePhoton(toQ);
      })
      .then(function (toPt) {
        if (!toPt) throw new Error('TO_GEOCODE');
        if (!fromPt) throw new Error('FROM_GEOCODE');
        return getRoute(fromPt.lon, fromPt.lat, toPt.lon, toPt.lat).then(function (osrm) {
          return { fromPt: fromPt, toPt: toPt, osrm: osrm };
        });
      })
      .then(function (pack) {
        if (!map || !routeLayerGroup) initMapIfNeeded();
        clearRoute();

        var fromPt = pack.fromPt;
        var toPt = pack.toPt;
        var osrm = pack.osrm;
        var route0 = osrm && osrm.routes && osrm.routes[0];
        var geom = route0 && route0.geometry;

        if (!route0 || !geom || !geom.coordinates || !geom.coordinates.length) {
          showResult(
            '<span style="color:var(--orange)">Could not build a street route between these points. Straight line shown — try adding city (e.g. Dehradun) for better results.</span>'
          );
          var midLat = (fromPt.lat + toPt.lat) / 2;
          var midLon = (fromPt.lon + toPt.lon) / 2;
          map.setView([midLat, midLon], 12);
          L.circleMarker([fromPt.lat, fromPt.lon], {
            radius: 10,
            fillColor: '#8E2477',
            color: '#fff',
            weight: 2,
            fillOpacity: 1
          })
            .addTo(routeLayerGroup)
            .bindPopup('Start: ' + (fromPt.label || 'Start'));
          L.circleMarker([toPt.lat, toPt.lon], {
            radius: 10,
            fillColor: '#F35082',
            color: '#fff',
            weight: 2,
            fillOpacity: 1
          })
            .addTo(routeLayerGroup)
            .bindPopup('Destination: ' + (toPt.label || 'End'));
          L.polyline(
            [
              [fromPt.lat, fromPt.lon],
              [toPt.lat, toPt.lon]
            ],
            { color: '#8E2477', weight: 4, opacity: 0.6, dashArray: '8,12' }
          ).addTo(routeLayerGroup);
          try {
            map.fitBounds(routeLayerGroup.getBounds().pad(0.15));
          } catch (e) {
            map.setView([midLat, midLon], 13);
          }
          return;
        }

        var coords = geom.coordinates.map(function (c) {
          return [c[1], c[0]];
        });
        var dist = route0.distance;
        var dur = route0.duration;

        L.polyline(coords, {
          color: '#11A596',
          weight: 6,
          opacity: 0.92,
          lineJoin: 'round'
        }).addTo(routeLayerGroup);

        L.circleMarker([fromPt.lat, fromPt.lon], {
          radius: 10,
          fillColor: '#8E2477',
          color: '#fff',
          weight: 2,
          fillOpacity: 1
        })
          .addTo(routeLayerGroup)
          .bindPopup('<strong>Start</strong><br>' + (fromQ || fromPt.label || 'Here'));

        L.circleMarker([toPt.lat, toPt.lon], {
          radius: 10,
          fillColor: '#F35082',
          color: '#fff',
          weight: 2,
          fillOpacity: 1
        })
          .addTo(routeLayerGroup)
          .bindPopup('<strong>Destination</strong><br>' + toQ);

        try {
          map.fitBounds(routeLayerGroup.getBounds().pad(0.08));
        } catch (e) {
          map.setView([fromPt.lat, fromPt.lon], 14);
        }
        map.invalidateSize();

        var gmaps =
          'https://www.google.com/maps/dir/?api=1&origin=' +
          fromPt.lat +
          ',' +
          fromPt.lon +
          '&destination=' +
          toPt.lat +
          ',' +
          toPt.lon +
          '&travelmode=walking';

        showResult(
          '<span style="color:var(--teal)">✅ Route on map:</span> about <strong>' +
            formatDist(dist) +
            '</strong>, ~<strong>' +
            formatDuration(dur) +
            '</strong> (walking where available). Prefer well-lit main roads — stay alert. ' +
            '<a href="' +
            gmaps +
            '" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:underline">Open in Google Maps</a></span>'
        );
      })
      .catch(function (err) {
        var raw = err && (err.message || String(err));
        var msg = 'Something went wrong. Check your internet connection and try again.';
        if (err && err.message === 'FROM_GEOCODE')
          msg = 'Could not find the starting place. Try adding city or area (e.g. Clement Town, Dehradun).';
        if (err && err.message === 'TO_GEOCODE')
          msg = 'Could not find the destination. Try a clearer address or landmark + city.';
        if (err && err.message === 'NO_GEO')
          msg = 'Turn on location permission or type your starting place in the first box.';
        if (err && err.message === 'NETWORK')
          msg =
            'Could not reach the map service. Open this page via a local server (e.g. Live Server) or HTTPS — opening the HTML file directly (file://) often blocks maps.';
        if (raw && raw.indexOf('Failed to fetch') !== -1)
          msg =
            'Network blocked (often when using file://). Use VS Code Live Server, or run: npx serve in the project folder.';
        showResult('<span style="color:var(--red)">' + msg + '</span>');
        if (typeof console !== 'undefined' && console.warn) console.warn('Astra route:', err);
      })
      .finally(function () {
        setLoading(false);
        if (map) map.invalidateSize();
      });
}

export function attachRouteMapListeners() {
  if (el('routeMap')) initMapIfNeeded();
}
