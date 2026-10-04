'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={started:false,step:0,compiledStep:0,pendingFragments:0,liveSequence:0,profileBuffer:[],profileFill:0,profilesBuilt:0,brokerReady:false,stage:0,view:'session',paused:matchMedia('(prefers-reduced-motion: reduce)').matches,sink:false,leakEver:false,leakStored:false,redistributed:false,leakedFields:[],compromiseOpen:false,endpointCompromised:false,lureIgnored:false,extensionRemoved:false,stolenSequence:0,stolenRecords:[],deleted:false,deletionOutcome:null,restored:false,found:false,inspected:"cube",consent:{analytics:true,personalisation:true,advertising:true,enrichment:true,sharing:true},events:[]};
const percentages=[0,18,33,50,70,100];
const steps=[
 {label:'01 / Read',title:'A weekend outdoors?',copy:'You open an article about walking routes near Leicester.',card:'Five walks for a clear head',detail:'OUTDOORS · 6 MIN READ',button:'Read the article',signal:'Interest: outdoors',event:'Read an outdoors article. An interest signal joins C1.'},
 {label:'02 / Search',title:'Find something useful.',copy:'Search the fictional shop for something to take on your next walk.',card:'waterproof walking shoes',detail:'SEARCH QUERY',button:'Search for walking shoes',signal:'Intent: walking shoes',event:'Searched for walking shoes. Purchase intent joins C1.'},
 {label:'03 / Sort',title:'Keep it under £80.',copy:'You sort the results by price. Even how you shop can add context.',card:'Price: low to high',detail:'24 FICTIONAL RESULTS',button:'Sort by price',signal:'Budget signal: under £80',event:'Sorted by price. A budget preference joins C1.'},
 {label:'04 / Open offer',title:'That discount looks useful.',copy:'A shop banner offers a discount on outdoor equipment.',card:'15% off your next adventure',detail:'FICTIONAL OFFER · NO PURCHASE',button:'Open the discount',signal:'Response: discount offer',event:'Opened a discount. Offer engagement joins C1.'},
 {label:'05 / Sign in',title:'Put a name to the activity.',copy:'Signing in links this session to the fictional account you created.',card:'Alex Morgan',detail:'alex@example.test · FICTIONAL IDENTITY',button:'Complete fictional sign-in',signal:'Linked account: Alex Morgan',event:'Signed in as Alex Morgan. This session is now linked to an account.'}
];
const signalList=()=>steps.slice(0,state.step).map(x=>x.signal);
function announce(t){$('#announcement').textContent=t}
function log(t){state.events.push({time:new Date().toLocaleTimeString('en-GB',{hour12:false}),text:t});$('#events').innerHTML=state.events.map(x=>`<li><time>${x.time}</time><span>${x.text}</span></li>`).join('');$('#activity-count').textContent=`${state.events.length} events`;announce(t)}
function start(){if(state.started)return;$$('.choices input').forEach(x=>state.consent[x.name]=x.checked);state.started=true;log('Fictional session C1 created. Optional purposes follow your selected settings.');render();}
function act(){
 if(!state.started||state.step>=5)return;
 const step=steps[state.step];state.step++;
 log(state.consent.analytics?step.event:'Completed '+step.label.split(' / ')[1].toLowerCase()+'. Optional analytics are off; only the session action is retained in this model.');
 const field=collectedFields().at(-1),fragmentStep=state.step,fragmentId='F'+fragmentStep;
 state.pendingFragments++;
 const compileAndForward=()=>{
  state.pendingFragments--;state.compiledStep=Math.max(state.compiledStep,fragmentStep);
  receiveProfileFragment(fragmentId,[field]);
  render();
 };
 if(state.paused)compileAndForward();
 else burst('route-collect',fragmentId,'teal',compileAndForward,{title:fragmentId+' · activity fragment',fields:[field]});
 render();inspect('cube');
}
function receiveProfileFragment(id,fields){
 state.profileBuffer.push({id,fields:fields.map(field=>({...field}))});
 state.profileFill=state.profileBuffer.length;
 if(state.profileFill===5){
  const fragments=state.profileBuffer;state.profileBuffer=[];
  const profileId='Profile '+(++state.profilesBuilt);
  const payload={title:profileId+' · five compiled fragments',compiled:true,fields:fragments.flatMap(fragment=>fragment.fields.map(field=>({...field,source:fragment.id+' · '+field.source})))};
  if(state.consent.advertising&&state.deletionOutcome!=='success'){
   const received=()=>{state.brokerReady=true;render();};
   if(state.paused)received();else burst('route-broker',"Alex’s profile",'teal',received,payload);
  }
 }
 render();
}
function trade(){
 if(state.step<5||state.pendingFragments>0||!state.brokerReady||state.stage>=1)return;
 if(!state.consent.advertising){log('Advertising is off. This model does not send the profile to the broker.');return;}
 state.stage=1;state.view='trade';clock=0;emitBrowserActivity();
 log('Meridian receives the compiled profile, keeps working copy C2 and retains archive C3. Reach Media receives a selected audience record, not the entire profile.');
 log('Reach Media returns 29 SC to Meridian. SC is fictional teaching currency, not a market price.');
 burst('route-ads','A1','red',null,{title:'Selected audience record',fields:audienceFields()});
 burst('route-pay','29 SC','gold');render();inspect('broker');
}
function reveal(){if(state.stage!==1)return;state.stage=2;state.view='network';log(state.consent.sharing?'Wider network revealed. Two more fictional adverts appear. Onward paths are illustrative, not a count of real recipients.':'Wider infrastructure revealed. Partner sharing is off; no further profile transfers or adverts are added.');render();inspect('dc4');}
function deletion(){
 if(state.stage<1)return;
 state.deleted=true;log('Deletion requested. Choose handled correctly or deletion failure to compare outcomes.');render();inspect('archive');
}
function chooseDeletion(outcome){
 if(!state.deleted||!['success','failure'].includes(outcome))throw Error('Request deletion before choosing a valid outcome.');
 state.deletionOutcome=outcome;state.restored=false;replayClock=8;
 particles=particles.filter(p=>{if(p.route==='route-collect'||p.colour==='purple'||p.payload?.background)return true;p.g.remove();return false;});
 log(outcome==='success'?'Handled correctly: applicable active copies removed, backup C3 beyond operational use, and a minimal suppression record prevents marketing re-entry. Previously leaked copies remain outside organisational control.':'Deletion failure: archive C3 enters review pending and restores Meridian’s working copy. Lemon-yellow copies restart distribution. This is a fictional failure scenario.');
 render();inspect('archive');
}
function toggleSink(){
 if(state.stage<1)return;
 if(state.deletionOutcome==='success'&&!state.leakEver)return;
 state.sink=!state.sink;
 if(state.sink){state.leakEver=true;state.leakStored=true;if(!state.leakedFields.length)state.leakedFields=brokerFields().map(f=>({...f}));}
 if(!state.sink){particles=particles.filter(p=>{if(p.route==='route-sink'||p.route==='route-dark'){p.g.remove();return false;}return true;});leakClock=0;darkClock=0;}
 log(state.sink?'Leak simulated: a copy held by Meridian is exposed through an unsecured server. Commercial sharing continues. Redistribution is a separate event.':'Exposed-server transfers stopped. Previously leaked copies remain recorded. Any active malicious browser extension continues sending directly until it is removed.');
 render();layoutTrafficRoutes();inspect('sink');
}
function redistribute(){
 if(!state.sink||!state.leakStored||state.redistributed)return;
 state.redistributed=true;darkClock=5;
 log('Leaked copy redistributed to the fictional dark-web destination. This separate event is not an automatic consequence of every exposed server.');
 render();inspect('dark');
}
function exploreCompromise(){
 if(!state.redistributed)return;
 state.compromiseOpen=true;render();
 $('#compromise-panel').scrollIntoView?.({behavior:state.paused?'auto':'smooth',block:'nearest'});
}
function ignoreLure(){
 if(!state.compromiseOpen||state.endpointCompromised)return;
 state.lureIgnored=true;log('Simulated lure ignored. No extension is installed and the browser remains uncompromised.');render();
}
function installExtension(){
 if(!state.compromiseOpen||!state.redistributed||state.endpointCompromised)return;
 state.endpointCompromised=true;state.lureIgnored=false;state.extensionRemoved=false;theftClock=4.4;
 log('Optional scenario: the fictional user installs a malicious extension after a targeted lure. The browser is now a simulated compromised endpoint; the leaked profile alone did not grant access.');render();layoutTrafficRoutes();inspect('person');
}
function removeExtension(){
 if(!state.endpointCompromised)return;
 state.endpointCompromised=false;state.extensionRemoved=true;theftClock=0;
 particles=particles.filter(p=>{if(p.payload?.browserTheft){p.g.remove();return false;}return true;});
 log('Simulated malicious extension removed. Fresh browser theft stops. Previously leaked profile and browser-activity copies remain at their recorded destinations.');render();inspect('person');
}
function emitStolenActivity(){
 if(!state.endpointCompromised)return;
 const id='B'+(++state.stolenSequence);
 const fields=[{value:state.stolenSequence%2?'Viewed fictional product page':'Entered a fictional search term',source:'Simulated extension collection · invented example'}];
 const payload={browserTheft:true,title:id+' · stolen browser activity',fields};
 burst('route-compromised',id+' · browser','purple',()=>{
  if(!state.endpointCompromised)return;
  state.stolenRecords.push(...fields.map(f=>({...f,source:id+' · '+f.source})));state.stolenRecords=state.stolenRecords.slice(-6);if(state.inspected==='dark')inspect('dark');
 },payload);
}
function findData(){
 state.found=true;$$('.map-node').forEach(x=>x.classList.remove('highlight'));
 let nodes=['person','cube'];
 if(state.stage)nodes.push('archive');
 if(state.stage&&state.deletionOutcome!=='success')nodes.push('advertiser',...(state.deleted&&!state.restored?[]:['broker']));
 if(state.stage===2&&state.consent.sharing&&state.deletionOutcome!=='success')nodes.push('dc3','dc4');
 if(state.leakStored)nodes.push('sink');if(state.redistributed)nodes.push('dark');
 nodes.forEach(n=>$(`[data-node="${n}"]`).classList.add('highlight'));
 log(state.deletionOutcome==='success'?'Known active marketing copies removed in the selected scenario. The archive is beyond use; previously leaked copies remain separately marked.':'Highlighted known locations in this model. The wider real-world number of copies is not established.');
 inspect(state.redistributed?'dark':state.stage?'archive':'cube');
}
function setView(v){if(!['session','trade','network'].includes(v))throw Error('Unknown view');if(v==='trade'&&state.stage<1||v==='network'&&state.stage<2)throw Error('Complete the preceding chapter first');state.view=v;render();}
function renderScenario(){const el=$('#scenario');if(!state.started){el.innerHTML=`<span class="step-label">A FICTIONAL ACCOUNT</span><h3>Meet Alex. That’s you for this experiment.</h3><p>No personal details needed. Choose what this fictional service can do with your activity.</p><span class="mock-input">Alex Morgan · alex@example.test</span><fieldset class="choices"><legend>Account privacy settings</legend><label>Essential processing <input type="checkbox" checked disabled aria-label="Essential processing required"></label>${[['analytics','Analytics'],['personalisation','Personalisation'],['advertising','Advertising'],['enrichment','Profile enrichment'],['sharing','Partner sharing']].map(([n,l])=>`<label>${l}<input type="checkbox" name="${n}" ${state.consent[n]?'checked':''}></label>`).join('')}</fieldset><button class="action" id="start">Create fictional session</button>`;$('#start').onclick=start;$$('.choices input[name]').forEach(x=>x.onchange=()=>{state.consent[x.name]=x.checked;});return;}
if(state.step<5){const s=steps[state.step];el.innerHTML=`<span class="step-label">${s.label}</span><h3>${s.title}</h3><p>${s.copy}</p><div class="mock-card"><small>${s.detail}</small><strong>${s.card}</strong></div><div class="progress-track"><i data-progress="${percentages[state.step]}"></i></div><button id="action" class="action">${s.button}</button><p class="receipt">${state.step} of 5 actions · ${percentages[state.step]}% of this demonstration</p>`;$('#action').onclick=act;return;}
el.innerHTML=`<span class="step-label">5 / 5 GUIDED ACTIONS COMPLETE</span><div class="completed">✓</div><h3>A short session.<br>A useful profile.</h3><p>${state.consent.analytics?'Your interests, shopping intent and account are now connected in this fictional profile.':'Analytics were declined. The cube represents essential session activity, not an optional interest profile.'}</p><div class="mock-card"><small>PRIVACY CHOICES</small><strong>${state.consent.advertising?'Advertising allowed':'Advertising declined'}</strong><small>Enrichment ${state.consent.enrichment?'on':'off'} · Partner sharing ${state.consent.sharing?'on':'off'}</small></div><p class="receipt">${state.stage?'The guided steps are complete. Simulated browser activity continues while the animation runs.':state.consent.advertising?'Follow the trade using the button below the map.':'This model honours your choice: no broker sale. Restart to compare with advertising enabled.'}</p>`;
}
function render(){
 renderScenario();const success=state.deletionOutcome==='success',failure=state.deletionOutcome==='failure';
 $('#cube-percent').textContent=(state.profileFill*20)+'%';
 $('#profile-build').textContent=state.profileFill+' / 5 fragments';
 $('#profile-parts').innerHTML=Array.from({length:5},(_,i)=>'<i class="'+(i<state.profileFill?'filled':'')+'"></i>').join('');
 $('#world').className='world'+(state.view==='network'?' network':'')+(state.step?' collect-active':'')+(state.stage?' trade-active archive-active':'')+(state.sink?' sink-active':'')+(state.leakEver?' leak-visible':'')+(failure?' restore-active':'');
 document.body.classList.toggle('motion-paused',state.paused);
 document.body.classList.toggle('browser-compromised',state.endpointCompromised);
 $('#endpoint-status').textContent=state.endpointCompromised?'COMPROMISED ENDPOINT':state.extensionRemoved?'EXTENSION REMOVED':'SIMULATED · CLEAN';
 $('#explore-compromise').hidden=!state.redistributed||state.compromiseOpen;
 $('#compromise-panel').hidden=!state.compromiseOpen;
 $('#ignore-lure').hidden=state.endpointCompromised;$('#install-extension').hidden=state.endpointCompromised;
 $('#remove-extension').hidden=!state.endpointCompromised;
 $('#install-extension').textContent=state.extensionRemoved?'Replay simulated installation':'Simulate installing malicious extension';
 $('#compromise-status').textContent=state.endpointCompromised?'Persistent browser compromise: the malicious extension sends activity directly to dark-web distribution. Closing the original leak does not remove it.':(state.extensionRemoved?'Extension removed: new browser theft has stopped. Previously stolen copies remain.':state.lureIgnored?'Lure ignored: the browser stays clean. You can still demonstrate the installation outcome.':'Choose an outcome to demonstrate the decision.');

 $('#pause').textContent=state.paused?'Resume motion':'Pause motion';$('#pause').setAttribute('aria-pressed',String(state.paused));
 $('#broker-status').textContent=success?'C2 · removed':failure?(state.restored?'C2 · restored from C3':'C2 · awaiting archive'):state.stage?'C2 · combined profile':state.brokerReady?'Compiled profile received':'Waiting for compiled profile';
 $('#archive-status').textContent=state.stage?(success?'C3 · beyond use':failure?'C3 · review pending':state.deleted?'C3 · outcome not selected':'C3 · retained'):'Not created';
 $('#advertiser-status').textContent=success?'A1 · removed':state.stage?'A1 · audience selection':'No audience received';
 $('#sink-status').textContent=state.sink?'Exposed copy accessible':state.leakStored?'Leaked copy remains':'Leak scenario off';
 $('[data-node="dark"]').hidden=!state.leakEver;
 $('#dark-status').textContent=state.endpointCompromised?'Direct browser theft active':state.redistributed?(state.sink?'L1 · outside organisation’s control':'Transfers stopped · existing L1 retained'):'Awaiting separate redistribution event';
 $$('[data-view]').forEach(b=>{b.disabled=b.dataset.view==='trade'?state.stage<1:b.dataset.view==='network'?state.stage<2:false;b.classList.toggle('selected',b.dataset.view===state.view);b.setAttribute('aria-current',b.dataset.view===state.view?'step':'false');});
 const next=$('#next');next.hidden=state.stage>=2;next.disabled=state.step<5||state.pendingFragments>0||!state.brokerReady||!state.consent.advertising;next.textContent=state.stage===0?(state.step===5&&(!state.brokerReady||state.pendingFragments>0)?(state.paused?'Resume motion to finish compiling':'Compiling and sending profile…'):'Follow the trade'):'Reveal the wider network';
 $('#delete').hidden=state.stage<1;$('#delete').disabled=state.deleted;$('#delete').textContent=state.deleted?'Deletion requested':'Request deletion';
 $('#sink-toggle').hidden=state.stage<1;$('#sink-toggle').disabled=success&&!state.leakEver;$('#sink-toggle').textContent=state.sink?'Stop new exposure':'Simulate data leak';
 $('#redistribute').hidden=!state.leakEver;$('#redistribute').disabled=!state.sink||!state.leakStored||state.redistributed;$('#redistribute').textContent=state.redistributed?'Leaked copy redistributed':'Redistribute leaked copy';
 $('#deletion-options').hidden=!state.deleted;
 $('#delete-success').setAttribute('aria-pressed',String(success));$('#delete-failure').setAttribute('aria-pressed',String(failure));
 $('#deletion-status').textContent=success?'Active records removed · backup beyond use · marketing suppression active':failure?'Failure scenario · retained archive restores and resends the profile':'Select an outcome. A request alone does not establish that deletion has happened.';
 let title='A profile starts with ordinary things.',copy='Five activity fragments build one profile cube. Only after all five arrive does that compiled cube travel to Meridian. This five-part cycle is a teaching model, not a real-world collection threshold.',kicker='COLLECTION',index='01',caption=state.started?'Tap a moving cube or use Inspect a record to see its contents.':'Create a fictional session to leave your first trace.';
 if(state.step===5&&!state.consent.advertising){title='A choice that stops this trade.';copy='Advertising is off, so this model keeps the profile out of the broker route. Restart to compare the other path.';caption='No advertising fragments leave for Meridian.';}
 if(state.stage===1){title='Fragments become a profile. A selection moves on.';copy='Meridian combines the fragments and retains an archive. Reach Media receives selected audience information. Gold shows the separate fictional payment.';kicker='THE TRADE';index='02';caption='Five fragments build each profile · one compiled cube goes to Meridian · collection keeps repeating.';}
 if(state.stage===2){title='Different organisations add different pieces.';copy=state.consent.sharing?'North links identifiers. West adds a separate source. South creates an audience category. East handles advertising delivery. The buildings host these fictional organisations.':'Partner sharing is off for Alex. Red background traffic illustrates other fictional records; Alex’s audience is not sent onward.';kicker='THE WIDER PICTURE';index='03';caption='Grey: other people’s simulated data from Meridian. Coloured flows identify Alex’s trail and the existing network scenarios. Tap a cube to inspect its purpose.';}
 if(state.deleted&&!state.deletionOutcome){title='A deletion request has more than one possible outcome.';copy='Choose handled correctly or deletion failure below. Existing traffic continues until an outcome is selected in this demonstration.';}
 if(failure){title='The archive puts the profile back into circulation.';copy='Lemon-yellow cubes restore Meridian’s working copy from C3, then carry a selected audience to Reach Media. This is a fictional deletion failure, not a claim about every broker.';caption='C3 review pending · archive restore · renewed distribution.';}
 if(success){title='Deletion stops the affected commercial flows.';copy='In this successful scenario, active records are removed and C3 is beyond operational use pending expiry. A minimal do-not-market record blocks re-entry. Copies already leaked remain outside the organisation’s control.';caption='Affected commercial flows stopped. New browser activity stays at the profile; unrelated background traffic continues.';}
 $('#story-title').textContent=title;$('#story-copy').textContent=copy;$('#story-kicker').textContent=kicker;$('#story-index').textContent=index;$('#map-caption').textContent=caption;
 renderAds();if(state.inspected!=='packet')inspect(state.inspected);requestAnimationFrame(layoutTrafficRoutes);
}
function renderAds(){const count=state.deletionOutcome==='success'?0:state.stage?(state.stage===2&&state.consent.sharing?3:1):0;$('#ad-section').hidden=!count;$('#ad-count').textContent=count+' '+(count===1?'ADVERT':'ADVERTS');const personalised=state.consent.personalisation&&state.consent.analytics;const all=personalised?[['FIELDWORK','Walking shoes. Ready for rain.','Based on the fictional walking-shoes search.','01'],['WEEKEND CO.','Your next trail starts here.','Based on the fictional outdoors interest.','02'],['OUTBOUND','A little further. For a little less.','Based on the fictional discount response.','03']]:[['REACH MEDIA','Discover the everyday collection.','Generic advert. Personalised targeting is off.','01'],['PARTNER PLACEMENT','Something new to explore.','Generic advert. No interest-based selection.','02'],['NETWORK PLACEMENT','Browse the latest offers.','Generic advert. No interest-based selection.','03']];$('#ads').innerHTML=all.slice(0,count).map(a=>`<article class="ad"><span class="ad-icon">${a[3]}</span><small>SIMULATED AD · ${a[0]}</small><h3>${a[1]}</h3><p>${a[2]}</p></article>`).join('');}
function collectedFields(){
 const fields=[{value:'Session C1',source:'Fictional browser session · identifier'}];
 if(state.consent.analytics){
  const values=['Read an outdoors article','Searched for walking shoes','Sorted by price','Opened a discount'];
  for(let i=0;i<Math.min(state.step,4);i++)fields.push({value:values[i],source:'Observed action · everyday.example'});
 }
 if(state.step===5)fields.push({value:'Account ALEX-01',source:'Fictional sign-in · account identifier'});
 return fields;
}
function brokerFields(){return [...collectedFields(),...(state.consent.enrichment&&state.consent.analytics&&state.step>=2?[{value:'Likely outdoor shopper',source:'Meridian inference from activity · uncertain, not a fact'}]:[])];}
function enrichedFields(){return [...brokerFields(),...(state.consent.enrichment?[{value:'Outdoor-store purchase category',source:'Separate fictional loyalty source · simulated example'}]:[])];}
function audienceFields(){return [{value:'Audience token A1',source:'Selected identifier · fictional campaign'}, {value:state.consent.personalisation&&state.consent.analytics?'Outdoor-shopping audience':'Generic audience',source:'Audience selection · other profile fields omitted'}];}
const escapeText=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showRecord(id,title,copy,fields){$('#inspect-id').textContent=id;$('#inspector-title').textContent=title;$('#inspector-copy').textContent=copy;$('#signals').className='signals record-fields';$('#signals').innerHTML=fields.map(f=>`<div class="record-field"><strong>${escapeText(f.value)}</strong><small>${escapeText(f.source)}</small></div>`).join('');}
function inspect(id){
 state.inspected=id;const success=state.deletionOutcome==='success',failure=state.deletionOutcome==='failure';
 const note=t=>[{value:t,source:'State of this fictional simulation'}];
 const definitions={
 person:['C1',state.endpointCompromised?'Compromised browser':'Your browser',state.endpointCompromised?'A simulated malicious extension sends fresh activity directly to dark-web distribution. This connection bypasses Meridian and the exposed server, and continues until the extension is removed.':'The fictional source of this session. All demonstration activity stays on this page.',[...collectedFields(),...note(state.endpointCompromised?'Malicious extension active':state.extensionRemoved?'Extension removed':'Browser uncompromised')]],
 cube:['C1','Collected activity','Five fragments accumulate here before one compiled profile is shared. The build counter shows this demonstration’s current batch, not real-world profile completeness.',collectedFields()],
 broker:['C2','Meridian Data',success?'The active marketing profile is removed. A minimal suppression record prevents it re-entering the marketing flow.':'Meridian combines signals into a profile. An inference is a prediction, not a confirmed fact.',success?note('Do not market · active suppression record'):state.step&&state.consent.advertising?brokerFields():note('No advertising data received')],
 advertiser:['A1','Reach Media',success?'The affected audience record is removed in the successful scenario.':'The advertiser receives a selected audience identifier and category, rather than every field in the broker’s profile.',state.stage&&!success?audienceFields():note(success?'Audience removed':'No audience received')],
 archive:['C3','Archive copy',success?'Retained backup data is beyond operational use pending expiry in this scenario. It cannot feed new campaigns.':failure?'The archive repopulates the broker in this fictional deletion-failure scenario. Follow the lemon-yellow copies.':'The archive is a separate retained record. A deletion request alone does not establish its final status.',note(success?'Beyond use · awaiting scheduled expiry':failure?'Review pending · restoration loop active':state.stage?'Retained copy':'Not created')],
 sink:['EXPOSED','Exposed server','An unsecured server holding a broker’s copy is accessible in this fictional leak. Normal commercial sharing can continue at the same time.',state.leakStored?state.leakedFields:note('Leak scenario not activated')],
 dark:['L1','Dark-web distribution','Redistribution is a separate simulated event after exposure. Existing leaked copies are outside the organisation’s control; this does not claim that their removal is impossible.',state.redistributed?[...state.leakedFields,...state.stolenRecords]:note('No copy redistributed')],
 dc1:['NORTH','Identity-matching provider','Links records through a shared identifier. Matching can be wrong; a link is not proof that every record describes the same person.',state.stage===2&&state.consent.sharing&&!success?note('ALEX-01 ↔ loyalty record · simulated match'):note('Background matching only')],
 dc2:['EAST','Advertising platform','Delivers campaigns using selected audience information. The data-centre building represents infrastructure hosting this organisation.',state.stage===2&&state.consent.sharing&&!success?audienceFields():note('Background advertising activity only')],
 dc3:['P1','Partner broker · West','Adds a separate source to the received record when enrichment is enabled. Inspect the field sources to see what was added.',state.stage===2&&state.consent.sharing&&!success?enrichedFields():note(success?'Affected active copy removed':'Alex’s record not shared here')],
 dc4:['SOUTH','Audience provider','Turns selected profile attributes into a category for advertising. The complete profile does not need to travel with the category.',state.stage===2&&state.consent.sharing&&!success?audienceFields():note('No active Alex audience here')]
 };
 const d=definitions[id];if(d)showRecord(...d);
 if(['cube','broker','dc3','advertiser','archive','dark'].includes(id))$('#profile-record').value=id;
}
function inspectPacket(payload){state.inspected='packet';showRecord(payload.background?'BACKGROUND':'COPY',payload.title,payload.background?'Illustrative traffic involving other fictional records. This cube does not represent Alex.':'A selected copy in this simulation. The listed sources explain what was collected, inferred or added.',payload.fields);}
let particles=[],last=0,clock=0,replayClock=0,leakClock=0,darkClock=0,profileClock=20,theftClock=0;
const ns='http://www.w3.org/2000/svg';
const centres=['dc1','dc2','dc3','dc4'];
const networkTimers=Object.fromEntries(centres.map((id,i)=>[id,.25+i*.45]));
const reachTimers={dc2:1,dc4:2.2};
const meridianDestinations=['dc1','dc2','dc3','dc4','advertiser'];
const meridianEmitters=Object.fromEntries(meridianDestinations.map((id,i)=>[id,{wait:.3+i*.65,remaining:0}]));
let meridianBackgroundId=0;
const meridianPurposes={dc1:'Identity matching',dc2:'Advertising delivery',dc3:'Profile enrichment',dc4:'Audience selection',advertiser:'Campaign audience access'};

const palette={teal:['#00e3d0','#a8fff6','#81f7e9'],gold:['#edb966','#ffe6b9','#edb966'],red:['#ff434f','#ffb1b7','#ff7780'],lemon:['#f5ff42','#fcffad','#f5ff42'],purple:['#c77dff','#efccff','#dca8ff'],grey:['#74818c','#b2bec8','#a2b0bc']};
function ensureRoute(id,d,outer=false){
 let path=$('#'+id);
 if(!path){path=document.createElementNS(ns,'path');path.id=id;$(outer?'#outer-routes':'#core-routes').append(path);}
 path.setAttribute('d',d);
 if(id==='route-restore')path.setAttribute('class','restore-route');
 if(id.startsWith('route-meridian-'))path.setAttribute('class','meridian-background-route');
}
function layoutTrafficRoutes(){
 const world=$('#world').getBoundingClientRect();
 if(!world.width||!world.height)return;
 const box=id=>{const r=$('[data-node="'+id+'"]').getBoundingClientRect();return{x:(r.left-world.left)/world.width*1000,y:(r.top-world.top)/world.height*490,w:r.width/world.width*1000,h:r.height/world.height*490};};
 const boxes=Object.fromEntries(centres.map(id=>[id,box(id)]));
 const upper=Math.max(boxes.dc1.y+boxes.dc1.h,boxes.dc2.y+boxes.dc2.h)+30;
 const lower=Math.min(boxes.dc3.y,boxes.dc4.y)-25;
 const anchor=id=>{const r=boxes[id];return {x:r.x+r.w/2,y:id==='dc1'||id==='dc2'?r.y+r.h:r.y,lane:id==='dc1'||id==='dc2'?upper:lower};};
 for(const from of centres)for(const to of centres){if(from===to)continue;const a=anchor(from),b=anchor(to);let d=`M${a.x} ${a.y}V${a.lane}`;
  if(a.lane===b.lane)d+=`H${b.x}`;
  else {const edge=(from==='dc1'||from==='dc3')?20:980;d+=`H${edge}V${b.lane}H${b.x}`;}
  ensureRoute(`route-${from}-${to}`,d+`V${b.y}`,true);
 }
 const reach=box('advertiser');
 for(const id of ['dc2','dc4']){const a=anchor(id);const y=id==='dc2'?reach.y:reach.y+reach.h;ensureRoute('route-reach-'+id,`M${reach.x+reach.w*.55} ${y}V${a.lane}H${a.x}V${a.y}`,true);}
 const archive=box('archive'),broker=box('broker');
 for(const id of centres){const a=anchor(id);let d;
  if(id==='dc1'||id==='dc2')d=`M${broker.x+broker.w*.6} ${broker.y}V${a.lane}H${a.x}V${a.y}`;
  else if(id==='dc3')d=`M${broker.x} ${broker.y+broker.h*.7}H${a.x+130}V${a.lane}H${a.x}V${a.y}`;
  else d=`M${broker.x+broker.w} ${broker.y+broker.h*.75}H${broker.x+broker.w+45}V${a.lane}H${a.x}V${a.y}`;
  ensureRoute('route-meridian-'+id,d,true);
 }
 ensureRoute('route-meridian-advertiser',`M${broker.x+broker.w} ${broker.y+broker.h*.4}H${reach.x}`,true);

 const west=anchor('dc3');ensureRoute('route-partner',`M${broker.x} ${broker.y+broker.h*.7}H${west.x+130}V${west.lane}H${west.x}V${west.y}`,true);
 ensureRoute('route-restore',`M${archive.x+archive.w*.35} ${archive.y}V${broker.y+broker.h}`);
 const exposed=box('sink'),browser=box('person');
 if(state.leakEver){
  const dark=box('dark'),startY=browser.y+browser.h*.5,endY=dark.y+dark.h*.6,edge=12,r=12;
  ensureRoute('route-compromised',`M${browser.x} ${startY}H${edge+r}Q${edge} ${startY} ${edge} ${startY+r}V${endY-r}Q${edge} ${endY} ${edge+r} ${endY}H${dark.x}`);
 }
 ensureRoute('route-sink',`M${broker.x+broker.w*.25} ${broker.y+broker.h}V${exposed.y-18}H${exposed.x+exposed.w*.5}V${exposed.y}`);
 if(state.leakEver){const dark=box('dark');ensureRoute('route-dark',`M${exposed.x+exposed.w*.5} ${exposed.y+exposed.h}V${dark.y-15}H${dark.x+dark.w*.5}V${dark.y}`);}

}
function burst(route,label,colour='teal',onComplete=null,payload=null){
 if(state.paused)return;
 const path=$('#'+route);if(!path)return;
 if(colour===true)colour='gold';
 const [fill,stroke,text]=palette[colour]||palette.teal;
 const g=document.createElementNS(ns,'g');
 const outer=route.startsWith('route-dc')||route.startsWith('route-reach-')||route==='route-partner'||route.startsWith('route-meridian-');
 g.setAttribute('class','traffic-cube'+(outer?' outer-traffic':''));
 g.setAttribute('data-colour',colour);
 const scale=payload?.compiled?1.45:1;
 payload=payload||{title:label,fields:colour==='gold'?[{value:'29 SC',source:'Fictional teaching currency · not a real price'}]:brokerFields()};
 g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label','Inspect '+payload.title);
 g.onclick=()=>inspectPacket(payload);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspectPacket(payload);}};

 for(const [d,opacity] of [['M0 -13L12 -6L0 1L-12 -6Z','1'],['M-12 -6L0 1V15L-12 8Z','.72'],['M0 1L12 -6V8L0 15Z','.9']]){
  const face=document.createElementNS(ns,'path');face.setAttribute('d',d);Object.assign(face.style,{fill,stroke,strokeWidth:'1',markerEnd:'none',opacity});g.append(face);
 }
 const t=document.createElementNS(ns,'text');t.setAttribute('y','-20');t.setAttribute('text-anchor','middle');t.setAttribute('fill',text);t.setAttribute('font-size','12');t.textContent=label;if(!payload?.hideLabel)g.append(t);
 const q=path.getPointAtLength(0);g.setAttribute('transform',`translate(${q.x},${q.y}) scale(${scale})`);$('#particles').append(g);
 particles.push({g,path,route,colour,progress:0,duration:outer?4+Math.random()*2:3.2,onComplete,payload,scale});
}
function restoreFromArchive(){
 if(state.deletionOutcome!=='failure')return;
 burst('route-restore','C3','lemon',()=>{
  if(state.deletionOutcome!=='failure')return;
  if(!state.restored){state.restored=true;log('Archive C3 restored the working profile at Meridian. Lemon-yellow copies restart distribution.');render();}
  burst('route-ads','A1 · resent','lemon',()=>{
   if(state.deletionOutcome!=='failure')return;
   burst('route-pay','29 SC','gold');
   if(state.stage===2&&state.consent.sharing)for(const id of ['dc2','dc4'])burst('route-reach-'+id,'Resent','lemon',null,{title:'Resent audience record',fields:audienceFields()});
  },{title:'Audience resent after archive restore',fields:audienceFields()});
 },{title:'Restored archive profile',fields:brokerFields()});
}
const routePurposes={dc1:'Match IDs',dc2:'Ad delivery',dc3:'Enrich',dc4:'Audience'};
const backgroundPayload=to=>({background:true,title:routePurposes[to]+' · background record',fields:[{value:'Unrelated fictional record',source:'Background commercial traffic'},{value:routePurposes[to],source:'Purpose of this transfer'}]});
function profileChain(){
 const eligible=()=>state.stage===2&&state.consent.sharing&&state.deletionOutcome!=='success';
 if(!eligible())return;
 burst('route-partner','C2 · profile','red',()=>{
  if(!eligible())return;
  burst('route-dc3-dc1',state.consent.enrichment?'P1 · enriched':'P1 · copy','red',()=>{
   if(!eligible())return;
   burst('route-dc1-dc4','Matched ID','red',()=>{
    if(eligible())burst('route-dc4-dc2','A1 · audience','red',null,{title:'Selected audience for delivery',fields:audienceFields()});
   },{title:'Matched profile',fields:enrichedFields()});
  },{title:'Partner record after enrichment',fields:enrichedFields()});
 },{title:'Profile supplied to partner broker',fields:brokerFields()});
}
function emitBrowserActivity(){
 if(!state.stage||state.paused)return;
 const sequence=++state.liveSequence,id='F'+(((sequence-1)%5)+1);
 const activities=['Viewed another product','Opened another article','Compared two offers','Returned to a search'];
 const fields=[{value:'Session C1 / account ALEX-01',source:'Fictional continuing browser activity'},
  {value:state.consent.analytics?activities[(sequence-1)%activities.length]:'Essential session activity',source:state.consent.analytics?'Simulated new activity fragment':'Optional analytics declined'}];
 burst('route-collect',id,'teal',()=>{
  receiveProfileFragment(id,fields);
 },{title:id+' · ongoing browser activity',fields});
}
function advanceMeridianBackground(dt){
 for(const to of meridianDestinations){const emitter=meridianEmitters[to];emitter.wait-=dt;
  if(emitter.wait>0)continue;
  if(particles.filter(p=>p.colour==='grey').length>=16){emitter.wait=.5;continue;}
  if(!emitter.remaining)emitter.remaining=1+Math.floor(Math.random()*3);
  const record='BG-M'+(++meridianBackgroundId);
  const fields=to==='dc1'?[{value:'Pseudonymous matching identifier',source:'Other fictional person · selected matching fields'}]:to==='dc3'?[{value:'Partial consumer profile',source:'Other fictional person · enrichment request'}]:[{value:'Audience category and campaign token',source:'Other fictional person · selected audience data'}];
  burst('route-meridian-'+to,'Other profile','grey',null,{background:true,hideLabel:true,title:meridianPurposes[to]+' · '+record,fields:[{value:record,source:'Meridian background record · not Alex'},...fields,{value:meridianPurposes[to],source:'Purpose of this transfer'}]});
  emitter.remaining--;emitter.wait=emitter.remaining?.45+Math.random()*.4:3.8+Math.random()*3.2;
 }
}
function advanceTraffic(dt){
 if(state.paused)return;
 const completed=[];
 particles=particles.filter(p=>{p.progress+=dt/p.duration;if(p.progress>=1){p.g.remove();if(p.onComplete)completed.push(p.onComplete);return false;}const q=p.path.getPointAtLength(p.path.getTotalLength()*p.progress);p.g.setAttribute('transform',`translate(${q.x},${q.y}) scale(${p.scale})`);return true;});
 completed.forEach(done=>done());clock+=dt;
 const active=state.deletionOutcome!=='success';
 if(clock>4.4){clock=0;if(state.stage){
  emitBrowserActivity();
  if(active&&state.deletionOutcome!=='failure'){
   burst('route-ads','A1','red',null,{title:'Selected audience record',fields:audienceFields()});burst('route-archive','C3');
  }
 }}
 if(state.deletionOutcome==='failure'){replayClock+=dt;if(replayClock>=8){replayClock=0;restoreFromArchive();}}
 if(state.sink&&active){leakClock+=dt;if(leakClock>=4.4){leakClock=0;burst('route-sink','Exposed','purple',null,{title:'Unauthorised copy at exposed server',fields:state.leakedFields});}}
 if(state.endpointCompromised){theftClock+=dt;if(theftClock>=4.4){theftClock=0;emitStolenActivity();}}
 if(state.redistributed&&state.sink){darkClock+=dt;if(darkClock>=5){darkClock=0;burst('route-dark','L1 · leaked','purple',null,{title:'Redistributed leaked copy',fields:state.leakedFields});}}
 if(state.stage===2&&state.view==='network'){
  advanceMeridianBackground(dt);
  profileClock+=dt;if(profileClock>=24){profileClock=0;profileChain();}
  for(const from of centres){networkTimers[from]-=dt;if(networkTimers[from]<=0){const destinations=centres.filter(id=>id!==from);const to=destinations[Math.floor(Math.random()*destinations.length)];burst(`route-${from}-${to}`,routePurposes[to],'red',null,backgroundPayload(to));networkTimers[from]=2.4+Math.random()*3.6;}}
  if(state.consent.sharing&&active)for(const to of ['dc2','dc4']){reachTimers[to]-=dt;if(reachTimers[to]<=0){burst('route-reach-'+to,to==='dc2'?'Delivery':'Audience','red',null,{title:'Shared audience selection',fields:audienceFields()});reachTimers[to]=3+Math.random()*3;}}
 }
}
function tick(now){const dt=Math.min((now-last)/1000,.05);last=now;advanceTraffic(dt);requestAnimationFrame(tick);}
layoutTrafficRoutes();
if(typeof ResizeObserver!=='undefined')new ResizeObserver(layoutTrafficRoutes).observe($('#world'));
addEventListener('resize',layoutTrafficRoutes);
if(document.fonts?.ready)document.fonts.ready.then(layoutTrafficRoutes);
$('#explore-compromise').onclick=exploreCompromise;$('#ignore-lure').onclick=ignoreLure;$('#install-extension').onclick=installExtension;$('#remove-extension').onclick=removeExtension;
$('#next').onclick=()=>state.stage===0?trade():reveal();$('#reset').onclick=()=>location.reload();$('#delete').onclick=deletion;$('#delete-success').onclick=()=>chooseDeletion('success');$('#delete-failure').onclick=()=>chooseDeletion('failure');$('#redistribute').onclick=redistribute;$('#profile-record').onchange=e=>inspect(e.target.value);$('#sink-toggle').onclick=toggleSink;$('#find').onclick=findData;$('#pause').onclick=()=>{state.paused=!state.paused;render();};$$('[data-node]').forEach(x=>x.onclick=()=>inspect(x.dataset.node));$$('[data-view]').forEach(x=>x.onclick=()=>setView(x.dataset.view));render();requestAnimationFrame(tick);
const context=document.modelContext;if(context?.registerTool){const controller=new AbortController();try{Promise.resolve(context.registerTool({name:'read_data_trail',description:'Read the current fictional data-trail simulation state.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({started:state.started,completedActions:state.step,progress:percentages[state.step],stage:state.stage,view:state.view,consent:{...state.consent},deletionRequested:state.deleted,exposureActive:state.sink,leakedCopyPresent:state.leakStored,redistributed:state.redistributed,deletionOutcome:state.deletionOutcome,browserCompromised:state.endpointCompromised,stolenActivityExamples:state.stolenSequence})},{signal:controller.signal})).catch(()=>{});Promise.resolve(context.registerTool({name:'advance_data_trail',description:'Complete the next fictional browser action, trade, or network reveal. Does not create an account outside this simulation.',inputSchema:{type:'object',properties:{action:{type:'string',enum:['start','browse','trade','reveal']}},required:['action'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||!['start','browse','trade','reveal'].includes(input.action))throw Error('Invalid simulation action');const a=input.action;if(a==='start'&&state.started||a==='browse'&&(!state.started||state.step>=5)||a==='trade'&&(state.step<5||state.pendingFragments>0||!state.brokerReady||state.stage!==0||!state.consent.advertising)||a==='reveal'&&state.stage!==1)throw Error('Action not available at this stage');({start,browse:act,trade,reveal})[a]();return{stage:state.stage,completedActions:state.step};}},{signal:controller.signal})).catch(()=>{});addEventListener('pagehide',()=>controller.abort(),{once:true});}catch{}}
