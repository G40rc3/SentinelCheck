document.addEventListener('DOMContentLoaded', () => { renderNav('Fingerprint Defence'); renderChecklist(); });

const FP_ITEMS = [
  {id:'fp01',impact:'high',title:'Switch to Firefox or Brave',desc:'Chrome and Edge have the most identifiable fingerprints. Firefox with the right settings, or Brave with shields enabled, significantly reduces fingerprint uniqueness.',fix:'Download Firefox (mozilla.org) or Brave (brave.com). Set as default browser.',link:'https://www.mozilla.org/en-GB/firefox/'},
  {id:'fp02',impact:'high',title:'Enable Firefox Strict Tracking Protection',desc:'Firefox\'s Strict mode blocks known fingerprinting scripts in addition to trackers and cookies.',fix:'Firefox → Settings → Privacy & Security → Enhanced Tracking Protection → Strict',link:null},
  {id:'fp03',impact:'high',title:'Install Firefox resist fingerprinting (about:config)',desc:'Firefox has a hidden setting that randomises your canvas fingerprint, screen size reporting, and other signals on every page load.',fix:'Type about:config in address bar → search "privacy.resistFingerprinting" → set to true',link:null},
  {id:'fp04',impact:'high',title:'Install CanvasBlocker extension',desc:'Blocks or randomises the Canvas API that sites use to generate a unique fingerprint from your GPU\'s rendering behaviour.',fix:'Install CanvasBlocker from Firefox Add-ons. Set to "Fake" mode.',link:'https://addons.mozilla.org/en-GB/firefox/addon/canvasblocker/'},
  {id:'fp05',impact:'high',title:'Install uBlock Origin (if not already)',desc:'uBlock Origin\'s advanced mode blocks fingerprinting scripts from known tracking domains. Essential even for fingerprinting defence.',fix:'Install uBlock Origin. Enable "I am an advanced user" in settings.',link:'https://github.com/gorhill/uBlock'},
  {id:'fp06',impact:'med',title:'Disable WebRTC',desc:'WebRTC can leak your real IP address even through a VPN. Sites can use it to identify your true location.',fix:'Firefox: about:config → search "media.peerconnection.enabled" → set false. Or install "WebRTC Leak Shield".',link:'https://addons.mozilla.org/en-GB/firefox/addon/webrtc-leak-shield/'},
  {id:'fp07',impact:'med',title:'Use a common screen resolution',desc:'Unusual screen sizes (ultrawide, very high DPI) make you more fingerprintable. A common resolution blends you into the crowd.',fix:'With resistFingerprinting enabled, Firefox reports a standard screen size. No extra action needed if that\'s on.',link:null},
  {id:'fp08',impact:'med',title:'Limit installed fonts',desc:'Your system\'s installed fonts are enumerable by JavaScript. Unusual font sets are highly identifying.',fix:'resistFingerprinting in Firefox limits font enumeration automatically. No manual action needed if enabled.',link:null},
  {id:'fp09',impact:'med',title:'Set timezone to UTC',desc:'Your timezone narrows you down geographically. Setting to UTC makes you match millions of users.',fix:'resistFingerprinting reports UTC by default. Or: OS timezone settings → UTC.',link:null},
  {id:'fp10',impact:'med',title:'Disable JavaScript (selective)',desc:'JS is the mechanism through which most fingerprinting happens. Disabling it on untrusted sites eliminates most attack surface.',fix:'uBlock Origin → Dashboard → My filters → add "||example.com^$script" per domain. Or use NoScript.',link:'https://addons.mozilla.org/en-GB/firefox/addon/noscript/'},
  {id:'fp11',impact:'low',title:'Use Mullvad Browser',desc:'Built by Tor Project + Mullvad. Designed specifically for fingerprint resistance: gives every user the same fingerprint.',fix:'Download Mullvad Browser (mullvad.net/browser). Use alongside Mullvad VPN for maximum effect.',link:'https://mullvad.net/en/browser'},
  {id:'fp12',impact:'low',title:'Consider Tor Browser for sensitive browsing',desc:'Tor Browser routes traffic through multiple relays AND standardises fingerprints. All users look identical to sites.',fix:'Use Tor Browser (torproject.org) for sensitive research. Slower but most private.',link:'https://www.torproject.org'},
];

function renderChecklist() {
  const done = S.get('fpDone', []);
  const doneCount = FP_ITEMS.filter(i => done.includes(i.id)).length;
  document.getElementById('fp_done').textContent = doneCount;
  document.getElementById('fp_todo').textContent = FP_ITEMS.length - doneCount;
  document.getElementById('fp_bar').style.width = (doneCount / FP_ITEMS.length * 100).toFixed(0) + '%';

  document.getElementById('fpChecklist').innerHTML = FP_ITEMS.map(item => {
    const isDone = done.includes(item.id);
    return `<div style="display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)">
      <button onclick="toggleFP('${item.id}')" style="width:24px;height:24px;flex-shrink:0;margin-top:2px;
        background:${isDone?'var(--green)':'transparent'};border:1px solid ${isDone?'var(--green)':'var(--border2)'};
        color:${isDone?'#03110f':'var(--text3)'};font-size:12px;cursor:pointer;border-radius:2px;transition:all .15s">
        ${isDone?'✓':''}
      </button>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <span style="font-size:13px;font-weight:500;${isDone?'text-decoration:line-through;color:var(--text3)':''}">${item.title}</span>
          <span class="badge ${item.impact==='high'?'danger':item.impact==='med'?'warn':'muted'}">${item.impact.toUpperCase()}</span>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px">${item.desc}</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--accent)">FIX: ${item.fix}${item.link?` <a href="${item.link}" target="_blank" rel="noopener" style="color:var(--accent)">[link ↗]</a>`:''}</div>
      </div>
    </div>`;
  }).join('');
}

function toggleFP(id) {
  const done = S.get('fpDone', []);
  const idx = done.indexOf(id);
  if (idx === -1) done.push(id); else done.splice(idx, 1);
  S.set('fpDone', done);
  renderChecklist();
  S.updateScoreUI();
  renderNav('Fingerprint Defence');
}
