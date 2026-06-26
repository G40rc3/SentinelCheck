function renderNav(active) {
  const links = [
    ['../index.html','00','Overview'],
    ['audit.html','01','Exposure Audit'],
    ['arsenal.html','02','Tool Arsenal'],
    ['brokers.html','03','Broker Opt-Out'],
    ['aliases.html','04','Email Aliases'],
    ['personas.html','05','Persona Generator'],
    ['fingerprint.html','06','Fingerprint Defence'],
    ['breaches.html','07','Breach Monitor'],
    ['social.html','08','Social Media Audit'],
    ['network.html','09','Network Hardening'],
    ['passwords.html','10','Password & 2FA'],
    ['cookies.html','11','Cookie & Consent'],
    ['permissions.html','12','App Permissions'],
    ['wifi.html','13','WiFi & Bluetooth'],
    ['search.html','14','Search & Browsing'],
    ['physical.html','15','Physical OPSEC'],
    ['household.html','16','Household & Children'],
    ['news.html','17','Intel Feed'],
  ];
  const stats = S.exposureStats();
  const circ = 213.6;
  const offset = (circ - (circ * stats.percent / 100)).toFixed(1);
  const priorityText = stats.topPriorities.length ? ' Next: ' + stats.topPriorities.join(' + ') + '.' : '';
  document.querySelector('.sidebar').innerHTML = `
    <div class="logo" aria-hidden="true">
      <div class="logo-icon"><span class="pulse-ring"></span><span class="logo-dot"></span></div>
      <div><div class="logo-title">GHOST</div><div class="logo-sub">PROTOCOL v3.0</div></div>
    </div>
    <nav class="toolkit-nav" aria-label="Ghost Protocol toolkit navigation">
    <ul class="nav-links" style="overflow-y:auto;flex:1;padding-bottom:8px">
      ${links.map(([href,num,label]) => `
        <li><a href="${href}" class="nav-link${label===active?' active':''}" data-label="${num}"${label===active?' aria-current="page"':''}><span>${label}</span></a></li>
      `).join('')}
    </ul>
    </nav>
    <div class="sidebar-home" role="navigation" aria-label="Sentinel Check quick links">
      <a href="/learning-hub.html">LEARNING HUB</a>
      <a href="/#contact">FREE CYBER MOT</a>
    </div>
    <div class="sidebar-score">
      <div class="score-label">EXPOSURE SCORE</div>
      <svg viewBox="0 0 80 80" class="score-ring" role="img" aria-label="Current exposure score">
        <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" stroke-width="5"/>
        <circle cx="40" cy="40" r="34" fill="none" stroke="${stats.stroke}" stroke-width="5"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}" id="scoreCircle"
          stroke-linecap="round" transform="rotate(-90 40 40)" style="transition:stroke-dashoffset 1.2s ease,stroke 0.5s"/>
        <text x="40" y="44" text-anchor="middle" font-family="'Share Tech Mono'" font-size="13" fill="var(--text)" id="scoreText">${stats.current}/${stats.total}</text>
      </svg>
      <div class="score-status" id="scoreStatus">${stats.level}</div>
      <div class="score-feedback" id="scoreFeedback">${stats.feedback + priorityText}</div>
      <div class="score-meta" id="scoreMeta">${stats.auditDone ? 'Initial ' + stats.initial + ' | Fixed ' + stats.fixedCount : 'Ready to run audit'}</div>
    </div>`;
  S.updateScoreUI();
}
