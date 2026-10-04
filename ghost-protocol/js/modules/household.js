document.addEventListener('DOMContentLoaded', () => { renderNav('Household & Children'); renderHh(); renderDevList(); });

const ITEMS = [
  {id:'hh01',impact:'high',title:'Set privacy DNS on your router for the whole household',desc:'Router-level DNS (Mullvad or NextDNS) applies to every device in the home: including children\'s devices, smart TVs, and IoT gadgets: without touching each one.',fix:'Router admin panel → DNS settings → Mullvad: 194.242.2.2 / 194.242.2.3. See Network Hardening module for full guide.'},
  {id:'hh02',impact:'high',title:'Disable ACR on every smart TV',desc:'Automatic Content Recognition reports every show you watch to advertisers and data brokers. Off by default on every TV.',fix:'See the ACR settings by manufacturer in the section below. Do this for every TV in the house.'},
  {id:'hh03',impact:'high',title:'Mute smart speaker microphones when not in use',desc:'Smart speakers (Alexa, Google Home) have always-on microphones. They are triggered by false wake words more than manufacturers admit.',fix:'Physical mute button on all smart speakers when not actively using them. Consider removing them from bedrooms.'},
  {id:'hh04',impact:'high',title:'Create child accounts with privacy controls',desc:'Children\'s accounts on Google, Microsoft, and Apple have additional parental controls and privacy restrictions.',fix:'Google: families.google.com. Apple: Screen Time + Family Sharing. Microsoft: account.microsoft.com/family. Use these instead of adult accounts for children.'},
  {id:'hh05',impact:'high',title:'Set up DNS content filtering for children\'s devices',desc:'NextDNS allows per-device filtering: you can apply stricter blocklists to children\'s devices specifically.',fix:'Sign up at nextdns.io → create a profile for children → apply the OISD or Hagezi blocklist → configure children\'s devices to use that profile\'s DNS.',link:'https://nextdns.io'},
  {id:'hh06',impact:'high',title:'Talk to children about privacy and data collection',desc:'Children who understand why privacy matters make better decisions about app permissions, cookie banners, and sharing personal info.',fix:'Age-appropriate conversation: explain that apps collect data to sell adverts, that their personal info is worth protecting, and that they should check with you before installing new apps.'},
  {id:'hh07',impact:'med',title:'Audit children\'s apps and their permissions',desc:'Children\'s games and apps are among the worst offenders for aggressive data collection.',fix:'Go through every app on children\'s devices. Revoke location, microphone, camera, and contacts permissions unless clearly necessary. Remove apps they don\'t use.'},
  {id:'hh08',impact:'med',title:'Install uBlock Origin on family computers',desc:'Extends your tracker blocking to all computers in the household.',fix:'Install uBlock Origin on every browser in the house. Takes 2 minutes. See Tool Arsenal for setup.'},
  {id:'hh09',impact:'med',title:'Set Firefox or Brave as default browser for everyone',desc:'If family members use Chrome, your household DNS and VPN are undermined by Google\'s own data collection.',fix:'Install Firefox or Brave on all family computers. Set as default. Brief explanation of why.'},
  {id:'hh10',impact:'med',title:'Remove gaming consoles from personal WiFi (guest network)',desc:'Xbox, PlayStation, and Nintendo Switch collect significant usage and location data. Isolate them from your main devices.',fix:'Router → Guest Network → connect gaming consoles to guest network. They still work normally but can\'t communicate with your computers.'},
  {id:'hh11',impact:'med',title:'Audit school-issued device privacy settings',desc:'School laptops often have MDM (Mobile Device Management) that can monitor activity even at home.',fix:'Ask the school what monitoring software is installed and whether it operates outside school hours. Use a separate home device for non-school activities if possible.'},
  {id:'hh12',impact:'med',title:'Review household Google account sharing',desc:'Family Google accounts share data. A child\'s YouTube searches can influence adult ad profiles and vice versa.',fix:'Google Family Link → review data sharing settings → consider whether account linking is necessary.'},
  {id:'hh13',impact:'low',title:'Disable smart home integrations where not needed',desc:'Google Home, Alexa, and Apple HomeKit integrations link your device usage patterns and build detailed household profiles.',fix:'Audit connected integrations in each smart home app. Remove anything you don\'t actively use.'},
  {id:'hh14',impact:'low',title:'Check if children\'s game accounts are public',desc:'Public gaming profiles (Xbox, PlayStation, Steam) reveal real-time activity, game history, and sometimes real names.',fix:'Set all children\'s gaming profiles to private/friends-only. Xbox: account.xbox.com/privacy. PlayStation: account.playstation.com → Privacy settings.'},
  {id:'hh15',impact:'low',title:'Review household streaming service data settings',desc:'Netflix, Disney+, Spotify etc. build detailed taste profiles and share data with partners.',fix:'Each service: Account → Privacy Settings → opt out of data sharing with partners. Also: clear viewing history periodically.'},
  {id:'hh16',impact:'low',title:'Discuss phishing with all household members',desc:'A household member clicking a phishing link can compromise shared accounts and home network security.',fix:'Show family members what phishing emails look like: unexpected requests, mismatched sender addresses, urgent language. Agree to check with each other before clicking unusual links.'},
  {id:'hh17',impact:'low',title:'Set up guest WiFi for visitors',desc:'Visitors connecting to your main WiFi can potentially see local network devices.',fix:'Router → Guest Network → enable. Give visitors the guest network password, not your main network password.'},
  {id:'hh18',impact:'low',title:'Review voice assistant purchase history and recordings',desc:'Smart speakers record interactions that are stored in the cloud and may be reviewed by staff.',fix:'Alexa: alexa.amazon.co.uk → History → delete all. Google Home: myactivity.google.com → filter by Assistant → delete. Delete regularly.'},
];

function renderHh() {
  const done = S.get('hhDone',[]);
  document.getElementById('hh_done').textContent = done.length;
  const sorted = [...ITEMS.filter(i=>i.impact==='high'), ...ITEMS.filter(i=>i.impact==='med'), ...ITEMS.filter(i=>i.impact==='low')];
  document.getElementById('hhChecklist').innerHTML = sorted.map(item => {
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
  const done = S.get('hhDone',[]);
  const i = done.indexOf(id); if(i===-1) done.push(id); else done.splice(i,1);
  S.set('hhDone',done); renderHh(); S.updateScoreUI(); renderNav('Household & Children');
}

function addDevice() {
  const name = document.getElementById('devName').value.trim();
  if (!name) return;
  const devs = S.get('devices',[]);
  devs.unshift({id:Date.now(), name, action: document.getElementById('devAction').value.trim(), risk: document.getElementById('devRisk').value, date: new Date().toLocaleDateString('en-GB')});
  S.set('devices', devs);
  document.getElementById('devName').value = '';
  document.getElementById('devAction').value = '';
  renderDevList();
}

function removeDevice(id) {
  S.set('devices', S.get('devices',[]).filter(d=>d.id!==id));
  renderDevList();
}

function renderDevList() {
  const devs = S.get('devices',[]);
  if (!devs.length) { document.getElementById('devList').innerHTML='<div style="font-size:12px;color:var(--text3);padding:8px 0">No devices logged yet.</div>'; return; }
  document.getElementById('devList').innerHTML = `<table class="data-table"><thead><tr><th>DEVICE</th><th>RISK</th><th>ACTION TAKEN</th><th>DATE</th><th></th></tr></thead><tbody>
    ${devs.map(d=>`<tr>
      <td class="cell-main">${d.name}</td>
      <td><span class="badge ${d.risk==='high'?'danger':d.risk==='med'?'warn':'muted'}">${d.risk.toUpperCase()}</span></td>
      <td style="font-size:12px;color:var(--text2)">${d.action||'-'}</td>
      <td style="font-family:var(--mono);font-size:10px;color:var(--text3)">${d.date}</td>
      <td><button class="btn-icon" onclick="removeDevice(${d.id})">✕</button></td>
    </tr>`).join('')}
  </tbody></table>`;
}
