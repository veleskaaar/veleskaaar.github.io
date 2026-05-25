(function () {
  var hero = document.querySelector(".quiet-hero");
  if (!hero) return;

  var bgCanvas = hero.querySelector("[data-hero-background]");
  var titleCanvas = hero.querySelector("[data-hero-title]");
  var titleField = hero.querySelector("[data-hero-title-field]");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pointer = { x: 0, y: 0, active: false, lastMove: 0 };
  var titleParticles = [];
  var bgPoints = [];
  var bgLines = [];
  var titleCtx = titleCanvas.getContext("2d");
  var bgCtx = bgCanvas.getContext("2d");
  var audioState = {
    ctx: null,
    master: null,
    delay: null,
    feedback: null,
    filter: null,
    active: false,
    scheduling: false
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function resizeCanvas(canvas) {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return rect;
  }

  function createBackground() {
    var rect = resizeCanvas(bgCanvas);
    var count = prefersReducedMotion ? 70 : Math.floor(clamp(rect.width / 7, 100, 210));
    bgPoints = [];
    bgLines = [];

    for (var i = 0; i < count; i += 1) {
      bgPoints.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        z: Math.random() * 0.9 + 0.1,
        speed: Math.random() * 0.08 + 0.025,
        phase: Math.random() * Math.PI * 2
      });
    }

    for (var j = 0; j < 18; j += 1) {
      bgLines.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        len: Math.random() * 180 + 80,
        alpha: Math.random() * 0.08 + 0.03,
        speed: Math.random() * 0.05 + 0.015,
        angle: (Math.random() * 0.3 - 0.15) + Math.PI * 0.08
      });
    }
  }

  function buildTitleParticles() {
    var rect = resizeCanvas(titleCanvas);
    var text = titleCanvas.getAttribute("data-hero-title") || "Xi Chen";
    var offscreen = document.createElement("canvas");
    var offCtx = offscreen.getContext("2d");
    var dpr = 1;
    offscreen.width = Math.floor(rect.width * dpr);
    offscreen.height = Math.floor(rect.height * dpr);

    var fontSize = clamp(rect.width * 0.18, 72, 162);
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.font = "600 " + fontSize + "px Georgia, Times New Roman, serif";

    while (offCtx.measureText(text).width > rect.width * 0.92 && fontSize > 42) {
      fontSize -= 4;
      offCtx.font = "600 " + fontSize + "px Georgia, Times New Roman, serif";
    }

    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
    offCtx.fillStyle = "#ffffff";
    offCtx.fillText(text, rect.width / 2, rect.height / 2 + fontSize * 0.02);

    var pixels = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    var gap = rect.width < 600 ? 5 : 4;
    var targets = [];
    for (var y = 0; y < offscreen.height; y += gap) {
      for (var x = 0; x < offscreen.width; x += gap) {
        var alpha = pixels[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 120 && Math.random() > 0.16) {
          targets.push({ x: x / dpr, y: y / dpr });
        }
      }
    }

    var maxParticles = rect.width < 600 ? 1450 : 2500;
    while (targets.length > maxParticles) {
      targets.splice(Math.floor(Math.random() * targets.length), 1);
    }

    titleParticles = targets.map(function (target, index) {
      var existing = titleParticles[index];
      return {
        x: existing ? existing.x : target.x + (Math.random() - 0.5) * rect.width,
        y: existing ? existing.y : target.y + (Math.random() - 0.5) * rect.height,
        tx: target.x,
        ty: target.y,
        vx: existing ? existing.vx : 0,
        vy: existing ? existing.vy : 0,
        size: Math.random() * 1.45 + 0.65,
        shimmer: Math.random() * Math.PI * 2
      };
    });
  }

  function drawBackground(time) {
    var rect = bgCanvas.getBoundingClientRect();
    bgCtx.clearRect(0, 0, rect.width, rect.height);
    bgCtx.fillStyle = "#07090c";
    bgCtx.fillRect(0, 0, rect.width, rect.height);

    var slowTime = time * 0.00014;
    bgCtx.save();
    bgCtx.globalCompositeOperation = "screen";

    for (var i = 0; i < bgLines.length; i += 1) {
      var line = bgLines[i];
      line.x += Math.cos(line.angle) * line.speed;
      line.y += Math.sin(line.angle) * line.speed;
      if (line.x > rect.width + line.len) line.x = -line.len;
      if (line.y > rect.height + line.len) line.y = -line.len;

      bgCtx.beginPath();
      bgCtx.moveTo(line.x, line.y);
      bgCtx.lineTo(line.x + Math.cos(line.angle) * line.len, line.y + Math.sin(line.angle) * line.len);
      bgCtx.strokeStyle = "rgba(197, 211, 190, " + line.alpha + ")";
      bgCtx.lineWidth = 1;
      bgCtx.stroke();
    }

    for (var j = 0; j < bgPoints.length; j += 1) {
      var point = bgPoints[j];
      if (!prefersReducedMotion) {
        point.y += point.speed * (0.4 + point.z);
        point.x += Math.sin(slowTime + point.phase) * 0.07;
      }
      if (point.y > rect.height + 8) {
        point.y = -8;
        point.x = Math.random() * rect.width;
      }

      var alpha = 0.12 + point.z * 0.34;
      bgCtx.fillStyle = "rgba(228, 234, 221, " + alpha + ")";
      bgCtx.fillRect(point.x, point.y, point.z * 1.35, point.z * 1.35);
    }

    bgCtx.restore();

    bgCtx.save();
    bgCtx.globalAlpha = 0.08;
    bgCtx.strokeStyle = "#d5cab0";
    bgCtx.lineWidth = 1;
    var horizon = rect.height * 0.6;
    for (var k = 0; k < 8; k += 1) {
      var offset = (k * 38 + (time * 0.012)) % 300;
      bgCtx.beginPath();
      bgCtx.moveTo(rect.width * 0.12, horizon + offset);
      bgCtx.lineTo(rect.width * 0.5, horizon - 70 + offset * 0.26);
      bgCtx.lineTo(rect.width * 0.88, horizon + offset);
      bgCtx.stroke();
    }
    bgCtx.restore();
  }

  function drawTitle(time) {
    var rect = titleCanvas.getBoundingClientRect();
    titleCtx.clearRect(0, 0, rect.width, rect.height);
    titleCtx.save();
    titleCtx.globalCompositeOperation = "lighter";

    for (var i = 0; i < titleParticles.length; i += 1) {
      var p = titleParticles[i];
      var ax = (p.tx - p.x) * (pointer.active ? 0.012 : 0.024);
      var ay = (p.ty - p.y) * (pointer.active ? 0.012 : 0.024);

      if (pointer.active && !prefersReducedMotion) {
        var dx = p.x - pointer.x;
        var dy = p.y - pointer.y;
        var distSq = dx * dx + dy * dy;
        var radius = rect.width < 600 ? 82 : 122;
        if (distSq < radius * radius) {
          var dist = Math.sqrt(distSq) || 1;
          var force = (1 - dist / radius) * 3.6;
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
        }
      }

      p.vx = (p.vx + ax) * 0.88;
      p.vy = (p.vy + ay) * 0.88;
      p.x += p.vx;
      p.y += p.vy;

      var shimmer = 0.56 + Math.sin(time * 0.0011 + p.shimmer) * 0.18;
      var alpha = clamp(shimmer, 0.3, 0.82);
      titleCtx.fillStyle = "rgba(238, 244, 236, " + alpha + ")";
      titleCtx.fillRect(p.x, p.y, p.size, p.size);
    }

    titleCtx.restore();
  }

  function animate(time) {
    drawBackground(time);
    drawTitle(time);
    requestAnimationFrame(animate);
  }

  function titlePointerPosition(event) {
    var rect = titleCanvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.lastMove = performance.now();
  }

  function setupAudio() {
    if (audioState.ctx) return;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    var ctx = new AudioContext();
    var master = ctx.createGain();
    var delay = ctx.createDelay(1.8);
    var feedback = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    master.gain.value = 0;
    delay.delayTime.value = 0.42;
    feedback.gain.value = 0.18;
    filter.type = "lowpass";
    filter.frequency.value = 4200;

    delay.connect(feedback);
    feedback.connect(delay);
    master.connect(delay);
    master.connect(filter);
    delay.connect(filter);
    filter.connect(ctx.destination);

    audioState.ctx = ctx;
    audioState.master = master;
    audioState.delay = delay;
    audioState.feedback = feedback;
    audioState.filter = filter;
  }

  function playBell(frequency, startTime, duration, gain) {
    var ctx = audioState.ctx;
    if (!ctx) return;

    var osc = ctx.createOscillator();
    var overtone = ctx.createOscillator();
    var noteGain = ctx.createGain();
    var overtoneGain = ctx.createGain();

    osc.type = "sine";
    overtone.type = "triangle";
    osc.frequency.value = frequency;
    overtone.frequency.value = frequency * 2.01;

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(gain, startTime + 0.035);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    overtoneGain.gain.setValueAtTime(0.0001, startTime);
    overtoneGain.gain.exponentialRampToValueAtTime(gain * 0.18, startTime + 0.02);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    noteGain.connect(audioState.master);
    overtoneGain.connect(audioState.master);

    osc.start(startTime);
    overtone.start(startTime);
    osc.stop(startTime + duration + 0.04);
    overtone.stop(startTime + duration + 0.04);
  }

  function scheduleMotif() {
    if (!audioState.active || audioState.scheduling || !audioState.ctx) return;
    audioState.scheduling = true;

    var ctx = audioState.ctx;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    audioState.master.gain.cancelScheduledValues(ctx.currentTime);
    audioState.master.gain.setTargetAtTime(0.042, ctx.currentTime, 0.8);

    var motif = [0, 4, 7, 11, 9, 7, 4, 2];
    var base = 523.25;
    var now = ctx.currentTime + 0.06;
    for (var i = 0; i < motif.length; i += 1) {
      var ratio = Math.pow(2, motif[i] / 12);
      playBell(base * ratio, now + i * 0.34, 1.25, 0.026);
      if (i === 2 || i === 5) {
        playBell(base * ratio * 0.5, now + i * 0.34 + 0.02, 1.4, 0.012);
      }
    }

    window.setTimeout(function () {
      audioState.scheduling = false;
      if (audioState.active && performance.now() - pointer.lastMove < 4200) {
        scheduleMotif();
      }
    }, 3900);
  }

  function activateAudio() {
    setupAudio();
    if (!audioState.ctx) return;
    audioState.active = true;
    hero.classList.add("is-playing");
    scheduleMotif();
  }

  function softenAudio() {
    audioState.active = false;
    hero.classList.remove("is-playing");
    if (audioState.ctx && audioState.master) {
      audioState.master.gain.setTargetAtTime(0.0001, audioState.ctx.currentTime, 1.2);
    }
  }

  function bindEvents() {
    titleField.addEventListener("pointerenter", function (event) {
      pointer.active = true;
      titlePointerPosition(event);
      activateAudio();
    });

    titleField.addEventListener("pointermove", function (event) {
      pointer.active = true;
      titlePointerPosition(event);
      activateAudio();
    });

    titleField.addEventListener("pointerleave", function () {
      pointer.active = false;
      softenAudio();
    });

    titleField.addEventListener("pointerdown", function (event) {
      titlePointerPosition(event);
      activateAudio();
    });

    window.addEventListener("resize", function () {
      createBackground();
      buildTitleParticles();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) softenAudio();
    });
  }

  createBackground();
  buildTitleParticles();
  bindEvents();
  requestAnimationFrame(animate);
})();
