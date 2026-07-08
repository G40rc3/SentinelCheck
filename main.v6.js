

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



  function initSingularityShowcase() {
    var canvas = document.getElementById('sentinel-singularity-canvas');
    if (!canvas) { return; }

    var card = document.querySelector('[data-singularity-card]') || canvas.parentNode;
    var ctx = canvas.getContext('2d');
    if (!ctx || !card) { return; }

    var titleEl = document.getElementById('singularity-main-title');
    var statusEl = document.getElementById('singularity-status-text');
    var signalEl = document.getElementById('singularity-signal-val');
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var states = [
      { title: 'Unmonitored', status: 'Risk: Elevated', signal: 'Scattered', color: '#c99b47', calm: 0.08 },
      { title: 'Sense Check', status: 'Risk: Reviewing', signal: 'Resolving', color: '#00e3d0', calm: 0.55 },
      { title: 'Protected', status: 'Risk: Low', signal: 'Steady', color: '#2edba0', calm: 1 }
    ];

    var stateIndex = 0;
    var targetCalm = states[0].calm;
    var currentCalm = targetCalm;
    var currentColor = hexToRgb(states[0].color);
    var width = 0;
    var height = 0;
    var dpr = 1;
    var rafId = 0;
    var isVisible = true;

    var particles = [];
    var particleCount = 560;
    for (var i = 0; i < particleCount; i += 1) {
      particles.push({
        offset: Math.random(),
        speed: 0.025 + Math.random() * 0.045,
        band: (Math.random() - 0.5) * 2,
        radius: 42 + Math.random() * 150,
        angle: Math.random() * Math.PI * 2,
        size: 0.6 + Math.random() * 1.8,
        depth: 0.35 + Math.random() * 0.65
      });
    }

    function hexToRgb(hex) {
      var clean = String(hex || '#00e3d0').replace('#', '');
      var num = parseInt(clean, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    }

    function ease(value) {
      var v = Math.max(0, Math.min(1, value));
      return v * v * (3 - 2 * v);
    }

    function setState(nextIndex) {
      var state = states[nextIndex];
      targetCalm = state.calm;
      currentColor = hexToRgb(state.color);

      if (titleEl) { titleEl.textContent = state.title; }
      if (statusEl) {
        statusEl.textContent = state.status;
        statusEl.style.color = state.color;
        statusEl.style.borderColor = state.color;
        statusEl.style.background = 'rgba(' + currentColor.r + ', ' + currentColor.g + ', ' + currentColor.b + ', 0.08)';
      }
      if (signalEl) { signalEl.textContent = state.signal; }
    }

    function cycleState() {
      stateIndex = (stateIndex + 1) % states.length;
      setState(stateIndex);
    }

    function resize() {
      var rect = card.getBoundingClientRect();
      width = Math.max(320, Math.floor(rect.width));
      height = Math.max(300, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now() * 0.001);
    }

    function drawGrid(cx, cy, time) {
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1;

      for (var i = 0; i < 9; i += 1) {
        var y = (height * 0.18) + (i * height * 0.08);
        var wobble = Math.sin(time * 0.35 + i) * 16;
        ctx.beginPath();
        ctx.moveTo(width * 0.05, y);
        ctx.quadraticCurveTo(width * 0.38, y + wobble, cx - 26, cy + (i - 4) * 10);
        ctx.strokeStyle = 'rgba(0, 227, 208, 0.18)';
        ctx.stroke();
      }

      ctx.globalAlpha = 0.11;
      for (var r = 58; r <= 210; r += 38) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.34, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawCore(cx, cy, time) {
      var pulse = 1 + Math.sin(time * 1.6) * 0.035;
      var glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, 150 * pulse);
      glow.addColorStop(0, 'rgba(0, 227, 208, 0.36)');
      glow.addColorStop(0.34, 'rgba(0, 227, 208, 0.12)');
      glow.addColorStop(1, 'rgba(0, 227, 208, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 160 * pulse, 0, Math.PI * 2);
      ctx.fill();

      var core = ctx.createRadialGradient(cx - 14, cy - 16, 4, cx, cy, 54);
      core.addColorStop(0, 'rgba(234, 242, 239, 0.88)');
      core.addColorStop(0.28, 'rgba(0, 227, 208, 0.72)');
      core.addColorStop(1, 'rgba(13, 27, 42, 0.95)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 34 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(0, 227, 208, 0.62)';
      ctx.beginPath();
      ctx.arc(cx, cy, 43 * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawParticle(p, time, cx, cy) {
      var progress = (time * p.speed + p.offset) % 1;
      var x;
      var y;
      var angle;
      var lane = p.band * height * 0.33;

      if (progress < 0.62) {
        var travel = ease(progress / 0.62);
        var wave = Math.sin(progress * 9 + p.offset * Math.PI * 2) * 24 * (1 - currentCalm);
        x = -34 + (cx - p.radius * 0.65 + 34) * travel;
        y = cy + lane * (1 - travel * 0.74) + wave;
        angle = Math.atan2(cy - y, cx - x);
      } else {
        var orbit = (progress - 0.62) / 0.38;
        var orbitAngle = p.angle + orbit * Math.PI * 2 + time * (0.28 + currentCalm * 0.15);
        var radius = p.radius * (1 - currentCalm * 0.22);
        x = cx + Math.cos(orbitAngle) * radius;
        y = cy + Math.sin(orbitAngle) * radius * (0.36 - currentCalm * 0.06) + p.band * 7 * currentCalm;
        angle = orbitAngle + Math.PI / 2;
      }

      var fadeIn = ease(Math.min(progress * 6, 1));
      var fadeOut = ease(Math.min((1 - progress) * 7, 1));
      var alpha = (0.12 + p.depth * 0.38) * fadeIn * fadeOut;
      var length = 10 + p.depth * 22 + currentCalm * 10;

      ctx.strokeStyle = 'rgba(' + currentColor.r + ', ' + currentColor.g + ', ' + currentColor.b + ', ' + alpha + ')';
      ctx.lineWidth = Math.max(0.7, p.size * 0.65);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length);
      ctx.stroke();

      if (p.depth > 0.76) {
        ctx.fillStyle = 'rgba(234, 242, 239, ' + (alpha * 0.75) + ')';
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function draw(timestamp) {
      if (!width || !height) { return; }
      var time = timestamp || 0;
      currentCalm += (targetCalm - currentCalm) * 0.015;
      var cx = width * 0.68;
      var cy = height * 0.5;

      ctx.clearRect(0, 0, width, height);
      var bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, 'rgba(5, 9, 13, 0.98)');
      bg.addColorStop(0.48, 'rgba(6, 16, 26, 0.96)');
      bg.addColorStop(1, 'rgba(3, 8, 13, 0.98)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      drawGrid(cx, cy, time);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < particles.length; i += 1) {
        drawParticle(particles[i], time, cx, cy);
      }
      drawCore(cx, cy, time);
      ctx.restore();

      if (!prefersReducedMotion && isVisible && !document.hidden) {
        rafId = window.requestAnimationFrame(function (next) {
          draw(next * 0.001);
        });
      }
    }

    function start() {
      if (rafId || prefersReducedMotion) { return; }
      rafId = window.requestAnimationFrame(function (timestamp) {
        draw(timestamp * 0.001);
      });
    }

    function stop() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); }
      else if (isVisible) { start(); }
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible) { start(); }
          else { stop(); }
        });
      }, { threshold: 0.08 });
      observer.observe(card);
    }

    setState(0);
    resize();
    if (!prefersReducedMotion) {
      window.setInterval(cycleState, 11000);
      start();
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
    initSingularityShowcase();
    initNavCurrent();
  });

}());
