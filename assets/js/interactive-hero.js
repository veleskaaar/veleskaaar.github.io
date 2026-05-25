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
        "EDUCATION",
        "",
        "Columbia University",
        "M.A. in Economics | 2025-2026 expected",
        "I am currently pursuing an M.A. in Economics at Columbia University. My graduate training focuses on microeconomic theory, behavioral economics, and empirical methods, and has strengthened my interest in using formal economic reasoning to study decision-making, incentives, and behavior in organizational and institutional settings.",
        "",
        "Soochow University",
        "B.A. in Economics, minor in Applied Psychology | 2021-2025",
        "I received my B.A. in Economics from Soochow University, with a minor in Applied Psychology. This combination shaped the interdisciplinary foundation of my research interests: I approach economic behavior not only through incentives and constraints, but also through cognition, judgment, motivation, and social context.",
        "",
        "University of California, Berkeley",
        "Visiting Student, Berkeley Global Access Program | Spring 2024",
        "As a visiting student at UC Berkeley, I explored topics in economic research and algorithmic approaches. This experience further encouraged my interest in connecting behavioral questions with computational tools, empirical research design, and broader social-scientific inquiry."
      ]),
      actions: []
    },
    research: {
      title: "module.research",
      code: block([
        "RESEARCH",
        "",
        "Reference Points and Value Uncertainty",
        "Incoming Summer Research Assistant, Columbia University | supervised by Prof. Mark Dean",
        "I will work as a Summer Research Assistant in the Columbia Economics Department on an ongoing project related to reference points and value uncertainty. This project is closely connected to my interest in behavioral decision theory, especially how individuals form, revise, and act upon reference-dependent evaluations under uncertainty.",
        "",
        "Letter-Spirit Divergence and Strategic Compliance",
        "Research Assistant, Columbia Business School, Morris Lab | supervised by Prof. Michael Morris",
        "At Columbia Business School, I contribute to a research project on malicious compliance, strategic rule adherence, and the divergence between the letter and spirit of rules. This work reflects one of my central research interests: how people interpret rules, navigate institutional expectations, and make decisions in environments where formal requirements and social meaning may not fully align.",
        "",
        "AI-Mediated Negotiation Behavior",
        "I have also contributed to the design and implementation of a chatbot-based negotiation experiment. This project examines how negotiation behavior may differ when participants interact with AI versus human counterparts, connecting organizational behavior, experimental design, and human-AI interaction.",
        "",
        "Organizational and Institutional Research Projects",
        "Research Assistant, Columbia Business School | supervised by Prof. Lori Yue",
        "I have supported research on how nationalism and patriotism are expressed in organizational narratives and corporate behavior. My work involves literature review, text data collection and coding, and NLP-based semantic analysis of firm communications, which connects my interests in organizational behavior, institutional environments, and computational social science.",
        "",
        "Older Worker Reemployment",
        "Researcher, coauthored project under review",
        "I worked on a structured review project on the reemployment process and experiences of older workers. The project involved large-scale literature screening, bibliometric mapping, and thematic synthesis, and contributed to a coauthored paper currently under review. This experience trained me to think systematically about how individual labor-market experiences are shaped by organizational practices, social perceptions, and institutional structures.",
        "",
        "Work-Family Conflict and Psychological Resilience",
        "Capstone Project",
        "For my capstone project, I conducted semi-structured interviews with accompanying mothers to study work-family conflict and psychological resilience. I used NLP-based methods, including SpaCy, Sentence Transformers, VADER, and TextBlob, to analyze interview narratives. This project reflects my broader interest in using computational tools to study psychologically rich and socially embedded human experiences.",
        "",
        "Human-Computer Interaction and Consumer Choice",
        "Project Director",
        "I directed a research project on how human-computer interaction features of smart wearable devices influence consumer purchase intentions. The project combined bibliometric analysis, discrete choice experiment design, survey implementation, and binary logit modeling. It gave me early training in connecting behavioral theory, experimental choice design, and quantitative modeling.",
        "",
        "Working paper",
        "To be added."
      ]),
      actions: []
    },
    cv: {
      title: "module.cv",
      code: block([
        "CV",
        "",
        "Xi (Veleska) Chen",
        "M.A. Economics student, Columbia University",
        "",
        "Research interests",
        "Behavioral economics; microeconomic theory; organizational behavior; psychology; computational social science.",
        "",
        "Methods",
        "Formal economic reasoning, experimental design, survey-based measurement, discrete choice methods, NLP/text-as-data analysis.",
        "",
        "Programming and tools",
        "Python, C++, SPSS, SQL, Stata, MATLAB.",
        "",
        "The PDF preview opens below this text."
      ]),
      actions: []
    },
    other: {
      title: "module.other",
      code: block([
        "OTHER",
        "",
        "Teaching",
        "I served as a Teaching Assistant for Intermediate Microeconomics at Columbia University. In this role, I led weekly recitation sessions, held office hours, graded problem sets, and helped prepare review materials. Teaching microeconomics has made me more attentive to the craft of explanation: how abstract models, once carefully unpacked, can become intuitive tools for understanding behavior.",
        "",
        "Skills and Methods",
        "My research toolkit includes Python, C++, SPSS, SQL, Stata, and MATLAB. I am especially interested in combining formal economic modeling, experimental design, survey-based measurement, discrete choice methods, and NLP/text-as-data approaches.",
        "",
        "Beyond Research",
        "Outside academic work, I am drawn to literature, choreography, and movement. I enjoy reading literary and philosophical works, choreographing in styles such as jazz and Afro, and staying active through swimming. These interests reflect a different but related part of my intellectual life: an interest in rhythm, interpretation, structure, and the many ways people move through social worlds.",
        "",
        "Links",
        "GitHub: https://github.com/veleskaaar",
        "LinkedIn: https://www.linkedin.com/in/xi-veleska-chen-226176303/"
      ]),
      actions: []
    },
    contact: {
      title: "module.contact",
      code: block([
        "CONTACT",
        "",
        "Columbia: xc2826@columbia.edu",
        "Outlook: veleskaaar@outlook.com",
        "",
        "GitHub: https://github.com/veleskaaar",
        "LinkedIn: https://www.linkedin.com/in/xi-veleska-chen-226176303/",
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
      { r: 114, g: 220, b: 255 },
      { r: 255, g: 128, b: 221 },
      { r: 255, g: 217, b: 92 },
      { r: 180, g: 164, b: 255 },
      { r: 250, g: 252, b: 255 }
    ];
    var roll = Math.random();
    var colorIndex = roll < 0.44 ? 0 : roll < 0.76 ? 1 : roll < 0.91 ? 2 : 3;

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
    bgOffCtx.filter = "saturate(1.7) contrast(1.26) brightness(1.34)";
    bgOffCtx.drawImage(bgImage, cover.x, cover.y, cover.width, cover.height);
    bgOffCtx.restore();

    var pixels = bgOffCtx.getImageData(0, 0, bgOffscreen.width, bgOffscreen.height).data;
    var gap = rect.width < 560 ? 5 : 4;
    var maxParticles = rect.width < 560 ? 5600 : 10800;

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
        var chance = clamp((brightness - 8) / 255 * 0.72 + saturation * 0.64, 0.06, 0.92);

        if (Math.random() > chance) continue;

        var color = glitterColor(red, green, blue, brightness, saturation);
        bgPoints.push({
          x: x + (Math.random() - 0.5) * gap,
          y: y + (Math.random() - 0.5) * gap,
          r: color.r,
          g: color.g,
          b: color.b,
          alpha: clamp(0.38 + brightness / 255 * 0.78 + saturation * 0.28, 0.32, 1),
          size: Math.random() < 0.14 ? Math.random() * 2.7 + 1.35 : Math.random() * 1.25 + 0.65,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.00078 + 0.00034,
          drift: Math.random() * 2.6 + 0.45,
          metallic: Math.random() < 0.18
        });
      }
    }

    while (bgPoints.length > maxParticles) {
      bgPoints.splice(Math.floor(Math.random() * bgPoints.length), 1);
    }

    var ambientCount = Math.floor(maxParticles * 0.32);
    for (var i = 0; i < ambientCount; i += 1) {
      var ambient = [
        { r: 116, g: 219, b: 255 },
        { r: 255, g: 136, b: 220 },
        { r: 255, g: 220, b: 98 },
        { r: 190, g: 170, b: 255 }
      ][Math.floor(Math.random() * 4)];
      bgPoints.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: ambient.r,
        g: ambient.g,
        b: ambient.b,
        alpha: Math.random() * 0.34 + 0.16,
        size: Math.random() * 1.35 + 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.00055 + 0.00025,
        drift: Math.random() * 3.2 + 0.5,
        metallic: Math.random() < 0.12
      });
    }

    var galaxyCount = rect.width < 560 ? 2800 : 5600;
    var centerX = rect.width * 0.52;
    var centerY = rect.height * 0.45;
    var radiusX = rect.width * 0.72;
    var radiusY = rect.height * 0.42;
    var tilt = -0.18;
    var cosTilt = Math.cos(tilt);
    var sinTilt = Math.sin(tilt);

    for (var g = 0; g < galaxyCount; g += 1) {
      var radius = Math.pow(Math.random(), 0.55);
      var arm = Math.floor(Math.random() * 4);
      var theta = arm * Math.PI * 0.5 + radius * 4.2 + (Math.random() - 0.5) * (0.72 - radius * 0.34);
      var scatter = (1 - radius) * 0.18 + 0.035;
      var localX = Math.cos(theta) * radiusX * radius + (Math.random() - 0.5) * rect.width * scatter;
      var localY = Math.sin(theta) * radiusY * radius + (Math.random() - 0.5) * rect.height * scatter;
      var x = centerX + localX * cosTilt - localY * sinTilt;
      var y = centerY + localX * sinTilt + localY * cosTilt;

      if (x < -40 || x > rect.width + 40 || y < -40 || y > rect.height + 40) continue;

      var streamColor = [
        { r: 92, g: 210, b: 255 },
        { r: 255, g: 123, b: 218 },
        { r: 255, g: 217, b: 86 },
        { r: 236, g: 240, b: 255 }
      ][Math.floor(Math.random() * 4)];
      var coreBoost = 1 - radius;
      bgPoints.push({
        x: x,
        y: y,
        r: streamColor.r,
        g: streamColor.g,
        b: streamColor.b,
        alpha: clamp(0.28 + coreBoost * 0.54 + Math.random() * 0.3, 0.24, 0.98),
        size: Math.random() < 0.2 ? Math.random() * 2.6 + 1.2 : Math.random() * 1.28 + 0.58,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0007 + 0.00025,
        drift: Math.random() * 2.4 + 0.5,
        metallic: Math.random() < 0.28
      });
    }

    var totalMax = rect.width < 560 ? 9800 : 18000;
    while (bgPoints.length > totalMax) {
      bgPoints.splice(Math.floor(Math.random() * bgPoints.length), 1);
    }

    buildGalaxyRibbons(rect);
  }

  function buildGalaxyRibbons(rect) {
    var ribbonColors = [
      { r: 98, g: 197, b: 255, glow: "rgba(98, 197, 255, 0.86)" },
      { r: 255, g: 219, b: 112, glow: "rgba(255, 219, 112, 0.84)" },
      { r: 137, g: 244, b: 224, glow: "rgba(137, 244, 224, 0.7)" },
      { r: 255, g: 156, b: 219, glow: "rgba(255, 156, 219, 0.68)" },
      { r: 234, g: 241, b: 255, glow: "rgba(234, 241, 255, 0.84)" }
    ];

    var ribbonCount = rect.width < 560 ? 6 : 10;
    for (var i = 0; i < ribbonCount; i += 1) {
      var color = ribbonColors[i % ribbonColors.length];
      var points = [];
      var offset = (i - ribbonCount / 2) * rect.height * 0.018;
      var phase = Math.random() * Math.PI * 2;
      var amplitude = rect.height * (0.035 + Math.random() * 0.042);
      var lift = rect.height * (0.08 + Math.random() * 0.18);

      for (var step = 0; step <= 11; step += 1) {
        var t = step / 11;
        var x = -rect.width * 0.22 + t * rect.width * 1.48 + Math.sin(t * 7 + phase) * rect.width * 0.042;
        var y = rect.height * (0.74 - t * 0.54) + offset - lift + Math.sin(t * 8.5 + phase) * amplitude;
        points.push({ x: x, y: y });
      }

      bgRibbons.push({
        points: points,
        r: color.r,
        g: color.g,
        b: color.b,
        glow: color.glow,
        alpha: 0.035 + Math.random() * 0.085,
        width: rect.width * (0.004 + Math.random() * 0.008),
        phase: phase,
        speed: 0.00014 + Math.random() * 0.00016,
        shimmer: 0.16 + Math.random() * 0.18
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

    var fontSize = clamp(Math.min(rect.width * 0.15, rect.height * 0.74), 54, 150);
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
    var gap = rect.width < 620 ? 4 : 3;
    var targets = [];
    for (var y = 0; y < offscreen.height; y += gap) {
      for (var x = 0; x < offscreen.width; x += gap) {
        var alpha = pixels[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 120 && Math.random() > 0.14) {
          targets.push({ x: x, y: y });
        }
      }
    }

    var maxParticles = rect.width < 620 ? 2200 : 5000;
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
        size: Math.random() * 1.55 + 1.0,
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
    var gap = 3;
    var targets = [];

    for (var y = 0; y < offscreen.height; y += gap) {
      for (var x = 0; x < offscreen.width; x += gap) {
        var index = (y * offscreen.width + x) * 4;
        var brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        if (brightness > 28 && Math.random() < 0.94) {
          targets.push({
            x: x,
            y: y,
            tone: clamp(brightness / 255, 0.28, 1)
          });
        }
      }
    }

    var maxParticles = rect.width < 420 ? 6200 : 12400;
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
        size: Math.random() * 1.35 + target.tone * 2.35,
        alpha: clamp(target.tone * 1.18, 0.4, 1),
        shimmer: Math.random() * Math.PI * 2
      };
    });
  }

  function drawBackground(time) {
    var rect = bgCanvas.getBoundingClientRect();
    bgCtx.clearRect(0, 0, rect.width, rect.height);
    bgCtx.fillStyle = "#000000";
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
      var focusX = (p.x - rect.width * 0.5) / (rect.width * 0.33);
      var focusY = (p.y - rect.height * 0.48) / (rect.height * 0.39);
      var focusDistance = focusX * focusX + focusY * focusY;
      var focusDamp = 1 - clamp(1.12 - focusDistance, 0, 1) * 0.42;
      var titleBand = p.y > rect.height * 0.58 && p.y < rect.height * 0.82 && Math.abs(p.x - rect.width * 0.5) < rect.width * 0.45;
      if (titleBand) {
        focusDamp *= 0.36;
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

    for (var i = 0; i < bgRibbons.length; i += 1) {
      var ribbon = bgRibbons[i];
      var wave = Math.sin(time * ribbon.speed + ribbon.phase) * ribbon.shimmer;
      var alpha = clamp(ribbon.alpha + wave, 0.05, 0.36);

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = ribbon.glow;
      ctx.shadowBlur = rect.width < 560 ? 14 : 26;

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
      ctx.lineWidth = ribbon.width * 1.8;
      ctx.stroke();

      ctx.shadowBlur = rect.width < 560 ? 7 : 14;
      ctx.strokeStyle = "rgba(248, 250, 255, " + clamp(alpha * 1.85, 0.08, 0.28) + ")";
      ctx.lineWidth = Math.max(1, ribbon.width * 0.22);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.translate(rect.width * 0.5, rect.height * 0.43);
    ctx.scale(1.15, 0.78);
    var portraitFade = ctx.createRadialGradient(0, 0, 0, 0, 0, rect.height * 0.34);
    portraitFade.addColorStop(0, "rgba(0, 0, 0, 0.58)");
    portraitFade.addColorStop(0.58, "rgba(0, 0, 0, 0.24)");
    portraitFade.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = portraitFade;
    ctx.fillRect(-rect.width, -rect.height, rect.width * 2, rect.height * 2);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    var titleFade = ctx.createLinearGradient(0, rect.height * 0.55, 0, rect.height * 0.86);
    titleFade.addColorStop(0, "rgba(0, 0, 0, 0)");
    titleFade.addColorStop(0.36, "rgba(0, 0, 0, 0.42)");
    titleFade.addColorStop(0.82, "rgba(0, 0, 0, 0.5)");
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

      var shimmer = 0.84 + Math.sin(time * 0.0011 + p.shimmer) * 0.18;
      var alpha = clamp(shimmer, 0.68, 1);
      titleCtx.fillStyle = "rgba(248, 249, 244, " + alpha + ")";
      titleCtx.fillRect(p.x, p.y, p.size * 1.22, p.size * 1.22);
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
      portraitCtx.globalAlpha = 0.2;
      portraitCtx.filter = "grayscale(1) contrast(1.28) brightness(1.08)";
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

      var shimmer = 0.9 + Math.sin(time * 0.0009 + p.shimmer) * 0.12;
      var alpha = clamp(p.alpha * shimmer, 0.46, 1);
      portraitCtx.fillStyle = "rgba(250, 250, 244, " + alpha + ")";
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
    if (prefersReducedMotion || text.length > 700) {
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
