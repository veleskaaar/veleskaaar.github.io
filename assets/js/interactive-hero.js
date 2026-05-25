(function () {
  var home = document.querySelector(".quiet-home");
  var hero = document.querySelector(".quiet-hero");
  if (!home || !hero) return;

  var bgCanvas = hero.querySelector("[data-hero-background]");
  var titleCanvas = hero.querySelector("[data-hero-title]");
  var titleField = hero.querySelector("[data-hero-title-field]");
  var portraitCanvas = hero.querySelector("[data-hero-portrait]");
  var portraitField = hero.querySelector("[data-hero-portrait-field]");
  var codePanel = home.querySelector("[data-code-panel]");
  var codeOutput = home.querySelector("[data-code-output]");
  var codeTitle = home.querySelector("#quiet-code-title");
  var codeActions = home.querySelector("[data-code-actions]");
  var contactForm = home.querySelector("[data-contact-form]");
  var contactSubject = home.querySelector("[data-contact-subject]");
  var contactMessage = home.querySelector("[data-contact-message]");
  var revealSection = home.querySelector("[data-reveal-section]");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pointer = { x: 0, y: 0, active: false, lastMove: 0 };
  var portraitPointer = { x: 0, y: 0, active: false, lastMove: 0 };
  var profileDismissed = false;
  var columbiaEmail = "xc2826@columbia.edu";
  var zhimiaoEmail = "zhimiao-email@example.com";
  var titleParticles = [];
  var portraitParticles = [];
  var bgPoints = [];
  var bgLines = [];
  var titleCtx = titleCanvas.getContext("2d");
  var portraitCtx = portraitCanvas ? portraitCanvas.getContext("2d") : null;
  var portraitImage = new Image();
  var portraitReady = false;
  var portraitDraw = null;
  var bgCtx = bgCanvas.getContext("2d");
  var typingTimer = null;
  var audioState = {
    ctx: null,
    master: null,
    delay: null,
    feedback: null,
    filter: null,
    active: false,
    scheduling: false
  };

  var modules = {
    education: {
      title: "module.education",
      code:
        "const education = {\n" +
        "  columbia: {\n" +
        "    degree: 'M.A. Economics',\n" +
        "    location: 'New York, NY',\n" +
        "    period: '2025 - 2026 expected',\n" +
        "    focus: ['microeconomic theory', 'behavioral economics', 'research methods']\n" +
        "  },\n\n" +
        "  soochow: {\n" +
        "    degree: 'B.A. Economics',\n" +
        "    minor: 'Applied Psychology',\n" +
        "    period: '2021 - 2025',\n" +
        "    honors: ['Academic Excellence Scholarship', 'ICM Meritorious Winner']\n" +
        "  },\n\n" +
        "  berkeley: {\n" +
        "    program: 'Berkeley Global Access Program',\n" +
        "    period: 'Spring 2024',\n" +
        "    note: 'Visiting student exploring economic research and algorithmic thinking.'\n" +
        "  }\n" +
        "};",
      actions: []
    },
    research: {
      title: "module.research",
      code:
        "const research = [\n" +
        "  'reference points and value uncertainty',\n" +
        "  'letter-spirit divergence and strategic compliance',\n" +
        "  'AI-mediated negotiation behavior',\n" +
        "  'nationalism and patriotism in firm narratives',\n" +
        "  'older-worker reemployment and labor-market experience',\n" +
        "  'NLP-assisted interview and text analysis'\n" +
        "];\n\n" +
        "function currentQuestion() {\n" +
        "  return 'How do people and organizations interpret rules under uncertainty?';\n" +
        "}\n\n" +
        "export { research, currentQuestion };",
      actions: [
        { label: "Open Research", href: "/research/" }
      ]
    },
    cv: {
      title: "module.cv",
      code:
        "const cv = {\n" +
        "  name: 'Xi Chen',\n" +
        "  email: 'xc2826@columbia.edu',\n" +
        "  current: 'M.A. Economics student at Columbia University',\n" +
        "  methods: ['Python', 'Stata', 'SQL', 'SPSS', 'MATLAB', 'NLP', 'experimental design'],\n" +
        "  teaching: 'Teaching Assistant, Intermediate Microeconomics, Columbia University',\n" +
        "  status: 'open to research conversations and collaboration'\n" +
        "};\n\n" +
        "download(cv);",
      actions: [
        { label: "Open CV", href: "/cv/" },
        { label: "Email", href: "mailto:xc2826@columbia.edu" }
      ]
    },
    other: {
      title: "module.other",
      code:
        "const other = {\n" +
        "  style: 'quiet digital space',\n" +
        "  palette: ['black', 'white', 'soft cyan', 'muted amber'],\n" +
        "  interests: [\n" +
        "    'computational social science',\n" +
        "    'organizational narratives',\n" +
        "    'human-computer interaction',\n" +
        "    'behavior under institutional constraints'\n" +
        "  ],\n" +
        "  next: 'Add publications, a real portrait, and project image cards.'\n" +
        "};",
      actions: [
        { label: "GitHub", href: "https://github.com/veleskaaar", external: true }
      ]
    },
    contact: {
      title: "module.contact",
      code:
        "const contact = {\n" +
        "  columbia: 'xc2826@columbia.edu',\n" +
        "  zhimiao: 'zhimiao-email@example.com',\n" +
        "  github: 'https://github.com/veleskaaar',\n" +
        "  linkedin: 'https://www.linkedin.com/in/xi-veleska-chen-226176303/?skipRedirect=true',\n" +
        "  location: 'New York, NY',\n" +
        "  note: 'Static-site mail form: opens your email client with a drafted message.'\n" +
        "};\n\n" +
        "send.message({\n" +
        "  to: contact.zhimiao,\n" +
        "  cc: contact.columbia,\n" +
        "  tone: 'quiet',\n" +
        "  purpose: 'research conversation'\n" +
        "});",
      actions: [
        { label: "Email Columbia", href: "mailto:xc2826@columbia.edu" },
        { label: "GitHub", href: "https://github.com/veleskaaar", external: true },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/xi-veleska-chen-226176303/?skipRedirect=true", external: true }
      ]
    }
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
    var count = prefersReducedMotion ? 80 : Math.floor(clamp(rect.width / 6, 120, 240));
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

    for (var j = 0; j < 22; j += 1) {
      bgLines.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        len: Math.random() * 220 + 90,
        alpha: Math.random() * 0.08 + 0.03,
        speed: Math.random() * 0.05 + 0.015,
        angle: (Math.random() * 0.28 - 0.14) + Math.PI * 0.08
      });
    }
  }

  function buildTitleParticles() {
    var rect = resizeCanvas(titleCanvas);
    var text = titleCanvas.getAttribute("data-hero-title") || "Xi Chen";
    var offscreen = document.createElement("canvas");
    var offCtx = offscreen.getContext("2d");
    offscreen.width = Math.floor(rect.width);
    offscreen.height = Math.floor(rect.height);

    var fontSize = clamp(Math.min(rect.width * 0.2, rect.height * 0.78), 70, 178);
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.font = "800 " + fontSize + "px \"SFMono-Regular\", \"JetBrains Mono\", \"IBM Plex Mono\", \"Fira Code\", \"Cascadia Code\", Menlo, Monaco, Consolas, monospace";

    while (offCtx.measureText(text).width > rect.width * 0.92 && fontSize > 44) {
      fontSize -= 4;
      offCtx.font = "800 " + fontSize + "px \"SFMono-Regular\", \"JetBrains Mono\", \"IBM Plex Mono\", \"Fira Code\", \"Cascadia Code\", Menlo, Monaco, Consolas, monospace";
    }

    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
    offCtx.fillStyle = "#ffffff";
    offCtx.fillText(text, rect.width / 2, rect.height / 2 + fontSize * 0.02);

    var pixels = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    var gap = rect.width < 620 ? 5 : 4;
    var targets = [];
    for (var y = 0; y < offscreen.height; y += gap) {
      for (var x = 0; x < offscreen.width; x += gap) {
        var alpha = pixels[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 120 && Math.random() > 0.14) {
          targets.push({ x: x, y: y });
        }
      }
    }

    var maxParticles = rect.width < 620 ? 1650 : 3100;
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
        size: Math.random() * 1.5 + 0.7,
        shimmer: Math.random() * Math.PI * 2
      };
    });
  }

  function loadPortraitImage() {
    if (!portraitCanvas) return;

    portraitImage.onload = function () {
      portraitReady = true;
      buildPortraitParticles();
    };
    portraitImage.src = portraitCanvas.getAttribute("data-hero-portrait") || "";

    if (portraitImage.complete && portraitImage.naturalWidth) {
      portraitReady = true;
      buildPortraitParticles();
    }
  }

  function buildPortraitParticles() {
    if (!portraitCanvas || !portraitCtx || !portraitReady || !portraitImage.naturalWidth) return;

    var rect = resizeCanvas(portraitCanvas);
    var offscreen = document.createElement("canvas");
    var offCtx = offscreen.getContext("2d");
    offscreen.width = Math.floor(rect.width);
    offscreen.height = Math.floor(rect.height);

    var scale = Math.max(rect.width / portraitImage.naturalWidth, rect.height / portraitImage.naturalHeight);
    var drawWidth = portraitImage.naturalWidth * scale;
    var drawHeight = portraitImage.naturalHeight * scale;
    var drawX = (rect.width - drawWidth) / 2;
    var drawY = drawHeight > rect.height ? 0 : (rect.height - drawHeight) / 2;
    portraitDraw = { x: drawX, y: drawY, width: drawWidth, height: drawHeight };

    offCtx.fillStyle = "#000000";
    offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
    offCtx.drawImage(portraitImage, drawX, drawY, drawWidth, drawHeight);

    var pixels = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    var gap = rect.width < 420 ? 3 : 4;
    var targets = [];

    for (var y = 0; y < offscreen.height; y += gap) {
      for (var x = 0; x < offscreen.width; x += gap) {
        var index = (y * offscreen.width + x) * 4;
        var brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        if (brightness > 34 && Math.random() < 0.9) {
          targets.push({
            x: x,
            y: y,
            tone: clamp(brightness / 255, 0.22, 0.92)
          });
        }
      }
    }

    var maxParticles = rect.width < 420 ? 5600 : 11800;
    while (targets.length > maxParticles) {
      targets.splice(Math.floor(Math.random() * targets.length), 1);
    }

    portraitParticles = targets.map(function (target, index) {
      var existing = portraitParticles[index];
      return {
        x: existing ? existing.x : target.x + (Math.random() - 0.5) * rect.width,
        y: existing ? existing.y : target.y + (Math.random() - 0.5) * rect.height,
        tx: target.x,
        ty: target.y,
        vx: existing ? existing.vx : 0,
        vy: existing ? existing.vy : 0,
        size: Math.random() * 1.25 + target.tone * 2.1,
        alpha: target.tone,
        shimmer: Math.random() * Math.PI * 2
      };
    });
  }

  function drawBackground(time) {
    var rect = bgCanvas.getBoundingClientRect();
    bgCtx.clearRect(0, 0, rect.width, rect.height);
    bgCtx.fillStyle = "#050608";
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

      var alpha = 0.11 + point.z * 0.32;
      bgCtx.fillStyle = "rgba(228, 234, 221, " + alpha + ")";
      bgCtx.fillRect(point.x, point.y, point.z * 1.35, point.z * 1.35);
    }

    bgCtx.restore();

    bgCtx.save();
    bgCtx.globalAlpha = 0.09;
    bgCtx.strokeStyle = "#d5cab0";
    bgCtx.lineWidth = 1;
    var horizon = rect.height * 0.62;
    for (var k = 0; k < 9; k += 1) {
      var offset = (k * 38 + (time * 0.012)) % 340;
      bgCtx.beginPath();
      bgCtx.moveTo(rect.width * 0.08, horizon + offset);
      bgCtx.lineTo(rect.width * 0.5, horizon - 84 + offset * 0.24);
      bgCtx.lineTo(rect.width * 0.92, horizon + offset);
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
        var radius = rect.width < 620 ? 88 : 136;
        if (distSq < radius * radius) {
          var dist = Math.sqrt(distSq) || 1;
          var force = (1 - dist / radius) * 3.8;
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

  function drawPortrait(time) {
    if (!portraitCanvas || !portraitCtx) return;

    var rect = portraitCanvas.getBoundingClientRect();
    portraitCtx.clearRect(0, 0, rect.width, rect.height);
    if (!portraitReady) return;

    if (portraitDraw) {
      portraitCtx.save();
      portraitCtx.globalCompositeOperation = "screen";
      portraitCtx.globalAlpha = portraitPointer.active ? 0.2 : 0.34;
      portraitCtx.filter = "contrast(1.18) brightness(1.12)";
      portraitCtx.drawImage(
        portraitImage,
        portraitDraw.x,
        portraitDraw.y,
        portraitDraw.width,
        portraitDraw.height
      );
      portraitCtx.restore();
    }

    portraitCtx.save();
    portraitCtx.globalCompositeOperation = "lighter";

    for (var i = 0; i < portraitParticles.length; i += 1) {
      var p = portraitParticles[i];
      var ax = (p.tx - p.x) * (portraitPointer.active ? 0.011 : 0.023);
      var ay = (p.ty - p.y) * (portraitPointer.active ? 0.011 : 0.023);

      if (portraitPointer.active && !prefersReducedMotion) {
        var dx = p.x - portraitPointer.x;
        var dy = p.y - portraitPointer.y;
        var distSq = dx * dx + dy * dy;
        var radius = rect.width < 360 ? 76 : 116;
        if (distSq < radius * radius) {
          var dist = Math.sqrt(distSq) || 1;
          var force = (1 - dist / radius) * 3.2;
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
        }
      }

      p.vx = (p.vx + ax) * 0.9;
      p.vy = (p.vy + ay) * 0.9;
      p.x += p.vx;
      p.y += p.vy;

      var shimmer = 0.82 + Math.sin(time * 0.0009 + p.shimmer) * 0.14;
      var alpha = clamp(p.alpha * shimmer, 0.24, 0.96);
      portraitCtx.fillStyle = "rgba(238, 244, 236, " + alpha + ")";
      portraitCtx.fillRect(p.x, p.y, p.size, p.size);
    }

    portraitCtx.restore();
  }

  function animate(time) {
    drawBackground(time);
    drawPortrait(time);
    drawTitle(time);
    requestAnimationFrame(animate);
  }

  function titlePointerPosition(event) {
    var rect = titleCanvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.lastMove = performance.now();
  }

  function portraitPointerPosition(event) {
    var rect = portraitCanvas.getBoundingClientRect();
    portraitPointer.x = event.clientX - rect.left;
    portraitPointer.y = event.clientY - rect.top;
    portraitPointer.lastMove = performance.now();
    pointer.lastMove = portraitPointer.lastMove;
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
    audioState.master.gain.setTargetAtTime(0.038, ctx.currentTime, 0.8);

    var motif = [0, 4, 7, 11, 9, 7, 4, 2];
    var base = 523.25;
    var now = ctx.currentTime + 0.06;
    for (var i = 0; i < motif.length; i += 1) {
      var ratio = Math.pow(2, motif[i] / 12);
      playBell(base * ratio, now + i * 0.34, 1.25, 0.024);
      if (i === 2 || i === 5) {
        playBell(base * ratio * 0.5, now + i * 0.34 + 0.02, 1.4, 0.011);
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

  function typeCode(text) {
    if (typingTimer) window.clearInterval(typingTimer);
    if (prefersReducedMotion) {
      codeOutput.textContent = text;
      return;
    }

    codeOutput.textContent = "";
    var index = 0;
    typingTimer = window.setInterval(function () {
      codeOutput.textContent += text.slice(index, index + 3);
      index += 3;
      if (index >= text.length) {
        window.clearInterval(typingTimer);
        typingTimer = null;
      }
    }, 9);
  }

  function renderActions(actions) {
    codeActions.innerHTML = "";
    actions.forEach(function (action) {
      var link = document.createElement("a");
      link.textContent = action.label;
      link.href = action.href;
      if (action.external) {
        link.target = "_blank";
        link.rel = "noopener";
      }
      codeActions.appendChild(link);
    });
  }

  function openPanel(name) {
    var module = modules[name] || modules.education;
    codeTitle.textContent = module.title;
    typeCode(module.code);
    renderActions(module.actions || []);
    codePanel.classList.toggle("is-contact", name === "contact");
    codePanel.classList.add("is-open");
    codePanel.setAttribute("aria-hidden", "false");
  }

  function closePanel() {
    codePanel.classList.remove("is-open");
    codePanel.classList.remove("is-contact");
    codePanel.setAttribute("aria-hidden", "true");
  }

  function dismissProfile() {
    if (!revealSection) return;
    if (!revealSection.classList.contains("is-visible")) return;
    profileDismissed = true;
    revealSection.classList.add("is-dismissed");
    revealSection.classList.remove("is-visible");
  }

  function resetProfileDismissalNearHero() {
    if (!revealSection || !profileDismissed) return;
    if (window.scrollY < window.innerHeight * 0.45) {
      profileDismissed = false;
      revealSection.classList.remove("is-dismissed");
    }
  }

  function submitContact(event) {
    event.preventDefault();

    var subject = contactSubject && contactSubject.value.trim()
      ? contactSubject.value.trim()
      : "Hello Xi";
    var message = contactMessage && contactMessage.value.trim()
      ? contactMessage.value.trim()
      : "Hi Xi,\n\n";

    var mailto =
      "mailto:" + zhimiaoEmail +
      "?cc=" + encodeURIComponent(columbiaEmail) +
      "&subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(message);

    window.location.href = mailto;
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

    if (portraitField && portraitCanvas) {
      portraitField.addEventListener("pointerenter", function (event) {
        portraitPointer.active = true;
        portraitPointerPosition(event);
        activateAudio();
      });

      portraitField.addEventListener("pointermove", function (event) {
        portraitPointer.active = true;
        portraitPointerPosition(event);
        activateAudio();
      });

      portraitField.addEventListener("pointerleave", function () {
        portraitPointer.active = false;
        softenAudio();
      });

      portraitField.addEventListener("pointerdown", function (event) {
        portraitPointerPosition(event);
        activateAudio();
      });
    }

    home.addEventListener("click", function (event) {
      if (event.target.closest("[data-close-profile]")) {
        dismissProfile();
        return;
      }

      var panelButton = event.target.closest("[data-panel]");
      if (panelButton) {
        openPanel(panelButton.getAttribute("data-panel"));
        return;
      }

      if (event.target.closest("[data-close-panel]")) {
        closePanel();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePanel();
        dismissProfile();
      }
    });

    if (contactForm) {
      contactForm.addEventListener("submit", submitContact);
    }

    window.addEventListener("scroll", resetProfileDismissalNearHero, { passive: true });

    window.addEventListener("resize", function () {
      createBackground();
      buildTitleParticles();
      buildPortraitParticles();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) softenAudio();
    });
  }

  function revealProfile() {
    if (!revealSection) return;
    if (!("IntersectionObserver" in window)) {
      revealSection.classList.add("is-visible");
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !profileDismissed) {
          revealSection.classList.add("is-visible");
          revealSection.classList.remove("is-dismissed");
        } else if (!entry.isIntersecting) {
          revealSection.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.28 });

    observer.observe(revealSection);
  }

  createBackground();
  buildTitleParticles();
  loadPortraitImage();
  bindEvents();
  revealProfile();
  requestAnimationFrame(animate);
})();
