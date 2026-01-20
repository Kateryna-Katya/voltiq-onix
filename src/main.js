/**
 * VOLTIQ-ONIX 2026 - FINAL ENGINE (FULL SCREEN MENU)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  if (typeof gsap !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  // --- 1. УПРАВЛЕНИЕ ПОЛНОЭКРАННЫМ МЕНЮ ---
  const burger = document.getElementById('burger-menu');
  const nav = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link, .header__actions .btn');
  const header = document.querySelector('.header');

  const toggleMenu = (state) => {
      const isActive = state !== undefined ? state : !nav.classList.contains('active');

      burger.classList.toggle('active', isActive);
      nav.classList.toggle('active', isActive);

      // Блокируем скролл, чтобы при скролле внутри меню не двигался сайт
      document.body.style.overflow = isActive ? 'hidden' : '';
  };

  if (burger) {
      burger.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMenu();
      });
  }

  // Универсальная навигация: скролл на главной / переход с других страниц
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');

          if (href && href.includes('#')) {
              const parts = href.split('#');
              const targetId = '#' + parts[parts.length - 1];
              const targetElement = document.querySelector(targetId);

              if (targetElement) {
                  e.preventDefault();
                  toggleMenu(false); // Закрываем полноэкранное меню

                  setTimeout(() => {
                      const hOffset = header.offsetHeight;
                      const pos = targetElement.getBoundingClientRect().top + window.pageYOffset - hOffset;
                      window.scrollTo({ top: pos, behavior: 'smooth' });
                  }, 100);
              } else {
                  toggleMenu(false);
              }
          }
      });
  });

  // --- 2. HERO АНИМАЦИЯ ---
  const hTitle = document.querySelector('.hero__title');
  if (hTitle && typeof SplitType !== 'undefined') {
      const splitT = new SplitType(hTitle, { types: 'words, chars' });
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl.from('.hero__badge', { opacity: 0, y: -20, duration: 0.8, delay: 0.3 })
            .from(splitT.chars, { opacity: 0, y: 50, rotateX: -90, stagger: 0.02, duration: 1 }, "-=0.5")
            .from('.hero__description', { opacity: 0, y: 20, duration: 0.8 }, "-=0.8")
            .from('.hero__actions', { opacity: 0, y: 20, duration: 0.8, clearProps: "all" }, "-=0.5");
  }

  // --- 3. SCROLL REVEAL (ВАННИЛА) ---
  const revObs = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('active'); revObs.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  // --- 4. ТАБЫ ---
  document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-tab');
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          const target = document.getElementById(id);
          if (target) target.classList.add('active');
          if (typeof lucide !== 'undefined') lucide.createIcons();
      });
  });

  // --- 5. ФОРМА ---
  const f = document.getElementById('contact-form');
  if (f) {
      const ph = document.getElementById('phone');
      const capL = document.getElementById('captcha-question');
      const v1 = Math.floor(Math.random() * 10), v2 = Math.floor(Math.random() * 5) + 1, res = v1 + v2;
      if (capL) capL.textContent = `${v1} + ${v2} = ?`;
      ph.addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''));
      f.addEventListener('submit', (e) => {
          e.preventDefault();
          if (parseInt(document.getElementById('captcha-answer').value) !== res) { alert('Ошибка капчи'); return; }
          f.querySelector('.form__submit').textContent = 'Отправка...';
          setTimeout(() => { document.getElementById('form-success').classList.add('active'); if (typeof lucide !== 'undefined') lucide.createIcons(); }, 1500);
      });
  }

  // --- 6. COOKIE ---
  const cp = document.getElementById('cookie-popup'), ca = document.getElementById('cookie-accept');
  if (cp && !localStorage.getItem('voltiq_onix_c')) setTimeout(() => cp.classList.add('active'), 3000);
  if (ca) ca.addEventListener('click', () => { localStorage.setItem('voltiq_onix_c', 't'); cp.classList.remove('active'); });

  // --- 7. HEADER EFFECT ---
  window.addEventListener('scroll', () => {
      header.style.padding = window.scrollY > 50 ? '10px 0' : '20px 0';
      header.style.background = window.scrollY > 50 ? 'rgba(0, 34, 255, 0.98)' : 'rgba(0, 34, 255, 0.8)';
  });

  // --- 8. CANVAS BG ---
  initHeroCanvas();
});

function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  class P {
      constructor() { this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height; this.vx = (Math.random()-0.5)*0.3; this.vy = (Math.random()-0.5)*0.3; }
      update() { this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>canvas.width)this.vx*=-1; if(this.y<0||this.y>canvas.height)this.vy*=-1; }
  }
  const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
          p.update(); ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(255, 107, 0, 0.6)'; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, d = Math.sqrt(dx*dx+dy*dy);
              if (d < 140) { ctx.beginPath(); ctx.strokeStyle = `rgba(255, 107, 0, ${1 - d/140})`; ctx.lineWidth = 0.4; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
          }
      }
      requestAnimationFrame(animate);
  };
  window.addEventListener('resize', resize);
  resize();
  for (let i = 0; i < 80; i++) particles.push(new P());
  animate();
}