document.addEventListener('DOMContentLoaded', () => { renderNav('Cookie & Consent'); renderCk(); });

const CK = [
  {id:'ck01',impact:'high',title:'Add cookie filter lists to uBlock Origin',desc:'EasyList Cookie and uBlock Annoyances filter lists block most cookie banners before they even appear.',fix:'uBlock dashboard → Filter Lists → scroll to Annoyances section → enable both cookie lists → Apply changes'},
  {id:'ck02',impact:'high',title:'Install Consent-O-Matic',desc:'Automatically handles cookie banners on sites that slip through uBlock: sets minimum consent on over 60 consent management platforms.',fix:'Install from consentomatic.au.dk: available for Firefox and Chrome',link:'https://consentomatic.au.dk'},
  {id:'ck03',impact:'high',title:'Enable Firefox Strict Tracking Protection',desc:'Activates Total Cookie Protection: puts each site\'s cookies in an isolated jar so they can\'t track you cross-site.',fix:'Firefox Settings → Privacy & Security → Enhanced Tracking Protection → Strict'},
  {id:'ck04',impact:'high',title:'Install Cookie AutoDelete',desc:'Automatically deletes cookies from closed tabs. Stops tracking cookies accumulating over time.',fix:'Install Cookie AutoDelete from Firefox Add-ons. Whitelist trusted sites (like your email or bank).',link:'https://addons.mozilla.org/en-GB/firefox/addon/cookie-autodelete/'},
  {id:'ck05',impact:'med',title:'Clear all existing cookies',desc:'You may have years of accumulated tracking cookies. Start fresh.',fix:'Firefox: Settings → Privacy → Clear Data → Cookies and Site Data → Clear. Or Cookie AutoDelete → Clean All.'},
  {id:'ck06',impact:'med',title:'Never click "Accept All" without reading',desc:'The default should always be to reject or minimise consent. Only accept if you understand what you\'re agreeing to.',fix:'Habit change: look for "Reject All", "Essential Only", or "Manage Preferences" before accepting anything.'},
  {id:'ck07',impact:'med',title:'Audit Google consent settings',desc:'Google has its own consent framework separate from cookie banners that controls how your data is used across all Google services.',fix:'Visit myadcenter.google.com → review and disable all personalisation options'},
  {id:'ck08',impact:'med',title:'Opt out of IAB Transparency & Consent Framework',desc:'The advertising industry\'s consent system used by thousands of sites. You can opt out globally.',fix:'Visit optout.iabeurope.eu: sets an opt-out cookie (use Cookie AutoDelete whitelist to keep this one).',link:'https://optout.iabeurope.eu'},
  {id:'ck09',impact:'low',title:'Use Firefox Multi-Account Containers per site category',desc:'Keeps cookies from social media, shopping, and news sites completely isolated from each other.',fix:'Install Firefox Multi-Account Containers → create containers for Social, Shopping, News → assign sites to containers'},
  {id:'ck10',impact:'low',title:'Opt out of Network Advertising Initiative',desc:'Opt-out from dozens of advertising networks at once.',fix:'Visit optout.networkadvertising.org: opt out of all listed networks',link:'https://optout.networkadvertising.org'},
  {id:'ck11',impact:'low',title:'Opt out of Digital Advertising Alliance',desc:'Another industry opt-out covering US-based ad networks.',fix:'Visit youradchoices.com/control: opt out of personalised advertising',link:'https://youradchoices.com/control'},
  {id:'ck12',impact:'low',title:'Report illegal cookie practices to the ICO',desc:'Sites that make rejection harder than acceptance, use pre-ticked boxes, or have no reject option are breaking UK law.',fix:'ico.org.uk/make-a-complaint → Online and social media → Cookies. Takes 5 minutes.',link:'https://ico.org.uk/make-a-complaint/'},
];

function renderCk() {
  const done = S.get('ckDone', []);
  document.getElementById('ck_done').textContent = done.length;
  document.getElementById('ckChecklist').innerHTML = CK.map(item => {
    const isDone = done.includes(item.id);
    return `<div style="display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--border);align-items:flex-start">
      <button onclick="toggle('${item.id}')" style="width:22px;height:22px;flex-shrink:0;margin-top:2px;background:${isDone?'var(--green)':'transparent'};border:1px solid ${isDone?'var(--green)':'var(--border2)'};color:${isDone?'#03110f':'var(--text3)'};font-size:11px;cursor:pointer;border-radius:2px;transition:all .15s">${isDone?'✓':''}</button>
      <div style="flex:1">
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
  const done = S.get('ckDone', []);
  const i = done.indexOf(id); if (i===-1) done.push(id); else done.splice(i,1);
  S.set('ckDone', done); renderCk(); S.updateScoreUI(); renderNav('Cookie & Consent');
}
