(function () {
  'use strict';

  var filters = Array.from(document.querySelectorAll('[data-filter]'));
  var stories = Array.from(document.querySelectorAll('[data-media-type]'));
  var results = document.querySelector('[data-archive-results]');

  if (!filters.length || !stories.length || !results) {
    return;
  }

  filters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      var selectedType = filter.dataset.filter;
      var visibleCount = 0;

      filters.forEach(function (item) {
        item.setAttribute('aria-pressed', item === filter ? 'true' : 'false');
      });

      stories.forEach(function (story) {
        var isVisible = selectedType === 'all' || story.dataset.mediaType === selectedType;
        story.hidden = !isVisible;
        visibleCount += isVisible ? 1 : 0;
      });

      results.textContent = 'Showing ' + visibleCount + ' stories';
    });
  });
}());