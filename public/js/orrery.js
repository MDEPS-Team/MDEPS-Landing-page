/**
 * Orrery – vista 3D del portafolio, sin dependencias.
 *
 * Cada proyecto es un cuerpo sobre su propia órbita inclinada.
 * El arco brillante de la órbita es su progreso y la luz del cuerpo su salud
 * (on track / at risk / delayed). Proyección en perspectiva hecha a mano
 * sobre canvas 2D, con orden de profundidad (mitad trasera → núcleo → mitad
 * delantera), arrastre con inercia, teclado, pausa fuera de pantalla y modo
 * de movimiento reducido.
 *
 * @module orrery
 */
(function (global) {
  'use strict';

  var TAU = Math.PI * 2;
  var COLORS = {
    ok:   [127, 224, 201],
    warn: [255, 181, 71],
    bad:  [255, 122, 102],
    line: [214, 232, 248]
  };

  var reduceMotion = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // Pseudo-aleatorio determinista: el cielo es el mismo en cada visita.
  function rng(seed) {
    return function () {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} opts
   * @param {Array}  opts.projects   [{id,name,progress,health,due}]
   * @param {string} [opts.mode]     'hero' | 'story'
   * @param {HTMLElement} [opts.stage] elemento que recibe puntero/teclado
   * @param {Function} [opts.onSelect]
   */
  function Orrery(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.opts = opts || {};
    this.mode = this.opts.mode || 'hero';
    this.stage = this.opts.stage || canvas;
    this.selected = null;
    this.hover = null;

    var r = rng(7);
    this.projects = (this.opts.projects || []).map(function (p, i) {
      return {
        data: p,
        radius: 1.25 + i * 0.42,
        inc: [0.14, -0.22, 0.3, -0.1, 0.2][i % 5],
        node: i * 1.35,
        phase: r() * TAU,
        // Desorden inicial del modo historia: inclinaciones y radios dispersos
        chaosInc: (r() - 0.5) * 2.2,
        chaosRadius: (r() - 0.5) * 0.7,
        screen: { x: 0, y: 0, s: 0, z: 0 }
      };
    });

    this.stars = [];
    for (var i = 0; i < 140; i++) {
      var u = r() * 2 - 1, th = r() * TAU, s = Math.sqrt(1 - u * u);
      this.stars.push({ x: s * Math.cos(th) * 9, y: u * 9, z: s * Math.sin(th) * 9, b: 0.25 + r() * 0.75, tw: r() * TAU });
    }

    // Estado de cámara (con muelle hacia el objetivo)
    this.yaw = -0.6;   this.yawVel = 0;
    this.pitch = 0.42; this.pitchTarget = 0.42;
    this.pitchBias = 0;
    this.lastInteract = -1e9;

    // Parámetros de historia (0..1), interpolados cada fotograma
    // Hero: el portafolio "entra en foco" una sola vez al cargar (órbitas
    // dispersas que se ordenan). Historia: arranca en desorden y el scroll lo ordena.
    var startChaos = (this.mode === 'story' || !reduceMotion) ? 1 : 0;
    var targetChaos = this.mode === 'story' ? 1 : 0;
    this.p = { chaos: startChaos, align: 0, links: 0, labels: 0 };
    this.t = { chaos: targetChaos, align: 0, links: 0, labels: 0 };

    this.time = 0;
    this.running = false;
    this.visible = true;
    this._raf = null;
    this._last = 0;

    this._bind();
    this.resize();
  }

  Orrery.prototype._bind = function () {
    var self = this;
    var stage = this.stage;

    if (global.ResizeObserver) {
      new ResizeObserver(function () { self.resize(); self.requestRender(); }).observe(this.canvas);
    } else {
      global.addEventListener('resize', function () { self.resize(); self.requestRender(); });
    }

    if (global.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        self.visible = entries[0].isIntersecting;
        if (self.visible) self.start(); else self.stop();
      }, { rootMargin: '80px' }).observe(this.canvas);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) self.stop(); else if (self.visible) self.start();
    });

    if (this.mode !== 'hero') return;

    // Arrastre horizontal: gira el sistema. El scroll vertical sigue libre (touch-action: pan-y).
    var dragging = false, lastX = 0, lastY = 0, moved = 0, pid = null;
    stage.addEventListener('pointerdown', function (e) {
      if (pid !== null) return; // un solo dedo manda
      pid = e.pointerId; dragging = true; moved = 0;
      lastX = e.clientX; lastY = e.clientY;
      self.yawVel = 0;
      self.lastInteract = performance.now();
    });
    stage.addEventListener('pointermove', function (e) {
      var rect = self.canvas.getBoundingClientRect();
      if (dragging && e.pointerId === pid) {
        var dx = e.clientX - lastX, dy = e.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        if (moved > 6 && stage.setPointerCapture) { try { stage.setPointerCapture(pid); } catch (err) {} }
        self.yaw += dx * 0.008;
        self.yawVel = dx * 0.008;
        self.pitchTarget = clamp(self.pitchTarget + dy * 0.004, 0.1, 1.1);
        lastX = e.clientX; lastY = e.clientY;
        self.lastInteract = performance.now();
        self.requestRender();
      } else if (e.pointerType === 'mouse') {
        var hit = self.hitTest(e.clientX - rect.left, e.clientY - rect.top);
        if (hit !== self.hover) { self.hover = hit; stage.style.cursor = hit ? 'pointer' : 'grab'; self.requestRender(); }
      }
    });
    function end(e) {
      if (e.pointerId !== pid) return;
      if (moved < 6) {
        var rect = self.canvas.getBoundingClientRect();
        var hit = self.hitTest(e.clientX - rect.left, e.clientY - rect.top);
        self.select(hit ? hit.data.id : null, true);
      }
      dragging = false; pid = null;
    }
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('pointerleave', function () { if (self.hover) { self.hover = null; self.requestRender(); } });

    stage.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowLeft' || k === 'ArrowRight') {
        e.preventDefault();
        self.yaw += (k === 'ArrowLeft' ? -0.35 : 0.35);
        self.yawVel = 0;
        self.lastInteract = performance.now();
        self.requestRender();
      } else if (k === 'ArrowUp' || k === 'ArrowDown') {
        e.preventDefault();
        self.pitchTarget = clamp(self.pitchTarget + (k === 'ArrowUp' ? 0.15 : -0.15), 0.1, 1.1);
        self.lastInteract = performance.now();
        self.requestRender();
      } else if (k === 'Escape') {
        self.select(null, true);
      }
    });
  };

  Orrery.prototype.resize = function () {
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    var outer = 1.25 + (this.projects.length - 1) * 0.42 + 0.3;
    this.scale = Math.min(w * 0.47, h * 0.62) / outer;
  };

  Orrery.prototype.setStep = function (step) {
    // Acumulativo: cada paso conserva el orden logrado por el anterior.
    this.t.chaos  = step >= 0 ? 0 : 1;
    this.t.align  = step >= 1 ? 1 : 0;
    this.t.links  = step >= 2 ? 1 : 0;
    this.t.labels = step >= 3 ? 1 : 0;
    if (reduceMotion) { for (var k in this.t) this.p[k] = this.t[k]; }
    this.requestRender();
  };

  Orrery.prototype.setPitchBias = function (v) { this.pitchBias = v; };

  Orrery.prototype.select = function (id, fromUser) {
    var found = null;
    this.projects.forEach(function (p) { if (p.data.id === id) found = p; });
    this.selected = found;
    if (this.opts.onSelect) this.opts.onSelect(found ? found.data : null, fromUser);
    this.requestRender();
  };

  Orrery.prototype.hitTest = function (x, y) {
    var best = null, bestD = 30;
    this.projects.forEach(function (p) {
      var d = Math.hypot(p.screen.x - x, p.screen.y - y);
      if (d < bestD) { bestD = d; best = p; }
    });
    return best;
  };

  // --- Proyección ---------------------------------------------------------
  Orrery.prototype._project = function (x, y, z) {
    var cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    var x1 = x * cy - z * sy, z1 = x * sy + z * cy;
    var pitch = this.pitch + this.pitchBias;
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    var y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    var D = 7.5, f = D / (D + z2);
    return { x: this.w / 2 + x1 * f * this.scale, y: this.h / 2 + y2 * f * this.scale, z: z2, f: f };
  };

  Orrery.prototype._ringPoint = function (p, theta) {
    var R = p.radius + p.chaosRadius * this.p.chaos;
    var inc = p.inc * (1 - this.p.chaos) + p.chaosInc * this.p.chaos;
    var x = R * Math.cos(theta), z = R * Math.sin(theta), y = 0;
    var ci = Math.cos(inc), si = Math.sin(inc);
    var y1 = y * ci - z * si, z1 = y * si + z * ci;
    var cn = Math.cos(p.node), sn = Math.sin(p.node);
    return this._project(x * cn - z1 * sn, y1, x * sn + z1 * cn);
  };

  Orrery.prototype._bodyAngle = function (p) {
    var a = p.data.progress * TAU;
    // Modo historia: "alineados" = todos los cuerpos comparten fase
    return lerp(p.phase + a, -p.node + 0.6, this.p.align);
  };

  // --- Bucle -------------------------------------------------------------
  Orrery.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this._last = performance.now();
    var self = this;
    var loop = function (now) {
      if (!self.running) return;
      var dt = Math.min((now - self._last) / 16.67, 3);
      self._last = now;
      self._step(dt, now);
      self.draw();
      self._raf = requestAnimationFrame(loop);
    };
    if (reduceMotion) { this.running = false; this.draw(); return; }
    this._raf = requestAnimationFrame(loop);
  };

  Orrery.prototype.stop = function () {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  };

  Orrery.prototype.requestRender = function () {
    if (this.running) return;
    var self = this;
    requestAnimationFrame(function () { self.pitch = self.pitchTarget; self.draw(); });
  };

  Orrery.prototype._step = function (dt, now) {
    this.time += dt / 60;
    var idle = now - this.lastInteract > 2600;
    this.yawVel *= Math.pow(0.92, dt);
    this.yaw += this.yawVel * dt * 0.6 + (idle ? 0.0022 * dt : 0);
    this.pitch = lerp(this.pitch, this.pitchTarget, 0.08 * dt);
    var k = 1 - Math.pow(1 - 0.045, dt);
    for (var key in this.p) this.p[key] = lerp(this.p[key], this.t[key], k);
  };

  Orrery.prototype.draw = function () {
    var ctx = this.ctx, w = this.w, h = this.h;
    if (!w) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    this._drawStars(ctx);

    var self = this;
    var N = 120;
    var ringsBack = [], ringsFront = [];

    this.projects.forEach(function (p) {
      var c = COLORS[p.data.health] || COLORS.ok;
      var isSel = self.selected === p, isHover = self.hover === p;
      var dim = self.selected && !isSel ? 0.35 : 1;
      var start = self._bodyAngle(p) - p.data.progress * TAU;
      var pts = [];
      for (var i = 0; i <= N; i++) {
        var th = start + (i / N) * TAU;
        pts.push(self._ringPoint(p, th));
      }
      var progEnd = Math.round(p.data.progress * N);
      for (var j = 0; j < N; j++) {
        var a = pts[j], b = pts[j + 1];
        var back = (a.z + b.z) > 0;
        var seg = { a: a, b: b, prog: j < progEnd, c: c, dim: dim, sel: isSel || isHover };
        (back ? ringsBack : ringsFront).push(seg);
      }
      var body = self._ringPoint(p, self._bodyAngle(p));
      p.screen = { x: body.x, y: body.y, z: body.z, s: body.f };
    });

    this._strokeSegs(ctx, ringsBack, true);
    this._drawCore(ctx);
    this._drawLinks(ctx);
    this._strokeSegs(ctx, ringsFront, false);

    // Cuerpos de atrás hacia delante
    this.projects.slice().sort(function (a, b) { return b.screen.z - a.screen.z; }).forEach(function (p) {
      self._drawBody(ctx, p);
    });
    this._drawLabels(ctx);
  };

  Orrery.prototype._drawStars = function (ctx) {
    var self = this;
    var cy = Math.cos(this.yaw * 0.25), sy = Math.sin(this.yaw * 0.25);
    this.stars.forEach(function (s) {
      var x = s.x * cy - s.z * sy, z = s.x * sy + s.z * cy;
      var f = 12 / (12 + z);
      var px = self.w / 2 + x * f * self.scale * 0.9, py = self.h / 2 + s.y * f * self.scale * 0.6;
      if (px < 0 || py < 0 || px > self.w || py > self.h) return;
      var tw = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(self.time * 1.4 + s.tw);
      ctx.fillStyle = rgba(COLORS.line, 0.55 * s.b * tw * f);
      ctx.fillRect(px, py, 1.2, 1.2);
    });
  };

  Orrery.prototype._strokeSegs = function (ctx, segs, back) {
    ctx.lineCap = 'round';
    segs.forEach(function (s) {
      var depth = clamp(1.15 - s.a.z * 0.12, 0.45, 1.2);
      if (s.prog) {
        ctx.strokeStyle = rgba(s.c, (back ? 0.42 : 0.95) * s.dim);
        ctx.lineWidth = (s.sel ? 3 : 2) * depth;
      } else {
        ctx.strokeStyle = rgba(COLORS.line, (back ? 0.1 : 0.22) * s.dim);
        ctx.lineWidth = 1 * depth;
      }
      ctx.beginPath();
      ctx.moveTo(s.a.x, s.a.y);
      ctx.lineTo(s.b.x, s.b.y);
      ctx.stroke();
    });
  };

  Orrery.prototype._drawCore = function (ctx) {
    var c = this._project(0, 0, 0);
    var r = 0.62 * this.scale * c.f;
    var g = ctx.createRadialGradient(c.x - r * 0.35, c.y - r * 0.4, r * 0.1, c.x, c.y, r);
    g.addColorStop(0, '#5FB0EA');
    g.addColorStop(0.55, '#0B6CB3');
    g.addColorStop(1, '#03375F');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, TAU); ctx.fill();

    // Grabado: meridianos y paralelos del núcleo (solo cara visible)
    ctx.lineWidth = 0.8;
    var self = this, R = 0.62;
    for (var m = 0; m < 6; m++) {
      var lon = (m / 6) * Math.PI;
      ctx.beginPath();
      var started = false;
      for (var i = 0; i <= 40; i++) {
        var lat = -Math.PI / 2 + (i / 40) * Math.PI;
        var p = self._project(R * Math.cos(lat) * Math.cos(lon), R * Math.sin(lat), R * Math.cos(lat) * Math.sin(lon));
        if (p.z > 0.05) { started = false; continue; }
        if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(214,232,248,0.28)';
      ctx.stroke();
    }
    [-0.5, 0, 0.5].forEach(function (lat) {
      ctx.beginPath();
      var started = false;
      for (var i = 0; i <= 48; i++) {
        var lon = (i / 48) * TAU;
        var p = self._project(R * Math.cos(lat) * Math.cos(lon), R * Math.sin(lat), R * Math.cos(lat) * Math.sin(lon));
        if (p.z > 0.05) { started = false; continue; }
        if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(214,232,248,0.22)';
      ctx.stroke();
    });

    // Halo del núcleo
    var halo = ctx.createRadialGradient(c.x, c.y, r * 0.9, c.x, c.y, r * 2.2);
    halo.addColorStop(0, 'rgba(46,139,208,0.28)');
    halo.addColorStop(1, 'rgba(46,139,208,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(c.x, c.y, r * 2.2, 0, TAU); ctx.fill();
  };

  Orrery.prototype._drawLinks = function (ctx) {
    var a = this.p.links;
    if (a < 0.01) return;
    var c = this._project(0, 0, 0);
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.lineDashOffset = reduceMotion ? 0 : -this.time * 18;
    ctx.lineWidth = 1;
    var ps = this.projects;
    ctx.strokeStyle = rgba(COLORS.line, 0.45 * a);
    ps.forEach(function (p) {
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(p.screen.x, p.screen.y); ctx.stroke();
    });
    ctx.strokeStyle = rgba(COLORS.ok, 0.35 * a);
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i], q = ps[(i + 1) % ps.length];
      ctx.beginPath(); ctx.moveTo(p.screen.x, p.screen.y); ctx.lineTo(q.screen.x, q.screen.y); ctx.stroke();
    }
    ctx.restore();
  };

  Orrery.prototype._drawBody = function (ctx, p) {
    var c = COLORS[p.data.health] || COLORS.ok;
    var s = p.screen.s;
    var isSel = this.selected === p, isHover = this.hover === p;
    var dim = this.selected && !isSel ? 0.45 : 1;
    // El riesgo "respira": la luz es el estado
    var pulse = 1;
    if (!reduceMotion && p.data.health !== 'ok') pulse = 0.82 + 0.18 * Math.sin(this.time * (p.data.health === 'bad' ? 3.2 : 2.2));
    var glowR = (isSel || isHover ? 30 : 22) * s * pulse;
    var g = ctx.createRadialGradient(p.screen.x, p.screen.y, 0, p.screen.x, p.screen.y, glowR);
    g.addColorStop(0, rgba(c, 0.75 * dim));
    g.addColorStop(0.35, rgba(c, 0.22 * dim));
    g.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p.screen.x, p.screen.y, glowR, 0, TAU); ctx.fill();

    ctx.fillStyle = rgba([255, 255, 255], 0.95 * dim);
    ctx.beginPath(); ctx.arc(p.screen.x, p.screen.y, (isSel ? 5.5 : 4.2) * s, 0, TAU); ctx.fill();

    if (isSel) {
      ctx.strokeStyle = rgba(c, 0.9);
      ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.arc(p.screen.x, p.screen.y, 11 * s, 0, TAU); ctx.stroke();
    }
  };

  Orrery.prototype._drawLabels = function (ctx) {
    var a = this.mode === 'story' ? this.p.labels : (this.hover ? 1 : 0);
    if (a < 0.02) return;
    var self = this;
    ctx.font = '500 12px Geist, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    this.projects.forEach(function (p) {
      if (self.mode === 'hero' && self.hover !== p) return;
      var label = p.data.name + '  ' + Math.round(p.data.progress * 100) + '%';
      var x = p.screen.x + 14, y = p.screen.y - 14;
      var tw = ctx.measureText(label).width;
      if (x + tw + 12 > self.w) x = p.screen.x - tw - 26;
      ctx.fillStyle = 'rgba(3,26,48,' + 0.82 * a + ')';
      roundRect(ctx, x - 6, y - 11, tw + 12, 22, 6); ctx.fill();
      ctx.fillStyle = 'rgba(234,243,251,' + a + ')';
      ctx.fillText(label, x, y);
    });
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  Orrery.reduceMotion = reduceMotion;
  global.Orrery = Orrery;
})(window);
