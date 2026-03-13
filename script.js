/* ═══════════════════════════════════════════════════
   AVISH DENTAL CLINIC — JavaScript
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll behavior ───────────────────────
  const navbar  = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
      scrollTopBtn.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ─── Hamburger menu ───────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Inject backdrop once
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  navbar.insertAdjacentElement('afterend', backdrop);

  const openMenu = () => {
    navLinks.classList.add('open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('show');
    document.body.style.overflow = '';
  };

  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on backdrop click
  backdrop.addEventListener('click', closeMenu);

  // Close on any nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
  });


  // ─── Active nav link on scroll ────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const onScrollSpy = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.remove('active-nav');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active-nav');
      }
    });
  };
  window.addEventListener('scroll', onScrollSpy, { passive: true });


  // ─── Animated stat counters ───────────────────────
  const statsSection = document.getElementById('stats');
  let statsAnimated = false;

  const animateCounter = (el, target, duration = 1800) => {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(update);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) statsObserver.observe(statsSection);


  // ─── Fade-up on scroll (intersection observer) ────
  const fadeEls = document.querySelectorAll(
    '.service-card, .why-card, .step-item, .tip-card, .testimonial-card, .gallery-card, .pricing-card, .faq-item'
  );

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
  });


  // ─── FAQ accordion ────────────────────────────────
  const faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all
      faqList.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Open clicked (if wasn't already open)
      if (!isActive) item.classList.add('active');
    });
  }


  // ─── Booking form submission ───────────────────────
  const bookingForm = document.getElementById('booking-form');
  const formSuccess = document.getElementById('form-success');

  if (bookingForm) {
    // Set min date to today
    const dateInput = document.getElementById('fdate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const name  = document.getElementById('fname').value.trim();
      const phone = document.getElementById('fphone').value.trim();

      if (!name || !phone) {
        shakeForm();
        return;
      }

      // Simulate submission
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Booking…';
      submitBtn.disabled = true;

      setTimeout(() => {
        bookingForm.style.display = 'none';
        formSuccess.style.display = 'block';

        // Celebration confetti
        launchConfetti();
      }, 1200);
    });
  }

  const shakeForm = () => {
    const wrap = document.querySelector('.book-form-wrap');
    wrap.style.animation = 'shake 0.4s ease';
    wrap.addEventListener('animationend', () => { wrap.style.animation = ''; }, { once: true });
  };


  // ─── Mini confetti on booking ─────────────────────
  const launchConfetti = () => {
    const colors = ['#4A90D9', '#5DBEA3', '#F5A623', '#E91E8C', '#7C3AED'];
    const section = document.getElementById('book');
    const rect = section.getBoundingClientRect();

    for (let i = 0; i < 40; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed;
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${window.innerWidth / 2 + (Math.random() - 0.5) * 200}px;
        top: ${window.innerHeight / 2}px;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
      `;
      document.body.appendChild(dot);

      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 160;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 120;
      let x = 0, y = 0, gy = 0;
      const start = performance.now();

      const animate = (now) => {
        const t = (now - start) / 1000;
        gy = vy * t + 0.5 * 320 * t * t;
        x = vx * t;
        y = gy;
        dot.style.transform = `translate(${x}px, ${y}px) rotate(${t * 360}deg)`;
        dot.style.opacity = Math.max(0, 1 - t * 1.4);
        if (t < 1.5) requestAnimationFrame(animate);
        else dot.remove();
      };
      requestAnimationFrame(animate);
    }
  };


  // ─── Smooth scroll for all anchor links ──────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ─── Hero section parallax (desktop only) ────────
  const heroIllustration = document.querySelector('.hero-illustration');
  const isMobile = () => window.innerWidth <= 768;
  if (heroIllustration && !isMobile()) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroIllustration.style.transform = `translateY(${y * 0.08}px)`;
    }, { passive: true });
  }


  // ─── Tooltip / hover enhancements ─────────────────
  // Service cards: subtle highlight on icon hover
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.service-icon').style.transform = 'scale(1.1) rotate(-4deg)';
      card.querySelector('.service-icon').style.transition = '0.3s cubic-bezier(0.4,0,0.2,1)';
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.service-icon').style.transform = '';
    });
  });


  // ─── Typing animation for hero subtitle (desktop only) ──
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub && !isMobile()) {
    const originalText = heroSub.textContent;
    heroSub.textContent = '';
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < originalText.length) {
        heroSub.textContent += originalText[i];
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 18);
  }


  // ─── Before/After slider (gallery cards) ─────────
  // Visual pulse on gallery cards to draw attention
  const galleryCards = document.querySelectorAll('.gallery-card');
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 120);
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  galleryCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    galleryObserver.observe(card);
  });


  // ─── Pricing card highlight ────────────────────────
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      pricingCards.forEach(c => { if (c !== card) c.style.opacity = '0.7'; });
    });
    card.addEventListener('mouseleave', () => {
      pricingCards.forEach(c => { c.style.opacity = ''; });
    });
  });


  // ─── Shake keyframes (injected) ───────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
    .active-nav {
      color: var(--primary) !important;
      background: var(--bg-alt) !important;
    }
  `;
  document.head.appendChild(style);


  // ─── Why section cards: staggered entrance ────────
  const whyCards = document.querySelectorAll('.why-card');
  const whyObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      whyCards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
      whyObserver.disconnect();
    }
  }, { threshold: 0.1 });

  whyCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background 0.3s, border-color 0.3s, box-shadow 0.3s';
  });

  const whySection = document.getElementById('why');
  if (whySection) whyObserver.observe(whySection);


  // ─── Testimonials: scroll indicator dots on mobile ──
  if (isMobile()) {
    const grid = document.querySelector('.testimonials-grid');
    if (grid) {
      // Add dot indicators below the carousel
      const cards = grid.querySelectorAll('.testimonial-card');
      const dotsWrap = document.createElement('div');
      dotsWrap.style.cssText = 'display:flex;justify-content:center;gap:6px;margin-top:16px;';
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.style.cssText = `width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;background:${i===0?'var(--primary)':'var(--border)'};padding:0;`;
        dot.addEventListener('click', () => {
          grid.scrollTo({ left: cards[i].offsetLeft - 14, behavior: 'smooth' });
        });
        dotsWrap.appendChild(dot);
      });
      grid.parentNode.insertBefore(dotsWrap, grid.nextSibling);

      // Sync active dot on scroll
      grid.addEventListener('scroll', () => {
        const scrollRatio = grid.scrollLeft / (grid.scrollWidth - grid.clientWidth);
        const activeIdx = Math.round(scrollRatio * (cards.length - 1));
        dotsWrap.querySelectorAll('button').forEach((d, i) => {
          d.style.background = i === activeIdx ? 'var(--primary)' : 'var(--border)';
        });
      }, { passive: true });
    }
  }


  // ─── Stats: hover effect ──────────────────────────
  document.querySelectorAll('.stat-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.querySelector('.stat-number').style.color = 'var(--secondary)';
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('.stat-number').style.color = '';
    });
  });


  // ─── Urgency countdown (social proof timer) ───────
  const urgencyBanner = document.querySelector('.urgency-banner');
  if (urgencyBanner) {
    // Randomly decrease "slots" between 5–8
    const slots = Math.floor(Math.random() * 4) + 5;
    urgencyBanner.querySelector('strong').textContent = `${slots} free consultation slots`;
  }


  // ─── Phone input format ───────────────────────────
  const phoneInput = document.getElementById('fphone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) val = val.slice(0, 10);
      e.target.value = val;
    });
  }

});
