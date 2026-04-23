// ── NAV TOGGLE ───────────────────────────────────
function toggleNav(){
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',()=>document.getElementById('navLinks')?.classList.remove('open'));
});

document.addEventListener('DOMContentLoaded',function(){
  if(typeof initNavAuth==='function')initNavAuth();
  if(typeof renderSosContactGrid==='function')renderSosContactGrid('sosContactsGrid');
});

// ── SCROLL ANIMATIONS ─────────────────────────────
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'), i*80);
      io.unobserve(e.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.anim').forEach(el=>io.observe(el));

// ── MODAL ─────────────────────────────────────────
function openModal(id){document.getElementById(id).classList.add('open')}
function closeModal(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.modal-backdrop').forEach(m=>{
  m.addEventListener('click',e=>{ if(e.target===m) m.classList.remove('open'); });
});

// ── SOS BUTTON ────────────────────────────────────
function resetSosModalCountdown(){
  const modal = document.getElementById('sosModal');
  const box = modal?.querySelector('.modal-box');
  if(!box || document.getElementById('sosCountdown')) return;
  box.style.textAlign = 'center';
  box.innerHTML =
    '<button class="modal-close" onclick="cancelSOS()">✕</button>' +
    '<div style="font-size:64px;margin-bottom:16px">🆘</div>' +
    '<h2 style="font-size:26px;font-weight:700;color:var(--red);margin-bottom:10px">SOS Alert Activating</h2>' +
    '<p style="color:var(--gray-700);font-size:15px;margin-bottom:24px">Preparing to notify your emergency contacts in</p>' +
    '<div id="sosCountdown" style="font-size:72px;font-weight:700;color:var(--red);margin-bottom:24px">5</div>' +
    '<p style="font-size:13px;color:var(--gray-400);margin-bottom:28px">Allow location when asked so SMS can include your map link.</p>' +
    '<button type="button" onclick="cancelSOS()" style="background:var(--gray-100);border:none;border-radius:12px;padding:14px 28px;font-size:15px;font-weight:600;cursor:pointer;width:100%;font-family:\'Inter\',sans-serif">Cancel — I am Safe</button>';
}

function triggerSOS(){
  resetSosModalCountdown();
  const el = document.getElementById('sosModal');
  if(el){ el.classList.add('open'); startSOSCountdown(); }
}
let sosTimer;

function astraSosDigits(phone){
  if(typeof astraDigitsOnly==='function') return astraDigitsOnly(phone);
  return String(phone||'').replace(/\D/g,'');
}

function buildSosMessage(mapUrl){
  let t = '🆘 SOS — I need help right now. (Astra)';
  if(mapUrl) t += '\n\nMy location: ' + mapUrl;
  else t += '\n\n(I could not attach GPS — please call me.)';
  return t;
}

function openSmsToNumber(digits, body){
  if(!digits) return;
  window.location.href = 'sms:' + digits + '?body=' + encodeURIComponent(body);
}

/** After countdown: alert user + show real Call / SMS actions (static site cannot auto-send SMS). */
function finalizeSOSAlert(){
  const modal = document.getElementById('sosModal');
  const box = modal?.querySelector('.modal-box');
  if(!box) return;

  const contacts = typeof astraGetEmergencyContacts==='function' ? astraGetEmergencyContacts() : [];
  const withDigits = contacts.map(c=>({
    name: (c.name||'Contact').trim()||'Contact',
    phone: c.phone||'',
    digits: astraSosDigits(c.phone)
  })).filter(c=>c.digits.length>=8);

  const applyUI = (mapUrl)=>{
    const bodyText = buildSosMessage(mapUrl);
    box.textContent = '';

    const wrap = document.createElement('div');
    wrap.style.cssText = 'text-align:center;padding:12px';

    const icon = document.createElement('div');
    icon.style.fontSize = '52px';
    icon.textContent = '🆘';
    wrap.appendChild(icon);

    const h2 = document.createElement('h2');
    h2.style.cssText = 'color:var(--red);font-size:22px;margin:12px 0 8px;font-weight:700';
    h2.textContent = 'Notify your contacts';
    wrap.appendChild(h2);

    const p1 = document.createElement('p');
    p1.style.cssText = 'color:var(--gray-700);font-size:14px;line-height:1.6;margin-bottom:16px';
    p1.textContent = 'This website cannot send messages by itself. Use Call or SMS for each person below. If you are in immediate danger, dial 112.';
    wrap.appendChild(p1);

    if(withDigits.length===0){
      const warn = document.createElement('p');
      warn.style.cssText = 'color:var(--orange);font-size:14px;font-weight:600;margin-bottom:16px';
      warn.textContent = 'No saved numbers with a valid phone. Add contacts under Emergency contacts.';
      wrap.appendChild(warn);
    } else {
      const list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin-bottom:18px;text-align:left';
      withDigits.forEach(c=>{
        const row = document.createElement('div');
        row.style.cssText = 'background:var(--gray-100);border-radius:12px;padding:12px 14px';
        const title = document.createElement('div');
        title.style.cssText = 'font-weight:700;font-size:14px;margin-bottom:8px';
        title.textContent = c.name + ' · ' + c.phone;
        row.appendChild(title);
        const btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';
        const callB = document.createElement('button');
        callB.type = 'button';
        callB.className = 'btn-primary';
        callB.style.cssText = 'flex:1;min-width:120px;padding:10px 14px;font-size:13px';
        callB.textContent = '📞 Call';
        callB.onclick = ()=> {
          if(!confirm('Call ' + c.name + ' now?\n\nYour phone will open the dialer.')) return;
          window.location.href = 'tel:' + c.digits;
        };
        const smsB = document.createElement('button');
        smsB.type = 'button';
        smsB.className = 'btn-outline';
        smsB.style.cssText = 'flex:1;min-width:120px;padding:10px 14px;font-size:13px;border-color:var(--primary);color:var(--primary)';
        smsB.textContent = '💬 SMS';
        smsB.onclick = ()=> openSmsToNumber(c.digits, bodyText);
        btns.appendChild(callB);
        btns.appendChild(smsB);
        row.appendChild(btns);
        list.appendChild(row);
      });
      wrap.appendChild(list);
    }

    const police = document.createElement('button');
    police.type = 'button';
    police.className = 'btn-sos';
    police.style.cssText = 'width:100%;margin-bottom:10px;justify-content:center';
    police.textContent = '📞 Call 112 (emergency)';
    police.onclick = ()=> { astraEmergencyTel('112', 'Emergency 112'); };

    const safe = document.createElement('button');
    safe.type = 'button';
    safe.style.cssText = 'background:var(--gray-100);border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;width:100%;font-family:inherit';
    safe.textContent = 'I am safe — close';
    safe.onclick = ()=> closeModal('sosModal');

    wrap.appendChild(police);
    wrap.appendChild(safe);
    box.appendChild(wrap);

    if(withDigits.length){
      const lines = withDigits.map(c=>c.name + ': ' + c.phone).join('\n');
      alert('SOS — Tap OK, then use Call or SMS for each contact:\n\n' + lines);
    } else {
      alert('SOS — No emergency numbers found. Add contacts in Emergency contacts, or call 112 now.');
    }
  };

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const url = 'https://maps.google.com/?q=' + pos.coords.latitude + ',' + pos.coords.longitude;
        applyUI(url);
      },
      ()=> applyUI(null),
      { enableHighAccuracy:true, timeout:6000, maximumAge:0 }
    );
  } else {
    applyUI(null);
  }
}

function startSOSCountdown(){
  let count = 5;
  const cd = document.getElementById('sosCountdown');
  if(!cd){
    finalizeSOSAlert();
    return;
  }
  cd.textContent = count;
  clearInterval(sosTimer);
  sosTimer = setInterval(()=>{
    count--;
    if(cd) cd.textContent = count;
    if(count <= 0){
      clearInterval(sosTimer);
      finalizeSOSAlert();
    }
  },1000);
}
function cancelSOS(){
  clearInterval(sosTimer);
  closeModal('sosModal');
}

// ── FAKE CALL ────────────────────────────────────
function triggerFakeCall(){
  document.getElementById('fakeCallModal')?.classList.add('open');
}
function endFakeCall(){
  closeModal('fakeCallModal');
}

// ── LOCATION SHARE ────────────────────────────────
function shareLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const {latitude:lat,longitude:lng} = pos.coords;
      const url = `https://maps.google.com/?q=${lat},${lng}`;
      const msg = `🆘 I am sharing my live location: ${url}`;
      if(navigator.share){
        navigator.share({title:'My Location – Astra',text:msg,url}).catch(()=>{});
      } else {
        prompt('Copy and share this link with someone you trust:',url);
      }
    }, ()=>alert('Location access denied. Please enable GPS.'));
  } else {
    alert('Geolocation not supported on this browser.');
  }
}

// ── EMERGENCY PHONE (tel:) ─────────────────────────
/** Frontend-only build — no server logging. */
function astraLogEmergencyDialIntent(_digits, _label) {}

/** Confirms then opens the device dialer via tel: — works on mobile browsers. */
function astraEmergencyTel(rawNumber, label){
  const digits = String(rawNumber || '').replace(/\D/g, '');
  if(!digits){
    alert('Invalid number.');
    return;
  }
  const line = label ? `${label} (${digits})` : digits;
  if(!confirm(`Call ${line} now?\n\nYour phone will open the dialer.`)) return;
  astraLogEmergencyDialIntent(digits, label || '');
  window.location.href = 'tel:' + digits;
}

function callHelpline(num){
  astraEmergencyTel(num, null);
}
