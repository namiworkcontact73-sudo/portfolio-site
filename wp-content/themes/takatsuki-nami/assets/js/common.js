(function() {
  'use strict';

  var tagMap = {
    0:  'all',
    31: 'tag-works-web',
    32: 'tag-works-sns',
    33: 'tag-works-icon'
  };

  var MAX_ALL = 6;

  /* pf-hidden: Bootstrapの!importantを上書きして非表示 */
  var style = document.createElement('style');
  style.textContent = [
    '#portfolio-items [data-tag].pf-hidden { display: none !important; }',
    '#pf-spinner-overlay {',
    '  position: absolute; inset: 0;',
    '  display: flex; align-items: center; justify-content: center;',
    '  background: rgba(255,255,255,0.7);',
    '  z-index: 10;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function() {
    var filterButtons = document.querySelectorAll('.portfolio-filter__btn');
    var container     = document.getElementById('portfolio-items');
    var items         = Array.from(container.querySelectorAll('[data-tag]'));

    /* コンテナを position:relative に */
    container.style.position = 'relative';

    /* スピナー要素を一度だけ作成 */
    var overlay = document.createElement('div');
    overlay.id  = 'pf-spinner-overlay';
    var spinner = document.createElement('div');
    spinner.className = 'portfolio-loading-spinner';
    overlay.appendChild(spinner);

    function showSpinner() {
      container.appendChild(overlay);
    }
    function hideSpinner() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    function applyFilter(tag) {
      var count = 0;
      items.forEach(function(item) {
        var match;
        if (tag === 'all') {
          match = count < MAX_ALL;
          if (match) count++;
        } else {
          match = item.getAttribute('data-tag') === tag;
        }
        if (match) {
          item.classList.remove('pf-hidden');
        } else {
          item.classList.add('pf-hidden');
        }
      });
    }

    /* 初期状態：全て表示で最大6件 */
    applyFilter('all');

    filterButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        var tagId = parseInt(this.getAttribute('data-tag-id'), 10);
        var tag   = tagMap[tagId] || 'all';

        filterButtons.forEach(function(btn) {
          btn.classList.remove('portfolio-filter__btn--active');
        });
        this.classList.add('portfolio-filter__btn--active');

        showSpinner();
        setTimeout(function() {
          applyFilter(tag);
          hideSpinner();
        }, 400);
      });
    });
  });
})();
