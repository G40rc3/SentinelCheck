function getProtocolNavData(active) {
  const inPages = window.location.pathname.includes('/pages/');
  const overviewHref = inPages ? '../index.html' : 'index.html';
  const pageHref = (file) => inPages ? file : 'pages/' + file;
  return [
    [overviewHref,'00','Overview'],
    [pageHref('audit.html'),'01','Exposure Audit'],
    [pageHref('arsenal.html'),'02','Tool Arsenal'],
    [pageHref('brokers.html'),'03','Broker Opt-Out'],
    [pageHref('aliases.html'),'04','Email Aliases'],
    [pageHref('personas.html'),'05','Persona Generator'],
    [pageHref('fingerprint.html'),'06','Fingerprint Defence'],
    [pageHref('breaches.html'),'07','Breach Monitor'],
    [pageHref('social.html'),'08','Social Media Audit'],
    [pageHref('network.html'),'09','Network Hardening'],
    [pageHref('passwords.html'),'10','Password & 2FA'],
    [pageHref('cookies.html'),'11','Cookie & Consent'],
    [pageHref('permissions.html'),'12','App Permissions'],
    [pageHref('wifi.html'),'13','WiFi & Bluetooth'],
    [pageHref('search.html'),'14','Search & Browsing'],
    [pageHref('physical.html'),'15','Physical OPSEC'],
    [pageHref('household.html'),'16','Household & Children'],
    [pageHref('news.html'),'17','Intel Feed'],
  ];
}

function getAuditHref() {
  const inPages = window.location.pathname.includes('/pages/');
  return inPages ? 'audit.html' : 'pages/audit.html';
}

function scoreMarkup(stats) {
  const circ = 213.6;
  const offset = (circ - (circ * stats.percent / 100)).toFixed(1);
  const priorityText = stats.topPriorities.length ? ' Next: ' + stats.topPriorities.join(' + ') + '.' : '';
  return `
    <div class="score-label">EXPOSURE SCORE</div>
    <svg viewBox="0 0 80 80" class="score-ring" role="img" aria-label="Current exposure score">
      <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" stroke-width="5"/>
      <circle cx="40" cy="40" r="34" fill="none" stroke="${stats.stroke}" stroke-width="5"
        stroke-dasharray="${circ}" stroke-dashoffset="${offset}" id="scoreCircle"
        stroke-linecap="round" transform="rotate(-90 40 40)" style="transition:stroke-dashoffset 1.2s ease,stroke 0.5s"/>
      <text x="40" y="44" text-anchor="middle" font-family="'Segoe UI', Roboto, monospace" font-size="13" fill="var(--text)" id="scoreText">${stats.current}/${stats.total}</text>
    </svg>
    <div class="score-status" id="scoreStatus">${stats.level}</div>
    <div class="score-feedback" id="scoreFeedback">${stats.feedback + priorityText}</div>
    <div class="score-meta" id="scoreMeta">${stats.auditDone ? 'Initial ' + stats.initial + ' | Fixed ' + stats.fixedCount : 'Ready to run audit'}</div>`;
}

function renderMobileProtocolControls(active, links) {
  const oldBar = document.getElementById('mobileProtocolBar');
  const oldDrawer = document.getElementById('mobileProtocolDrawer');
  if (oldBar) oldBar.remove();
  if (oldDrawer) oldDrawer.remove();

  const stats = S.exposureStats();
  const activeLabel = active || 'Ghost Protocol';
  const auditHref = getAuditHref();
  const navItems = links.map(([href, num, label]) => `
    <a href="${href}" class="mobile-drawer-link${label === active ? ' active' : ''}"${label === active ? ' aria-current="page"' : ''}>
      <span class="mobile-drawer-num">${num}</span>
      <span>${label}</span>
    </a>
  `).join('');

  const drawer = document.createElement('div');
  drawer.id = 'mobileProtocolDrawer';
  drawer.className = 'mobile-protocol-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <div class="mobile-drawer-backdrop" data-close-mobile-menu></div>
    <section class="mobile-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="mobileDrawerTitle" tabindex="-1">
      <div class="mobile-drawer-head">
        <div>
          <div class="mobile-drawer-kicker">Protocol Menu</div>
          <h2 id="mobileDrawerTitle">Ghost Protocol Modules</h2>
          <p>Current page: ${activeLabel}</p>
        </div>
        <button class="mobile-drawer-close" type="button" data-close-mobile-menu aria-label="Close Protocol Menu">✕</button>
      </div>
      <div class="mobile-drawer-score">
        <span>Exposure Score</span>
        <strong id="mobileDrawerScoreText">${stats.current}/${stats.total}</strong>
        <small id="mobileDrawerScoreStatus">${stats.level}</small>
      </div>
      <nav class="mobile-drawer-nav" aria-label="Ghost Protocol mobile modules">
        ${navItems}
      </nav>
      <div class="mobile-drawer-site-links" aria-label="Sentinel Check quick links">
        <a href="/learning-hub.html">Learning Hub</a>
        <a href="/#contact">Free Cyber MOT</a>
      </div>
    </section>`;

  const bar = document.createElement('nav');
  bar.id = 'mobileProtocolBar';
  bar.className = 'mobile-protocol-bar';
  bar.setAttribute('aria-label', 'Ghost Protocol mobile controls');
  bar.innerHTML = `
    <button class="mobile-bar-button mobile-menu-button" type="button" id="mobileProtocolMenuBtn" aria-controls="mobileProtocolDrawer" aria-expanded="false">
      <span>Protocol Menu</span>
    </button>
    <a class="mobile-score-pill" href="${auditHref}" aria-label="Open Exposure Audit score">
      <span>Exposure</span>
      <strong id="mobileScoreText">${stats.current}/${stats.total}</strong>
      <small id="mobileScoreStatus">${stats.level}</small>
    </a>
    <button class="mobile-bar-button mobile-top-button" type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})">
      Top
    </button>`;

  document.body.appendChild(drawer);
  document.body.appendChild(bar);

  const menuButton = document.getElementById('mobileProtocolMenuBtn');
  const panel = drawer.querySelector('.mobile-drawer-panel');
  const openMenu = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-drawer-open');
    setTimeout(() => panel && panel.focus(), 20);
  };
  const closeMenu = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-drawer-open');
    menuButton.focus({ preventScroll: true });
  };

  menuButton.addEventListener('click', openMenu);
  drawer.querySelectorAll('[data-close-mobile-menu]').forEach((el) => el.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
  });
}

function renderNav(active) {
  const links = getProtocolNavData(active);
  const stats = S.exposureStats();
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="logo" aria-hidden="true">
        <div class="logo-icon"><span class="pulse-ring"></span><span class="logo-dot"></span></div>
        <div><div class="logo-title">GHOST</div><div class="logo-sub">PROTOCOL v3.0</div></div>
      </div>
      <div class="sidebar-score">
        ${scoreMarkup(stats)}
      </div>
      <nav class="toolkit-nav" aria-label="Ghost Protocol toolkit navigation">
        <ul class="nav-links">
          ${links.map(([href,num,label]) => `
            <li><a href="${href}" class="nav-link${label===active?' active':''}" data-label="${num}"${label===active?' aria-current="page"':''}><span>${label}</span></a></li>
          `).join('')}
        </ul>
      </nav>
      <div class="sidebar-home" role="navigation" aria-label="Sentinel Check quick links">
        <a href="/learning-hub.html">LEARNING HUB</a>
        <a href="/#contact">FREE CYBER MOT</a>
      </div>`;
  }
  renderMobileProtocolControls(active, links);
  S.updateScoreUI();
}
