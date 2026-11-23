/* Centric Fitness Club: shared script */

/* [CONFIRM] Paste the trial booking link here once the booking software is chosen.
   Every "Try 7 days" / "Start your trial" button on the site uses it. */
const BOOKING_URL = '#book';

document.documentElement.classList.add('js');

// Point every trial button at the booking link
document.querySelectorAll('[data-book]').forEach((a) => {
  a.setAttribute('href', BOOKING_URL);
  if (/^https?:/.test(BOOKING_URL)) { a.target = '_blank'; a.rel = 'noopener'; }
});

// Header shadow once the page scrolls
const header = document.querySelector('[data-header]');
const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const menuBtn = document.querySelector('[data-menu-btn]');
const menu = document.querySelector('[data-menu]');
if (menuBtn && menu) {
  const setOpen = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.menu-btn__label').textContent = open ? 'Close' : 'Menu';
    if (open) document.documentElement.style.setProperty('--menu-top', header.getBoundingClientRect().bottom + 'px');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); menuBtn.focus(); } });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
}

// Gentle fade-in as sections scroll into view
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// Sliding photo gallery: duplicate the slides once so the loop is seamless
const track = document.querySelector('[data-gallery-track]');
if (track) {
  [...track.children].forEach((li) => {
    const copy = li.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
    copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    track.appendChild(copy);
  });
  const gallery = track.closest('.gallery');
  const toggle = document.querySelector('[data-gallery-toggle]');
  toggle && toggle.addEventListener('click', () => {
    const paused = gallery.classList.toggle('is-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.querySelector('[data-gallery-label]').textContent = paused ? 'Play' : 'Pause';
  });
}

// Smooth open/close for the FAQ drop-downs
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.faq details').forEach((d) => {
  const summary = d.querySelector('summary');
  const body = d.querySelector('.faq__body');
  if (!summary || !body || !body.animate) return;
  let anim = null;
  summary.addEventListener('click', (e) => {
    if (reduceMotion.matches) return;
    e.preventDefault();
    if (anim) anim.cancel();
    const opening = !d.open;
    if (opening) d.open = true;
    const full = body.scrollHeight;
    anim = body.animate(
      opening
        ? [{ height: '0px', opacity: 0, transform: 'translateY(-6px)' }, { height: full + 'px', opacity: 1, transform: 'none' }]
        : [{ height: full + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
      { duration: opening ? 420 : 300, easing: 'cubic-bezier(.2,.7,.3,1)' }
    );
    anim.onfinish = () => { if (!opening) d.open = false; anim = null; };
  });
});
