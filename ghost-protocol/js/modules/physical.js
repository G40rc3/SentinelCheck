document.addEventListener('DOMContentLoaded', () => { renderNav('Physical OPSEC'); renderPo(); });

const ITEMS = [
  {id:'po01',impact:'high',title:'Enable full disk encryption on your laptop',desc:'If your laptop is stolen without encryption, all your files are readable in minutes. Encryption makes the data useless without your password.',fix:'Windows: Settings → Update & Security → Device Encryption → On. Mac: System Preferences → Security → FileVault → On.'},
  {id:'po02',impact:'high',title:'Set a strong device passcode',desc:'A 4-digit PIN can be brute-forced. Use 6+ digits or an alphanumeric passcode.',fix:'iPhone: Settings → Face ID & Passcode → Change Passcode → Passcode Options → Custom Alphanumeric. Android: Settings → Security → Screen Lock → Password.'},
  {id:'po03',impact:'high',title:'Enable auto-lock after 30 to 60 seconds',desc:'A device left unlocked is a device anyone can access. Short auto-lock is your physical security net.',fix:'iPhone: Settings → Display & Brightness → Auto-Lock → 30 seconds. Windows: Settings → Personalisation → Lock Screen → Screen timeout.'},
  {id:'po04',impact:'high',title:'Wipe old devices before selling or recycling',desc:'Factory reset without prior encryption leaves data recoverable. Always encrypt first, then factory reset.',fix:'See the disposal guide below. Never sell a device with only a factory reset: encrypt it first.'},
  {id:'po05',impact:'high',title:'Enable "Find My" / remote wipe on all devices',desc:'If a device is stolen, you need the ability to wipe it remotely before the thief can extract data.',fix:'iPhone: Settings → [your name] → Find My → on. Android: Settings → Google → Find My Device → on. Test the remote wipe option: know where to go before you need it.'},
  {id:'po06',impact:'med',title:'Use a screen privacy filter on laptop in public',desc:'Visual eavesdropping ("shoulder surfing") is a real attack. Anyone sitting near you in a café or train can see your screen.',fix:'Buy a 3M privacy filter for your laptop model. Restricts viewing angle to ~60°. Worth it if you work in public regularly.',link:'https://www.3m.com/3M/en_US/privacy-screen-protectors-us/'},
  {id:'po07',impact:'med',title:'Never leave devices unattended unlocked',desc:'30 seconds is enough for someone to install malware, copy files, or add themselves to your accounts.',fix:'Habit: always lock before stepping away. Windows: Win+L. Mac: Cmd+Ctrl+Q. iPhone: side button.'},
  {id:'po08',impact:'med',title:'Be aware of cameras in workspaces',desc:'CCTV in cafés, offices, and co-working spaces can capture your screen, keyboard input, and face.',fix:'Position yourself with your back to walls. Check camera angles before working on sensitive material. Use a privacy screen filter.'},
  {id:'po09',impact:'med',title:'Disable USB ports when not in use (high risk users)',desc:'Rubber Ducky and similar USB attack tools can compromise a machine in seconds if inserted.',fix:'Windows: Device Manager → Universal Serial Bus controllers → disable. Or: physical USB port locks. For most users: just don\'t leave devices unattended.'},
  {id:'po10',impact:'med',title:'Set BIOS/firmware password',desc:'A firmware password prevents someone from booting from a USB drive to bypass your OS login.',fix:'Mac: Recovery Mode → Utilities → Startup Security Utility → Full Security + require password. Windows: restart → BIOS/UEFI (usually F2 or Del) → set supervisor password.'},
  {id:'po11',impact:'med',title:'Check your environment before sensitive calls',desc:'Smart speakers (Alexa, Google Home) in the room during sensitive conversations are microphones.',fix:'Mute or unplug smart speakers during sensitive calls. Move to a room without them if possible.'},
  {id:'po12',impact:'med',title:'Cover your laptop camera when not in use',desc:'Webcam malware exists. A simple physical cover costs £2 and is absolute protection.',fix:'Buy a webcam cover/slider (search "laptop camera cover" on Amazon: under £2). Simple, effective, permanent solution.'},
  {id:'po13',impact:'low',title:'Shred documents containing personal information',desc:'Paper documents with your name, address, or account numbers feed identity theft if binned.',fix:'Buy a cross-cut shredder for any document with your name, address, account numbers, or receipts.'},
  {id:'po14',impact:'low',title:'Use a VPN on hotel WiFi',desc:'Hotel networks are frequently monitored. Business travellers are targeted for corporate data.',fix:'Connect Mullvad or ProtonVPN before opening any hotel WiFi. Treat hotel WiFi like a public hotspot.'},
  {id:'po15',impact:'low',title:'Consider a RFID-blocking wallet',desc:'Contactless payment cards can be read at short range by specialised equipment.',fix:'Use an RFID-blocking wallet or card sleeve. Particularly useful in crowded public transport.'},
  {id:'po16',impact:'low',title:'Be cautious with USB charging in public',desc:'"Juice jacking": malicious USB charging ports that install malware or extract data while charging.',fix:'Carry a power bank for charging in public. If you must use a public USB port, use a USB data blocker (charge-only adapter). Available for ~£5.'},
];

function renderPo() {
  const done = S.get('poDone',[]);
  document.getElementById('po_done').textContent = done.length;
  document.getElementById('poChecklist').innerHTML = ITEMS.map(item => {
    const isDone = done.includes(item.id);
    return `<div style="display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--border);align-items:flex-start">
      <button onclick="toggle('${item.id}')" style="width:22px;height:22px;flex-shrink:0;margin-top:2px;background:${isDone?'var(--green)':'transparent'};border:1px solid ${isDone?'var(--green)':'var(--border2)'};color:${isDone?'#03110f':'var(--text3)'};font-size:11px;cursor:pointer;border-radius:2px;transition:all .15s">${isDone?'✓':''}</button>
      <div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:3px">
          <span style="font-size:13px;font-weight:500;${isDone?'text-decoration:line-through;color:var(--text3)':''}">${item.title}</span>
          <span class="badge ${item.impact==='high'?'danger':item.impact==='med'?'warn':'muted'}">${item.impact.toUpperCase()}</span>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">${item.desc}</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--accent)">FIX: ${item.fix}${item.link?` <a href="${item.link}" target="_blank" rel="noopener" style="color:var(--accent)">[link ↗]</a>`:''}</div>
      </div>
    </div>`;
  }).join('');
}

function toggle(id) {
  const done = S.get('poDone',[]);
  const i = done.indexOf(id); if(i===-1) done.push(id); else done.splice(i,1);
  S.set('poDone',done); renderPo(); S.updateScoreUI(); renderNav('Physical OPSEC');
}
