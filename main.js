/**
 * main.js - Sentinel Check
 *
 * SECURITY NOTES:
 * - No eval(), Function(), setTimeout(string), or dynamic code execution
 * - No innerHTML assignments (DOM-based XSS vector)
 * - All DOM interaction uses safe APIs: hidden, setAttribute, textContent
 * - No external requests (fetch, XHR, WebSocket)
 * - No localStorage / sessionStorage usage (no sensitive data stored client-side)
 * - No third-party scripts or dynamic script injection
 * - Event delegation used safely with explicit target validation
 * - 'use strict' enforced to prevent accidental global variable creation
 */

'use strict';

(function () {

  /**
   * FAQ ACCORDION
   *
   * Uses aria-expanded and the hidden attribute (not CSS display toggling)
   * so assistive technologies correctly announce state changes.
   * Validates that the controlled element exists before operating on it.
   */
  function initFAQ() {
    var buttons = document.querySelectorAll('.faq-q');

    if (!buttons.length) {
      return;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {

        // Read current state
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';

        // Collapse all panels first
        buttons.forEach(function (otherBtn) {
          var controlledId = otherBtn.getAttribute('aria-controls');
          if (!controlledId) { return; }

          // Validate the ID contains only safe characters before using as selector
          if (!/^[a-zA-Z0-9_-]+$/.test(controlledId)) { return; }

          var panel = document.getElementById(controlledId);
          if (panel) {
            otherBtn.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
          }
        });

        // If this panel was closed, open it
        if (!isExpanded) {
          var targetId = btn.getAttribute('aria-controls');
          if (!targetId) { return; }

          // Validate ID before use
          if (!/^[a-zA-Z0-9_-]+$/.test(targetId)) { return; }

          var target = document.getElementById(targetId);
          if (target) {
            btn.setAttribute('aria-expanded', 'true');
            target.hidden = false;
          }
        }
      });
    });
  }

  /**
   * Initialise on DOMContentLoaded.
   * Using a named IIFE with DOMContentLoaded avoids polluting the global scope.
   */
  document.addEventListener('DOMContentLoaded', function () {
    initFAQ();
  });

}());
