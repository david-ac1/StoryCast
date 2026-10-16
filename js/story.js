(function () {
  'use strict';

  var video = document.querySelector('.story-video');
  var search = document.querySelector('#transcript-search');
  var durationLabel = document.querySelector('[data-duration]');
  var lines = Array.from(document.querySelectorAll('.transcript__line'));

  if (!video || !search || !lines.length) {
    return;
  }

  function formatTime(seconds) {
    var safeSeconds = Math.max(0, seconds);
    var minutes = Math.floor(safeSeconds / 60);
    var wholeSeconds = Math.floor(safeSeconds % 60);
    var hundredths = String(Math.round((safeSeconds % 1) * 100)).padStart(2, '0');
    return String(minutes).padStart(2, '0') + ':' + String(wholeSeconds).padStart(2, '0') + '.' + hundredths;
  }

  function setCurrentLine() {
    var currentTime = video.currentTime;

    lines.forEach(function (line) {
      var isCurrent = currentTime >= Number(line.dataset.start) && currentTime < Number(line.dataset.end);
      line.classList.toggle('transcript__line--current', isCurrent);
      line.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });
  }

  function syncTranscriptToVideo() {
    var referenceDuration = 971.788481;
    var scale = video.duration / referenceDuration;

    if (!Number.isFinite(scale) || scale <= 0) {
      return;
    }

    if (durationLabel) {
      durationLabel.textContent = formatTime(video.duration);
    }

    lines.forEach(function (line) {
      var start = Number(line.dataset.referenceStart) * scale;
      var end = Number(line.dataset.referenceEnd) * scale;
      var timestamp = line.querySelector('.transcript__timestamp');

      line.dataset.start = String(start);
      line.dataset.end = String(end);
      timestamp.textContent = formatTime(start) + '–' + formatTime(end);
      timestamp.setAttribute('aria-label', 'Play from ' + formatTime(start));
    });

    setCurrentLine();
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

  video.addEventListener('loadedmetadata', syncTranscriptToVideo);
  video.addEventListener('durationchange', syncTranscriptToVideo);
  video.addEventListener('timeupdate', setCurrentLine);
  if (video.readyState >= 1) {
    syncTranscriptToVideo();
  }
  setCurrentLine();
}());