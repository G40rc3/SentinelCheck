document.addEventListener('DOMContentLoaded', () => { renderNav('App Permissions'); setPlat('ios'); renderAppLog(); });

let currentPlat = 'ios';
function setPlat(p) {
  currentPlat = p;
  ['ios','android'].forEach(k => {
    const b = document.getElementById('plt_'+k);
    if (b) { b.style.borderColor = k===p?'var(--accent)':''; b.style.color = k===p?'var(--accent)':''; }
  });
  renderChecklist();
}

const ITEMS = {
  ios: [
    {id:'ap01',title:'Audit Location permissions',desc:'Go through every app. Most should be "Never" or "While Using". Almost nothing should be "Always".',fix:'Settings → Privacy & Security → Location Services → review each app. Change to "Never" or "While Using App" wherever possible.'},
    {id:'ap02',title:'Audit Microphone permissions',desc:'Only apps that actively need your voice (calls, voice notes, Siri integrations) should have microphone access.',fix:'Settings → Privacy & Security → Microphone → toggle off any app you don\'t use for voice.'},
    {id:'ap03',title:'Audit Camera permissions',desc:'Only camera/video apps need this. Review anything unexpected.',fix:'Settings → Privacy & Security → Camera → review each app.'},
    {id:'ap04',title:'Audit Contacts permissions',desc:'Your contacts list maps your entire social network. Most apps don\'t need it.',fix:'Settings → Privacy & Security → Contacts → revoke anything that doesn\'t need to send messages or calls.'},
    {id:'ap05',title:'Audit Tracking permissions (ATT)',desc:'Apple\'s App Tracking Transparency lets you block cross-app tracking entirely.',fix:'Settings → Privacy & Security → Tracking → toggle "Allow Apps to Request to Track" OFF. This stops all apps asking.'},
    {id:'ap06',title:'Turn off Personalised Ads',desc:'Apple uses your data for its own ad targeting unless you opt out.',fix:'Settings → Privacy & Security → Apple Advertising → Personalised Ads → OFF'},
    {id:'ap07',title:'Review app access to Health data',desc:'Health data is extremely sensitive. Audit what has access.',fix:'Settings → Privacy & Security → Health → review each category.'},
    {id:'ap08',title:'Limit ad targeting in apps (IDFA)',desc:'Your iPhone\'s advertising ID links your behaviour across apps. Resetting it breaks tracking history.',fix:'Settings → Privacy & Security → Tracking → turn off tracking globally. IDFA is then zeros for all apps.'},
    {id:'ap09',title:'Audit apps with access to Photos',desc:'Full photo library access gives apps all your photos and their metadata (location, time, faces).',fix:'Settings → Privacy & Security → Photos → set each app to "Selected Photos" or "None" unless necessary.'},
    {id:'ap10',title:'Check which apps have Background App Refresh',desc:'Apps refreshing in the background can collect data even when closed.',fix:'Settings → General → Background App Refresh → disable for any app that doesn\'t need real-time updates.'},
  ],
  android: [
    {id:'ap11',title:'Audit Location permissions',desc:'Review every app\'s location access. Most should be "Only while using" or "Denied".',fix:'Settings → Privacy → Permission Manager → Location → review each app. Revoke "Allow all the time" from anything that doesn\'t need it.'},
    {id:'ap12',title:'Audit Microphone permissions',desc:'Only voice, calls, and dictation apps need microphone.',fix:'Settings → Privacy → Permission Manager → Microphone → revoke from any non-voice app.'},
    {id:'ap13',title:'Audit Camera permissions',desc:'Camera apps, video call apps, QR scanners. Everything else: revoke.',fix:'Settings → Privacy → Permission Manager → Camera → revoke from anything unexpected.'},
    {id:'ap14',title:'Audit Contacts permissions',desc:'Your contacts reveal your social graph. Aggressively revoke.',fix:'Settings → Privacy → Permission Manager → Contacts → revoke from any app that doesn\'t need to make calls or messages.'},
    {id:'ap15',title:'Reset Advertising ID',desc:'Android\'s advertising ID (GAID) links your behaviour across apps. Resetting it breaks that history.',fix:'Settings → Privacy → Ads → Reset advertising ID. Do this monthly. Or: Delete Advertising ID entirely (Android 12+).'},
    {id:'ap16',title:'Disable personalised ads',desc:'Google uses your app usage for ad targeting across all apps.',fix:'Settings → Privacy → Ads → Opt out of Ads Personalisation → ON'},
  ]
};

function renderChecklist() {
  const done = S.get('apDone', []);
  const items = ITEMS[currentPlat];
  document.getElementById('ap_done').textContent = S.get('apDone',[]).length;
  document.getElementById('apChecklist').innerHTML = items.map(item => {
    const isDone = done.includes(item.id);
    return `<div style="display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--border);align-items:flex-start">
      <button onclick="toggle('${item.id}')" style="width:22px;height:22px;flex-shrink:0;margin-top:2px;background:${isDone?'var(--green)':'transparent'};border:1px solid ${isDone?'var(--green)':'var(--border2)'};color:${isDone?'#03110f':'var(--text3)'};font-size:11px;cursor:pointer;border-radius:2px;transition:all .15s">${isDone?'✓':''}</button>
      <div>
        <div style="font-size:13px;font-weight:500;margin-bottom:3px;${isDone?'text-decoration:line-through;color:var(--text3)':''}">${item.title}</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">${item.desc}</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--accent)">HOW: ${item.fix}</div>
      </div>
    </div>`;
  }).join('');
}

function toggle(id) {
  const done = S.get('apDone',[]);
  const i = done.indexOf(id); if(i===-1) done.push(id); else done.splice(i,1);
  S.set('apDone',done); renderChecklist(); S.updateScoreUI(); renderNav('App Permissions');
}

function addApp() {
  const name = document.getElementById('appName').value.trim();
  const revoked = document.getElementById('appRevoked').value.trim();
  if (!name) return;
  const log = S.get('appLog',[]);
  log.unshift({id:Date.now(), name, revoked, date: new Date().toLocaleDateString('en-GB')});
  S.set('appLog', log);
  document.getElementById('appName').value = '';
  document.getElementById('appRevoked').value = '';
  renderAppLog();
}

function removeApp(id) {
  S.set('appLog', S.get('appLog',[]).filter(a=>a.id!==id));
  renderAppLog();
}

function renderAppLog() {
  const log = S.get('appLog',[]);
  if (!log.length) { document.getElementById('appLog').innerHTML='<div style="font-size:12px;color:var(--text3);padding:8px 0">No app reviews added yet.</div>'; return; }
  document.getElementById('appLog').innerHTML = `<table class="data-table"><thead><tr><th>APP</th><th>PERMISSIONS REVOKED</th><th>DATE</th><th></th></tr></thead><tbody>
    ${log.map(a=>`<tr><td class="cell-main">${a.name}</td><td style="font-size:12px;color:var(--text2)">${a.revoked||'-'}</td><td style="font-family:var(--mono);font-size:10px;color:var(--text3)">${a.date}</td><td><button class="btn-icon" onclick="removeApp(${a.id})">✕</button></td></tr>`).join('')}
  </tbody></table>`;
}
