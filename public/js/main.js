/**
 * Vantage PMO – comportamiento de la landing.
 * Orquesta el orrery del hero, el orrery narrativo, el carrusel 3D de módulos,
 * el asistente IA, el tema, el menú móvil y los textos dinámicos (i18n).
 *
 * @module main
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t = function (k, v) { return window.i18n ? window.i18n.t(k, v) : k; };

  // Portafolio de ejemplo: los mismos datos que muestra el asistente.
  var PORTFOLIO = [
    { id: 'alpha', name: 'Alpha Launch', progress: 0.78, health: 'ok',   due: { en: 'May 12', es: '12 may' } },
    { id: 'beta',  name: 'Beta Rollout', progress: 0.42, health: 'bad',  due: { en: 'Jun 3',  es: '3 jun' } },
    { id: 'q3',    name: 'Q3 Migration', progress: 0.91, health: 'ok',   due: { en: 'Apr 30', es: '30 abr' } },
    { id: 'crm',   name: 'CRM Update',   progress: 0.55, health: 'warn', due: { en: 'May 28', es: '28 may' } }
  ];

  /* ---------------------------------------------------------------- NAV */
  function initNav() {
    var nav = document.getElementById('nav');
    var btn = document.getElementById('menuBtn');
    var sheet = document.getElementById('mobileMenu');

    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!btn || !sheet) return;
    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', t(open ? 'nav.menuClose' : 'nav.menuOpen'));
      btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
      nav.classList.toggle('is-open', open);
      if (open) { sheet.hidden = false; requestAnimationFrame(function () { sheet.classList.add('is-open'); }); }
      else { sheet.classList.remove('is-open'); setTimeout(function () { if (!nav.classList.contains('is-open')) sheet.hidden = true; }, 220); }
    }
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  /* -------------------------------------------------------------- THEME */
  function initTheme() {
    var btn = document.getElementById('themeSwitcher');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!btn) return;
    function sync() {
      var dark = document.documentElement.getAttribute('data-theme') !== 'light';
      btn.setAttribute('aria-pressed', String(!dark));
      btn.setAttribute('aria-label', t(dark ? 'nav.themeToLight' : 'nav.themeToDark'));
      if (meta) meta.setAttribute('content', dark ? '#031A30' : '#F3F7FB');
    }
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      var swap = function () {
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('vantage-pmo-theme', next); } catch (e) {}
        sync();
      };
      // Transición de vista nativa cuando existe; si no, cambio directo
      if (document.startViewTransition && !reduceMotion) document.startViewTransition(swap); else swap();
    });
    document.addEventListener('i18n:change', sync);
    sync();
  }

  /* ------------------------------------------------------- HERO ORRERY */
  function initHeroOrrery() {
    var canvas = document.getElementById('orrery');
    var stage = document.getElementById('orreryStage');
    var chipsEl = document.getElementById('projectChips');
    if (!canvas || !window.Orrery) return;

    var titleEl = document.getElementById('readoutTitle');
    var metaEl = document.getElementById('readoutMeta');
    var barEl = document.getElementById('readoutBar');
    var readout = document.getElementById('readout');
    var current = null;

    function renderReadout() {
      var lang = window.i18n ? window.i18n.getCurrentLang() : 'en';
      readout.dataset.health = current ? current.health : '';
      if (!current) {
        var c = { ok: 0, warn: 0, bad: 0 };
        PORTFOLIO.forEach(function (p) { c[p.health]++; });
        titleEl.textContent = t('hero.readout.title') + ' · ' + t('hero.readout.projects', { n: PORTFOLIO.length });
        metaEl.textContent = t('hero.readout.summary', c);
        var avg = PORTFOLIO.reduce(function (s, p) { return s + p.progress; }, 0) / PORTFOLIO.length;
        barEl.style.transform = 'scaleX(' + avg + ')';
      } else {
        titleEl.textContent = current.name + ' · ' + t('state.' + current.health);
        metaEl.textContent = t('hero.readout.detail', { progress: Math.round(current.progress * 100), due: current.due[lang] });
        barEl.style.transform = 'scaleX(' + current.progress + ')';
      }
    }

    function renderChips() {
      chipsEl.innerHTML = '';
      PORTFOLIO.forEach(function (p) {
        var li = document.createElement('div');
        li.setAttribute('role', 'listitem');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.dataset.health = p.health;
        b.dataset.id = p.id;
        b.setAttribute('aria-pressed', String(!!current && current.id === p.id));
        b.innerHTML = '<i aria-hidden="true"></i><span></span>';
        b.querySelector('span').textContent = p.name;
        b.title = t('state.' + p.health);
        li.appendChild(b);
        chipsEl.appendChild(li);
      });
    }

    var orrery = new window.Orrery(canvas, {
      projects: PORTFOLIO, mode: 'hero', stage: stage,
      onSelect: function (data) {
        current = data;
        renderReadout();
        chipsEl.querySelectorAll('.chip').forEach(function (c) {
          c.setAttribute('aria-pressed', String(!!data && c.dataset.id === data.id));
        });
      }
    });

    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      orrery.select(current && current.id === b.dataset.id ? null : b.dataset.id, true);
    });

    // 4D: el scroll inclina la cámara hacia una vista cenital
    var hero = document.getElementById('hero');
    window.addEventListener('scroll', function () {
      var r = hero.getBoundingClientRect();
      var prog = Math.min(Math.max(-r.top / r.height, 0), 1);
      orrery.setPitchBias(prog * 0.55);
    }, { passive: true });

    document.addEventListener('i18n:change', function () { renderChips(); renderReadout(); });
    renderChips();
    renderReadout();
    orrery.start();
  }

  /* ------------------------------------------------------ STORY ORRERY */
  function initStory() {
    var canvas = document.getElementById('orreryStory');
    var items = document.querySelectorAll('.result');
    if (!canvas || !items.length || !window.Orrery) return;

    var orrery = new window.Orrery(canvas, { projects: PORTFOLIO, mode: 'story' });
    orrery.start();

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var step = Number(en.target.dataset.step);
        items.forEach(function (it) { it.classList.toggle('is-active', it === en.target); });
        orrery.setStep(step);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    items.forEach(function (it) { io.observe(it); });
  }

  /* ---------------------------------------------------- MODULE DECK 3D */
  function initDeck() {
    var track = document.getElementById('deckTrack');
    var prev = document.getElementById('deckPrev');
    var next = document.getElementById('deckNext');
    var count = document.getElementById('deckCount');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll('.module'));
    var active = 0;

    // Coverflow: cada tarjeta gira según su distancia al centro del carril
    var ticking = false;
    function layout() {
      ticking = false;
      var tr = track.getBoundingClientRect();
      var mid = tr.left + tr.width / 2;
      var best = 0, bestD = Infinity;
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect();
        var d = (r.left + r.width / 2 - mid) / r.width; // en "tarjetas"
        if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
        if (!reduceMotion) {
          var k = Math.max(-1.6, Math.min(1.6, d));
          c.style.setProperty('--ry', (-k * 22).toFixed(2) + 'deg');
          c.style.setProperty('--tz', (-Math.abs(k) * 90).toFixed(1) + 'px');
          c.style.setProperty('--dim', (1 - Math.min(Math.abs(k), 1) * 0.45).toFixed(3));
        }
      });
      if (best !== active) { active = best; updateCount(); }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(layout); } }
    function updateCount() {
      count.textContent = t('products.count', { i: active + 1, n: cards.length });
      cards.forEach(function (c, i) { c.classList.toggle('is-center', i === active); });
    }
    function go(i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      var c = cards[i];
      var left = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2;
      track.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    prev.addEventListener('click', function () { go(active - 1); });
    next.addEventListener('click', function () { go(active + 1); });

    // Girar: promesa al frente, cómo funciona al reverso
    cards.forEach(function (c, i) {
      var btn = c.querySelector('.module__turn');
      var front = c.querySelector('.module__face--front');
      var back = c.querySelector('.module__face--back');
      back.setAttribute('aria-hidden', 'true');
      back.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });
      btn.addEventListener('click', function () {
        var on = !c.classList.contains('is-turned');
        c.classList.toggle('is-turned', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.querySelector('span').textContent = t(on ? 'products.turnBack' : 'products.turn');
        back.setAttribute('aria-hidden', String(!on));
        front.setAttribute('aria-hidden', String(on));
        back.querySelectorAll('a').forEach(function (a) { a.tabIndex = on ? 0 : -1; });
        if (i !== active) go(i);
      });
      c.addEventListener('focusin', function () { if (i !== active) go(i); });
    });

    document.addEventListener('i18n:change', function () {
      updateCount();
      cards.forEach(function (c) {
        var on = c.classList.contains('is-turned');
        c.querySelector('.module__turn span').textContent = t(on ? 'products.turnBack' : 'products.turn');
      });
    });
    requestAnimationFrame(layout);
    updateCount();
  }

  /* --------------------------------------------------------- ASSISTANT */
  var FLIP_CHARS = '0123456789%ABCDEFGHJKLMNPRSTUVWXYZ';
  function flipText(el) {
    var target = el.getAttribute('data-flip');
    if (reduceMotion) { el.textContent = target; return; }
    var start = performance.now(), dur = 520;
    (function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var out = '';
      for (var i = 0; i < target.length; i++) {
        var settle = (i + 1) / target.length;
        out += (p >= settle * 0.9 || target[i] === ' ') ? target[i] : FLIP_CHARS[(Math.random() * FLIP_CHARS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame); else el.textContent = target;
    })(start);
  }

  function initAssistant() {
    var section = document.getElementById('assistant');
    var tabs = Array.prototype.slice.call(document.querySelectorAll('#prompts .prompt'));
    var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); });
    var auto = document.getElementById('aiAutoplay');
    if (!tabs.length) return;

    var idx = 0, playing = !reduceMotion, hovered = false, inView = false, timer = null;
    var DWELL = 6500;

    function activate(i, focus) {
      idx = (i + tabs.length) % tabs.length;
      tabs.forEach(function (tab, k) {
        var on = k === idx;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
        panels[k].classList.toggle('is-active', on);
      });
      if (focus) tabs[idx].focus();
      var panel = panels[idx];
      panel.querySelectorAll('.flip').forEach(flipText);
      restartTimer();
    }

    function restartTimer() {
      clearTimeout(timer);
      tabs.forEach(function (tab) { tab.classList.remove('is-timing'); });
      if (!(playing && inView && !hovered)) return;
      void tabs[idx].offsetWidth; // reinicia la barra de tiempo CSS
      tabs[idx].style.setProperty('--dwell', DWELL + 'ms');
      tabs[idx].classList.add('is-timing');
      timer = setTimeout(function () { activate(idx + 1, false); }, DWELL);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(i, false); });
      tab.addEventListener('keydown', function (e) {
        var map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (map[e.key]) { e.preventDefault(); activate(idx + map[e.key], true); }
        else if (e.key === 'Home') { e.preventDefault(); activate(0, true); }
        else if (e.key === 'End') { e.preventDefault(); activate(tabs.length - 1, true); }
      });
    });

    function setPlaying(on) {
      playing = on;
      auto.setAttribute('aria-pressed', String(on));
      restartTimer();
    }
    auto.addEventListener('click', function () { setPlaying(!playing); });
    if (!playing) auto.setAttribute('aria-pressed', 'false');

    // La pausa automática respeta lectura y teclado
    section.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovered = true; restartTimer(); } });
    section.addEventListener('pointerleave', function () { hovered = false; restartTimer(); });
    section.addEventListener('focusin', function () { hovered = true; restartTimer(); });
    section.addEventListener('focusout', function (e) { if (!section.contains(e.relatedTarget)) { hovered = false; restartTimer(); } });

    new IntersectionObserver(function (en) {
      var was = inView;
      inView = en[0].isIntersecting;
      if (inView && !was) activate(idx, false); else restartTimer();
    }, { threshold: 0.35 }).observe(section);
    document.addEventListener('visibilitychange', function () { inView = !document.hidden && inView; restartTimer(); });
  }

  /* ------------------------------------------ FECHAS LOCALIZADAS */
  // Las fechas de los mockups se guardan como días desde el 20 de abril
  // y se escriben en el idioma activo.
  function initDates() {
    var base = Date.UTC(2026, 3, 20);
    function render() {
      var lang = window.i18n ? window.i18n.getCurrentLang() : 'en';
      var fmt = new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric', timeZone: 'UTC' });
      document.querySelectorAll('[data-day]').forEach(function (el) {
        var txt = fmt.format(new Date(base + Number(el.dataset.day) * 864e5)).replace('.', '');
        if (el.classList.contains('flip')) el.setAttribute('data-flip', txt);
        el.textContent = txt;
      });
    }
    document.addEventListener('i18n:change', render);
    render();
  }

  /* ----------------------------------------------- ONBOARDING ROUTE */
  function initRoute() {
    var route = document.getElementById('route');
    if (!route) return;
    if (!('IntersectionObserver' in window)) { route.classList.add('is-drawn'); return; }
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { route.classList.add('is-drawn'); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(route);
  }

  /* ------------------------------------------------------------ INIT */
  initNav();
  initTheme();
  initHeroOrrery();
  initStory();
  initDeck();
  initAssistant();
  initRoute();
  initDates();
})();
