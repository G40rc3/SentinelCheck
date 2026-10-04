document.addEventListener('DOMContentLoaded', () => {
  renderNav('Broker Opt-Out');
  loadDetails();
  updatePreview();
  updateCounts();
  renderBrokers();
});

const BROKERS = [
  {name:'Spokeo',risk:'high',data:'Name, address, phone, relatives, age, photos',method:'both',email:'privacy@spokeo.com',link:'https://www.spokeo.com/opt_out/new'},
  {name:'Whitepages',risk:'high',data:'Name, address, phone, relatives',method:'both',email:'support@whitepages.com',link:'https://www.whitepages.com/suppression-requests'},
  {name:'BeenVerified',risk:'high',data:'Name, address, criminal records, relatives',method:'both',email:'privacy@beenverified.com',link:'https://www.beenverified.com/app/optout/search'},
  {name:'Intelius',risk:'high',data:'Background checks, criminal, address history',method:'both',email:'privacy@intelius.com',link:'https://www.intelius.com/opt-out'},
  {name:'PeopleFinder',risk:'high',data:'Name, age, address, relatives',method:'both',email:'support@peoplefinder.com',link:'https://www.peoplefinder.com/optout.php'},
  {name:'Pipl',risk:'high',data:'Email, social profiles, address, photos',method:'email',email:'privacy@pipl.com',link:null},
  {name:'Acxiom',risk:'high',data:'Demographics, purchase history, financial indicators',method:'both',email:'consumer@acxiom.com',link:'https://isapps.acxiom.com/optout/optout.aspx'},
  {name:'Epsilon',risk:'high',data:'Purchase behaviour, demographics, marketing data',method:'email',email:'optout@epsilon.com',link:null},
  {name:'LexisNexis',risk:'high',data:'Legal records, address history, financial data',method:'both',email:'privacy@lexisnexis.com',link:'https://optout.lexisnexis.com'},
  {name:'CoreLogic',risk:'high',data:'Property records, financial data',method:'email',email:'privacy@corelogic.com',link:null},
  {name:'ZoomInfo',risk:'high',data:'Professional info, employer, email, phone',method:'both',email:'privacy@zoominfo.com',link:'https://www.zoominfo.com/about/privacy/'},
  {name:'Clearview AI',risk:'high',data:'Facial recognition database, photos',method:'email',email:'privacy@clearview.ai',link:null},
  {name:'Oracle Data Cloud',risk:'high',data:'Purchase behaviour, interests, demographics',method:'both',email:'datacloudprivacy_ww@oracle.com',link:'https://datalogix.com/consumer-opt-out/'},
  {name:'Equifax',risk:'high',data:'Credit, financial, employment history',method:'both',email:'privacy@equifax.com',link:'https://www.equifax.com/personal/privacy-center/'},
  {name:'Experian',risk:'high',data:'Credit, financial, marketing lists',method:'both',email:'privacy@experian.com',link:'https://www.experian.com/privacy/center.html'},
  {name:'TransUnion',risk:'high',data:'Credit, financial, fraud data',method:'both',email:'privacy@transunion.com',link:'https://www.transunion.com/consumer-privacy'},
  {name:'TowerData',risk:'high',data:'Email append, demographic data',method:'email',email:'privacy@towerdata.com',link:null},
  {name:'Instant Checkmate',risk:'high',data:'Criminal records, background checks',method:'both',email:'support@instantcheckmate.com',link:'https://www.instantcheckmate.com/opt-out/'},
  {name:'TruthFinder',risk:'high',data:'Criminal, address, relatives',method:'both',email:'support@truthfinder.com',link:'https://www.truthfinder.com/opt-out/'},
  {name:'Radaris',risk:'high',data:'Name, address, social profiles, photos',method:'both',email:'privacy@radaris.com',link:'https://radaris.com/control/privacy'},
  {name:'FamilyTreeNow',risk:'high',data:'Family relationships, address history',method:'both',email:'support@familytreenow.com',link:'https://www.familytreenow.com/optout'},
  {name:'MyLife',risk:'high',data:'Reputation score, criminal, relatives',method:'email',email:'privacy@mylife.com',link:null},
  {name:'LiveRamp',risk:'high',data:'Identity resolution, cross-device tracking',method:'both',email:'optout@liveramp.com',link:'https://liveramp.com/opt_out/'},
  {name:'FullContact',risk:'high',data:'Identity graph, contact enrichment',method:'both',email:'privacy@fullcontact.com',link:'https://preferences.fullcontact.com/'},
  {name:'Lotame',risk:'high',data:'Audience data, behavioural profiling',method:'both',email:'privacy@lotame.com',link:'https://www.lotame.com/about-lotame/privacy/'},
  {name:'Neustar',risk:'high',data:'Identity, marketing data, analytics',method:'email',email:'privacyofficer@team.neustar',link:null},
  {name:'Tapad',risk:'high',data:'Cross-device identity graph',method:'both',email:'privacy@tapad.com',link:'https://www.tapad.com/privacy'},
  {name:'ID5',risk:'high',data:'Universal ID, identity resolution',method:'both',email:'privacy@id5.io',link:'https://id5.io/privacy/'},
  {name:'The Trade Desk',risk:'high',data:'Advertising identity, audience data',method:'both',email:'privacy@thetradedesk.com',link:'https://www.adsrvr.org/'},
  {name:'Adobe Audience Manager',risk:'high',data:'Audience segmentation, behavioural data',method:'both',email:'privacy@adobe.com',link:'https://www.adobe.com/privacy/opt-out.html'},
  {name:'Salesforce DMP',risk:'high',data:'Audience, behavioural, third-party data',method:'both',email:'privacy@salesforce.com',link:'https://www.salesforce.com/company/privacy/'},
  {name:'Nielsen',risk:'high',data:'Demographics, viewing habits, purchasing',method:'both',email:'privacypolicy@nielsen.com',link:'https://www.nielsen.com/us/en/legal/privacy-statement/'},
  {name:'Dun & Bradstreet',risk:'high',data:'Business and personal identity data',method:'both',email:'privacy@dnb.com',link:'https://www.dnb.com/utility-pages/ccpa-dns.html'},
  {name:'VoterRecords',risk:'high',data:'Voter registration, political data',method:'both',email:'privacy@voterrecords.com',link:'https://voterrecords.com/opt-out'},
  {name:'Innovis',risk:'high',data:'Credit, financial data',method:'both',email:'privacy@innovis.com',link:'https://www.innovis.com/personal/creditFreeze'},
  {name:'PeopleConnect',risk:'high',data:'Background, criminal, relatives',method:'both',email:'privacy@peopleconnect.us',link:'https://www.peopleconnect.us/opt-out'},
  {name:'FastPeopleSearch',risk:'high',data:'Name, address, relatives, phone',method:'both',email:'support@fastpeoplesearch.com',link:'https://www.fastpeoplesearch.com/removal'},
  {name:'PeopleLooker',risk:'high',data:'Background, criminal, address, relatives',method:'both',email:'support@peoplelooker.com',link:'https://www.peoplelooker.com/f/optout/search'},
  {name:'Tracers Info',risk:'high',data:'Background, identity, address, criminal',method:'email',email:'privacy@tracers.com',link:null},
  {name:'Thomson Reuters',risk:'high',data:'Legal, identity, public records',method:'both',email:'privacy.practices@thomsonreuters.com',link:'https://legalsolutions.thomsonreuters.com/law-products/about/legal-notices/privacy'},
  {name:'Samba TV',risk:'high',data:'TV viewing habits, household data',method:'both',email:'privacy@samba.tv',link:'https://www.samba.tv/legal/privacy-policy'},
  {name:'Zeta Global',risk:'high',data:'Demographics, purchase intent, email targeting',method:'email',email:'privacy@zetaglobal.com',link:null},
  {name:'Harte-Hanks',risk:'med',data:'Demographics, direct mail lists',method:'email',email:'privacy@harte-hanks.com',link:null},
  {name:'US Search',risk:'med',data:'Name, address, phone, relatives',method:'web',email:null,link:'https://www.ussearch.com/consumer/ala/landing.do'},
  {name:'Nuwber',risk:'med',data:'Name, address, phone, email',method:'both',email:'support@nuwber.com',link:'https://nuwber.com/removal/link'},
  {name:'InfoTracer',risk:'med',data:'Background checks, contact info',method:'both',email:'privacy@infotracer.com',link:'https://infotracer.com/optout'},
  {name:'CheckPeople',risk:'med',data:'Background, criminal, address',method:'both',email:'support@checkpeople.com',link:'https://www.checkpeople.com/opt-out'},
  {name:'GoLookUp',risk:'med',data:'Background, criminal, address',method:'both',email:'support@golookup.com',link:'https://golookup.com/optout'},
  {name:'TruePeopleSearch',risk:'med',data:'Name, address, phone, relatives',method:'both',email:'support@truepeoplesearch.com',link:'https://www.truepeoplesearch.com/removal'},
  {name:'PublicRecordsNow',risk:'med',data:'Public records, address, criminal',method:'both',email:'support@publicrecordsnow.com',link:'https://www.publicrecordsnow.com/static/view/optout'},
  {name:'PrivateEye',risk:'med',data:'Background checks, criminal',method:'both',email:'support@privateeye.com',link:'https://www.privateeye.com/static/view/optout/'},
  {name:'Advanced Background Checks',risk:'med',data:'Background checks, criminal',method:'both',email:'support@advancedbackgroundchecks.com',link:'https://www.advancedbackgroundchecks.com/removal'},
  {name:'Addresses.com',risk:'med',data:'Address, phone, relatives',method:'web',email:null,link:'https://www.addresses.com/optout.php'},
  {name:'Cyberbackgroundchecks',risk:'med',data:'Background, criminal, address',method:'both',email:'support@cyberbackgroundchecks.com',link:'https://www.cyberbackgroundchecks.com/removal'},
  {name:'OfficialUSA',risk:'med',data:'Public records, address',method:'both',email:'support@officialusa.com',link:'https://www.officialusa.com/optout/'},
  {name:'PeopleSearchNow',risk:'med',data:'Contact, background data',method:'both',email:'support@peoplesearchnow.com',link:'https://www.peoplesearchnow.com/opt-out'},
  {name:'Veromi',risk:'med',data:'Background checks, address',method:'email',email:'privacy@veromi.net',link:null},
  {name:'FindPeopleSearch',risk:'low',data:'Name, address, phone',method:'web',email:null,link:'https://www.findpeoplesearch.com/remove_self.php'},
  {name:'SmartBackgroundChecks',risk:'med',data:'Background, criminal, address',method:'both',email:'support@smartbackgroundchecks.com',link:'https://www.smartbackgroundchecks.com/optout'},
  {name:'Clustrmaps',risk:'low',data:'Address history, contact info',method:'both',email:'support@clustrmaps.com',link:'https://clustrmaps.com/bl/opt-out'},
  {name:'NumberGuru',risk:'low',data:'Phone lookup, reverse search',method:'both',email:'support@numberguru.com',link:'https://www.numberguru.com/opt-out'},
  {name:'Homemetry',risk:'med',data:'Property records, address history',method:'email',email:'privacy@homemetry.com',link:null},
  {name:'Rehold',risk:'med',data:'Address, residents, neighbours',method:'email',email:'support@rehold.com',link:null},
  {name:'PeekYou',risk:'med',data:'Social profiles, contact, identity',method:'both',email:'privacy@peekyou.com',link:'https://www.peekyou.com/about/contact/ccpa_optout/'},
  {name:"That'sThem",risk:'med',data:'Name, address, email, phone',method:'both',email:'privacy@thatsthem.com',link:'https://thatsthem.com/optout'},
  {name:'SocialCatfish',risk:'med',data:'Social profiles, identity, photos',method:'both',email:'privacy@socialcatfish.com',link:'https://socialcatfish.com/opt-out/'},
  {name:'GoodHire',risk:'high',data:'Employment background checks',method:'email',email:'privacy@goodhire.com',link:null},
  {name:'ValidiFI',risk:'med',data:'Financial identity, bank data',method:'email',email:'privacy@validifi.com',link:null},
  {name:'Rocketreach',risk:'med',data:'Professional contact info',method:'both',email:'privacy@rocketreach.co',link:'https://rocketreach.co/privacy'},
  {name:'Bombora',risk:'med',data:'B2B intent data, company/person',method:'both',email:'privacy@bombora.com',link:'https://bombora.com/privacy/'},
  {name:'Kantar',risk:'med',data:'Consumer research, demographics',method:'email',email:'privacy@kantar.com',link:null},
  {name:'AnyWho',risk:'low',data:'Phone directory, address',method:'web',email:null,link:'https://www.anywho.com/help/privacy'},
  {name:'SearchBug',risk:'low',data:'Phone, address lookup',method:'email',email:'privacy@searchbug.com',link:null},
  {name:'PhoneDetective',risk:'med',data:'Reverse phone lookup',method:'email',email:'support@phonedetective.com',link:null},
  {name:'YouMail',risk:'low',data:'Phone data, voicemail records',method:'email',email:'privacy@youmail.com',link:null},
  {name:'WhoCallsMe',risk:'low',data:'Phone lookup, spam caller ID',method:'email',email:'support@whocallsme.com',link:null},
  {name:'Zabasearch',risk:'med',data:'Name, address, age',method:'email',email:'zabasearch@zabasearch.com',link:null},
  {name:'Whooster',risk:'med',data:'Name, address, phone',method:'email',email:'privacy@whooster.com',link:null},
  {name:'Swordfish',risk:'med',data:'Professional email, phone',method:'email',email:'privacy@swordfish.ai',link:null},
  {name:'IRB Search',risk:'med',data:'Background, address, criminal',method:'email',email:'privacy@irbsearch.com',link:null},
  {name:'Neighbor.report',risk:'med',data:'Address, residents, neighbours',method:'email',email:'privacy@neighbor.report',link:null},
  {name:'RelSci',risk:'med',data:'Professional relationships, org charts',method:'email',email:'privacy@relsciences.com',link:null},
  {name:'TechTarget',risk:'med',data:'Professional intent data, email',method:'email',email:'privacy@techtarget.com',link:null},
  {name:'QuinStreet',risk:'med',data:'Lead generation, intent data',method:'email',email:'privacy@quinstreet.com',link:null},
  {name:'NextMark',risk:'med',data:'Mailing lists, demographics',method:'email',email:'privacy@nextmark.com',link:null},
  {name:'Drawbridge',risk:'high',data:'Cross-device tracking, identity',method:'email',email:'privacy@drawbridge.com',link:null},
  {name:'IRI Worldwide',risk:'med',data:'Purchase data, retail analytics',method:'email',email:'privacy@iriworldwide.com',link:null},
  {name:'Datalogix',risk:'high',data:'Purchase behaviour, offline-online link',method:'email',email:'privacy@datalogix.com',link:null},
  {name:'WeInform',risk:'med',data:'Background, address, relatives',method:'email',email:'optout@weinform.com',link:null},
  {name:'WhoEasy',risk:'low',data:'Name, address, phone',method:'email',email:'privacy@whoeasy.com',link:null},
  {name:'Truthscore',risk:'med',data:'Background, identity, criminal',method:'email',email:'privacy@truthscore.com',link:null},
  {name:'PeopleSpy',risk:'med',data:'Contact info, background',method:'email',email:'privacy@peoplespy.com',link:null},
];

const EXTRA = [
  ['PeopleWhiz','med','Name, address, criminal','email','privacy@peoplewhiz.com'],
  ['FocusedData','med','Demographics, email lists','email','optout@focuseddata.com'],
  ['FreePeopleSearch','low','Name, address, phone','web',null,'https://www.freepeoplesearch.com/'],
  ['HouseFacts','med','Property records, owners','email','privacy@housefacts.com'],
  ['LocalPages','low','Phone directory, local business','web',null],
  ['MelissaData','med','Address, demographics, contact','both','privacy@melissa.com','https://www.melissa.com/privacy'],
  ['NetAcuity','high','IP geolocation, ISP data','email','privacy@digital-element.net'],
  ['SafeGraph','high','Location data, foot traffic','email','privacy@safegraph.com'],
  ['Kochava','high','Mobile tracking, attribution','both','privacy@kochava.com','https://www.kochava.com/support-privacy/'],
  ['Marchex','med','Call analytics, phone data','email','privacy@marchex.com'],
  ['Mixpanel','med','Behavioural analytics','both','privacy@mixpanel.com','https://mixpanel.com/legal/privacy-policy/'],
  ['Outbrain','high','Content targeting, interest data','both','privacy@outbrain.com','https://www.outbrain.com/legal/privacy'],
  ['Quantcast','high','Audience measurement, profiling','both','privacy@quantcast.com','https://www.quantcast.com/opt-out/'],
  ['ShareThis','high','Social sharing, cross-site tracking','both','privacy@sharethis.com','https://sharethis.com/privacy/'],
  ['Signal','high','Identity resolution, first-party data','email','privacy@signal.co'],
  ['Stirista','med','Email, demographic, B2B data','email','privacy@stirista.com'],
  ['TargetSmart','high','Voter, political, demographic data','email','privacy@targetsmart.com'],
  ['Throtle','high','Identity linking, email hashing','email','privacy@throtle.io'],
  ['Tru Optik','high','Household IP targeting','both','privacy@truoptik.com','https://truoptik.com/privacy-policy/'],
  ['TruSignal','high','Predictive audience data','email','privacy@trusignal.com'],
  ['UberMedia','high','Location, mobile data','email','privacy@ubermedia.com'],
  ['Videology','med','Video ad targeting','email','privacy@videologygroup.com'],
  ['VisualDNA','med','Psychographic profiling','email','privacy@visualdna.com'],
  ['Weborama','high','Behavioural, audience data','both','dpo@weborama.com','https://weborama.com/privacy/'],
  ['Wunderkind','high','Email retargeting, identity','email','privacy@wunderkind.co'],
  ['Sprinklr','med','Social data, CX analytics','email','privacy@sprinklr.com'],
  ['Placed','high','Location attribution, foot traffic','email','privacy@placed.com'],
  ['Peer39','med','Content targeting, brand safety','email','privacy@peer39.com'],
  ['Proximic','med','Content targeting, audience','email','privacy@proximic.com'],
  ['Resonate','high','Consumer insights, values data','email','privacy@resonate.com'],
  ['Retargetly','high','Audience data, Latin America','email','privacy@retargetly.com'],
  ['Semasio','med','Semantic targeting, profiling','email','privacy@semasio.com'],
  ['Skimlinks','med','Purchase intent, affiliate data','both','privacy@skimlinks.com','https://skimlinks.com/privacy-policy/'],
  ['Smartclip','med','Video ad data','email','privacy@smartclip.net'],
  ['SpotX','high','Video advertising data','email','privacy@spotx.tv'],
  ['Telaria','med','Video ad targeting','email','privacy@telaria.com'],
  ['Turbine Labs','med','Audience data, DMP','email','privacy@turbinelabs.io'],
  ['Tyroo','med','Ad network, user data','email','privacy@tyroo.com'],
  ['Undertone','med','Audience targeting data','email','privacy@undertone.com'],
  ['Vericast','high','Direct mail, financial targeting','email','privacy@vericast.com'],
  ['Vim.io','med','Purchase intent data','email','privacy@vim.io'],
  ['WorthPoint','low','Collectibles, purchase history','email','privacy@worthpoint.com'],
  ['YP Data','med','Business, local person data','email','privacy@yp.com'],
  ['Specific Media','high','Behavioural ad targeting','email','privacy@specificmedia.com'],
  ['Digital River','med','Purchase, financial data','email','privacy@digitalriver.com'],
  ['Cardlytics','high','Bank transaction targeting','both','privacy@cardlytics.com','https://www.cardlytics.com/consumer-opt-out'],
  ['Accenture Song','high','Marketing data, analytics','email','privacy@accenture.com'],
  ['IXI Network','high','Wealth, financial segment data','email','privacy@ixinetwork.com'],
  ['Nielsen Catalina','high','Purchase + media behaviour','email','privacy@nielsen.com'],
  ['Simmons Research','med','Consumer values, lifestyle','email','privacy@simmonsresearch.com'],
  ['Ipsos','med','Consumer research, panels','email','privacy@ipsos.com'],
  ['YouGov','med','Panel research, profiling','both','privacy@yougov.com','https://yougov.co.uk/about/terms-and-conditions/'],
  ['PushSpring','high','Mobile audience data','email','privacy@pushspring.com'],
  ['Factual','high','Location data, POI','email','privacy@factual.com'],
  ['Verve','high','Location, mobile audience','email','privacy@verve.com'],
  ['Adsquare','high','Location, audience data EU','both','privacy@adsquare.com','https://www.adsquare.com/privacy'],
  ['Zeotap','high','Identity, audience EU','both','privacy@zeotap.com','https://zeotap.com/privacy-policy/'],
  ['Exactag','med','Attribution, marketing data','email','privacy@exactag.com'],
  ['Commanders Act','med','Tag management, data','email','privacy@commandersact.com'],
  ['OnAudience','med','DMP, audience data','email','privacy@onaudience.com'],
  ['Audience Science','high','Behavioural targeting','email','privacy@audiencescience.com'],
  ['Conversant','high','Personalised marketing','email','privacy@conversantmedia.com'],
  ['Digital Management','med','Marketing data','email','privacy@dminc.com'],
  ['Infogroup','high','B2B/B2C contact data','email','privacy@infogroup.com'],
  ['Stirista2','med','Email lists, B2B','email','privacy@stirista.com'],
  ['Data.com','high','Business contact data','email','privacy@data.com'],
  ['Leadspace','high','B2B identity, intent','email','privacy@leadspace.com'],
  ['Demandbase','high','B2B targeting, identity','both','privacy@demandbase.com','https://www.demandbase.com/privacy-policy/'],
  ['Rollworks','high','B2B intent, account data','email','privacy@rollworks.com'],
  ['G2 Crowd','med','B2B intent, reviews data','email','privacy@g2.com'],
  ['TechTarget2','med','B2B purchase intent','email','privacy@techtarget.com'],
  ['Bombora2','med','B2B intent signals','email','privacy@bombora.com'],
  ['Aberdeen Group','med','B2B research, intent','email','privacy@aberdeen.com'],
  ['Mintigo','high','Predictive B2B data','email','privacy@mintigo.com'],
  ['EverString','high','B2B predictive data','email','privacy@everstring.com'],
  ['Lattice Engines','high','B2B data, AI scoring','email','privacy@lattice-engines.com'],
  ['InsideView','high','B2B company, contact data','email','privacy@insideview.com'],
  ['DiscoverOrg','high','B2B org charts, contacts','both','privacy@discoverorg.com','https://zoominfo.com/about/privacy/'],
  ['DataFox','high','Company intelligence data','email','privacy@datafox.com'],
  ['Radius Intelligence','high','B2B predictive data','email','privacy@radius.com'],
  ['SalesIntel','high','B2B verified contacts','email','privacy@salesintel.io'],
  ['Clearbit','high','B2B enrichment, identity','both','privacy@clearbit.com','https://clearbit.com/privacy'],
  ['Hunter.io','high','Professional email finder','both','privacy@hunter.io','https://hunter.io/privacy'],
  ['Apollo.io','high','B2B contacts, sequences','both','privacy@apollo.io','https://www.apollo.io/privacy-policy'],
  ['Cognism','high','GDPR B2B data EU/UK','both','privacy@cognism.com','https://www.cognism.com/privacy-policy'],
  ['Lusha','high','B2B contact enrichment','both','privacy@lusha.co','https://www.lusha.com/privacy-policy/'],
  ['Adapt.io','med','B2B contacts','email','privacy@adapt.io'],
  ['Seamless.ai','high','B2B contact finder','both','privacy@seamless.ai','https://seamless.ai/privacy'],
  ['Snov.io','med','Email finder, B2B','email','privacy@snov.io'],
];

EXTRA.forEach(([name,risk,data,method,email,link]) => {
  if (BROKERS.length < 187) BROKERS.push({name,risk,data,method:method||'email',email:email||null,link:link||null});
});

function saveDetails() {
  ['myName','myEmail','myCity'].forEach(id => S.set(id, document.getElementById(id).value));
  S.set('myCountry', document.getElementById('myCountry').value);
}
function loadDetails() {
  ['myName','myEmail','myCity'].forEach(id => { document.getElementById(id).value = S.get(id,''); });
  document.getElementById('myCountry').value = S.get('myCountry','UK');
}

function emailSubject() { return 'Personal data erasure and opt-out request'; }
function buildEmail(brokerName) {
  const name = document.getElementById('myName').value.trim() || '[YOUR NAME]';
  const email = document.getElementById('myEmail').value.trim() || '[EMAIL ASSOCIATED WITH YOUR RECORD]';
  const city = document.getElementById('myCity').value.trim();
  const country = document.getElementById('myCountry').value;
  const opening = {
    UK:'I am asking you to review my request to erase personal data you hold about me under Article 17 of the UK GDPR. I also object to processing for direct marketing under Article 21.',
    EU:'I am asking you to review my request to erase personal data you hold about me under Article 17 of the EU GDPR. I also object to processing for direct marketing under Article 21.',
    'US-CA':'I am requesting deletion of personal information you hold about me and opting out of sale or sharing where California law applies.',
    US:'I am requesting that you remove my personal information from your listings and stop using it for marketing where applicable.'
  }[country];
  return `Hello,

${opening}

Please check whether you hold a record for me. If you do, tell me what steps you have taken in response and whether you need any further information to locate the record. Please also tell me if you cannot fulfil part of this request and why.

Details to help find my record:
Name: ${name}
Email: ${email}${city ? '\nCity: '+city : ''}

Please reply to this email address. I will provide further details through a secure channel if they are needed to verify my identity.

Regards,
${name}`;
}
function updatePreview() {
  document.getElementById('emailSubject').textContent='Subject: '+emailSubject();
  document.getElementById('emailPreview').textContent=buildEmail('this company');
}
function updateCounts() {
  const withEmail = [...new Set(BROKERS.filter(b=>b.email).map(b=>b.email))].length;
  document.getElementById('bccCount').textContent=withEmail+' unique email addresses listed';
  document.getElementById('exportCount').textContent=BROKERS.filter(b=>b.email).length+' contacts, '+withEmail+' unique addresses';
  document.getElementById('batchCount').textContent=BROKERS.filter(b=>b.email).length+' listed email contacts';
}
function copyEmailBody() {
  const body=buildEmail('this company');
  navigator.clipboard.writeText(body).then(()=>{document.getElementById('copyBodyStatus').textContent='Email text copied. Paste it into the body of your draft.'}).catch(()=>{document.getElementById('copyBodyStatus').textContent='Could not copy automatically. Select and copy the example above.'});
}

function copyAllAddresses() {
  const addrs = [...new Set(BROKERS.filter(b => b.email).map(b => b.email))];
  navigator.clipboard.writeText(addrs.join(', ')).then(() => {
    document.getElementById('bccStatus').textContent = '✓ ' + addrs.length + ' addresses copied: paste into BCC field';
    setTimeout(() => document.getElementById('bccStatus').textContent = '', 5000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = addrs.join(', ');
    ta.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:200px;z-index:9999;background:var(--bg2);color:var(--text);border:1px solid var(--accent);padding:12px;font-family:var(--mono);font-size:11px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    setTimeout(() => ta.remove(), 4000);
    document.getElementById('bccStatus').textContent = '✓ Copied via fallback: ' + addrs.length + ' addresses';
  });
}

function openBccDraft() {
  const addresses=[...new Set(BROKERS.filter(b=>b.email).map(b=>b.email))];
  const a=document.createElement('a');
  a.href='mailto:?bcc='+encodeURIComponent(addresses.join(','))+'&subject='+encodeURIComponent(emailSubject())+'&body='+encodeURIComponent(buildEmail('this company'));
  a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
  document.getElementById('bccStatus').textContent='Draft requested in your email app. Check every address and send it yourself. If the app rejects this many recipients, use smaller batches or individual drafts.';
}

function exportAll() {
  const real = BROKERS.filter(b => b.email);
  let out = 'GHOST PROTOCOL: MASS OPT-OUT EMAIL EXPORT\n';
  out += 'Generated: ' + new Date().toLocaleString('en-GB') + '\n';
  out += 'Name: ' + (document.getElementById('myName').value || '[YOUR NAME]') + '\n';
  out += '━'.repeat(60) + '\n\n';
  out += 'EMAIL ADDRESSES (verify before using; paste into BCC, never CC):\n';
  out += [...new Set(real.map(b => b.email))].join(', ') + '\n\n';
  out += '━'.repeat(60) + '\n\n';
  out += 'INDIVIDUAL EMAILS:\n\n';
  real.forEach(b => {
    out += '══ ' + b.name + ' ══\n';
    out += 'TO: ' + b.email + '\n';
    if (b.link) out += 'WEB FORM: ' + b.link + '\n';
    out += 'SUBJECT: ' + emailSubject() + '\n\n' + buildEmail(b.name) + '\n\n' + '─'.repeat(60) + '\n\n';
  });
  const blob = new Blob([out], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ghost-protocol-optout-' + new Date().toISOString().slice(0,10) + '.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

let _queue = [], _idx = 0;
function startMailtoBatch() {
  if (!_queue.length || _idx >= _queue.length) {
    _queue = BROKERS.filter(b=>b.email);
    _idx = 0;
  }
  const batch=_queue.slice(_idx,_idx+5);
  batch.forEach(b=>{
    const a=document.createElement('a');
    a.href='mailto:'+b.email+'?subject='+encodeURIComponent(emailSubject())+'&body='+encodeURIComponent(buildEmail(b.name));
    a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
  });
  _idx += batch.length;
  const remaining=_queue.length-_idx;
  document.getElementById('batchStatus').textContent='Opened '+_idx+' of '+_queue.length+' drafts. Review and send in your email app. '+(remaining?'Click again for the next five.':'All listed drafts have been opened. None were sent by this page.');
  document.getElementById('batchBtn').textContent=remaining?'Open next five drafts':'Start drafts again';
}

function markAllSubmitted() {
  if (!confirm('Mark all listed brokers as "Submitted"?\n\nOnly mark requests you actually sent.')) return;
  const status = S.get('brokerStatus', {});
  BROKERS.forEach(b => { if (status[b.name] !== 'done') status[b.name] = 'submitted'; });
  S.set('brokerStatus', status);
  renderBrokers(); S.updateScoreUI(); renderNav('Broker Opt-Out');
}
function markAllDone() {
  if (!confirm('Mark all brokers as "Done"?\n\nOnly do this once you have received confirmation from each one.')) return;
  const status = S.get('brokerStatus', {});
  BROKERS.forEach(b => { status[b.name] = 'done'; });
  S.set('brokerStatus', status);
  renderBrokers(); S.updateScoreUI(); renderNav('Broker Opt-Out');
}

function renderBrokers() {
  const status = S.get('brokerStatus', {});
  const filter = (document.getElementById('filterInput').value || '').toLowerCase();
  const sf = document.getElementById('filterStatus').value;
  const done = BROKERS.filter(b=>status[b.name]==='done').length;
  const sub = BROKERS.filter(b=>status[b.name]==='submitted').length;
  document.getElementById('progressNum').textContent = done + '/' + BROKERS.length;
  document.getElementById('progressBar').style.width = (done / BROKERS.length * 100).toFixed(1) + '%';
  document.getElementById('cnt_done').textContent = done;
  document.getElementById('cnt_sub').textContent = sub;
  document.getElementById('cnt_todo').textContent = BROKERS.length - done - sub;

  const filtered = BROKERS.filter(b => {
    const state=status[b.name]||'todo';
    return (!filter||b.name.toLowerCase().includes(filter))&&(sf==='all'||state===sf);
  }).sort((a,b)=>a.name.localeCompare(b.name));
  const riskLabels={high:'High',med:'Medium',low:'Low'};
  for(const risk of ['high','med','low']) {
    const entries=filtered.filter(b=>b.risk===risk);
    const total=BROKERS.filter(b=>b.risk===risk).length;
    document.getElementById('riskCount-'+risk).textContent=filter||sf!=='all'?entries.length+' of '+total+' listed':total+' listed';
    const box=document.getElementById({high:'riskHigh',med:'riskMed',low:'riskLow'}[risk]);
    if(filter||sf!=='all')box.open=entries.length>0;
    document.getElementById('brokerBody-'+risk).innerHTML=entries.length?entries.map(b=>{
      const state=status[b.name]||'todo';
      const safeN=b.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      const subj=encodeURIComponent(emailSubject());
      const body=encodeURIComponent(buildEmail(b.name));
      return `<tr><td class="cell-main">${b.name}</td><td><span class="badge ${risk==='high'?'danger':risk==='med'?'warn':'muted'}">${riskLabels[risk]}</span></td><td>${b.data}</td><td>${b.method==='both'?'Email + form':b.method}</td><td><select class="form-select" aria-label="Status for ${b.name}" onchange="setStatus('${safeN}',this.value)"><option value="todo" ${state==='todo'?'selected':''}>To do</option><option value="submitted" ${state==='submitted'?'selected':''}>Submitted</option><option value="done" ${state==='done'?'selected':''}>Done</option></select></td><td class="broker-actions">${b.link?`<a href="${b.link}" target="_blank" rel="noopener">Form ↗</a>`:''}${b.email?`<a href="mailto:${b.email}?subject=${subj}&body=${body}">Email ↗</a>`:''}</td></tr>`;
    }).join(''):'<tr><td colspan="6">No matching brokers in this group.</td></tr>';
  }
  S.updateScoreUI();
}

function setStatus(name, val) {
  const status = S.get('brokerStatus', {});
  status[name] = val;
  S.set('brokerStatus', status);
  renderBrokers(); renderNav('Broker Opt-Out');
}
