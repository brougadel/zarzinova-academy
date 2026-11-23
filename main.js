/* Zarzinova Academy — comportements communs : menu mobile, encart arabe, apparitions, compteurs, lien actif */
{
  const $ = id => document.getElementById(id);

  // Menu mobile
  const btn = $('menuBtn'), nav = $('mobileNav'), ic = $('menuIcon');
  if (btn && nav) {
    const setMenu = o => { nav.classList.toggle('hidden', !o); btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu'); ic.setAttribute('d', o ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'); };
    btn.addEventListener('click', () => setMenu(nav.classList.contains('hidden')));
    nav.addEventListener('click', e => { if (e.target.closest('a,button')) setMenu(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  // Encart arabe (bouton « عربي » de la navbar)
  const ar = $('arPanel');
  if (ar) {
    document.addEventListener('click', e => {
      if (e.target.closest('[data-open-ar]')) { try { ar.showModal(); } catch (_) { ar.setAttribute('open', ''); } }
      if (e.target.closest('[data-close-ar]') || e.target === ar) ar.close();
      if (e.target.closest('#arPanel [data-open-signup]')) ar.close();
    });
    if (location.hash === '#ar') { try { ar.showModal(); } catch (_) {} }
  }

  // Apparitions au défilement + compteurs animés
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countUp = el => {
    const to = +el.dataset.to; if (reduce || !to) return;
    const t0 = performance.now();
    const step = now => { const k = Math.min((now - t0) / 1400, 1); el.textContent = Math.round(to * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const revealObs = new IntersectionObserver(es => es.forEach(x => {
    if (!x.isIntersecting) return;
    x.target.classList.add('in'); x.target.querySelectorAll('.count').forEach(countUp); revealObs.unobserve(x.target);
  }), { threshold: .12 });
  const watch = () => document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObs.observe(el));
  watch();
  window.znReveal = watch; // à rappeler après un rendu dynamique

  // Lien actif sur l'accueil (sections en ancre)
  const spyLinks = [...document.querySelectorAll('.navlink[data-spy]')];
  if (spyLinks.length) {
    const spyObs = new IntersectionObserver(es => es.forEach(x => {
      if (x.isIntersecting) spyLinks.forEach(l => l.setAttribute('aria-current', l.dataset.spy === x.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    spyLinks.forEach(l => { const s = $(l.dataset.spy); if (s) spyObs.observe(s); });
  }
}
