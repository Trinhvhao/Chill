(function () {
  "use strict";

  var FLOWER_CYCLE = [
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
  ];

  var giftLanding = document.getElementById("gift-landing");
  var giftBoxBtn = document.getElementById("gift-box-btn");
  var envelopeStack = document.querySelector(".envelope-stack");
  var bloomField = document.getElementById("bloom-field");
  var sparkleField = document.getElementById("sparkle-field");
  var scrapbookStage = document.getElementById("scrapbook-stage");
  var giftMusic = document.getElementById("gift-music");

  var flowerIdCounter = 0;

  function spawnFlower(x, y, size, duration, delay) {
    var img = document.createElement("img");
    img.src = FLOWER_CYCLE[flowerIdCounter % FLOWER_CYCLE.length];
    img.alt = "";
    img.className = "bloom-flower in";
    img.loading = "eager";
    img.decoding = "async";
    img.draggable = false;
    img.style.width = size + "px";
    img.style.height = size + "px";
    img.style.setProperty("--fx", x - size / 2 + "px");
    img.style.setProperty("--fy", y - size / 2 + "px");
    img.style.setProperty("--dur", duration + "s");
    img.style.setProperty("--delay", delay + "s");

    var rstart = Math.round(Math.random() * 24 - 12);
    img.style.setProperty("--rstart", rstart + "deg");
    var hue = Math.round(Math.random() * 34 - 17);
    var sat = (0.88 + Math.random() * 0.3).toFixed(2);
    var bri = (0.94 + Math.random() * 0.16).toFixed(2);
    var blurDepth = Math.random() < 0.35 ? (Math.random() * 1.4).toFixed(2) : "0";
    img.style.filter =
      "hue-rotate(" + hue + "deg) saturate(" + sat + ") brightness(" + bri + ") " +
      "drop-shadow(0 " + Math.round(size * 0.045) + "px " + Math.round(size * 0.07) + "px rgba(120, 30, 40, 0.16))" +
      (blurDepth !== "0" ? " blur(" + blurDepth + "px)" : "");
    img.style.zIndex = String(Math.round(size));

    img.dataset.id = flowerIdCounter;
    img.dataset.x = x;
    img.dataset.y = y;
    img.dataset.size = size;
    bloomField.appendChild(img);
    flowerIdCounter++;
    return img;
  }

  function spawnSparkles(w, h) {
    if (!sparkleField) return;
    sparkleField.innerHTML = "";
    var count = Math.min(60, Math.max(26, Math.round((w * h) / 45000)));
    for (var i = 0; i < count; i++) {
      var dot = document.createElement("span");
      dot.className = "bloom-sparkle";
      var size = 3 + Math.random() * 5;
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.setProperty("--sx", Math.random() * w + "px");
      dot.style.setProperty("--sy", Math.random() * h + "px");
      dot.style.setProperty("--sdur", (1.3 + Math.random() * 2.2).toFixed(2) + "s");
      dot.style.setProperty("--sdelay", (-Math.random() * 4).toFixed(2) + "s");
      dot.style.setProperty("--speak", (0.55 + Math.random() * 0.4).toFixed(2));
      sparkleField.appendChild(dot);
    }
  }

  function startGiftOpen() {
    if (giftLanding.classList.contains("state-bloom")) return;
    giftLanding.classList.add("state-bloom");

    if (giftMusic) {
      giftMusic.play().catch(function () {});
    }

    var w = window.innerWidth,
      h = window.innerHeight;
    var cx = w / 2,
      cy = h / 2;

    spawnSparkles(w, h);

    var goldenAngle = Math.PI * (3 - Math.sqrt(5));
    var cornerDist = Math.hypot(w, h) / 2;
    var isMobile = Math.min(w, h) < 640;
    var area = w * h;

    var baseTarget = isMobile ? 340 : 560;
    var scaleFactor = Math.min(2, Math.max(1, area / (isMobile ? 480000 : 1500000)));
    var targetCount = Math.min(isMobile ? 560 : 980, Math.round(baseTarget * scaleFactor));

    var edgeBuffer = Math.max(70, cornerDist * 0.06);
    var maxRadius = cornerDist + edgeBuffer;
    var spacing = maxRadius / Math.sqrt(targetCount);

    var sizeBase = spacing * 3.8;
    var minSize = isMobile ? 60 : 82;
    var maxSize = isMobile ? 230 : 360;

    var spawned = 0;
    var startTime = performance.now();
    var growDuration = 5800;

    function tick() {
      var elapsed = performance.now() - startTime;
      var progress = Math.min(1, elapsed / growDuration);
      var eased = Math.pow(progress, 2.5);
      var wanted = Math.floor(eased * targetCount);
      while (spawned < wanted) {
        var angle = spawned * goldenAngle;
        var radius = spacing * Math.sqrt(spawned + 1);
        var size = sizeBase * (0.72 + Math.random() * 0.56);
        size = Math.min(maxSize, Math.max(minSize, size));
        var x = cx + Math.cos(angle) * radius;
        var y = cy + Math.sin(angle) * radius;
        var duration = 3 + Math.random() * 4;
        var delay = -Math.random() * 6;
        spawnFlower(x, y, size, duration, delay);
        spawned++;
      }
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(startFall, 650);
      }
    }
    requestAnimationFrame(tick);
  }

  function startFall() {
    giftLanding.classList.remove("state-bloom");
    giftLanding.classList.add("state-fall");

    revealScrapbookBehindFlowers();

    var flowers = bloomField.querySelectorAll(".bloom-flower");

    flowers.forEach(function (el) {
      var id = parseInt(el.dataset.id, 10);
      var y = parseFloat(el.dataset.y);
      var size = parseFloat(el.dataset.size);
      var fall = window.innerHeight + size * 2 - y;
      var fdur = 1.3 + ((id * 37) % 100) / 100 * 0.7;
      var fdelay = ((id * 53) % 100) / 100 * 0.4;
      var frot = (((id * 91) % 200) - 100) * 0.9;
      var fsway = (((id * 67) % 200) - 100) * (size * 0.012 + 0.4);

      el.style.setProperty("--ffall", y + fall + "px");
      el.style.setProperty("--frot", frot + "deg");
      el.style.setProperty("--fsway", fsway.toFixed(1) + "px");
      el.style.setProperty("--fdur", fdur + "s");
      el.style.setProperty("--fdelay", fdelay + "s");
      el.classList.remove("in");
    });

    void bloomField.offsetHeight;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        flowers.forEach(function (el) {
          el.classList.add("falling");
        });
      });
    });

    setTimeout(goToScrapbook, 2100);
  }

  var envelopeOpening = false;
  function handleEnvelopeClick() {
    if (envelopeOpening || giftLanding.classList.contains("state-bloom") || giftLanding.classList.contains("state-fall")) {
      return;
    }
    envelopeOpening = true;

    if (envelopeStack) {
      envelopeStack.classList.add("shaking");
      var done = false;
      var finish = function () {
        if (done) return;
        done = true;
        envelopeStack.classList.remove("shaking");
        envelopeStack.removeEventListener("animationend", finish);
        startGiftOpen();
      };
      envelopeStack.addEventListener("animationend", finish);
      setTimeout(finish, 550);
    } else {
      startGiftOpen();
    }
  }

  giftBoxBtn.addEventListener("click", handleEnvelopeClick);

  function revealScrapbookBehindFlowers() {
    scrapbookStage.classList.add("shown");
    initScrapbook();
  }

  function goToScrapbook() {
    giftLanding.classList.add("hidden");
  }

  var scrapbookInitialised = false;

  function initScrapbook() {
    if (scrapbookInitialised) return;
    scrapbookInitialised = true;

    var bookEl = document.getElementById("book");
    var spineShadow = document.getElementById("spine-shadow");
    var isMobile = window.innerWidth < 768;

    var pageFlip = new St.PageFlip(bookEl, {
      width: isMobile ? 360 : 300,
      height: isMobile ? 480 : 400,
      size: "stretch",
      minWidth: 200,
      maxWidth: 500,
      minHeight: 260,
      maxHeight: 600,
      maxShadowOpacity: 0.35,
      drawShadow: true,
      showCover: true,
      mobileScrollSupport: true,
      useMouseEvents: true,
      flippingTime: 600,
      display: "landscape", // Yeh landscape spread rakhega jisse side wala page ka thoda hissa dikhega
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    function attachShadowToBookWrapper() {
      var wrapper = bookEl.querySelector(".stf__wrapper") || bookEl.querySelector(".stf__parent");
      if (wrapper && spineShadow) {
        wrapper.insertBefore(spineShadow, wrapper.firstChild);
      }
    }

    function updateSpineShadow() {
      try {
        var total = pageFlip.getPageCount();
        var current = pageFlip.getCurrentPageIndex();
        var orientation = pageFlip.getOrientation();
        var isSpread = orientation === "landscape" && current > 0 && current < total - 1;

        if (isSpread) {
          spineShadow.classList.add("visible");
        } else {
          spineShadow.classList.remove("visible");
        }
      } catch (err) {
        spineShadow.classList.remove("visible");
      }
    }

    function centerSinglePageView() {
      try {
        var total = pageFlip.getPageCount();
        var current = pageFlip.getCurrentPageIndex();
        var orientation = pageFlip.getOrientation();
        var rect = pageFlip.getRender().getRect();
        var pageWidth = rect && rect.pageWidth ? rect.pageWidth : 0;
        var target = bookEl.querySelector(".stf__parent") || bookEl.querySelector(".stf__wrapper");
        if (!target || !pageWidth) return;
        var isSinglePageView = current === 0 || current >= total - 1;
        if (orientation === "landscape" && isSinglePageView) {
          var shift = current === 0 ? -(pageWidth / 2) : pageWidth / 2;
          target.style.transition = "transform 0.25s ease";
          target.style.transform = "translateX(" + shift + "px)";
        } else {
          target.style.transform = "translateX(0)";
        }
      } catch (err) {}
    }

    pageFlip.on("flip", function () {
      requestAnimationFrame(centerSinglePageView);
      updateSpineShadow();
    });

    pageFlip.on("changeState", function () {
      updateSpineShadow();
    });

    pageFlip.on("changeOrientation", function () {
      requestAnimationFrame(function () {
        centerSinglePageView();
        updateSpineShadow();
      });
    });

    window.addEventListener("resize", function () {
      requestAnimationFrame(function () {
        centerSinglePageView();
        updateSpineShadow();
      });
    });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        requestAnimationFrame(function () {
          centerSinglePageView();
          updateSpineShadow();
        });
      }, 150);
    });

    setTimeout(function () {
      attachShadowToBookWrapper();
      centerSinglePageView();
      updateSpineShadow();
    }, 80);

    var rotateOverlay = document.getElementById("rotate-overlay");
    if (rotateOverlay) {
      rotateOverlay.style.display = "none";
    }

    (function () {
      var canvas = document.getElementById("spiral-canvas");
      var ctx = canvas.getContext("2d");
      var box = document.getElementById("book-container");
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      var flipTimer = null;

      function sizeCanvas() {
        var w = box.offsetWidth;
        var h = box.offsetHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function paint() {
        var cw = box.offsetWidth;
        var ch = box.offsetHeight;
        ctx.clearRect(0, 0, cw, ch);
        var boxR = box.getBoundingClientRect();
        var all = document.querySelectorAll(".stf__page");
        for (var i = 0; i < all.length; i++) {
          var el = all[i];
          var r = el.getBoundingClientRect();
          if (r.width < 30 || r.height < 30) continue;
          if (r.right <= boxR.left + 8 || r.left >= boxR.right - 8) continue;
          var pg = el.querySelector(".page[data-spiral]");
          if (!pg) continue;
          var side = pg.getAttribute("data-spiral");
          var isCover = pg.classList.contains("page-cover");
          var px = r.left - boxR.left;
          var py = r.top - boxR.top;
          drawCoils(px, py, r.width, r.height, side, isCover);
        }
      }

      function drawCoils(px, py, pw, ph, side, isCover) {
        var NUM = 24;
        var MARGIN = Math.max(11, pw * 0.042);
        var RX = Math.max(4.5, pw * 0.034);
        var RY = RX * 0.68;
        var SW = Math.max(2.2, RX * 0.44);
        var YTOP = ph * 0.032;
        var YBOT = ph * 0.968;
        var cx = side === "left" ? px + MARGIN : px + pw - MARGIN;
        for (var i = 0; i < NUM; i++) {
          var t = NUM > 1 ? i / (NUM - 1) : 0.5;
          var cy = py + YTOP + t * (YBOT - YTOP);
          ctx.beginPath();
          ctx.ellipse(cx, cy, Math.max(1, RX * 0.26), Math.max(0.6, RY * 0.33), 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,0,0,0.24)";
          ctx.fill();
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "rgba(0,0,0,0.13)";
          ctx.stroke();
          var sx = side === "left" ? cx + 1.6 : cx - 1.6;
          ring(sx, cy + 1.8, RX + 0.7, RY + 0.4, SW + 1.1, side, isCover, "rgba(0,0,0,0.26)");
          ring(cx, cy + 0.6, RX, RY, SW + 0.5, side, isCover, "#050505");
          ring(cx, cy, RX, RY, SW, side, isCover, "#111111");
          ring(cx, cy - 0.5, RX * 0.9, RY * 0.88, Math.max(0.4, SW - 1.5), side, isCover, "#1a1a1a");
          ring(cx, cy - 1.5, RX * 0.7, RY * 0.62, 1.2, side, isCover, "rgba(148,148,148,0.17)");
          ring(cx, cy - 2.3, RX * 0.4, RY * 0.38, 0.6, side, isCover, "rgba(255,255,255,0.07)");
        }
      }

      function ring(cx, cy, rx, ry, sw, side, isCover, color) {
        rx = Math.max(0.5, rx);
        ry = Math.max(0.5, ry);
        sw = Math.max(0.1, sw);
        ctx.beginPath();
        if (isCover) {
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        } else {
          if (side === "left") {
            ctx.ellipse(cx, cy, rx, ry, 0, -Math.PI * 0.5, Math.PI * 0.5, false);
          } else {
            ctx.ellipse(cx, cy, rx, ry, 0, Math.PI * 0.5, Math.PI * 1.5, false);
          }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = sw;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      pageFlip.on("flip", function () {
        canvas.classList.add("fade-out");
        clearTimeout(flipTimer);
        flipTimer = setTimeout(function () {
          sizeCanvas();
          paint();
          canvas.classList.remove("fade-out");
        }, 200);
      });

      pageFlip.on("changeOrientation", function () {
        canvas.classList.add("fade-out");
        clearTimeout(flipTimer);
        flipTimer = setTimeout(function () {
          sizeCanvas();
          paint();
          canvas.classList.remove("fade-out");
        }, 350);
      });

      setTimeout(function () {
        sizeCanvas();
        paint();
      }, 130);

      window.addEventListener("resize", function () {
        clearTimeout(flipTimer);
        flipTimer = setTimeout(function () {
          sizeCanvas();
          paint();
        }, 60);
      });
    })();
  }
})();