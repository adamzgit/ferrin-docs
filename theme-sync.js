// Keep the help docs and www.ferrin.app on the same theme. Both live on the same address (the docs are served at
// www.ferrin.app/help), so they share browser storage:
//   the website stores its choice in "ferrin-theme" ("light" | "dark", absent = follow the system)
//   Mintlify stores its own in "isDarkMode" ("light" | "dark" | "system")
// On load, the docs take the website's choice; when someone switches theme in the docs, the website follows.
// Mintlify's theme switch is a menu in the header (System / Light / Dark); each option contains the text
// "Switch to <x> theme". (Mintlify loads every .js file in this folder on every page.)
(function () {
  var SITE = 'ferrin-theme';
  var DOCS = 'isDarkMode';

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // Website → docs: save the choice where Mintlify keeps it and announce the change. Mintlify's theme system
  // listens for this (it's how it keeps tabs in sync), so it switches itself, no menu needed.
  function applySiteChoice() {
    var site = read(SITE);
    var want = site === 'light' || site === 'dark' ? site : 'system';
    if (read(DOCS) === want) return;
    try { localStorage.setItem(DOCS, want); } catch (e) { return; }
    window.dispatchEvent(new StorageEvent('storage', { key: DOCS, newValue: want, storageArea: localStorage }));
  }

  // Docs → website: mirror any switch made in the docs' menu
  document.addEventListener('click', function (event) {
    var item = event.target.closest && event.target.closest('[role="menuitem"]');
    if (!item) return;
    var match = item.textContent.match(/Switch to (system|light|dark) theme/);
    if (!match) return;
    try {
      if (match[1] === 'system') localStorage.removeItem(SITE);
      else localStorage.setItem(SITE, match[1]);
    } catch (e) { /* private browsing: the choice just isn't shared */ }
  }, true);

  applySiteChoice();
})();
