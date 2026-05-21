

'use strict';

(function () {


  function initFAQ() {
    var buttons = document.querySelectorAll('.faq-q');
    if (!buttons.length) { return; }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';

 
        buttons.forEach(function (otherBtn) {
          var controlledId = otherBtn.getAttribute('aria-controls');
          if (!controlledId || !/^[a-zA-Z0-9_-]+$/.test(controlledId)) { return; }
          var panel = document.getElementById(controlledId);
          if (panel) {
            otherBtn.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
          }
        });

        // Open this panel if it was closed
        if (!isExpanded) {
          var targetId = btn.getAttribute('aria-controls');
          if (!targetId || !/^[a-zA-Z0-9_-]+$/.test(targetId)) { return; }
          var target = document.getElementById(targetId);
          if (target) {
            btn.setAttribute('aria-expanded', 'true');
            target.hidden = false;
          }
        }
      });
    });
  }


  function initNavCurrent() {
    var navLinks = document.querySelectorAll('.navbar nav a[href^="#"]');
    if (!navLinks.length) { return; }

    var sections = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) { return; }
      var el = document.getElementById(id);
      if (el) { sections.push({ link: link, el: el }); }
    });

    if (!sections.length) { return; }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        sections.forEach(function (s) {
          s.link.removeAttribute('aria-current');
        });
        var active = sections.find(function (s) { return s.el === entry.target; });
        if (active) { active.link.setAttribute('aria-current', 'page'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s.el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFAQ();
    initNavCurrent();
  });

}());
