// Keep the help docs and www.ferrin.app on the same theme. Both live on the same address (the docs are served at
// www.ferrin.app/help), so they share browser storage:
//   the website stores its choice in "ferrin-theme" ("light" | "dark", absent = follow the system)
//   Mintlify stores its own in "isDarkMode" ("light" | "dark" | "system")
// On load, the docs take the website's choice; when someone switches theme in the docs, the website follows.
// (Mintlify loads every .js file in this folder on every page.)
(function () {
  var SITE = 'ferrin-theme';
  var DOCS = 'isDarkMode';

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // Website → docs: press the docs' own switch so Mintlify updates properly
  function applySiteChoice(triesLeft) {
    var site = read(SITE);
    var want = site === 'light' || site === 'dark' ? site : 'system';
    if (read(DOCS) === want) return;
    var button = document.querySelector('button[aria-label="Switch to ' + want + ' theme"]');
    if (button) button.click();
    else if (triesLeft > 0) setTimeout(function () { applySiteChoice(triesLeft - 1); }, 150);
  }

  // Docs → website: mirror any switch made here
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('button[aria-label^="Switch to "][aria-label$=" theme"]');
    if (!button) return;
    var choice = button.getAttribute('aria-label').replace('Switch to ', '').replace(' theme', '');
    try {
      if (choice === 'light' || choice === 'dark') localStorage.setItem(SITE, choice);
      else if (choice === 'system') localStorage.removeItem(SITE);
    } catch (e) { /* private browsing: the choice just isn't shared */ }
  }, true);

  applySiteChoice(20);
})();
