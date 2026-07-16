(function () {
  'use strict';

  function initModals() {
    document.querySelectorAll('[data-open-modal]').forEach(function (openBtn) {
      var dialog = document.getElementById(openBtn.getAttribute('data-open-modal'));
      if (!dialog) return;

      openBtn.addEventListener('click', function () {
        dialog.showModal();
      });

      dialog.querySelectorAll('[data-close-modal]').forEach(function (closeBtn) {
        closeBtn.addEventListener('click', function () {
          dialog.close();
        });
      });

      // Close when clicking the backdrop (a click that lands on the dialog itself, not its content)
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) {
          dialog.close();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initModals);
})();
