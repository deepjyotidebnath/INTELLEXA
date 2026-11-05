(() => {
  const WA_NUMBER = '919134800714';
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const toTop = document.getElementById('toTop');

  // Sticky nav style + back-to-top
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (window.scrollY <= 40) nav.classList.remove('scrolled');
  };
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) nav.classList.add('scrolled'); else onScroll();
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Active nav link on scroll
  const links = [...navLinks.querySelectorAll('a[href^="#"]:not(.btn)')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  // Scroll reveal
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); reveal.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  // Service filter
  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.svc');
  const filter = cat => {
    tabs.forEach(t => {
      const on = t.dataset.filter === cat;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
    });
    cards.forEach(c => {
      const show = cat === 'all' || c.dataset.cat === cat;
      c.classList.toggle('is-hidden', !show);
      if (show) c.classList.add('visible');
    });
  };
  const INITIAL = 9;
  const moreWrap = document.getElementById('svcMoreWrap');
  let expanded = false;
  const collapse = cat => {
    const limit = cat === 'all' && !expanded;
    cards.forEach((c, i) => c.classList.toggle('is-collapsed', limit && i >= INITIAL));
    moreWrap.hidden = !limit || cards.length <= INITIAL;
  };
  document.getElementById('svcMore').addEventListener('click', () => {
    expanded = true;
    collapse('all');
    cards.forEach(c => c.classList.add('visible'));
  });
  collapse('all');
  tabs.forEach(t => t.addEventListener('click', () => { filter(t.dataset.filter); collapse(t.dataset.filter); }));
  document.querySelectorAll('[data-goto]').forEach(a => a.addEventListener('click', () => { filter(a.dataset.goto); collapse(a.dataset.goto); }));

  // Expand feature lists
  document.querySelectorAll('.more-btn').forEach(btn => {
    const label = btn.textContent;
    btn.addEventListener('click', () => {
      const items = btn.closest('.svc').querySelectorAll('.svc-feats .more');
      const expand = items[0].hidden;
      items.forEach(li => { li.hidden = !expand; });
      btn.textContent = expand ? '− Show less' : label;
    });
  });

  // Contact form → WhatsApp
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const noteText = note.textContent;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let ok = true;
    ['name', 'phone'].forEach(k => {
      const field = form.elements[k];
      const bad = !data[k].trim() || (k === 'phone' && data[k].replace(/\D/g, '').length < 10);
      field.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = 'Please enter your name and a valid phone number.';
      note.classList.add('error');
      return;
    }
    note.textContent = noteText;
    note.classList.remove('error');
    const lines = [
      'Hi Intellexa! I would like a free consultation.',
      `Name: ${data.name.trim()}`,
      `Phone: ${data.phone.trim()}`,
      data.business.trim() && `Business: ${data.business.trim()}`,
      data.service && `Interested in: ${data.service}`,
      data.message.trim() && `Message: ${data.message.trim()}`
    ].filter(Boolean);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
  form.querySelectorAll('input').forEach(i => i.addEventListener('input', () => i.classList.remove('invalid')));

  document.getElementById('year').textContent = new Date().getFullYear();
})();
