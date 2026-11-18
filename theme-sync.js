// Keep the help docs and www.ferrin.app on the same theme. Both live on the same address (the docs are served at
// www.ferrin.app/help), so they share browser storage:
//   the website stores its choice in "ferrin-theme": "light" | "dark" (absent = dark, the default for everyone)
//   Mintlify stores its own in "isDarkMode": "light" | "dark" | "system"
// Two themes only, like the website: there's no "System" (follow the device) option. On load, the docs take the
// website's choice (dark unless the visitor picked light); when someone switches theme in the docs, the website
// follows. Mintlify's theme switch is a menu in the header; each option contains the text "Switch to <x> theme".
// The System option is hidden, and treated as Dark if it's ever picked. (Mintlify loads every .js file in this
// folder on every page.)
(function () {
  var SITE = 'ferrin-theme';
  var DOCS = 'isDarkMode';

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // Tell Mintlify to use a theme: save it where Mintlify keeps it and announce the change. Mintlify's theme system
  // listens for this (it's how it keeps tabs in sync), so it switches itself, no menu needed.
  function setDocs(want) {
    if (read(DOCS) === want) return;
    try { localStorage.setItem(DOCS, want); } catch (e) { return; }
    window.dispatchEvent(new StorageEvent('storage', { key: DOCS, newValue: want, storageArea: localStorage }));
  }

  // Website → docs
  function applySiteChoice() {
    setDocs(read(SITE) === 'light' ? 'light' : 'dark');
  }

  // Docs → website: mirror any switch made in the docs' menu
  document.addEventListener('click', function (event) {
    var item = event.target.closest && event.target.closest('[role="menuitem"]');
    if (!item) return;
    var match = item.textContent.match(/Switch to (system|light|dark) theme/);
    if (!match) return;
    var choice = match[1] === 'light' ? 'light' : 'dark';   // "system" isn't offered; if picked, it's dark
    try { localStorage.setItem(SITE, choice); } catch (e) { /* private browsing: the choice just isn't shared */ }
    if (match[1] === 'system') setTimeout(function () { setDocs('dark'); }, 0);
  }, true);

  // Hide the menu's System option whenever the menu opens
  function hideSystem(root) {
    var items = (root || document).querySelectorAll('[role="menuitem"]');
    for (var i = 0; i < items.length; i++) {
      if (/Switch to system theme/.test(items[i].textContent)) items[i].style.display = 'none';
    }
  }
  new MutationObserver(function () { hideSystem(); }).observe(document.documentElement, { childList: true, subtree: true });

  applySiteChoice();
})();
