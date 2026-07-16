(function () {
  'use strict';

  var STORAGE_KEY = 'mtdProtoScenarios';

  function getScenarios() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveScenarios(scenarios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  }

  function applyScenarios() {
    var scenarios = getScenarios();

    document.querySelectorAll('[data-show-when]').forEach(function (el) {
      el.hidden = !scenarios[el.getAttribute('data-show-when')];
    });

    document.querySelectorAll('[data-hide-when]').forEach(function (el) {
      el.hidden = !!scenarios[el.getAttribute('data-hide-when')];
    });
  }

  function initPanel() {
    var panel = document.getElementById('proto-panel');
    if (!panel) return;

    var toggleBtn = document.getElementById('proto-panel-toggle');
    var body = document.getElementById('proto-panel-body');
    var scenarios = getScenarios();

    // Sync checkboxes with stored state
    panel.querySelectorAll('.proto-panel__checkbox').forEach(function (checkbox) {
      var key = checkbox.getAttribute('data-scenario');
      checkbox.checked = !!scenarios[key];

      checkbox.addEventListener('change', function () {
        var current = getScenarios();
        current[key] = this.checked;
        saveScenarios(current);
        applyScenarios();
      });
    });

    // Open / close panel
    toggleBtn.addEventListener('click', function () {
      var isOpen = !body.hidden;
      body.hidden = isOpen;
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    initIterationSelect(panel);
    applyScenarios();
  }

  function initIterationSelect(panel) {
    var select = panel.querySelector('#proto-panel-iteration-select');
    if (!select) return;

    var current = window.location.pathname;
    Array.prototype.forEach.call(select.options, function (option) {
      if (option.value === current) {
        option.selected = true;
      }
    });

    select.addEventListener('change', function () {
      if (this.value) {
        window.location.href = this.value;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyScenarios();
    initPanel();
  });
  })();