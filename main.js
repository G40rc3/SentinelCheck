
  function initFAQ() {
    var buttons = document.querySelectorAll('.faq-q');

    if (!buttons.length) {
      return;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {


        var isExpanded = btn.getAttribute('aria-expanded') === 'true';


        buttons.forEach(function (otherBtn) {
          var controlledId = otherBtn.getAttribute('aria-controls');
          if (!controlledId) { return; }


          if (!/^[a-zA-Z0-9_-]+$/.test(controlledId)) { return; }

          var panel = document.getElementById(controlledId);
          if (panel) {
            otherBtn.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
          }
        });

 
        if (!isExpanded) {
          var targetId = btn.getAttribute('aria-controls');
          if (!targetId) { return; }


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


  document.addEventListener('DOMContentLoaded', function () {
    initFAQ();
  });

}());
