document.addEventListener('DOMContentLoaded', () => { renderNav('Network Hardening'); renderNetChecklist(); showGuide('router'); });

const NET_ITEMS = [
  {id:'n01',impact:'high',title:'Change DNS on your router',desc:'Changing DNS at the router level protects every device in your home: phones, laptops, smart TVs, everything: without touching each device individually.',fix:'Log into your router (usually 192.168.0.1 or 192.168.1.1) → DNS settings → enter Mullvad or NextDNS addresses'},
  {id:'n02',impact:'high',title:'Use a no-log VPN',desc:'A trustworthy VPN encrypts all your traffic from your ISP. They can no longer log or sell your browsing history.',fix:'Mullvad (mullvad.net) or ProtonVPN (protonvpn.com). Both independently audited. Avoid free VPNs.',link:'https://mullvad.net'},
  {id:'n03',impact:'high',title:'Enable DNS over HTTPS (DoH) in Firefox',desc:'Standard DNS is unencrypted: anyone on the network can read it. DoH encrypts your DNS queries.',fix:'Firefox → Settings → Privacy & Security → DNS over HTTPS → Max Protection → choose Mullvad or NextDNS'},
  {id:'n04',impact:'high',title:'Run a DNS leak test',desc:'Even with a VPN, your DNS queries may leak through your ISP (a "DNS leak"). Test to confirm they\'re not.',fix:'Visit dnsleaktest.com while VPN is active → Run Extended Test → DNS servers shown should be your VPN\'s, not your ISP\'s',link:'https://www.dnsleaktest.com'},
  {id:'n05',impact:'med',title:'Disable WebRTC in browser',desc:'WebRTC is a browser feature that can reveal your real IP address even when using a VPN.',fix:'about:config in Firefox → media.peerconnection.enabled → false. Or install WebRTC Leak Shield.',link:'https://addons.mozilla.org/en-GB/firefox/addon/webrtc-leak-shield/'},
  {id:'n06',impact:'med',title:'Install Portmaster (system-level DNS firewall)',desc:'Portmaster intercepts all DNS requests from every application on your computer: not just your browser: and blocks trackers at the OS level.',fix:'Download from safing.io/portmaster: free, open source',link:'https://safing.io/portmaster/'},
  {id:'n07',impact:'med',title:'Check for IPv6 leaks',desc:'If your VPN doesn\'t support IPv6, your real IPv6 address can leak through, identifying you.',fix:'Visit ipleak.net while VPN is active: check that no IPv6 address appears (or it should show VPN\'s IPv6)',link:'https://ipleak.net'},
  {id:'n08',impact:'low',title:'Use HTTPS everywhere',desc:'Ensure you\'re always using encrypted HTTPS connections, not unencrypted HTTP.',fix:'Modern browsers enforce HTTPS by default. Enable: Firefox → Settings → HTTPS-Only Mode → Enable in all windows'},
  {id:'n09',impact:'low',title:'Consider Pi-hole for home network',desc:'Pi-hole is a self-hosted DNS server that blocks ads and trackers for your entire home network. Requires a Raspberry Pi or spare PC.',fix:'pi-hole.net: free, open source, runs on a Raspberry Pi 4 (£35)',link:'https://pi-hole.net'},
];

const GUIDES = {
  router: {
    title:'Router: protects all home devices at once',
    steps:[
      'Open a browser and go to your router admin panel: usually 192.168.0.1 or 192.168.1.1',
      'Log in (check the sticker on your router for default credentials)',
      'Find "DNS Settings": usually under WAN, Internet, or Advanced settings',
      'Replace the DNS addresses with your chosen privacy DNS (e.g. Mullvad: 194.242.2.2 and 194.242.2.3)',
      'Save and restart your router',
      'Test at dnsleaktest.com: the DNS server shown should be Mullvad or your chosen provider, not your ISP'
    ]
  },
  windows: {
    title:'Windows 10/11',
    steps:[
      'Right-click the network icon in the taskbar → Open Network & Internet Settings',
      'Click your connection (WiFi or Ethernet) → Edit DNS settings',
      'Change from Automatic to Manual',
      'Enter Preferred DNS: 194.242.2.2 (Mullvad) and Alternate: 194.242.2.3',
      'Save and open Command Prompt → type: ipconfig /flushdns',
      'Test at dnsleaktest.com'
    ]
  },
  mac: {
    title:'macOS',
    steps:[
      'Apple menu → System Preferences (or System Settings on Ventura+) → Network',
      'Select your connection → Advanced → DNS tab',
      'Click + to add DNS servers. Enter: 194.242.2.2 and 194.242.2.3 (Mullvad)',
      'Remove old DNS entries by selecting them and clicking -',
      'Click OK → Apply',
      'Test at dnsleaktest.com'
    ]
  },
  android: {
    title:'Android',
    steps:[
      'Settings → Network & Internet → Private DNS',
      'Select "Private DNS provider hostname"',
      'Enter: dns.mullvad.net (or nextdns.io if you have a NextDNS account)',
      'Tap Save',
      'This uses DNS-over-TLS: encrypted and private',
      'Test at dnsleaktest.com'
    ]
  },
  ios: {
    title:'iPhone / iPad (iOS)',
    steps:[
      'The easiest method is installing the Mullvad or NextDNS configuration profile',
      'Visit 194.242.2.2 in Safari → download the configuration profile',
      'Settings → General → VPN & Device Management → install the profile',
      'This routes all DNS through Mullvad with encryption',
      'Alternatively: use the Cloudflare 1.1.1.1 app from the App Store (free)',
      'Test at dnsleaktest.com'
    ]
  },
  firefox: {
    title:'Firefox: DNS over HTTPS',
    steps:[
      'Open Firefox → Settings → Privacy & Security',
      'Scroll to "DNS over HTTPS"',
      'Select "Max Protection"',
      'Choose provider: select Custom and enter https://doh.mullvad.net/dns-query',
      'Firefox now encrypts all DNS queries: your ISP can no longer read them',
      'Test: visit browserleaks.com/dns: should show Mullvad as DNS resolver'
    ]
  }
};

function showGuide(key) {
  Object.keys(GUIDES).forEach(k => {
    const btn = document.getElementById('g_' + k);
    if (btn) { btn.style.borderColor = k === key ? 'var(--accent)' : ''; btn.style.color = k === key ? 'var(--accent)' : ''; }
  });
  const g = GUIDES[key];
  document.getElementById('guideArea').innerHTML = `
    <div style="background:var(--bg3);border:1px solid var(--border);padding:16px;border-radius:2px">
      <div style="font-family:var(--mono);font-size:10px;color:var(--accent);margin-bottom:12px">${g.title}</div>
      <ol style="padding-left:20px;display:flex;flex-direction:column;gap:10px">
        ${g.steps.map(s => `<li style="font-size:13px;color:var(--text2);line-height:1.6">${s}</li>`).join('')}
      </ol>
    </div>`;
}

function renderNetChecklist() {
  const done = S.get('netDone', []);
  document.getElementById('netChecklist').innerHTML = NET_ITEMS.map(item => {
    const isDone = done.includes(item.id);
    return `<div style="display:flex;align-items:flex-start;gap:12px;padding:13px 0;border-bottom:1px solid var(--border)">
      <button onclick="toggleNet('${item.id}')" style="width:22px;height:22px;flex-shrink:0;margin-top:2px;
        background:${isDone?'var(--green)':'transparent'};border:1px solid ${isDone?'var(--green)':'var(--border2)'};
        color:${isDone?'#03110f':'var(--text3)'};font-size:11px;cursor:pointer;border-radius:2px;transition:all .15s">
        ${isDone?'✓':''}
      </button>
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <span style="font-size:13px;font-weight:500;${isDone?'text-decoration:line-through;color:var(--text3)':''}">${item.title}</span>
          <span class="badge ${item.impact==='high'?'danger':item.impact==='med'?'warn':'muted'}">${item.impact.toUpperCase()}</span>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">${item.desc}</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--accent)">HOW: ${item.fix}${item.link?` <a href="${item.link}" target="_blank" rel="noopener" style="color:var(--accent)">[link ↗]</a>`:''}</div>
      </div>
    </div>`;
  }).join('');
}

function toggleNet(id) {
  const done = S.get('netDone', []);
  const idx = done.indexOf(id);
  if (idx === -1) done.push(id); else done.splice(idx, 1);
  S.set('netDone', done);
  renderNetChecklist();
  S.updateScoreUI();
  renderNav('Network Hardening');
}
