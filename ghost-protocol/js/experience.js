(() => {
  const modules = [
    ['audit','Exposure Audit','Find your current priorities.'],['arsenal','Tool Arsenal','Choose useful privacy tools.'],['brokers','Broker Opt-Out','Review contacts and track requests you send.'],['aliases','Email Aliases','Keep sign-ups separate.'],['personas','Persona Generator','Create details for optional sign-ups.'],['fingerprint','Fingerprint Defence','Reduce browser identification.'],['breaches','Breach Monitor','Check exposed accounts.'],['social','Social Media Audit','Review public profiles and settings.'],['network','Network Hardening','Review DNS and network settings.'],['passwords','Password & 2FA','Protect accounts and recovery.'],['cookies','Cookie & Consent','Manage tracking choices.'],['permissions','App Permissions','Check access granted to apps.'],['wifi','WiFi & Bluetooth','Review nearby connection settings.'],['search','Search & Browsing','Choose search and browser settings.'],['physical','Physical OPSEC','Protect devices and physical access.'],['household','Household & Children','Review shared and family devices.'],['news','Intel Feed','Follow privacy resources.']
  ];
  const file = location.pathname.split('/').pop().replace('.html','');
  const overview = file === 'index' || file === '';
  const prefix = overview ? 'pages/' : '';
  const home = overview ? 'index.html' : '../index.html';
  const index = modules.findIndex(m=>m[0]===file);
  function link(id) { return prefix+id+'.html'; }
  document.addEventListener('DOMContentLoaded', () => {
    const sidebar=document.querySelector('.sidebar');
    if(sidebar) {
      const trigger=document.createElement('button');trigger.className='modules-trigger';trigger.type='button';trigger.textContent='Modules';trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');
      const panel=document.createElement('div');panel.className='modules-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Modules');
      panel.innerHTML='<div class="modules-panel-head"><strong>Modules</strong><button type="button" class="modules-close" aria-label="Close modules">Close ×</button></div><p class="modules-current">Current: '+(overview?'Overview':modules[index]?.[1]||'Overview')+'</p><a href="'+home+'">Overview</a>'+[['Start here',0,3],['Protect accounts',3,8],['Control devices',8,13],['Keep reviewing',13,17]].map(([name,a,b])=>'<h2>'+name+'</h2>'+modules.slice(a,b).map(([id,title],offset)=>'<a href="'+link(id)+'" '+(id===file?'aria-current="page"':'')+'>'+String(a+offset+1).padStart(2,'0')+' '+title+'</a>').join('')).join('');
      document.body.append(trigger,panel);
      let previous=null;
      const close=()=>{panel.hidden=true;trigger.setAttribute('aria-expanded','false');document.body.classList.remove('panel-open');(previous||trigger).focus();};
      trigger.addEventListener('click',()=>{previous=trigger;panel.hidden=false;trigger.setAttribute('aria-expanded','true');document.body.classList.add('panel-open');panel.querySelector('button').focus();});
      panel.querySelector('button').addEventListener('click',close);
      panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){let f=[...panel.querySelectorAll('button,a')];let first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
    }
    if(file==='audit') {
      const groups=[...document.querySelectorAll('main > .page-section')].filter(el=>el.querySelector('select[id^="q"]'));
      let step=0;const pager=document.createElement('div');pager.className='audit-pager';pager.innerHTML='<button type="button" class="btn-ghost" id="auditPrev">← Previous group</button><strong id="auditStep"></strong><button type="button" class="btn-primary" id="auditNext">Next group →</button>';
      groups.at(-1)?.after(pager);
      const render=()=>{groups.forEach((g,i)=>g.hidden=i!==step);pager.querySelector('#auditStep').textContent='Group '+(step+1)+' of '+groups.length;pager.querySelector('#auditPrev').disabled=step===0;pager.querySelector('#auditNext').textContent=step===groups.length-1?'Review and run audit':'Next group →';};
      pager.querySelector('#auditPrev').onclick=()=>{step--;render();groups[step].scrollIntoView({behavior:'smooth'});};
      pager.querySelector('#auditNext').onclick=()=>{if(step<groups.length-1){step++;render();groups[step].scrollIntoView({behavior:'smooth'});}else document.querySelector('#runBtnBottom')?.focus();};render();
      document.querySelectorAll('#runBtn,#runBtnBottom').forEach(btn=>btn.addEventListener('click',()=>{let missing=groups.findIndex(g=>[...g.querySelectorAll('select[id^="q"]')].some(q=>!q.value));if(missing>=0){step=missing;render();groups[step].scrollIntoView();}},true));
    }
    if(overview) {
      document.querySelector('.topbar .btn-primary').textContent=S.get('auditDone',false)?'Continue where you left off':'Start the Exposure Audit';
      const last=S.get('lastModule',null);
      if(last&&S.get('auditDone',false)&&modules.some(m=>m[0]===last))document.querySelector('.topbar .btn-primary').href=link(last);
      document.querySelectorAll('.module-card p').forEach(p=>{let card=p.closest('.module-card');let id=card?.getAttribute('href')?.split('/').pop().replace('.html','');let item=modules.find(m=>m[0]===id);if(item)p.textContent=item[2];});
      document.querySelectorAll('.module-card').forEach(a=>a.setAttribute('aria-label',a.querySelector('h2')?.textContent+' — open module'));
      const lead=document.createElement('section');lead.className='route-intro';lead.innerHTML='<h2>A simple route</h2><p>Start with the 18-question audit, protect your important accounts, then choose one more area to work through. Your progress stays in this browser.</p><p><strong>Exposure score:</strong> the number of audit findings still open, out of 18 checks. It is not a safety rating. A score appears only after you run the audit.</p><p><strong>Progress:</strong> completed checklist actions, installed tools, saved aliases and broker requests are separate counts. Zero means none recorded here.</p>';
      document.querySelector('.grid-4')?.before(lead);
      const auditCard=document.querySelector('a[href="pages/audit.html"].module-card p');if(auditCard)auditCard.textContent='Answer 18 checks and choose what to fix first.';
      const grids=[...document.querySelectorAll('.responsive-grid')];const all=grids[1];if(all){const cards=[...all.querySelectorAll(':scope > .module-card')];all.replaceChildren();[['Separate your identity',0,4],['Secure accounts and connections',4,9],['Control everyday data',9,14]].forEach(([title,start,end])=>{const section=document.createElement('section');section.className='module-group';section.innerHTML='<h2>'+title+'</h2><div class="module-group-grid"></div>';cards.slice(start,end).forEach(c=>section.querySelector('div').append(c));all.append(section);});}
      document.body.classList.add('overview-page');
    } else if(index>=0) {
      S.set('lastModule',file);
      const top=document.querySelector('.topbar');
      if(top && !document.documentElement.classList.contains('embedded')){const mini=document.createElement('a');mini.href='../index.html?focus='+file;mini.className='btn-ghost standalone-minimise';mini.textContent='← Minimise';top.append(mini);}
      if(top){const intro=document.createElement('section');intro.className='module-intro';intro.innerHTML='<div><strong>Why this matters</strong><p>'+modules[index][2]+'</p></div><div><strong>Do this first</strong><p>'+({audit:'Answer the first four checks, then continue through the audit.',brokers:'Review the request and check each broker contact before sending.',aliases:'Create one alias for a new sign-up.',personas:'Use an alias and avoid false details where a service needs your real identity.'}[file]||'Choose one action below and save your progress here.')+'</p></div><p class="effort">Time: depends on your accounts, devices and choices. You can pause and return on this browser.</p>';top.after(intro);}
      const technical=/^(What |Why |Recommended |Test Tools|Privacy DNS Servers|2FA Method Ranking|Key Breach Resources|The Most Dangerous|Tools That|How to Change DNS)/i;
      [...document.querySelectorAll('main > .page-section')].forEach(section=>{const heading=section.querySelector(':scope > h2');if(!heading||!technical.test(heading.textContent.trim())||section.querySelector('select[id^="q"]'))return;const details=document.createElement('details');details.className='technical-details';const summary=document.createElement('summary');summary.textContent='More detail: '+heading.textContent.trim();details.append(summary);while(section.firstChild)details.append(section.firstChild);section.append(details);});
      const foot=document.createElement('nav');foot.className='module-sequence';foot.setAttribute('aria-label','Module sequence');foot.innerHTML=(index>0?'<a href="'+link(modules[index-1][0])+'">← Previous module</a>':'<span></span>')+'<a href="'+home+'">Back to overview</a>'+(index<modules.length-1?'<a href="'+link(modules[index+1][0])+'">Next module →</a>':'<span></span>');document.querySelector('main')?.append(foot);
    }
  });
})();
