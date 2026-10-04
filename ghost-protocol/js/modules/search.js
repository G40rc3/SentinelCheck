document.addEventListener('DOMContentLoaded', () => { renderNav('Search & Browsing'); renderSb(); });

const ITEMS = [
  {id:'sb01',impact:'high',title:'Switch default search to Brave Search or DuckDuckGo',desc:'Your search queries reveal your health concerns, political views, financial situation, and personal relationships. Don\'t hand them to Google.',fix:'Firefox: Settings → Search → Default Search Engine → select DuckDuckGo or Brave Search. Or install Brave browser.'},
  {id:'sb02',impact:'high',title:'Delete your Google search history',desc:'Google has potentially years of your search history. Delete it.',fix:'myaccount.google.com/delete-services → Delete activity by → All time → Search → Delete. Then pause Web & App Activity.'},
  {id:'sb03',impact:'high',title:'Stop using Chrome',desc:'Chrome reports your browsing to Google. Even with extensions, it has telemetry that can\'t be disabled by regular users.',fix:'Switch to Firefox (open source, non-profit) or Brave (built-in ad blocking, Chromium-based). Both support all major extensions.'},
  {id:'sb04',impact:'high',title:'Enable HTTPS-Only mode',desc:'HTTP connections are unencrypted and visible to your ISP and network operator. Always use HTTPS.',fix:'Firefox: Settings → Privacy & Security → HTTPS-Only Mode → Enable in all windows.'},
  {id:'sb05',impact:'high',title:'Clear browser history and set auto-clear',desc:'Your local browser history is also a privacy risk if someone accesses your device.',fix:'Firefox: Settings → Privacy → History → Firefox will: Use custom settings → clear history when Firefox closes → tick everything.'},
  {id:'sb06',impact:'med',title:'Stop using Google Translate for sensitive text',desc:'Text you paste into Google Translate is collected and may be used for training.',fix:'Use DeepL (deepl.com): better privacy policy. Or use offline translation apps for sensitive content.'},
  {id:'sb07',impact:'med',title:'Log out of Google/Facebook while browsing',desc:'When logged into Google or Facebook, every site with a Like button or Analytics tag reports your visit to them.',fix:'Browse logged out of all social accounts. Use Firefox containers to isolate social media sessions.'},
  {id:'sb08',impact:'med',title:'Don\'t use Google Docs for sensitive documents',desc:'Google reads your documents for ad profiling. All content in Google Docs is accessible to Google.',fix:'Use LibreOffice (local), Cryptpad.fr (encrypted online collaboration), or Proton Drive for sensitive files.',link:'https://cryptpad.fr'},
  {id:'sb09',impact:'med',title:'Use a privacy-respecting maps service',desc:'Google Maps tracks everywhere you go and builds a detailed location history.',fix:'Use OpenStreetMap (openstreetmap.org) or OsmAnd (mobile). For transit: Moovit or Citymapper (less invasive than Google).'},
  {id:'sb10',impact:'med',title:'Stop using Google Analytics opt-out workaround',desc:'Install the Google Analytics Opt-Out browser add-on: tells GA not to collect your data on sites that use it.',fix:'Install: tools.google.com/dlpage/gaoptout: installs an add-on that blocks Google Analytics collection.',link:'https://tools.google.com/dlpage/gaoptout'},
  {id:'sb11',impact:'med',title:'Understand and use SearXNG for sensitive searches',desc:'SearXNG is a self-hostable meta-search engine that queries multiple engines without identifying you to any of them.',fix:'Use a public instance at searx.space: or self-host with Docker if you\'re technical.',link:'https://searx.space'},
  {id:'sb12',impact:'low',title:'Never use browser-saved passwords',desc:'Browser password managers are convenient but less secure than Bitwarden and sync your passwords to the browser company\'s servers.',fix:'Bitwarden Settings → Browser extension → disable in-browser fill where it conflicts. Let Bitwarden handle all fills.'},
  {id:'sb13',impact:'low',title:'Disable browser telemetry',desc:'Firefox and Brave both send some telemetry to their developers by default. Opt out.',fix:'Firefox: Settings → Privacy → Firefox Data Collection → untick all. Brave: Settings → Privacy → Usage Ping → Off.'},
  {id:'sb14',impact:'low',title:'Use a separate browser for high-risk searches',desc:'For sensitive research (medical, legal, financial), use a separate browser profile or Tor Browser to keep it completely isolated.',fix:'Create a Firefox profile: about:profiles → Create a New Profile. Use only for sensitive research. Never log into anything in it.'},
  {id:'sb15',impact:'low',title:'Install Privacy Badger (EFF)',desc:'Learns which trackers follow you across sites and blocks them. Complements uBlock Origin with a different detection method.',fix:'Install Privacy Badger from privacybadger.org: available for Firefox and Chrome.',link:'https://privacybadger.org'},
];

function renderSb() {
  const done = S.get('sbDone',[]);
  document.getElementById('sb_done').textContent = done.length;
  document.getElementById('sbChecklist').innerHTML = ITEMS.map(item => {
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
  const done = S.get('sbDone',[]);
  const i = done.indexOf(id); if(i===-1) done.push(id); else done.splice(i,1);
  S.set('sbDone',done); renderSb(); S.updateScoreUI(); renderNav('Search & Browsing');
}
