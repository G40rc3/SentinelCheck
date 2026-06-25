

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


  function initLearningHub() {
    var search = document.getElementById('learning-search');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-resource-card]'));
    var filters = Array.prototype.slice.call(document.querySelectorAll('[data-learning-filter]'));
    var count = document.getElementById('resource-count');
    var empty = document.getElementById('resource-empty');

    if (cards.length) {
      var activeFilter = 'all';

      function normalise(value) {
        return String(value || '').toLowerCase().trim();
      }

      function updateResources() {
        var query = normalise(search ? search.value : '');
        var visible = 0;

        cards.forEach(function (card) {
          var category = normalise(card.getAttribute('data-category'));
          var haystack = normalise(card.textContent + ' ' + (card.getAttribute('data-keywords') || ''));
          var filterMatch = activeFilter === 'all' || category === activeFilter;
          var searchMatch = !query || haystack.indexOf(query) !== -1;
          var show = filterMatch && searchMatch;

          card.hidden = !show;
          if (show) { visible += 1; }
        });

        if (count) {
          count.textContent = visible + ' lesson' + (visible === 1 ? '' : 's') + ' shown';
        }
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeFilter = normalise(btn.getAttribute('data-learning-filter')) || 'all';
          filters.forEach(function (otherBtn) {
            otherBtn.classList.remove('active');
            otherBtn.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          updateResources();
        });
      });

      if (search) {
        search.addEventListener('input', updateResources);
      }

      updateResources();
    }

    var checks = Array.prototype.slice.call(document.querySelectorAll('[data-learning-check]'));
    if (checks.length) {
      var storageKey = 'sentinel-learning-checklist';
      var saved = [];

      var scoreEl = document.querySelector('[data-checklist-score]');
      var barEl = document.querySelector('[data-checklist-bar]');
      var meterEl = document.querySelector('[data-checklist-meter]');
      var statusEl = document.querySelector('[data-checklist-status]');
      var guidanceEl = document.querySelector('[data-checklist-guidance]');

      try {
        saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      } catch (err) {
        saved = [];
      }

      function getChecklistState(score) {
        if (score === 0) {
          return {
            label: 'Low concern',
            message: 'No obvious pressure signs detected. Still verify before acting.',
            color: '#22c55e'
          };
        }
        if (score === 1) {
          return {
            label: 'Mild caution',
            message: 'One warning sign is present. Slow down and verify before acting.',
            color: '#84cc16'
          };
        }
        if (score === 2) {
          return {
            label: 'Caution',
            message: 'There are some warning signs here. Pause and verify before clicking, paying, or replying.',
            color: '#eab308'
          };
        }
        if (score === 3) {
          return {
            label: 'High caution',
            message: 'Several scam indicators are present. Do not act until you verify through a trusted route.',
            color: '#f97316'
          };
        }
        if (score === 4) {
          return {
            label: 'Very high caution',
            message: 'This message shows strong warning signs. Avoid using links or contact details inside it.',
            color: '#ef4444'
          };
        }
        return {
          label: 'Extreme caution',
          message: 'Multiple scam indicators are present. Treat this as suspicious until proven legitimate.',
          color: '#dc2626'
        };
      }

      function updateChecklistFeedback() {
        var active = [];

        checks.forEach(function (item, itemIndex) {
          if (item.checked) {
            active.push(itemIndex);
          }
        });

        var score = active.length;
        var percentage = checks.length ? (score / checks.length) * 100 : 0;
        var state = getChecklistState(score);

        if (scoreEl) {
          scoreEl.textContent = score + ' / ' + checks.length;
        }

        if (barEl) {
          barEl.style.width = percentage + '%';
          barEl.style.background = state.color;
        }

        if (meterEl) {
          meterEl.setAttribute('aria-valuenow', String(score));
        }

        if (statusEl) {
          statusEl.textContent = state.label;
        }

        if (guidanceEl) {
          guidanceEl.textContent = state.message;
        }

        try {
          localStorage.setItem(storageKey, JSON.stringify(active));
        } catch (err) {
          // If localStorage is blocked, the checklist still works for this page view.
        }
      }

      checks.forEach(function (checkbox, index) {
        checkbox.checked = saved.indexOf(index) !== -1;
        checkbox.addEventListener('change', updateChecklistFeedback);
      });

      var reset = document.querySelector('[data-reset-checklist]');
      if (reset) {
        reset.addEventListener('click', function () {
          checks.forEach(function (checkbox) {
            checkbox.checked = false;
          });
          try {
            localStorage.removeItem(storageKey);
          } catch (err) {
            // Ignore storage errors.
          }
          updateChecklistFeedback();
        });
      }

      updateChecklistFeedback();
    }
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
    initLearningHub();
    initNavCurrent();
  });

}());
