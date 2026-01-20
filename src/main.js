/**
 * VOLTIQ-ONIX BLOG - CORE ENGINE 2026
 * ----------------------------------
 * Содержит: GSAP Animations, Vanilla ScrollReveal,
 * Mobile Menu, Tabs, Form Validation, Canvas BG.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК И ПЛАГИНОВ
  if (typeof lucide !== 'undefined') lucide.createIcons();
  if (typeof gsap !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  // --- 2. МОБИЛЬНОЕ МЕНЮ (Z-INDEX FIX) ---
  const burger = document.getElementById('burger-menu');
  const nav = document.getElementById('nav-menu');
  const overlay = document.getElementById('mobile-overlay');
  const navLinks = document.querySelectorAll('.nav__link');

  const toggleMenu = (state) => {
      const isActive = state !== undefined ? state : !nav.classList.contains('active');

      burger.classList.toggle('active', isActive);
      nav.classList.toggle('active', isActive);
      overlay.classList.toggle('active', isActive);

      // Блокируем скролл при открытом меню
      document.body.style.overflow = isActive ? 'hidden' : '';
  };

  if (burger) {
      burger.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMenu();
      });
  }

  if (overlay) overlay.addEventListener('click', () => toggleMenu(false));

  navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
  });


  // --- 3. HERO АНИМАЦИЯ (GSAP + SPLITTYPE) ---
  // Используем типы 'words, chars', чтобы SplitType обернул слова в отдельные контейнеры
  // CSS класс .word { white-space: nowrap; } предотвратит разрывы.
  const heroTitleText = document.querySelector('.hero__title');
  if (heroTitleText && typeof SplitType !== 'undefined') {
      const heroTitle = new SplitType(heroTitleText, { types: 'words, chars' });
      const heroDesc = new SplitType('.hero__description', { types: 'words' });

      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl
          .from('.hero__badge', { opacity: 0, y: -20, duration: 0.8, delay: 0.5 })
          .from(heroTitle.chars, {
              opacity: 0,
              y: 50,
              rotateX: -90,
              stagger: 0.02,
              duration: 1
          }, "-=0.5")
          .from(heroDesc.words, {
              opacity: 0,
              y: 10,
              stagger: 0.01,
              duration: 0.8
          }, "-=0.8")
          .from('.hero__actions', {
              opacity: 0,
              y: 30,
              duration: 1,
              clearProps: "all" // Очищаем стили после анимации для работы hover/z-index
          }, "-=0.6")
          .from('.glass-card', {
              opacity: 0,
              scale: 0.8,
              stagger: 0.2,
              duration: 1
          }, "-=1");
  }


  // --- 4. ВАНИЛЬНЫЙ SCROLL REVEAL (INTERSECTION OBSERVER) ---
  const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('active');
              revealObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  // --- 5. ТАБЫ (INNOVATIONS SECTION) ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
      button.addEventListener('click', () => {
          const target = button.getAttribute('data-tab');

          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));

          button.classList.add('active');
          const activeContent = document.getElementById(target);
          if (activeContent) activeContent.classList.add('active');

          if (typeof lucide !== 'undefined') lucide.createIcons();
      });
  });


  // --- 6. ФОРМА КОНТАКТОВ (VALIDATION + CAPTCHA) ---
  const form = document.getElementById('contact-form');
  if (form) {
      const phoneInput = document.getElementById('phone');
      const captchaLabel = document.getElementById('captcha-question');
      const successMessage = document.getElementById('form-success');

      // Генерация капчи
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 10) + 1;
      const correctResult = n1 + n2;
      if (captchaLabel) captchaLabel.textContent = `${n1} + ${n2} = ?`;

      // Валидация телефона (только цифры)
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          const userAns = parseInt(document.getElementById('captcha-answer').value);

          if (userAns !== correctResult) {
              alert('Ошибка: Математический ответ неверный.');
              return;
          }

          const btn = form.querySelector('.form__submit');
          btn.textContent = 'Обработка...';
          btn.style.opacity = '0.5';
          btn.disabled = true;

          // Имитация отправки
          setTimeout(() => {
              successMessage.classList.add('active');
              if (typeof lucide !== 'undefined') lucide.createIcons();
          }, 1500);
      });
  }


  // --- 7. COOKIE POPUP ---
  const cookiePopup = document.getElementById('cookie-popup');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookiePopup && !localStorage.getItem('voltiq_cookies_accepted')) {
      setTimeout(() => cookiePopup.classList.add('active'), 3000);
  }

  if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
          localStorage.setItem('voltiq_cookies_accepted', 'true');
          cookiePopup.classList.remove('active');
      });
  }


  // --- 8. HEADER SCROLL EFFECT ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
          header.style.padding = '12px 0';
          header.style.background = 'rgba(0, 34, 255, 0.98)';
      } else {
          header.style.padding = '20px 0';
          header.style.background = 'rgba(0, 34, 255, 0.8)';
      }
  });

  // --- 9. HERO CANVAS (NEURAL NETWORK) ---
  initHeroCanvas();
});

/**
* Отрисовка интерактивного фона на Canvas
*/
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  };

  class Particle {
      constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = (Math.random() - 0.5) * 0.4;
          this.radius = Math.random() * 1.5 + 1;
      }
      update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#FF6B00';
          ctx.fill();
      }
  }

  const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
          p.update();
          p.draw();
      });

      // Рисуем линии между точками
      for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 150) {
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(255, 107, 0, ${1 - dist/150})`;
                  ctx.lineWidth = 0.5;
                  ctx.moveTo(particles[i].x, particles[i].y);
                  ctx.lineTo(particles[j].x, particles[j].y);
                  ctx.stroke();
              }
          }
      }
      requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resize);
  resize();

  // Создаем частицы в зависимости от ширины экрана
  const count = Math.min(Math.floor(window.innerWidth / 15), 100);
  for (let i = 0; i < count; i++) {
      particles.push(new Particle());
  }
  animate();
}