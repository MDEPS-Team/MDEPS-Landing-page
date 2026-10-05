/**
 * Main application bootstrap module for Vantage PMO website.
 *
 * This module initializes all core functionality including navigation,
 * smooth scrolling, feature animations, and scroll-based content reveals.
 *
 * @module main
 * @author Vantage PMO Development Team
 * @version 1.0.0
 * @license © 2026 Vantage PMO. All rights reserved.
 */

/**
 * Initializes the mobile navigation menu functionality.
 *
 * Sets up event listeners for the hamburger menu toggle, outside clicks,
 * and window resize events to ensure proper mobile menu behavior.
 *
 * @function initNav
 * @private
 */
function initNav() {
  var toggle = document.querySelector('.nav__toggle');
  var menu   = document.querySelector('.nav__menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Initializes smooth scrolling for internal anchor links.
 *
 * Finds all anchor elements with href attributes starting with '#'
 * and adds click event listeners to smoothly scroll to the target elements.
 *
 * @function initSmoothScroll
 * @private
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Initializes the sticky feature counter animation.
 *
 * Uses Intersection Observer to detect when feature items come into view
 * and updates the sticky counter numbers with fade/blur transitions.
 *
 * @function initFeaturesScroll
 * @private
 */
function initFeaturesScroll() {
  if (!('IntersectionObserver' in window)) return;

  var nums  = document.querySelectorAll('.features__num');
  var items = document.querySelectorAll('.feature-item[data-index]');
  if (!nums.length || !items.length) return;

  var activeIdx = 0;

  /**
   * Activates the specified feature index with animation.
   *
   * @param {number} idx - The index of the feature item to activate
   */
  function activate(idx) {
    if (idx === activeIdx) return;

    /* Salida del número actual */
    var prev = activeIdx;
    nums[prev].classList.remove('is-active');
    nums[prev].classList.add('is-exit');
    items[prev].classList.remove('is-active');
    setTimeout(function () { nums[prev].classList.remove('is-exit'); }, 320);

    /* Entrada del número nuevo */
    activeIdx = idx;
    nums[activeIdx].classList.add('is-active');
    items[activeIdx].classList.add('is-active');
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        activate(+entry.target.getAttribute('data-index'));
      }
    });
  }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

  items.forEach(function (item) { observer.observe(item); });

  /* Activar el primero al inicio */
  items[0].classList.add('is-active');
}

/**
 * Initializes scroll-based entrance animations for content sections.
 *
 * Uses Intersection Observer to add 'is-visible' class to elements
 * when they come into view, triggering CSS animations.
 *
 * @function initScrollAnimations
 * @private
 */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  var selectors = [
    '.pillar-card',
    '.step-card',
    '.testimonial-card',
    '.blog-card',
  ];

  document.querySelectorAll(selectors.join(',')).forEach(function (el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

/**
 * Main initialization function.
 *
 * Called when the DOM is fully loaded to set up all application features.
 *
 * @function init
 * @private
 */
function initProductsCarousel() {
  var track  = document.querySelector('.products__track');
  var prev   = document.getElementById('productsPrev');
  var next   = document.getElementById('productsNext');
  var dotsEl = document.getElementById('productsDots');
  if (!track || !prev || !next) return;

  var origCards = Array.from(track.querySelectorAll('.product-card'));
  var N = origCards.length;
  if (N === 0) return;

  // Clonar todas las cards: un set antes (prepend) y uno después (append)
  origCards.slice().reverse().forEach(function (c) {
    var cl = c.cloneNode(true);
    cl.setAttribute('aria-hidden', 'true');
    track.insertBefore(cl, track.firstChild);
  });
  origCards.forEach(function (c) {
    var cl = c.cloneNode(true);
    cl.setAttribute('aria-hidden', 'true');
    track.appendChild(cl);
  });
  // DOM total: [N clones-before][N originals][N clones-after]
  // Índices reales: N .. 2N-1

  var cur  = 0;     // índice actual en las cards originales (0..N-1)
  var busy = false; // evitar re-entrancia en resets

  // Posición de scroll para mostrar la card en domIndex
  function posFor(domIdx) {
    var all = track.querySelectorAll('.product-card');
    if (!all[domIdx]) return 0;
    var tRect = track.getBoundingClientRect();
    var cRect = all[domIdx].getBoundingClientRect();
    return Math.round(track.scrollLeft + cRect.left - tRect.left);
  }

  // Salto instantáneo (sin animación, sin scroll-snap)
  function jumpTo(domIdx) {
    busy = true;
    track.style.scrollSnapType = 'none';
    track.scrollLeft = posFor(domIdx);
    requestAnimationFrame(function () {
      track.style.scrollSnapType = '';
      busy = false;
    });
  }

  // Navegar con animación suave a domIndex y actualizar cur al índice real
  function smoothTo(domIdx, realIdx) {
    cur = realIdx;
    track.scrollTo({ left: posFor(domIdx), behavior: 'smooth' });
    updateDots();
  }

  // Arrancar en la primera card real
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { jumpTo(N); });
  });

  // ── Dots ──────────────────────────────────────────────────────────────
  if (dotsEl) {
    origCards.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'products__dot' + (i === 0 ? ' is-active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.dataset.index = String(i);
      dotsEl.appendChild(d);
    });
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.products__dot').forEach(function (d, i) {
      d.classList.toggle('is-active', i === cur);
    });
  }

  // ── Reset tras animación ───────────────────────────────────────────────
  // Si el scroll terminó en zona de clones, volver silenciosamente a la card real
  function afterScroll() {
    if (busy) return;
    var all   = track.querySelectorAll('.product-card');
    var tRect = track.getBoundingClientRect();
    var bestIdx = 0, minDist = Infinity;
    all.forEach(function (card, i) {
      var dist = Math.abs(card.getBoundingClientRect().left - tRect.left);
      if (dist < minDist) { minDist = dist; bestIdx = i; }
    });
    if (bestIdx < N || bestIdx >= N * 2) {
      jumpTo(N + cur);
    }
  }

  if ('onscrollend' in window) {
    track.addEventListener('scrollend', afterScroll, { passive: true });
  } else {
    var scrollEndTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(afterScroll, 150);
    }, { passive: true });
  }

  // ── Botones ────────────────────────────────────────────────────────────
  next.addEventListener('click', function () {
    if (cur === N - 1) {
      smoothTo(N * 2, 0);          // clon-after de la primera card
    } else {
      smoothTo(N + cur + 1, cur + 1);
    }
  });

  prev.addEventListener('click', function () {
    if (cur === 0) {
      smoothTo(N - 1, N - 1);     // clon-before de la última card
    } else {
      smoothTo(N + cur - 1, cur - 1);
    }
  });

  // ── Dots click ─────────────────────────────────────────────────────────
  if (dotsEl) {
    dotsEl.addEventListener('click', function (e) {
      var d = e.target.closest('.products__dot');
      if (d) smoothTo(N + Number(d.dataset.index), Number(d.dataset.index));
    });
  }

  // ── Sync dots al arrastrar manualmente ────────────────────────────────
  var syncTimer;
  track.addEventListener('scroll', function () {
    if (busy) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      var all   = track.querySelectorAll('.product-card');
      var tRect = track.getBoundingClientRect();
      var best  = 0, minD = Infinity;
      all.forEach(function (card, i) {
        var dist = Math.abs(card.getBoundingClientRect().left - tRect.left);
        if (dist < minD) { minD = dist; best = i; }
      });
      var realIdx = ((best - N) % N + N) % N;
      if (realIdx !== cur) { cur = realIdx; updateDots(); }
    }, 60);
  }, { passive: true });
}

function initAiRotator() {
  var prompts = document.querySelectorAll('.ai-section__prompts .ai-prompt');
  var panels  = document.querySelectorAll('.ai-panel');
  if (!prompts.length || !panels.length) return;

  var current = 0;
  var timer   = null;

  function goTo(idx) {
    prompts[current].classList.remove('ai-prompt--active');
    panels[current].classList.remove('ai-panel--active');
    current = idx % prompts.length;
    prompts[current].classList.add('ai-prompt--active');
    panels[current].classList.add('ai-panel--active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  prompts.forEach(function (prompt, i) {
    prompt.addEventListener('click', function () {
      goTo(i);
      startAuto(); // reinicia el contador al hacer clic
    });
  });

  startAuto();
}

/**
 * Initializes team reveal behavior: when the `#team` section
 * enters the viewport, reveal every member's details.
 */
function initTeamReveal() {
  if (!('IntersectionObserver' in window)) return;
  var team = document.getElementById('team');
  if (!team) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        team.classList.add('is-active');
      } else {
        team.classList.remove('is-active');
      }
    });
  }, { threshold: 0.18 });

  observer.observe(team);
}

/**
 * Initializes the theme switcher (Dark/Light mode) with text labels.
 * Handles system preferences, button text updates, and local storage persistence.
 */
function initTheme() {
  var switcher = document.getElementById('themeSwitcher');
  var textEl   = document.getElementById('themeText');
  if (!switcher && !textEl) return;

  var savedTheme = localStorage.getItem('vantage-pmo-theme');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = savedTheme || (systemDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vantage-pmo-theme', theme);
    if (textEl) {
      // El texto muestra la acción opuesta al tema actual
      textEl.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
    }
  }

  applyTheme(currentTheme);

  switcher.addEventListener('click', function() {
    var newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
}

function init() {
  initNav();
  initSmoothScroll();
  initFeaturesScroll();
  initScrollAnimations();
  initProductsCarousel();
  initAiRotator();
  initTeamReveal();
  initTheme();
}

// Esperar a que todas las imágenes carguen antes de inicializar
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
