// Links in the help docs: anything on Ferrin (www.ferrin.app, including the help docs themselves) opens in the same
// tab, since the docs are part of the website; anything on another site opens in a new tab. Mintlify opens every
// absolute link in a new tab and has no setting for it, so one click listener (capture phase, before Mintlify's own)
// decides. Mintlify loads every .js file in this folder on every page (like theme-sync.js).
(function () {
  var FERRIN = ['www.ferrin.app', 'ferrin.app', location.host];

  document.addEventListener('click', function (e) {
    // Leave cmd/ctrl/shift/middle clicks alone: the visitor chose where it opens
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a) return;
    var url;
    try { url = new URL(a.getAttribute('href'), location.href); } catch (err) { return; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;   // mailto: and the like

    var ferrin = FERRIN.indexOf(url.host) !== -1;
    var newTab = a.target === '_blank';

    if (ferrin && newTab) {
      e.preventDefault();
      e.stopPropagation();
      location.assign(url.href);
    } else if (!ferrin && !newTab) {
      e.preventDefault();
      e.stopPropagation();
      window.open(url.href, '_blank', 'noopener,noreferrer');
    }
  }, true);
})();
