/**
 * ArchiFit — E-commerce Homepage JavaScript
 * Handles hero slider, sticky header, product filters,
 * scroll-to-top, and micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===== HERO SLIDER =====
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('hero-slide--active');
    dots[currentSlide].classList.remove('hero-dot--active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('hero-slide--active');
    dots[currentSlide].classList.add('hero-dot--active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(slideInterval);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(i);
      startAutoSlide();
    });
  });

  startAutoSlide();


  // ===== STICKY HEADER SHADOW =====
  const header = document.getElementById('main-header');
  let ticking = false;

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 10) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        // Scroll to top button
        const scrollTopBtn = document.getElementById('scroll-top');
        if (window.scrollY > 600) {
          scrollTopBtn.classList.add('scroll-top--visible');
        } else {
          scrollTopBtn.classList.remove('scroll-top--visible');
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });


  // ===== SCROLL TO TOP =====
  const scrollTopBtn = document.getElementById('scroll-top');
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ===== PRODUCT FILTER CHIPS =====
  const filterChips = document.querySelectorAll('.filter-chip');
  const productCards = document.querySelectorAll('.product-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Update active chip
      filterChips.forEach(c => c.classList.remove('filter-chip--active'));
      chip.classList.add('filter-chip--active');

      const filter = chip.dataset.filter;

      productCards.forEach((card, index) => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = `fadeInUp 0.4s ease-out ${index * 0.05}s both`;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animate category cards
  document.querySelectorAll('.category-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    animateOnScroll.observe(card);
  });

  // Animate trust badges
  document.querySelectorAll('.trust-badge').forEach((badge, i) => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(30px)';
    badge.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    animateOnScroll.observe(badge);
  });

  // Animate section headers
  document.querySelectorAll('.section-header').forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(20px)';
    header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(header);
  });


  // ===== ANIMATED COUNTER FOR HERO STATS =====
  function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * easeOut);
      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statProducts = document.getElementById('stat-products');
        const statClients = document.getElementById('stat-clients');
        const statYears = document.getElementById('stat-years');

        if (statProducts) animateCounter(statProducts, 200, '+');
        if (statClients) animateCounter(statClients, 5000, '+');
        if (statYears) animateCounter(statYears, 15, '+');

        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);


  // ===== ADD TO CART BUTTON MICRO-INTERACTION =====
  document.querySelectorAll('.product-card__add-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const originalText = this.innerHTML;
      this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="20 6 9 17 4 12"/></svg>
        Added!
      `;
      this.style.background = '#16A34A';
      this.style.color = 'white';

      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = '';
        this.style.color = '';
      }, 1800);

      // Update cart badge count
      const cartBadge = document.querySelector('.header-action--cart .header-action__badge');
      if (cartBadge) {
        const current = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = current + 1;
        cartBadge.style.transform = 'scale(1.3)';
        setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 200);
      }
    });
  });


  // ===== WISHLIST BUTTON TOGGLE =====
  document.querySelectorAll('.product-card__wishlist').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const svg = this.querySelector('svg');
      const isActive = svg.getAttribute('fill') === '#EF4444';

      if (isActive) {
        svg.setAttribute('fill', 'none');
        svg.querySelector('path').style.stroke = '';
      } else {
        svg.setAttribute('fill', '#EF4444');
        svg.querySelector('path').style.stroke = '#EF4444';
        this.style.transform = 'scale(1.2)';
        setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
      }
    });
  });


  // ===== SEARCH BAR FOCUS EFFECT =====
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.parentElement.style.transform = 'scale(1.01)';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.parentElement.style.transform = 'scale(1)';
    });
  }


  // ===== ADD CSS KEYFRAME FOR FILTER ANIMATION =====
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

});
