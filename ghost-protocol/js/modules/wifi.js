document.addEventListener('DOMContentLoaded', () => { renderNav('WiFi & Bluetooth'); renderWb(); });

const ITEMS = [
  {id:'wb01',impact:'high',title:'Turn off WiFi when not using it',desc:'When WiFi is on but unconnected, your phone broadcasts probe requests advertising every network you\'ve ever joined.',fix:'Habit: turn off WiFi when leaving home/office. Or: set it to auto-disable when not connected to a known network (Android: WiFi settings → Advanced → Turn on WiFi automatically toggle off).'},
  {id:'wb02',impact:'high',title:'Forget all public/old WiFi networks',desc:'Your device remembers and advertises every network it\'s ever connected to. Old networks from years ago are still being broadcast.',fix:'iOS: Settings → WiFi → Edit → delete old networks. Android: Settings → Network → WiFi → Saved Networks → delete all you don\'t regularly use.'},
  {id:'wb03',impact:'high',title:'Enable MAC address randomisation per network',desc:'Randomising your MAC address prevents tracking across different WiFi networks.',fix:'iOS: automatic on iOS 14+. Verify: tap a network → Private WiFi Address → ON. Android: Settings → WiFi → tap network → Privacy → Use randomised MAC.'},
  {id:'wb04',impact:'high',title:'Always use VPN on public WiFi',desc:'Public WiFi operators can see your traffic. A VPN encrypts everything from your device before it hits their network.',fix:'Enable Mullvad or ProtonVPN before connecting to any public WiFi. Make it a reflex.'},
  {id:'wb05',impact:'high',title:'Turn off Bluetooth when not using it',desc:'Bluetooth is used for in-store tracking and can be used to establish proximity to other devices.',fix:'Habit: turn off Bluetooth when not using headphones, speakers, or other peripherals. Quick settings toggle.'},
  {id:'wb06',impact:'med',title:'Never auto-connect to open networks',desc:'Your device auto-connecting to an open network named "Starbucks" could be connecting to a rogue hotspot run by an attacker.',fix:'iOS: Settings → WiFi → Auto-Join Hotspot → Never (or Ask). Android: WiFi Advanced → Connect to public networks → Off.'},
  {id:'wb07',impact:'med',title:'Disable WiFi calling if not needed',desc:'WiFi calling routes calls through your internet connection and is logged by your carrier differently: and may expose your home IP.',fix:'iOS: Settings → Phone → WiFi Calling → Off (unless you need it for coverage). Android: Settings → Network → WiFi Calling → Off.'},
  {id:'wb08',impact:'med',title:'Use HTTPS exclusively',desc:'On public WiFi, HTTP traffic is readable by the network operator. HTTPS encrypts it.',fix:'Firefox: Settings → HTTPS-Only Mode → Enable in all windows. Modern browsers enforce this by default now.'},
  {id:'wb09',impact:'med',title:'Check your home router for rogue devices',desc:'Devices you don\'t recognise on your home network can sniff traffic.',fix:'Log into your router admin panel → check connected devices list → remove or block anything unrecognised.'},
  {id:'wb10',impact:'med',title:'Change your home router default credentials',desc:'Default router username/password ("admin/admin") is widely known. Anyone on your network or nearby can access the router.',fix:'Router admin panel → Administration → change username and password to something unique and strong.'},
  {id:'wb11',impact:'med',title:'Disable WPS on your router',desc:'WPS (WiFi Protected Setup) has known vulnerabilities that allow brute-force attacks to get your WiFi password.',fix:'Router admin panel → Wireless → WPS → Disable.'},
  {id:'wb12',impact:'low',title:'Use WPA3 encryption on home WiFi',desc:'WPA2 has known vulnerabilities. WPA3 is significantly more secure.',fix:'Router admin → Wireless Security → change encryption to WPA3 if your router supports it. WPA2/WPA3 mixed mode is fine if some devices are older.'},
  {id:'wb13',impact:'low',title:'Create a guest network for IoT devices',desc:'Smart TVs, voice assistants, and IoT devices often have poor security. Isolating them on a guest network prevents them accessing your main devices.',fix:'Router admin → Guest Network → enable and set a separate password. Connect all IoT devices to the guest network only.'},
  {id:'wb14',impact:'low',title:'Disable Bluetooth device history sharing',desc:'Some apps can read your list of paired Bluetooth devices as an identifier.',fix:'iOS: Settings → Privacy → Bluetooth → review which apps have access. Android: Settings → Privacy → Permission Manager → Nearby Devices → review.'},
];

function renderWb() {
  const done = S.get('wbDone',[]);
  document.getElementById('wb_done').textContent = done.length;
  document.getElementById('wbChecklist').innerHTML = ITEMS.map(item => {
    const isDone = done.includes(item.id);
    return `<div style="display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--border);align-items:flex-start">
      <button onclick="toggle('${item.id}')" style="width:22px;height:22px;flex-shrink:0;margin-top:2px;background:${isDone?'var(--green)':'transparent'};border:1px solid ${isDone?'var(--green)':'var(--border2)'};color:${isDone?'#03110f':'var(--text3)'};font-size:11px;cursor:pointer;border-radius:2px;transition:all .15s">${isDone?'✓':''}</button>
      <div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:3px">
          <span style="font-size:13px;font-weight:500;${isDone?'text-decoration:line-through;color:var(--text3)':''}">${item.title}</span>
          <span class="badge ${item.impact==='high'?'danger':item.impact==='med'?'warn':'muted'}">${item.impact.toUpperCase()}</span>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">${item.desc}</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--accent)">FIX: ${item.fix}</div>
      </div>
    </div>`;
  }).join('');
}

function toggle(id) {
  const done = S.get('wbDone',[]);
  const i = done.indexOf(id); if(i===-1) done.push(id); else done.splice(i,1);
  S.set('wbDone',done); renderWb(); S.updateScoreUI(); renderNav('WiFi & Bluetooth');
}
