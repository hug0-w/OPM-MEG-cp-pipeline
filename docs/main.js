// Small enhancements for the project page. The page works without them.

// Render LaTeX once KaTeX has loaded.
window.addEventListener('load', () => {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    });
  }
});

// Sticky nav: show once the hero has scrolled away, highlight the current section.
(() => {
  const nav = document.getElementById('topnav');
  const hero = document.querySelector('.hero');
  if (!nav || !hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => nav.classList.toggle('show', !e.isIntersecting), { threshold: 0 }).observe(hero);

  const links = [...nav.querySelectorAll('.topnav-links a')];
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        byId.get(e.target.id)?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
})();

// Result tabs, with arrow-key support.
(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });
})();

// Copy buttons.
document.querySelectorAll('.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = document.getElementById(btn.dataset.copy).innerText;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch {
      btn.textContent = 'Press Ctrl+C';
      const r = document.createRange();
      r.selectNodeContents(document.getElementById(btn.dataset.copy));
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
  });
});

// Click a figure to see it full screen.
(() => {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const img = box.querySelector('img');
  const close = () => { box.hidden = true; img.removeAttribute('src'); };
  document.querySelectorAll('.zoomable img').forEach(el => {
    el.addEventListener('click', () => {
      img.src = el.currentSrc || el.src;
      img.alt = el.alt;
      box.hidden = false;
    });
  });
  box.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) close(); });
})();
