const S = {
  exposureMax: 18,
  get(k, def) {
    try { const v = localStorage.getItem('gp_' + k); return v !== null ? JSON.parse(v) : def; } catch { return def; }
  },
  set(k, v) { try { localStorage.setItem('gp_' + k, JSON.stringify(v)); } catch {} },
  remove(k) { try { localStorage.removeItem('gp_' + k); } catch {} },
  clearAll() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('gp_'))
        .forEach(key => localStorage.removeItem(key));
    } catch {}
  },
  auditFindings() {
    return S.get('auditFindings', []);
  },
  fixedRisks() {
    return S.get('fixedRisks', {});
  },
  exposureStats() {
    const total = S.exposureMax;
    const auditDone = !!S.get('auditDone', false);
    const findings = S.auditFindings().filter(f => f && f.id);
    const fixed = S.fixedRisks();
    const active = findings.filter(f => !fixed[f.id]);
    const initial = Math.min(total, findings.length);
    const current = Math.min(total, active.length);
    const fixedCount = Math.max(0, initial - current);
    const percent = total ? Math.round((current / total) * 100) : 0;
    const topPriorities = active
      .slice()
      .sort((a, b) => (a.sev === b.sev ? 0 : a.sev === 'high' ? -1 : 1))
      .slice(0, 2)
      .map(f => f.short || f.title);

    let level = 'Audit not started';
    let className = 'muted';
    let stroke = 'var(--text3)';
    let feedback = 'Answer the 18 checks, then run the audit to calculate your exposure score.';

    if (auditDone) {
      if (current <= 3) {
        level = 'Low exposure';
        className = 'ok';
        stroke = 'var(--green)';
        feedback = current === 0
          ? 'No active audit risks remain. Keep reviewing accounts, backups, and exposure regularly.'
          : 'A few low-count risks remain. Finish the highest-impact fixes and review again monthly.';
      } else if (current <= 7) {
        level = 'Moderate exposure';
        className = 'warn';
        stroke = 'var(--amber)';
        feedback = 'Several areas still need attention. Start with account, email, password, and 2FA fixes first.';
      } else if (current <= 12) {
        level = 'High exposure';
        className = 'danger';
        stroke = 'var(--red)';
        feedback = 'Multiple selected risks could increase compromise, tracking, scams, or data leak exposure.';
      } else {
        level = 'Critical exposure';
        className = 'danger';
        stroke = 'var(--red)';
        feedback = 'Broad exposure detected. Fix account recovery, passwords, 2FA, broker exposure, and public profiles first.';
      }
    }

    return { total, auditDone, findings, active, initial, current, fixedCount, percent, level, className, stroke, feedback, topPriorities };
  },
  score() {
    return S.exposureStats().current;
  },
  toggleRiskFixed(id) {
    const fixed = S.fixedRisks();
    fixed[id] = !fixed[id];
    S.set('fixedRisks', fixed);
    return fixed[id];
  },
  updateScoreUI() {
    const stats = S.exposureStats();
    const el = document.getElementById('scoreCircle');
    const txt = document.getElementById('scoreText');
    const sta = document.getElementById('scoreStatus');
    const fb = document.getElementById('scoreFeedback');
    const meta = document.getElementById('scoreMeta');
    if (!el) return;

    const circ = 213.6;
    el.style.strokeDashoffset = (circ - circ * stats.percent / 100).toFixed(1);
    el.style.stroke = stats.stroke;
    if (txt) txt.textContent = stats.current + '/' + stats.total;
    if (sta) sta.textContent = stats.level;
    if (fb) {
      const priority = stats.topPriorities.length
        ? ' Next: ' + stats.topPriorities.join(' + ') + '.'
        : '';
      fb.textContent = stats.feedback + priority;
    }
    if (meta) {
      meta.textContent = stats.auditDone
        ? 'Initial ' + stats.initial + ' | Fixed ' + stats.fixedCount
        : 'Ready to run audit';
    }
  }
};


/* Light accessibility helpers for Ghost Protocol.
   Keeps ARIA targeted: navigation/current state plus icon/checklist controls. */
(function () {
  function enhanceGhostProtocolAccessibility(root) {
    const scope = root || document;

    scope.querySelectorAll('.site-divider, .mod-glyph, .stat-icon').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
    });

    scope.querySelectorAll('button').forEach((button) => {
      if (!button.hasAttribute('type')) button.setAttribute('type', 'button');

      const text = (button.textContent || '').trim();
      const onclick = button.getAttribute('onclick') || '';

      if (!button.hasAttribute('aria-label')) {
        if (text === '✕') {
          button.setAttribute('aria-label', 'Remove item');
        } else if ((text === '✓' || text === '') && /toggle|markDone|toggleRead/.test(onclick)) {
          button.setAttribute('aria-label', 'Toggle checklist item');
        }
      }

      if (!button.hasAttribute('aria-pressed') && /toggle|markDone|toggleRead/.test(onclick)) {
        button.setAttribute('aria-pressed', text === '✓' ? 'true' : 'false');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    enhanceGhostProtocolAccessibility(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) enhanceGhostProtocolAccessibility(node);
        });
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
})();
