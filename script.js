// Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Sticky nav shadow
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20 ? '0 4px 40px rgba(0,0,0,0.5)' : 'none';
  });

  // Hamburger (mobile)
  document.querySelector('.hamburger').addEventListener('click', function() {
    const links = document.querySelector('.nav-links');
    const spans = this.querySelectorAll('span');
    if (links.style.display === 'flex') {
      links.style.display = 'none';
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    } else {
      links.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:72px;left:0;right:0;background:rgba(15,10,10,0.98);padding:1.5rem 5vw;gap:1.2rem;border-bottom:1px solid rgba(255,107,107,0.15);backdrop-filter:blur(20px);';
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    }
  });