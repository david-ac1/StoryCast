(function () {
  'use strict';

  var video = document.querySelector('.story-video');
  var search = document.querySelector('#transcript-search');
  var lines = Array.from(document.querySelectorAll('.transcript__line'));

  if (!video || !search || !lines.length) {
    return;
  }

  function setCurrentLine() {
    var currentTime = video.currentTime;

    lines.forEach(function (line) {
      var isCurrent = currentTime >= Number(line.dataset.start) && currentTime < Number(line.dataset.end);
      line.classList.toggle('transcript__line--current', isCurrent);
      line.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });
  }

  lines.forEach(function (line) {
    var timestamp = line.querySelector('.transcript__timestamp');

    timestamp.addEventListener('click', function () {
      video.currentTime = Number(line.dataset.start);
      video.play().catch(function () {
        video.focus();
      });
    });
  });

  search.addEventListener('input', function () {
    var query = search.value.trim().toLowerCase();

    lines.forEach(function (line) {
      line.hidden = query !== '' && !line.textContent.toLowerCase().includes(query);
    });
  });

  video.addEventListener('timeupdate', setCurrentLine);
  setCurrentLine();
}());