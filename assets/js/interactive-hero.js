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
  var codeWindow = home.querySelector(".quiet-code__window");
  var contactForm = home.querySelector("[data-contact-form]");
  var contactSubject = home.querySelector("[data-contact-subject]");
  var contactMessage = home.querySelector("[data-contact-message]");
  var contactStatus = home.querySelector("[data-contact-status]");
  var revealSection = home.querySelector("[data-reveal-section]");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pointer = { x: 0, y: 0, active: false, lastMove: 0, lastSparkle: 0 };
  var portraitPointer = { x: 0, y: 0, active: false, lastMove: 0, lastSparkle: 0 };
  var profileDismissed = false;
  var columbiaEmail = "xc2826@columbia.edu";
  var outlookEmail = "veleskaaar@outlook.com";
  var titleParticles = [];
  var portraitParticles = [];
  var titleSparkles = [];
  var portraitSparkles = [];
  var bgPoints = [];
  var bgRibbons = [];
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

  function block(lines) {
    return lines.join("\n");
  }

  var modules = {
    education: {
      title: "module.education",
      code: block([
        "## Columbia University",
        "> M.A. in Economics | 2025-2026 expected",
        "I am currently pursuing an M.A. in Economics at Columbia University. My graduate training focuses on microeconomic theory, behavioral economics, and empirical methods, and has strengthened my interest in using formal economic reasoning to study decision-making, incentives, and behavior in organizational and institutional settings.",
        "",
        "## Soochow University",
        "> B.A. in Economics, minor in Applied Psychology | 2021-2025",
        "I received my B.A. in Economics from Soochow University, with a minor in Applied Psychology. This combination shaped the interdisciplinary foundation of my research interests: I approach economic behavior not only through incentives and constraints, but also through cognition, judgment, motivation, and social context.",
        "",
        "## University of California, Berkeley",
        "> Visiting Student, Berkeley Global Access Program | Spring 2024",
        "As a visiting student at UC Berkeley, I explored topics in economic research and algorithmic approaches. This experience further encouraged my interest in connecting behavioral questions with computational tools, empirical research design, and broader social-scientific inquiry."
      ]),
      actions: []
    },
    research: {
      title: "module.research",
      code: block([
        "## Reference Points and Value Uncertainty",
        "> Incoming Summer Research Assistant, Columbia University | supervised by Prof. Mark Dean",
        "I will work as a Summer Research Assistant in the Columbia Economics Department on an ongoing project related to reference points and value uncertainty. This project is closely connected to my interest in behavioral decision theory, especially how individuals form, revise, and act upon reference-dependent evaluations under uncertainty.",
        "",
        "## Letter-Spirit Divergence and Strategic Compliance",
        "> Research Assistant, Columbia Business School, Morris Lab | supervised by Prof. Michael Morris",
        "At Columbia Business School, I contribute to a research project on malicious compliance, strategic rule adherence, and the divergence between the letter and spirit of rules. This work reflects one of my central research interests: how people interpret rules, navigate institutional expectations, and make decisions in environments where formal requirements and social meaning may not fully align.",
        "",
        "## AI-Mediated Negotiation Behavior",
        "I have also contributed to the design and implementation of a chatbot-based negotiation experiment. This project examines how negotiation behavior may differ when participants interact with AI versus human counterparts, connecting organizational behavior, experimental design, and human-AI interaction.",
        "",
        "## Organizational and Institutional Research Projects",
        "> Research Assistant, Columbia Business School | supervised by Prof. Lori Yue",
        "I have supported research on how nationalism and patriotism are expressed in organizational narratives and corporate behavior. My work involves literature review, text data collection and coding, and NLP-based semantic analysis of firm communications, which connects my interests in organizational behavior, institutional environments, and computational social science.",
        "",
        "## Older Worker Reemployment",
        "> Researcher, coauthored project under review",
        "I worked on a structured review project on the reemployment process and experiences of older workers. The project involved large-scale literature screening, bibliometric mapping, and thematic synthesis, and contributed to a coauthored paper currently under review. This experience trained me to think systematically about how individual labor-market experiences are shaped by organizational practices, social perceptions, and institutional structures.",
        "",
        "## Work-Family Conflict and Psychological Resilience",
        "> Capstone Project",
        "For my capstone project, I conducted semi-structured interviews with accompanying mothers to study work-family conflict and psychological resilience. I used NLP-based methods, including SpaCy, Sentence Transformers, VADER, and TextBlob, to analyze interview narratives. This project reflects my broader interest in using computational tools to study psychologically rich and socially embedded human experiences.",
        "",
        "## Human-Computer Interaction and Consumer Choice",
        "> Project Director",
        "I directed a research project on how human-computer interaction features of smart wearable devices influence consumer purchase intentions. The project combined bibliometric analysis, discrete choice experiment design, survey implementation, and binary logit modeling. It gave me early training in connecting behavioral theory, experimental choice design, and quantitative modeling.",
        "",
        "## Working paper",
        "To be added."
      ]),
      actions: []
    },
    cv: {
      title: "module.cv",
      code: "",
      actions: []
    },
    other: {
      title: "module.other",
      code: block([
        "## Teaching",
        "I served as a Teaching Assistant for Intermediate Microeconomics at Columbia University. In this role, I led weekly recitation sessions, held office hours, graded problem sets, and helped prepare review materials. Teaching microeconomics has made me more attentive to the craft of explanation: how abstract models, once carefully unpacked, can become intuitive tools for understanding behavior.",
        "",
        "## Skills and Methods",
        "My research toolkit includes Python, C++, SPSS, SQL, Stata, and MATLAB. I am especially interested in combining formal economic modeling, experimental design, survey-based measurement, discrete choice methods, and NLP/text-as-data approaches.",
        "",
        "## Beyond Research",
        "Outside academic work, I am drawn to literature, choreography, and movement. I enjoy reading literary and philosophical works, choreographing in styles such as jazz and Afro, and staying active through swimming. These interests reflect a different but related part of my intellectual life: an interest in rhythm, interpretation, structure, and the many ways people move through social worlds.",
        "",
        "## Links",
        "- GitHub: https://github.com/veleskaaar",
        "- LinkedIn: https://www.linkedin.com/in/xi-veleska-chen-226176303/"
      ]),
      actions: []
    },
    contact: {
      title: "module.contact",
      code: block([
        "## Email",
        "- Columbia: xc2826@columbia.edu",
        "- Outlook: veleskaaar@outlook.com",
        "",
        "## Links",
        "- GitHub: https://github.com/veleskaaar",
        "- LinkedIn: https://www.linkedin.com/in/xi-veleska-chen-226176303/",
        "",
        "Use the message box below to draft an email to my Outlook address, with my Columbia email copied."
      ]),
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
    if (bgCanvas) resizeCanvas(bgCanvas);
  }

  function loadBackgroundImage() {
    return;
  }

  function glitterColor(red, green, blue, brightness, saturation) {
    var palettes = [
      { r: 138, g: 226, b: 255 },
      { r: 255, g: 158, b: 222 },
      { r: 255, g: 214, b: 120 },
      { r: 202, g: 238, b: 255 },
      { r: 248, g: 252, b: 255 }
    ];
    var roll = Math.random();
    var colorIndex = roll < 0.42 ? 0 : roll < 0.68 ? 1 : roll < 0.9 ? 2 : 3;

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
    bgRibbons = [];

    if (!rect.width || !rect.height) return;

    if (bgReady && bgImage.naturalWidth) {
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
      bgOffCtx.filter = "saturate(1.55) contrast(1.22) brightness(1.18)";
      bgOffCtx.drawImage(bgImage, cover.x, cover.y, cover.width, cover.height);
      bgOffCtx.restore();

      var pixels = bgOffCtx.getImageData(0, 0, bgOffscreen.width, bgOffscreen.height).data;
      var sampleGap = rect.width < 560 ? 4 : 3;
      var maxSampled = rect.width < 560 ? 9200 : 17800;

      for (var sy = 0; sy < bgOffscreen.height; sy += sampleGap) {
        for (var sx = 0; sx < bgOffscreen.width; sx += sampleGap) {
          var index = (sy * bgOffscreen.width + sx) * 4;
          var red = pixels[index];
          var green = pixels[index + 1];
          var blue = pixels[index + 2];
          var high = Math.max(red, green, blue);
          var low = Math.min(red, green, blue);
          var brightness = (red + green + blue) / 3;
          var saturation = (high - low) / 255;
          var chance = clamp((brightness - 14) / 255 * 0.78 + saturation * 0.62, 0.015, 0.84);

          if (Math.random() > chance) continue;

          var mapped = glitterColor(red, green, blue, brightness, saturation);
          var bright = brightness > 178 || Math.random() < saturation * 0.42;
          bgPoints.push({
            x: sx + (Math.random() - 0.5) * sampleGap * 1.8,
            y: sy + (Math.random() - 0.5) * sampleGap * 1.8,
            r: mapped.r,
            g: mapped.g,
            b: mapped.b,
            alpha: clamp(brightness / 255 * 0.9 + saturation * 0.5, 0.2, 1),
            size: bright ? Math.random() * 1.45 + 0.82 : Math.random() * 0.78 + 0.34,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.00036 + 0.00012,
            drift: Math.random() * 1.45 + 0.18,
            metallic: bright && Math.random() < 0.46
          });
        }
      }

      var ambientCount = rect.width < 560 ? 2200 : 4200;
      var ambientPalette = [
        { r: 136, g: 226, b: 255 },
        { r: 255, g: 160, b: 220 },
        { r: 255, g: 215, b: 122 },
        { r: 235, g: 248, b: 255 }
      ];
      for (var a = 0; a < ambientCount; a += 1) {
        var ambient = ambientPalette[Math.floor(Math.random() * ambientPalette.length)];
        var near = Math.random() < 0.45;
        var t = Math.random();
        bgPoints.push({
          x: near ? rect.width * (0.12 + t * 0.86) + (Math.random() - 0.5) * rect.width * 0.18 : Math.random() * rect.width,
          y: near ? rect.height * (0.95 - t * 1.02) + Math.sin(t * 7) * rect.height * 0.07 + (Math.random() - 0.5) * rect.height * 0.16 : Math.random() * rect.height,
          r: ambient.r,
          g: ambient.g,
          b: ambient.b,
          alpha: Math.random() * 0.5 + 0.2,
          size: Math.random() < 0.2 ? Math.random() * 1.8 + 0.82 : Math.random() * 0.72 + 0.34,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.00032 + 0.00012,
          drift: Math.random() * 1.3 + 0.18,
          metallic: Math.random() < 0.18
        });
      }

      while (bgPoints.length > maxSampled) {
        bgPoints.splice(Math.floor(Math.random() * bgPoints.length), 1);
      }

      buildGalaxyRibbons(rect);
      return;
    }

    var palette = [
      { r: 156, g: 226, b: 255 },
      { r: 200, g: 239, b: 255 },
      { r: 255, g: 174, b: 222 },
      { r: 255, g: 213, b: 132 },
      { r: 246, g: 250, b: 255 }
    ];

    var count = rect.width < 560 ? 4300 : 8200;
    var streamCount = rect.width < 560 ? 3000 : 6200;
    for (var i = 0; i < count; i += 1) {
      var color = palette[Math.floor(Math.random() * palette.length)];
      var nearStream = Math.random() < 0.38;
      var t = Math.random();
      var curve = Math.sin(t * Math.PI * 2.2) * 0.08 + Math.cos(t * Math.PI * 4.6) * 0.035;
      var x = nearStream
        ? rect.width * (0.14 + t * 0.82 + curve) + (Math.random() - 0.5) * rect.width * 0.24
        : Math.random() * rect.width;
      var y = nearStream
        ? rect.height * (0.92 - t * 0.98 + Math.sin(t * 8.2) * 0.055) + (Math.random() - 0.5) * rect.height * 0.18
        : Math.random() * rect.height;
      var isBright = Math.random() < (nearStream ? 0.3 : 0.1);

      bgPoints.push({
        x: x,
        y: y,
        r: color.r,
        g: color.g,
        b: color.b,
        alpha: nearStream ? Math.random() * 0.5 + 0.22 : Math.random() * 0.3 + 0.12,
        size: isBright ? Math.random() * 1.35 + 0.8 : Math.random() * 0.68 + 0.34,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.00036 + 0.00012,
        drift: Math.random() * 1.35 + 0.2,
        metallic: isBright
      });
    }

    for (var s = 0; s < streamCount; s += 1) {
      var u = Math.random();
      var streamColor = palette[Math.floor(Math.random() * palette.length)];
      var streamCurve = Math.sin(u * Math.PI * 2.4) * 0.09 + Math.cos(u * Math.PI * 5.2) * 0.032;
      var streamX = rect.width * (0.1 + u * 0.86 + streamCurve) + (Math.random() - 0.5) * rect.width * 0.11;
      var streamY = rect.height * (0.98 - u * 1.04 + Math.sin(u * 7.4) * 0.06) + (Math.random() - 0.5) * rect.height * 0.11;
      bgPoints.push({
        x: streamX,
        y: streamY,
        r: streamColor.r,
        g: streamColor.g,
        b: streamColor.b,
        alpha: Math.random() * 0.56 + 0.22,
        size: Math.random() < 0.18 ? Math.random() * 1.65 + 0.86 : Math.random() * 0.66 + 0.34,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.00034 + 0.00016,
        drift: Math.random() * 1.18 + 0.22,
        metallic: Math.random() < 0.3
      });
    }

    buildGalaxyRibbons(rect);
  }

  function buildGalaxyRibbons(rect) {
    var ribbonColors = [
      { r: 160, g: 226, b: 255, glow: "rgba(160, 226, 255, 0.72)" },
      { r: 255, g: 203, b: 232, glow: "rgba(255, 203, 232, 0.56)" },
      { r: 255, g: 224, b: 140, glow: "rgba(255, 224, 140, 0.58)" },
      { r: 232, g: 246, b: 255, glow: "rgba(232, 246, 255, 0.72)" }
    ];

    var ribbonCount = rect.width < 560 ? 5 : 8;
    for (var i = 0; i < ribbonCount; i += 1) {
      var color = ribbonColors[i % ribbonColors.length];
      var points = [];
      var offset = (i - ribbonCount / 2) * rect.width * 0.018;
      var phase = Math.random() * Math.PI * 2;
      var amplitude = rect.width * (0.035 + Math.random() * 0.055);

      for (var step = 0; step <= 12; step += 1) {
        var t = step / 12;
        var x = rect.width * (0.1 + t * 0.86) + offset + Math.sin(t * 7.4 + phase) * amplitude;
        var y = rect.height * (0.99 - t * 1.07) + Math.cos(t * 6.2 + phase) * rect.height * 0.065;
        points.push({ x: x, y: y });
      }

      bgRibbons.push({
        points: points,
        r: color.r,
        g: color.g,
        b: color.b,
        glow: color.glow,
        alpha: 0.065 + Math.random() * 0.065,
        width: 0.75 + Math.random() * (rect.width < 560 ? 1.4 : 2.1),
        phase: phase,
        speed: 0.00011 + Math.random() * 0.00012,
        shimmer: 0.1 + Math.random() * 0.16
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

    while (list.length > 80) {
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

    var fontSize = clamp(Math.min(rect.width * 0.2, rect.height * 0.78), 66, 164);
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
    var gap = 2;
    var targets = [];
    for (var y = 0; y < offscreen.height; y += gap) {
      for (var x = 0; x < offscreen.width; x += gap) {
        var alpha = pixels[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 110 && Math.random() > 0.2) {
          targets.push({ x: x, y: y });
        }
      }
    }

    var maxParticles = rect.width < 620 ? 3000 : 5800;
    while (targets.length > maxParticles) {
      targets.splice(Math.floor(Math.random() * targets.length), 1);
    }

    titleParticles = targets.map(function (target, index) {
      var existing = titleParticles[index];
      return {
        x: existing ? existing.x : target.x + (Math.random() - 0.5) * 12,
        y: existing ? existing.y : target.y + (Math.random() - 0.5) * 12,
        tx: target.x,
        ty: target.y,
        vx: existing ? existing.vx : 0,
        vy: existing ? existing.vy : 0,
        size: Math.random() * 0.52 + 0.68,
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

    var scale = Math.min(rect.width / portraitImage.naturalWidth, rect.height / portraitImage.naturalHeight) * 1.16;
    var drawWidth = portraitImage.naturalWidth * scale;
    var drawHeight = portraitImage.naturalHeight * scale;
    var drawX = (rect.width - drawWidth) / 2;
    var drawY = drawHeight > rect.height
      ? Math.max((rect.height - drawHeight) * 0.28, -rect.height * 0.08)
      : (rect.height - drawHeight) / 2;
    portraitDraw = { x: drawX, y: drawY, width: drawWidth, height: drawHeight };

    offCtx.fillStyle = "#000000";
    offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
    offCtx.drawImage(portraitImage, drawX, drawY, drawWidth, drawHeight);

    var pixels = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    var gap = 3;
    var targets = [];

    for (var y = 0; y < offscreen.height; y += gap) {
      for (var x = 0; x < offscreen.width; x += gap) {
        var index = (y * offscreen.width + x) * 4;
        var brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        if (brightness > 24 && Math.random() < 0.96) {
          targets.push({
            x: x,
            y: y,
            tone: clamp(brightness / 255, 0.28, 1)
          });
        }
      }
    }

    var maxParticles = rect.width < 420 ? 5200 : 9800;
    while (targets.length > maxParticles) {
      targets.splice(Math.floor(Math.random() * targets.length), 1);
    }

    portraitParticles = targets.map(function (target, index) {
      var existing = portraitParticles[index];
      return {
        x: existing ? existing.x : target.x + (Math.random() - 0.5) * 18,
        y: existing ? existing.y : target.y + (Math.random() - 0.5) * 18,
        tx: target.x,
        ty: target.y,
        vx: existing ? existing.vx : 0,
        vy: existing ? existing.vy : 0,
        size: Math.random() * 0.56 + target.tone * 1.1,
        alpha: clamp(target.tone * 1.28, 0.48, 1),
        shimmer: Math.random() * Math.PI * 2
      };
    });
  }

  function drawBackground(time) {
    var rect = bgCanvas.getBoundingClientRect();
    bgCtx.clearRect(0, 0, rect.width, rect.height);
    var base = bgCtx.createLinearGradient(0, 0, rect.width, rect.height);
    base.addColorStop(0, "#02040a");
    base.addColorStop(0.42, "#030816");
    base.addColorStop(0.72, "#00030a");
    base.addColorStop(1, "#000000");
    bgCtx.fillStyle = base;
    bgCtx.fillRect(0, 0, rect.width, rect.height);

    if (!bgPoints.length && !bgRibbons.length) return;

    drawGalaxyRibbons(bgCtx, time, rect);

    bgCtx.save();
    bgCtx.globalCompositeOperation = "lighter";

    for (var i = 0; i < bgPoints.length; i += 1) {
      var p = bgPoints[i];
      var driftX = Math.sin(time * p.speed + p.phase) * p.drift;
      var driftY = Math.cos(time * p.speed * 0.72 + p.phase) * p.drift * 0.55;
      var pulse = 0.66 + Math.sin(time * 0.0012 + p.phase) * 0.28;
      var alpha = clamp(p.alpha * pulse, 0.04, 0.92);
      var focusX = (p.x - rect.width * 0.5) / (rect.width * 0.29);
      var focusY = (p.y - rect.height * 0.43) / (rect.height * 0.34);
      var focusDistance = focusX * focusX + focusY * focusY;
      var focusDamp = 1 - clamp(1.14 - focusDistance, 0, 1) * 0.58;
      var titleBand = p.y > rect.height * 0.58 && p.y < rect.height * 0.82 && Math.abs(p.x - rect.width * 0.5) < rect.width * 0.45;
      if (titleBand) {
        focusDamp *= 0.28;
      }
      alpha *= focusDamp;

      bgCtx.fillStyle = "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + alpha + ")";
      bgCtx.fillRect(p.x + driftX, p.y + driftY, p.size, p.size);

      if ((p.metallic || p.size > 1.7) && alpha > 0.4) {
        bgCtx.fillStyle = "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + alpha * 0.26 + ")";
        bgCtx.fillRect(p.x + driftX - p.size * 1.4, p.y + driftY + p.size * 0.35, p.size * 3.8, 0.8);
        bgCtx.fillRect(p.x + driftX + p.size * 0.35, p.y + driftY - p.size * 1.4, 0.8, p.size * 3.8);
      }
    }

    bgCtx.restore();
  }

  function drawGalaxyRibbons(ctx, time, rect) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    var wash = ctx.createLinearGradient(rect.width * 0.78, 0, rect.width * 0.12, rect.height);
    wash.addColorStop(0, "rgba(132, 224, 255, 0.13)");
    wash.addColorStop(0.36, "rgba(255, 166, 222, 0.11)");
    wash.addColorStop(0.64, "rgba(255, 214, 126, 0.115)");
    wash.addColorStop(1, "rgba(116, 234, 222, 0.09)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.filter = "blur(22px)";
    var upperGlow = ctx.createRadialGradient(rect.width * 0.78, rect.height * 0.08, 0, rect.width * 0.78, rect.height * 0.08, rect.width * 0.5);
    upperGlow.addColorStop(0, "rgba(143, 222, 255, 0.28)");
    upperGlow.addColorStop(0.36, "rgba(255, 210, 145, 0.16)");
    upperGlow.addColorStop(0.58, "rgba(255, 158, 222, 0.08)");
    upperGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = upperGlow;
    ctx.fillRect(0, 0, rect.width, rect.height);

    var lowerGlow = ctx.createRadialGradient(rect.width * 0.18, rect.height * 0.9, 0, rect.width * 0.18, rect.height * 0.9, rect.width * 0.5);
    lowerGlow.addColorStop(0, "rgba(115, 236, 230, 0.2)");
    lowerGlow.addColorStop(0.46, "rgba(255, 160, 222, 0.12)");
    lowerGlow.addColorStop(0.7, "rgba(255, 210, 120, 0.08)");
    lowerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = lowerGlow;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.filter = "blur(10px)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    var flowGradient = ctx.createLinearGradient(0, rect.height, rect.width, 0);
    flowGradient.addColorStop(0, "rgba(118, 235, 246, 0.18)");
    flowGradient.addColorStop(0.28, "rgba(255, 152, 220, 0.16)");
    flowGradient.addColorStop(0.54, "rgba(162, 226, 255, 0.22)");
    flowGradient.addColorStop(0.76, "rgba(255, 207, 108, 0.22)");
    flowGradient.addColorStop(1, "rgba(174, 235, 255, 0.16)");
    ctx.strokeStyle = flowGradient;
    ctx.shadowColor = "rgba(169, 226, 255, 0.32)";
    ctx.shadowBlur = rect.width < 560 ? 18 : 30;
    ctx.lineWidth = rect.width < 560 ? 20 : 40;
    ctx.beginPath();
    ctx.moveTo(-rect.width * 0.18, rect.height * 0.96);
    ctx.bezierCurveTo(rect.width * 0.18, rect.height * 0.7, rect.width * 0.32, rect.height * 0.33, rect.width * 0.66, rect.height * 0.2);
    ctx.bezierCurveTo(rect.width * 0.86, rect.height * 0.12, rect.width * 1.02, rect.height * 0.02, rect.width * 1.18, -rect.height * 0.12);
    ctx.stroke();

    ctx.lineWidth = rect.width < 560 ? 11 : 22;
    ctx.strokeStyle = "rgba(255, 184, 220, 0.13)";
    ctx.beginPath();
    ctx.moveTo(-rect.width * 0.08, rect.height * 0.82);
    ctx.bezierCurveTo(rect.width * 0.18, rect.height * 0.66, rect.width * 0.46, rect.height * 0.56, rect.width * 0.7, rect.height * 0.3);
    ctx.bezierCurveTo(rect.width * 0.88, rect.height * 0.1, rect.width * 1.03, rect.height * 0.06, rect.width * 1.1, -rect.height * 0.04);
    ctx.stroke();
    ctx.restore();

    for (var i = 0; i < bgRibbons.length; i += 1) {
      var ribbon = bgRibbons[i];
      var wave = Math.sin(time * ribbon.speed + ribbon.phase) * ribbon.shimmer;
      var alpha = clamp(ribbon.alpha + wave * 0.35, 0.035, 0.18);

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = ribbon.glow;
      ctx.shadowBlur = rect.width < 560 ? 10 : 18;

      ctx.beginPath();
      for (var p = 0; p < ribbon.points.length; p += 1) {
        var point = ribbon.points[p];
        var x = point.x + Math.sin(time * 0.00018 + ribbon.phase + p) * 6;
        var y = point.y + Math.cos(time * 0.00016 + ribbon.phase + p) * 5;
        if (p === 0) {
          ctx.moveTo(x, y);
        } else {
          var previous = ribbon.points[p - 1];
          var cpX = (previous.x + x) / 2;
          var cpY = (previous.y + y) / 2;
          ctx.quadraticCurveTo(previous.x, previous.y, cpX, cpY);
        }
      }

      var wideGradient = ctx.createLinearGradient(0, rect.height, rect.width, 0);
      wideGradient.addColorStop(0, "rgba(68, 220, 211, " + alpha * 0.62 + ")");
      wideGradient.addColorStop(0.42, "rgba(" + ribbon.r + ", " + ribbon.g + ", " + ribbon.b + ", " + alpha + ")");
      wideGradient.addColorStop(0.72, "rgba(255, 220, 120, " + alpha * 0.76 + ")");
      wideGradient.addColorStop(1, "rgba(242, 247, 255, " + alpha * 0.46 + ")");
      ctx.strokeStyle = wideGradient;
      ctx.lineWidth = ribbon.width;
      ctx.stroke();

      ctx.shadowBlur = rect.width < 560 ? 5 : 9;
      ctx.strokeStyle = "rgba(248, 250, 255, " + clamp(alpha * 1.15, 0.045, 0.16) + ")";
      ctx.lineWidth = Math.max(0.7, ribbon.width * 0.42);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.translate(rect.width * 0.5, rect.height * 0.43);
    ctx.scale(1.02, 0.8);
    var portraitFade = ctx.createRadialGradient(0, 0, 0, 0, 0, rect.height * 0.36);
    portraitFade.addColorStop(0, "rgba(0, 0, 0, 0.64)");
    portraitFade.addColorStop(0.62, "rgba(0, 0, 0, 0.28)");
    portraitFade.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = portraitFade;
    ctx.fillRect(-rect.width, -rect.height, rect.width * 2, rect.height * 2);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    var titleFade = ctx.createLinearGradient(0, rect.height * 0.55, 0, rect.height * 0.86);
    titleFade.addColorStop(0, "rgba(0, 0, 0, 0)");
    titleFade.addColorStop(0.34, "rgba(0, 0, 0, 0.38)");
    titleFade.addColorStop(0.82, "rgba(0, 0, 0, 0.46)");
    titleFade.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = titleFade;
    ctx.fillRect(rect.width * 0.05, rect.height * 0.55, rect.width * 0.9, rect.height * 0.32);
    ctx.restore();

    ctx.restore();
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

      var shimmer = 0.92 + Math.sin(time * 0.001 + p.shimmer) * 0.08;
      var alpha = clamp(shimmer, 0.78, 1);
      titleCtx.fillStyle = "rgba(252, 253, 249, " + alpha + ")";
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
      portraitCtx.globalAlpha = 0.18;
      portraitCtx.filter = "grayscale(1) contrast(1.35) brightness(1.12)";
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

      var shimmer = 0.92 + Math.sin(time * 0.00082 + p.shimmer) * 0.1;
      var alpha = clamp(p.alpha * shimmer, 0.6, 1);
      portraitCtx.fillStyle = "rgba(252, 253, 249, " + alpha + ")";
      portraitCtx.fillRect(p.x, p.y, p.size, p.size);
    }

    drawSparkles(portraitCtx, portraitSparkles);
    portraitCtx.restore();
  }

  function animate(time) {
    drawPortrait(time);
    drawTitle(time);
    requestAnimationFrame(animate);
  }

  function titlePointerPosition(event) {
    var rect = titleCanvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.lastMove = performance.now();
    if (pointer.lastMove - pointer.lastSparkle > 42) {
      addSparkles(titleSparkles, pointer.x, pointer.y, 1);
      pointer.lastSparkle = pointer.lastMove;
    }
  }

  function portraitPointerPosition(event) {
    var rect = portraitCanvas.getBoundingClientRect();
    portraitPointer.x = event.clientX - rect.left;
    portraitPointer.y = event.clientY - rect.top;
    portraitPointer.lastMove = performance.now();
    pointer.lastMove = portraitPointer.lastMove;
    if (portraitPointer.lastMove - portraitPointer.lastSparkle > 54) {
      addSparkles(portraitSparkles, portraitPointer.x, portraitPointer.y, 1);
      portraitPointer.lastSparkle = portraitPointer.lastMove;
    }
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
    audioState.master.gain.setTargetAtTime(0.028, ctx.currentTime, 0.7);

    var motif = [0, 2, 7, 9, 11, 7, 4, 2];
    var base = 523.25;
    var now = ctx.currentTime + 0.06;
    for (var i = 0; i < motif.length; i += 1) {
      var ratio = Math.pow(2, motif[i] / 12);
      playBell(base * ratio, now + i * 0.38, 1.35, 0.019);
      if (i === 2 || i === 5) {
        playBell(base * ratio * 0.5, now + i * 0.38 + 0.03, 1.5, 0.008);
      }
    }

    window.setTimeout(function () {
      audioState.scheduling = false;
      if (audioState.active && performance.now() - pointer.lastMove < 4200) {
        scheduleMotif();
      }
    }, 4300);
  }

  function activateAudio() {
    setupAudio();
    if (!audioState.ctx) return;
    if (audioState.ctx.state === "suspended") {
      audioState.ctx.resume();
    }
    audioState.active = true;
    hero.classList.add("is-playing");
    scheduleMotif();
  }

  function maybeSoftenAudio() {
    if (!pointer.active && !portraitPointer.active) {
      softenAudio();
    }
  }

  function softenAudio() {
    audioState.active = false;
    hero.classList.remove("is-playing");
    if (audioState.ctx && audioState.master) {
      audioState.master.gain.setTargetAtTime(0.0001, audioState.ctx.currentTime, 1.2);
    }
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function terminalLine(line) {
    if (!line) {
      return "<span class=\"quiet-code__line quiet-code__line--spacer\"></span>";
    }

    var className = "quiet-code__line--text";
    var text = line;
    if (line.indexOf("$ ") === 0) {
      className = "quiet-code__line--command";
    } else if (line.indexOf("## ") === 0) {
      className = "quiet-code__line--heading";
      text = line.slice(3);
    } else if (line.indexOf("> ") === 0) {
      className = "quiet-code__line--meta";
      text = line.slice(2);
    } else if (line.indexOf("- ") === 0) {
      className = "quiet-code__line--bullet";
    }

    return "<span class=\"quiet-code__line " + className + "\">" + escapeHtml(text) + "</span>";
  }

  function renderTerminal(text) {
    codeOutput.innerHTML = text.split("\n").map(terminalLine).join("");
  }

  function typeCode(text) {
    if (typingTimer) window.clearInterval(typingTimer);
    typingTimer = null;
    renderTerminal(text);
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
    if (codeWindow) codeWindow.scrollTop = 0;
    if (codeOutput && codeOutput.parentElement) codeOutput.parentElement.scrollTop = 0;
    if (name === "contact") setContactStatus("");
  }

  function closePanel() {
    codePanel.classList.remove("is-open");
    codePanel.classList.remove("is-contact");
    codePanel.classList.remove("is-cv");
    codePanel.setAttribute("aria-hidden", "true");
  }

  function setContactStatus(message) {
    if (!contactStatus) return;
    contactStatus.textContent = message;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(field);
      }
    });
  }

  function fillContactTemplate(name) {
    var templates = {
      research: {
        subject: "Research conversation",
        message: "Hi Xi,\n\nI came across your work and would be glad to connect about related research interests.\n\n"
      },
      collab: {
        subject: "Possible collaboration",
        message: "Hi Xi,\n\nI would like to reach out about a possible collaboration related to behavioral economics, organizations, or text-as-data methods.\n\n"
      },
      hello: {
        subject: "Hello Xi",
        message: "Hi Xi,\n\nI wanted to say hello and connect.\n\n"
      }
    };
    var template = templates[name];
    if (!template) return;
    if (contactSubject) contactSubject.value = template.subject;
    if (contactMessage) contactMessage.value = template.message;
    setContactStatus("template.loaded: " + template.subject);
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

    setContactStatus("opening.email.draft -> " + outlookEmail);
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
      maybeSoftenAudio();
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
        maybeSoftenAudio();
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

      var copyButton = event.target.closest("[data-copy-email]");
      if (copyButton) {
        var email = copyButton.getAttribute("data-copy-email");
        copyText(email)
          .then(function () {
            setContactStatus("copied: " + email);
          })
          .catch(function () {
            setContactStatus("copy.failed: select the email manually");
          });
        return;
      }

      var templateButton = event.target.closest("[data-contact-template]");
      if (templateButton) {
        fillContactTemplate(templateButton.getAttribute("data-contact-template"));
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
