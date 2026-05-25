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
  var outlookEmail = "veleskaaar@outlook.com";
  var titleParticles = [];
  var portraitParticles = [];
  var titleSparkles = [];
  var portraitSparkles = [];
  var bgPoints = [];
  var titleCtx = titleCanvas.getContext("2d");
  var portraitCtx = portraitCanvas ? portraitCanvas.getContext("2d") : null;
  var bgImage = new Image();
  var bgReady = false;
  var bgOffscreen = document.createElement("canvas");
  var bgOffCtx = bgOffscreen.getContext("2d");
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
        "  current: {\n" +
        "    school: 'Columbia University',\n" +
        "    degree: 'M.A. Economics',\n" +
        "    location: 'New York, NY',\n" +
        "    period: '2025 - 2026 expected',\n" +
        "    focus: ['behavioral economics', 'microeconomic theory', 'econometrics', 'computational methods']\n" +
        "  },\n\n" +
        "  undergraduate: {\n" +
        "    school: 'Soochow University',\n" +
        "    degree: 'B.A. Economics',\n" +
        "    minor: 'Applied Psychology',\n" +
        "    period: '2021 - 2025',\n" +
        "    honors: ['Academic Excellence Scholarship', 'Meritorious Winner, Interdisciplinary Contest in Modeling']\n" +
        "  },\n\n" +
        "  visiting: {\n" +
        "    school: 'UC Berkeley',\n" +
        "    program: 'Berkeley Global Access Program',\n" +
        "    period: 'Spring 2024',\n" +
        "    note: 'Coursework and research exposure in economics, data, and technology.'\n" +
        "  },\n\n" +
        "  throughline: 'economics + psychology + computation'\n" +
        "};",
      actions: []
    },
    research: {
      title: "module.research",
      code:
        "const research = {\n" +
        "  question: 'How do people and organizations interpret rules under uncertainty?',\n" +
        "  directions: [\n" +
        "    'reference points, value uncertainty, and decision framing',\n" +
        "    'letter-spirit divergence and strategic compliance',\n" +
        "    'AI-mediated negotiation behavior',\n" +
        "    'nationalism, patriotism, and firm narratives',\n" +
        "    'older-worker reemployment and labor-market experience'\n" +
        "  ],\n" +
        "  methods: ['experiment design', 'Python', 'Stata', 'NLP', 'survey design', 'text analysis'],\n" +
        "  style: 'quiet empirical work with a human-behavior lens'\n" +
        "};\n\n" +
        "export default research;",
      actions: []
    },
    cv: {
      title: "module.cv",
      code:
        "const cv = {\n" +
        "  name: 'Xi Chen',\n" +
        "  email: 'xc2826@columbia.edu',\n" +
        "  alternateEmail: 'veleskaaar@outlook.com',\n" +
        "  current: 'M.A. Economics student at Columbia University',\n" +
        "  methods: ['Python', 'Stata', 'SQL', 'SPSS', 'MATLAB', 'NLP', 'experimental design'],\n" +
        "  teaching: 'Teaching Assistant, Intermediate Microeconomics, Columbia University',\n" +
        "  interests: ['behavioral economics', 'computational social science', 'organizational narratives'],\n" +
        "  pdf: '/files/cv-xi-chen.pdf',\n" +
        "  note: 'The PDF preview opens below this code block.'\n" +
        "};\n\n" +
        "open.pdf(cv.pdf);",
      actions: []
    },
    other: {
      title: "module.other",
      code:
        "const other = {\n" +
        "  interface: 'minimal terminal garden',\n" +
        "  palette: ['black', 'white', 'glitter blue', 'soft pink', 'small gold'],\n" +
        "  interests: [\n" +
        "    'computational social science',\n" +
        "    'organizational narratives',\n" +
        "    'human-computer interaction',\n" +
        "    'behavior under institutional constraints'\n" +
        "  ],\n" +
        "  links: {\n" +
        "    github: 'https://github.com/veleskaaar',\n" +
        "    linkedin: 'https://www.linkedin.com/in/xi-veleska-chen-226176303/'\n" +
        "  }\n" +
        "};",
      actions: []
    },
    contact: {
      title: "module.contact",
      code:
        "const contact = {\n" +
        "  columbia: 'xc2826@columbia.edu',\n" +
        "  outlook: 'veleskaaar@outlook.com',\n" +
        "  github: 'https://github.com/veleskaaar',\n" +
        "  linkedin: 'https://www.linkedin.com/in/xi-veleska-chen-226176303/',\n" +
        "  location: 'New York, NY',\n" +
        "  note: 'Static-site mail form: opens your email client with a drafted message.'\n" +
        "};\n\n" +
        "send.message({\n" +
        "  to: contact.outlook,\n" +
        "  cc: contact.columbia,\n" +
        "  tone: 'quiet',\n" +
        "  purpose: 'research conversation'\n" +
        "});",
      actions: []
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

  function coverImageRect(width, height, imageWidth, imageHeight) {
    var scale = Math.max(width / imageWidth, height / imageHeight);
    var drawWidth = imageWidth * scale;
    var drawHeight = imageHeight * scale;
    return {
      x: (width - drawWidth) / 2,
      y: (height - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight
    };
  }

  function createBackground() {
    resizeCanvas(bgCanvas);
    buildBackgroundParticles();
  }

  function loadBackgroundImage() {
    if (!bgCanvas) return;

    bgImage.onload = function () {
      bgReady = true;
      createBackground();
    };
    bgImage.src = bgCanvas.getAttribute("data-hero-galaxy") || "";

    if (bgImage.complete && bgImage.naturalWidth) {
      bgReady = true;
      createBackground();
    }
  }

  function glitterColor(red, green, blue, brightness, saturation) {
    var palettes = [
      { r: 154, g: 224, b: 255 },
      { r: 255, g: 167, b: 224 },
      { r: 255, g: 222, b: 122 },
      { r: 199, g: 185, b: 255 },
      { r: 245, g: 248, b: 255 }
    ];
    var roll = Math.random();
    var colorIndex = roll < 0.4 ? 0 : roll < 0.75 ? 1 : roll < 0.9 ? 2 : 3;

    if (brightness > 236 && saturation < 0.12 && Math.random() < 0.18) {
      colorIndex = 4;
    } else if (red > blue + 28 && Math.random() < 0.65) {
      colorIndex = 1;
    } else if (green > red + 18 && brightness > 110 && Math.random() < 0.55) {
      colorIndex = 2;
    } else if (saturation > 0.34 && blue > red && Math.random() < 0.7) {
      colorIndex = 3;
    }

    return palettes[colorIndex];
  }

  function buildBackgroundParticles() {
    var rect = bgCanvas.getBoundingClientRect();
    bgPoints = [];

    if (!bgReady || !bgImage.naturalWidth || !rect.width || !rect.height) return;

    bgOffscreen.width = Math.max(1, Math.floor(rect.width));
    bgOffscreen.height = Math.max(1, Math.floor(rect.height));
    bgOffCtx.clearRect(0, 0, bgOffscreen.width, bgOffscreen.height);
    bgOffCtx.fillStyle = "#000000";
    bgOffCtx.fillRect(0, 0, bgOffscreen.width, bgOffscreen.height);

    var cover = coverImageRect(
      bgOffscreen.width,
      bgOffscreen.height,
      bgImage.naturalWidth,
      bgImage.naturalHeight
    );

    bgOffCtx.save();
    bgOffCtx.filter = "saturate(1.45) contrast(1.18) brightness(1.2)";
    bgOffCtx.drawImage(bgImage, cover.x, cover.y, cover.width, cover.height);
    bgOffCtx.restore();

    var pixels = bgOffCtx.getImageData(0, 0, bgOffscreen.width, bgOffscreen.height).data;
    var gap = rect.width < 560 ? 5 : 4;
    var maxParticles = rect.width < 560 ? 6800 : 14800;

    for (var y = 0; y < bgOffscreen.height; y += gap) {
      for (var x = 0; x < bgOffscreen.width; x += gap) {
        var index = (y * bgOffscreen.width + x) * 4;
        var red = pixels[index];
        var green = pixels[index + 1];
        var blue = pixels[index + 2];
        var high = Math.max(red, green, blue);
        var low = Math.min(red, green, blue);
        var brightness = (red + green + blue) / 3;
        var saturation = (high - low) / 255;
        var chance = clamp((brightness - 18) / 255 * 0.64 + saturation * 0.54, 0.03, 0.86);

        if (Math.random() > chance) continue;

        var color = glitterColor(red, green, blue, brightness, saturation);
        bgPoints.push({
          x: x + (Math.random() - 0.5) * gap,
          y: y + (Math.random() - 0.5) * gap,
          r: color.r,
          g: color.g,
          b: color.b,
          alpha: clamp(0.32 + brightness / 255 * 0.72 + saturation * 0.22, 0.28, 0.98),
          size: Math.random() < 0.1 ? Math.random() * 2.2 + 1.3 : Math.random() * 1.15 + 0.58,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.00075 + 0.00035,
          drift: Math.random() * 2.2 + 0.35
        });
      }
    }

    while (bgPoints.length > maxParticles) {
      bgPoints.splice(Math.floor(Math.random() * bgPoints.length), 1);
    }

    var ambientCount = Math.floor(maxParticles * 0.34);
    for (var i = 0; i < ambientCount; i += 1) {
      var ambient = [
        { r: 148, g: 221, b: 255 },
        { r: 255, g: 174, b: 220 },
        { r: 255, g: 222, b: 134 }
      ][Math.floor(Math.random() * 3)];
      bgPoints.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: ambient.r,
        g: ambient.g,
        b: ambient.b,
        alpha: Math.random() * 0.3 + 0.14,
        size: Math.random() * 1.15 + 0.45,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.00055 + 0.00025,
        drift: Math.random() * 2.8 + 0.4
      });
    }
  }

  function addSparkles(list, x, y, count) {
    if (prefersReducedMotion) return;

    var colors = [
      { r: 158, g: 226, b: 255 },
      { r: 255, g: 178, b: 224 },
      { r: 255, g: 222, b: 134 },
      { r: 248, g: 248, b: 238 }
    ];

    for (var i = 0; i < count; i += 1) {
      var color = colors[Math.floor(Math.random() * colors.length)];
      var angle = Math.random() * Math.PI * 2;
      var speed = Math.random() * 1.4 + 0.18;
      list.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: color.r,
        g: color.g,
        b: color.b,
        size: Math.random() * 1.9 + 0.8,
        age: 0,
        life: Math.random() * 34 + 42
      });
    }

    while (list.length > 180) {
      list.shift();
    }
  }

  function drawSparkles(ctx, list) {
    for (var i = list.length - 1; i >= 0; i -= 1) {
      var sparkle = list[i];
      sparkle.age += 1;
      sparkle.x += sparkle.vx;
      sparkle.y += sparkle.vy;
      sparkle.vx *= 0.962;
      sparkle.vy *= 0.962;

      var alpha = 1 - sparkle.age / sparkle.life;
      if (alpha <= 0) {
        list.splice(i, 1);
        continue;
      }

      ctx.fillStyle = "rgba(" + sparkle.r + ", " + sparkle.g + ", " + sparkle.b + ", " + clamp(alpha, 0, 0.88) + ")";
      ctx.fillRect(sparkle.x, sparkle.y, sparkle.size, sparkle.size);

      if (sparkle.size > 1.6) {
        ctx.fillStyle = "rgba(" + sparkle.r + ", " + sparkle.g + ", " + sparkle.b + ", " + clamp(alpha * 0.36, 0, 0.28) + ")";
        ctx.fillRect(sparkle.x - sparkle.size * 1.3, sparkle.y + sparkle.size * 0.4, sparkle.size * 3.1, 0.7);
        ctx.fillRect(sparkle.x + sparkle.size * 0.4, sparkle.y - sparkle.size * 1.3, 0.7, sparkle.size * 3.1);
      }
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
    bgCtx.fillStyle = "#000000";
    bgCtx.fillRect(0, 0, rect.width, rect.height);

    if (!bgPoints.length) return;

    bgCtx.save();
    bgCtx.globalCompositeOperation = "screen";

    for (var i = 0; i < bgPoints.length; i += 1) {
      var p = bgPoints[i];
      var driftX = Math.sin(time * p.speed + p.phase) * p.drift;
      var driftY = Math.cos(time * p.speed * 0.72 + p.phase) * p.drift * 0.55;
      var pulse = 0.66 + Math.sin(time * 0.0012 + p.phase) * 0.28;
      var alpha = clamp(p.alpha * pulse, 0.04, 0.92);

      bgCtx.fillStyle = "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + alpha + ")";
      bgCtx.fillRect(p.x + driftX, p.y + driftY, p.size, p.size);

      if (p.size > 1.6 && alpha > 0.48) {
        bgCtx.fillStyle = "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + alpha * 0.18 + ")";
        bgCtx.fillRect(p.x + driftX - p.size, p.y + driftY, p.size * 3.2, 0.7);
        bgCtx.fillRect(p.x + driftX, p.y + driftY - p.size, 0.7, p.size * 3.2);
      }
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

    drawSparkles(titleCtx, titleSparkles);
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
      portraitCtx.globalAlpha = 0.3;
      portraitCtx.filter = "contrast(1.2) brightness(1.04)";
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
      var alpha = clamp(p.alpha * shimmer, 0.34, 0.98);
      portraitCtx.fillStyle = "rgba(248, 248, 238, " + alpha + ")";
      portraitCtx.fillRect(p.x, p.y, p.size, p.size);
    }

    drawSparkles(portraitCtx, portraitSparkles);
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
    addSparkles(titleSparkles, pointer.x, pointer.y, 2);
  }

  function portraitPointerPosition(event) {
    var rect = portraitCanvas.getBoundingClientRect();
    portraitPointer.x = event.clientX - rect.left;
    portraitPointer.y = event.clientY - rect.top;
    portraitPointer.lastMove = performance.now();
    pointer.lastMove = portraitPointer.lastMove;
    addSparkles(portraitSparkles, portraitPointer.x, portraitPointer.y, 3);
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
    codePanel.classList.toggle("is-cv", name === "cv");
    codePanel.classList.add("is-open");
    codePanel.setAttribute("aria-hidden", "false");
  }

  function closePanel() {
    codePanel.classList.remove("is-open");
    codePanel.classList.remove("is-contact");
    codePanel.classList.remove("is-cv");
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
      "mailto:" + outlookEmail +
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

  loadBackgroundImage();
  createBackground();
  buildTitleParticles();
  loadPortraitImage();
  bindEvents();
  revealProfile();
  requestAnimationFrame(animate);
})();
