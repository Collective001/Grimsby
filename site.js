// Session-only admission; no persistent cookies or localStorage.
(() => {
  const root = document.documentElement;
  const screen = document.querySelector('.entrance-screen');
  const folio = document.querySelector('.site-folio');
  const enter = screen.querySelector('.entrance-enter');
  let returnFocus = null;
  let closing = false;
  const open = (trigger = null) => {
    if (closing) return;
    returnFocus = trigger;
    screen.hidden = false;
    root.classList.add('entrance-pending');
    folio.inert = true;
    folio.setAttribute('aria-hidden', 'true');
    screen.scrollTop = 0;
    screen.focus({ preventScroll: true });
  };
  const finish = () => {
    screen.hidden = true;
    root.classList.remove('entrance-leaving');
    folio.inert = false;
    folio.removeAttribute('aria-hidden');
    closing = false;
    (returnFocus || document.querySelector('#main')).focus({ preventScroll: true });
  };
  const close = () => {
    if (closing || !root.classList.contains('entrance-pending')) return;
    closing = true;
    try { sessionStorage.setItem('grimsby-entered', 'yes'); } catch (_) { /* Admission still works if storage is blocked. */ }
    root.classList.remove('entrance-pending');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
    } else {
      root.classList.add('entrance-leaving');
      window.setTimeout(finish, 450);
    }
  };
  enter.addEventListener('click', close);
  document.querySelectorAll('[data-open-invitation]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(link);
    });
  });
  screen.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const links = [...screen.querySelectorAll('a[href], button:not([disabled])')];
    const first = links[0];
    const last = links[links.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === screen)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === screen)) {
      event.preventDefault(); first.focus();
    }
  });
  if (root.classList.contains('entrance-pending')) open();
  else screen.hidden = true;
  // Reconcile pages restored by browser Back/Forward with the current session.
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    try {
      if (sessionStorage.getItem('grimsby-entered') === 'yes') {
        root.classList.remove('entrance-pending', 'entrance-leaving');
        screen.hidden = true;
        folio.inert = false;
        folio.removeAttribute('aria-hidden');
        closing = false;
      }
    } catch (_) {}
  });
})();

// The map moves once on arrival, or when explicitly replayed. Reading needs no JS.
const sheet = document.querySelector('.map-sheet');
if (sheet) {
  const play = () => { sheet.classList.remove('play'); void sheet.offsetWidth; sheet.classList.add('play'); };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(items => {
      if (items.some(item => item.isIntersecting)) { play(); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(sheet);
  } else play();
  sheet.querySelector('.replay').addEventListener('click', play);
}
