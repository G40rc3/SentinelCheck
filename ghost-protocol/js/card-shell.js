(() => {
  const ids=['audit','arsenal','brokers','aliases','personas','fingerprint','breaches','social','network','passwords','cookies','permissions','wifi','search','physical','household','news'];
  const labels=['Exposure Audit','Tool Arsenal','Broker Opt-Out','Email Aliases','Persona Generator','Fingerprint Defence','Breach Monitor','Social Media Audit','Network Hardening','Password & 2FA','Cookie & Consent','App Permissions','WiFi & Bluetooth','Search & Browsing','Physical OPSEC','Household & Children','Intel Feed'];
  const badgeKeys=['audit','tools','brokers','aliases','personas','fp','breaches','social','net','pw','ck','ap','wb','sb','po','hh','news'];
  const counts=[18,12,181,null,null,12,null,42,9,20,12,16,14,15,16,18,null];
  const storageKeys=[null,'toolsDone','brokerStatus','aliases','personas','fpDone','watchEmails','smDone','netDone','pwDone','ckDone','apDone','wbDone','sbDone','poDone','hhDone',null];
  const overview=document.getElementById('module-overview'),focused=document.getElementById('focused-module'),frame=document.getElementById('moduleFrame'),minimise=document.getElementById('minimiseModule');
  let current=null,lastOpened=null,gridScroll=0,frameObserver=null;
  const tile=id=>document.querySelector(`.module-tile[data-module="${id}"]`);
  const idFromUrl=()=>{const id=new URLSearchParams(location.search).get('module');return ids.includes(id)?id:null};
  const hrefFor=id=>{const u=new URL(location.href);u.searchParams.delete('module');if(id)u.searchParams.set('module',id);return u.pathname+u.search+u.hash};
  function refresh(){
    S.updateScoreUI();const stats=S.exposureStats();document.getElementById('catalogueScore').textContent=stats.auditDone?`${stats.current} open finding${stats.current===1?'':'s'} from 18 audit checks. This is a prioritisation count, not a safety rating.`:'Run the 18-question Exposure Audit to see open findings.';
    const nav=document.querySelectorAll('.sidebar .nav-link');nav.forEach((a,i)=>{a.classList.toggle('active',i===(current?ids.indexOf(current)+1:0));if(i===(current?ids.indexOf(current)+1:0))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    const progress={audit:S.get('auditDone',false)?'Audit complete':`${Object.values(S.get('auditAnswers',{})).filter(Boolean).length}/18 answered`,tools:`${S.get('toolsDone',[]).length}/12 installed`,brokers:`${Object.values(S.get('brokerStatus',{})).filter(x=>x==='done').length}/181 done`,aliases:`${S.get('aliases',[]).length} saved`,personas:`${S.get('personas',[]).length} saved`,breaches:`${S.get('watchEmails',[]).length} addresses saved`,news:'Curated links'};
    for(let i=0;i<ids.length;i++){const key=badgeKeys[i],el=document.getElementById('b_'+key);if(!el)continue;let value=progress[key];if(!value&&storageKeys[i]){const stored=S.get(storageKeys[i],[]);value=`${Array.isArray(stored)?stored.length:0}/${counts[i]} completed`;}el.textContent=value||'Open module';}
    const panel=document.querySelector('.modules-panel');if(panel){panel.querySelector('.modules-current').textContent='Current: '+(current?labels[ids.indexOf(current)]:'Overview');panel.querySelectorAll('a[data-module]').forEach(a=>{if(a.dataset.module===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});}
  }
  function useView(id,{push=false,restoreFocus=false}={}){
    if(id&&!ids.includes(id))return;
    if(push&&id!==current)history.pushState({module:id},'',hrefFor(id));
    const previous=current;current=id;
    if(id){
      if(!previous)gridScroll=window.scrollY;
      lastOpened=id;overview.hidden=true;focused.hidden=false;
      const name=labels[ids.indexOf(id)];document.getElementById('focused-title').textContent=name;frame.title=name+' full content';
      const next='pages/'+id+'.html?embedded=1';if(frame.getAttribute('src')!==next)frame.setAttribute('src',next);
      window.scrollTo(0,0);minimise.focus();
    }else{
      focused.hidden=true;overview.hidden=false;frame.removeAttribute('src');frame.style.height='900px';
      requestAnimationFrame(()=>{window.scrollTo(0,gridScroll);if(restoreFocus&&lastOpened)tile(lastOpened)?.focus();});
    }
    refresh();
  }
  document.addEventListener('click',e=>{
    const a=e.target.closest('a');if(a){const url=new URL(a.href,location.href),id=url.pathname.match(/\/pages\/([a-z]+)\.html$/)?.[1];
      if(url.origin===location.origin&&ids.includes(id)){e.preventDefault();useView(id,{push:true});return;}
      if(url.origin===location.origin&&/\/index\.html$/.test(url.pathname)&&a.closest('.toolkit-nav,.modules-panel')){e.preventDefault();useView(null,{push:true,restoreFocus:true});return;}
    }
  });
  minimise.addEventListener('click',()=>useView(null,{push:true,restoreFocus:true}));
  window.addEventListener('popstate',()=>useView(idFromUrl(),{restoreFocus:true}));
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow||!e.data||e.data.scope!=='ghost-module')return;
    if(e.data.type==='height'){frame.style.height=Math.max(700,Number(e.data.height)+16)+'px';refresh();}
    if(e.data.type==='open'&&ids.includes(e.data.id))useView(e.data.id,{push:true});
    if(e.data.type==='overview')useView(null,{push:true,restoreFocus:true});
  });
  window.addEventListener('storage',e=>{if(e.key?.startsWith('gp_'))refresh()});
  const trigger=document.createElement('button');trigger.className='modules-trigger';trigger.type='button';trigger.textContent='Modules';trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');
  const panel=document.createElement('div');panel.className='modules-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Modules');
  panel.innerHTML='<div class="modules-panel-head"><strong>Modules</strong><button type="button" class="modules-close" aria-label="Close modules">Close ×</button></div><p class="modules-current"></p><a href="index.html">Overview</a>'+ids.map((id,i)=>`<a href="pages/${id}.html" data-module="${id}">${String(i+1).padStart(2,'0')} ${labels[i]}</a>`).join('');
  document.body.append(trigger,panel);
  const close=()=>{panel.hidden=true;trigger.setAttribute('aria-expanded','false');document.body.classList.remove('panel-open');trigger.focus()};
  trigger.onclick=()=>{panel.hidden=false;trigger.setAttribute('aria-expanded','true');document.body.classList.add('panel-open');panel.querySelector('button').focus();refresh()};
  panel.querySelector('button').onclick=close;
  panel.addEventListener('click',e=>{if(e.target.closest('a'))close()});
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const f=[...panel.querySelectorAll('button,a')],first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  useView(idFromUrl());
  const focusId=new URLSearchParams(location.search).get('focus');if(!current&&ids.includes(focusId))requestAnimationFrame(()=>tile(focusId)?.focus());
})();
