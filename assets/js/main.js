// =============================================
// Main JS File
// =============================================

// LENIS SMOOTH SCROLL INITIALIZATION
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical', // vertical, horizontal
  gestureDirection: 'vertical', // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})
window.lenis = lenis
//get scroll value
// lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
//   console.log({ scroll, limit, velocity, direction, progress })
// })

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Handle anchor links for smooth scrolling with Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetSelector = this.getAttribute('href');
    if (targetSelector && targetSelector !== '#') {
      const targetEl = document.querySelector(targetSelector);
      if (targetEl) {
        lenis.scrollTo(targetEl, { offset: 0, duration: 1.4 });
      }
    } else if (targetSelector === '#') {
      lenis.scrollTo(0);
    }
  });
});

// Video Background Optimization
// Pauses the video when the user scrolls past the hero section to save CPU/GPU and prevent scroll lag
document.addEventListener('DOMContentLoaded', () => {
  // ═══════════════════════════════════════════════════════════════
  // PRELOADER ENTRANCE ANIMATION
  // ═══════════════════════════════════════════════════════════════
  const preloader = document.getElementById('preloader');
  if (preloader) {

    

    if (window.lenis) window.lenis.stop();
    document.body.style.overflow = 'hidden'; // Ensure native scroll is also locked

    requestAnimationFrame(() => {
      preloader.classList.add('animate-bar');
    });

    // Wait for the bar to finish (1.6s) + breathing room
    setTimeout(() => {
      preloader.classList.add('slide-up');

      // Wait for slide-up transition (1s)
      setTimeout(() => {
        preloader.remove();
        document.body.style.overflow = '';
        document.body.classList.add('hero-ready');
        if (window.lenis) window.lenis.start();
      }, 1000);
    }, 1800);
  } else {
    document.body.classList.add('hero-ready');
  }

  const heroVideo = document.getElementById('hero-bg');
  const heroSection = document.querySelector('.hero');

  if (heroVideo && heroSection) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroVideo.play();
        } else {
          heroVideo.pause();
        }
      });
    }, {
      rootMargin: "0px",
      threshold: 0.01 // Trigger as soon as 1% is visible
    });

    videoObserver.observe(heroSection);
  }

  // Scroll reveal for tech stack sections
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // ═══════════════════════════════════════════════════════════════
  // SCROLL-TRIGGERED RISE-UP ANIMATIONS
  // ═══════════════════════════════════════════════════════════════

  // Split header text into per-letter clip-wrap spans
  function splitLetters(el) {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.textContent = '';

    let letterIndex = 0;
    words.forEach((word) => {
      const wordDiv = document.createElement('div');
      wordDiv.className = 'word-wrap';

      for (let i = 0; i < word.length; i++) {
        const clipWrap = document.createElement('div');
        clipWrap.className = 'clip-wrap';

        const letter = document.createElement('span');
        letter.className = 'rise-letter';
        letter.textContent = word[i];
        letter.style.animationDelay = (letterIndex * 0.045) + 's';

        clipWrap.appendChild(letter);
        wordDiv.appendChild(clipWrap);
        letterIndex++;
      }

      el.appendChild(wordDiv);
    });
  }

  // Process all [data-letter-rise] headers
  document.querySelectorAll('[data-letter-rise]').forEach(el => splitLetters(el));

  // Observer for per-letter rise headers
  const letterRiseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('rise-active');
        letterRiseObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-letter-rise]').forEach(el => letterRiseObserver.observe(el));

  // Observer for block-level rise (paragraphs, subtexts)
  const blockRiseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('rise-active');
        blockRiseObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-rise]').forEach((el, i) => {
    // Stagger sibling block elements
    el.style.animationDelay = (i * 0.15) + 's';
    blockRiseObserver.observe(el);
  });

  // Observer for contact section staggered reveal
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('contact-revealed');
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-contact-reveal]').forEach(el => contactObserver.observe(el));

  // ═══════════════════════════════════════════════════════════════
  // UNIFIED WORKS SCROLL ANIMATION (Entrance + Gallery) — OPTIMIZED
  // ═══════════════════════════════════════════════════════════════
  const worksScene = document.getElementById('works-scroll-scene');
  if (worksScene) {
    // --- Cache ALL DOM lookups outside render loop ---
    const wWrap     = document.getElementById('works-title-wrap');
    const wTitle    = document.querySelector('.works-entrance-title');
    const wEyebrow  = document.querySelector('.works-eyebrow');
    const wVignette = document.getElementById('works-vignette');
    const wHint     = document.getElementById('works-scroll-hint');
    const groupTop  = document.getElementById('works-group-top');
    const groupBot  = document.getElementById('works-group-bot');

    const wStrips = [
      { el: document.getElementById('wt1'), dir:  1, base: -500 },
      { el: document.getElementById('wt2'), dir: -1, base: -300 },
      { el: document.getElementById('wb1'), dir: -1, base: -500 },
      { el: document.getElementById('wb2'), dir:  1, base: -300 },
    ];

    const stickyStage = document.getElementById('works-sticky-stage');
    const cardWrappers = stickyStage
      ? stickyStage.querySelectorAll('.work-card-wrapper')
      : [];
    const numCards = cardWrappers.length;

    // --- Helpers ---
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const lerp  = (a, b, t) => a + (b - a) * t;
    const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    const easeExp   = t => t === 0 ? 0 : Math.pow(2, 10 * t - 10);

    let uSceneH = 0, uViewH = 0;
    const uMeasure = () => {
      uSceneH = worksScene.offsetHeight;
      uViewH  = window.innerHeight;
    };
    uMeasure();

    // --- Device detection (checked once, updated on resize) ---
    let isMobile = window.innerWidth <= 768;

    // Timeline thresholds
    let ENTRANCE_END, GALLERY_START, GALLERY_END, SLIDE_RATIO;
    const setThresholds = () => {
      isMobile = window.innerWidth <= 768;
      if (isMobile) {
        ENTRANCE_END  = 0.75; // animation done at 75% of the 30vh scroll = ~22.5vh
        GALLERY_START = 1.0;
        GALLERY_END   = 1.0;
        SLIDE_RATIO   = 1.0;
      } else {
        ENTRANCE_END  = 0.20;
        GALLERY_START = 0.18;
        GALLERY_END   = 0.98;
        SLIDE_RATIO   = 0.85;
      }
    };
    setThresholds();

    // --- Smoothing state (desktop only) ---
    let smoothRaw = 0;
    const LERP_FACTOR = 0.12;
    const cardCurrentX = new Array(numCards).fill(110);

    // --- Scroll-triggered render with settle ---
    let uRaf = null;
    let settleFrames = 0;
    const MAX_SETTLE = 30; // frames to keep running after scroll stops (for lerp)
    let snapTimeout = null;

    // --- Split Title for GPU-Accelerated Spreading ---
    // Avoids laggy layout recalculations caused by letter-spacing animation
    if (wTitle && wTitle.textContent) {
      const titleText = wTitle.textContent;
      wTitle.textContent = '';
      wTitle.style.display = 'flex';
      wTitle.style.justifyContent = 'center';
      
      window.titleLetters = [];
      for(let i=0; i<titleText.length; i++) {
          const char = titleText[i];
          if (char === ' ') {
              const space = document.createElement('span');
              space.innerHTML = '&nbsp;';
              wTitle.appendChild(space);
              continue;
          }
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          span.style.willChange = 'transform';
          const centerOffset = (i - (titleText.length-1)/2); 
          window.titleLetters.push({ el: span, offset: centerOffset });
          wTitle.appendChild(span);
      }
    }

    const uRender = (overrideRaw) => {
      let raw;

      if (isMobile) {
        // Mobile: use the auto-play raw value injected by the timer
        raw = (overrideRaw !== undefined) ? overrideRaw : 0;
        smoothRaw = raw;
      } else {
        const targetRaw = clamp(
          -worksScene.getBoundingClientRect().top / (uSceneH - uViewH), 0, 1
        );
        // Desktop: lerp for buttery smoothness
        smoothRaw += (targetRaw - smoothRaw) * LERP_FACTOR;
        if (Math.abs(smoothRaw - targetRaw) < 0.0001) smoothRaw = targetRaw;
        raw = smoothRaw;

        // Continue loop only if still settling (desktop lerp)
        if (Math.abs(smoothRaw - targetRaw) > 0.0001) {
          settleFrames = MAX_SETTLE;
        }
        if (settleFrames > 0) {
          settleFrames--;
          uRaf = requestAnimationFrame(() => uRender());
        } else {
          uRaf = null;
        }
      }

      // ─── ENTRANCE PHASE ───
      const entranceP = clamp(raw / ENTRANCE_END, 0, 1);
      
      // Pro cinematic zoom: starts slow, accelerates exponentially
      const sc = lerp(1, 28, easeExp(entranceP));
      const titleOp = entranceP < 0.75 ? 1 : clamp(1 - (entranceP - 0.75) / 0.25, 0, 1);

      // Add rotateX to showcase the 3D extruded text-shadow depth
      wWrap.style.transform      = `scale(${sc.toFixed(3)}) translateZ(0) rotateX(${lerp(0, 35, easeInOut(entranceP))}deg)`;
      wWrap.style.opacity        = titleOp.toFixed(3);
      
      // Hardware-accelerated letter spread (replaces laggy letter-spacing)
      if (window.titleLetters) {
        const spreadAmount = lerp(0, 35, easeInOut(entranceP)); // pixels per letter offset
        window.titleLetters.forEach(l => {
           l.el.style.transform = `translate3d(${l.offset * spreadAmount}px, 0, 0)`;
        });
      }

      wEyebrow.style.opacity     = clamp(1 - entranceP / 0.15, 0, 1).toFixed(3);
      wEyebrow.style.transform   = `translate3d(0, ${-entranceP * 80}px, 0)`; // slides up and out
      
      // Flash dramatic dark vignette
      wVignette.style.opacity    = clamp(lerp(0.45, 1, easeInOut(entranceP)), 0, 1).toFixed(3);
      wHint.style.opacity        = clamp(1 - entranceP * 3, 0, 1).toFixed(3);

      // Marquees - Add slight rotation and Z-translation for depth
      const travel  = entranceP * 1200;
      const groupOp = entranceP < 0.15
        ? lerp(0, 1, entranceP / 0.15)
        : entranceP < 0.7 ? 1
        : lerp(1, 0, (entranceP - 0.7) / 0.3);

      for (let s = 0; s < wStrips.length; s++) {
        // Top group strips go up slightly, bottom go down slightly to "open the door"
        const yOffset = (s < 2) ? -entranceP * 120 : entranceP * 120;
        wStrips[s].el.style.transform = `translate3d(${(wStrips[s].base + wStrips[s].dir * travel).toFixed(1)}px, ${yOffset.toFixed(1)}px, 0) scale(${1 - entranceP * 0.15})`;
        wStrips[s].el.style.opacity   = groupOp.toFixed(3);
      }

      // Fade out entrance when gallery starts
      const entranceVis = raw < GALLERY_START ? 1 :
                          raw < GALLERY_START + 0.05 ? clamp(1 - (raw - GALLERY_START) / 0.05, 0, 1) : 0;
      const eVisStr = entranceVis.toFixed(3);
      if (groupTop) groupTop.style.opacity = eVisStr;
      if (groupBot) groupBot.style.opacity = eVisStr;
      if (raw >= GALLERY_START) {
        wVignette.style.opacity = eVisStr;
        wWrap.style.opacity     = eVisStr;
      }

      // ─── GALLERY PHASE (desktop only — mobile uses normal grid) ───
      if (!isMobile && numCards > 0) {
        const galleryP = clamp(
          (raw - GALLERY_START) / (GALLERY_END - GALLERY_START), 0, 1
        );
        const segSize = 1 / numCards;

        for (let i = 0; i < numCards; i++) {
          const segStart = i * segSize;
          const slideEnd = segStart + segSize * SLIDE_RATIO;
          const wrapper = cardWrappers[i];

          // ─── DESKTOP: Slide from right (with lerp) ───
          let targetX;
          if (galleryP <= segStart) {
            targetX = 110;
          } else if (galleryP <= slideEnd) {
            const p = (galleryP - segStart) / (slideEnd - segStart);
            const ease = 1 - Math.pow(1 - p, 3);
            targetX = (1 - ease) * 110;
          } else {
            targetX = 0;
          }
          cardCurrentX[i] += (targetX - cardCurrentX[i]) * LERP_FACTOR;
          if (Math.abs(cardCurrentX[i] - targetX) < 0.05) cardCurrentX[i] = targetX;
          wrapper.style.transform = `translate3d(${cardCurrentX[i].toFixed(1)}%,0,0)`;
        }
      }
    };

    // ─── MOBILE: intro removed — show cards directly ───
    if (isMobile) {
      // Nothing to do — #works-scroll-scene is hidden via CSS on mobile

    } else {
      // ─── DESKTOP: Scroll-driven ───
      const uSchedule = () => {
        settleFrames = MAX_SETTLE;
        if (!uRaf) uRaf = requestAnimationFrame(() => uRender());
      };

      window.addEventListener('scroll', uSchedule, { passive: true });
      window.addEventListener('resize', () => {
        uMeasure();
        setThresholds();
        uSchedule();
      }, { passive: true });
      uSchedule();
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// CONTACT SLIDE PANEL — Desktop Only
// ═══════════════════════════════════════════════════════════════
// MOBILE CURTAIN — SELECTED WORKS INTRO (mobile only)
// ═══════════════════════════════════════════════════════════════
(function initMobileCurtain() {
  if (window.innerWidth > 768) return;

  const curtainEl  = document.getElementById('mob-curtain-intro');
  const topCurtain = document.getElementById('mob-top-curtain');
  const botCurtain = document.getElementById('mob-bottom-curtain');
  const titleTop   = document.getElementById('mob-title-top');
  const titleBot   = document.getElementById('mob-title-bot');
  const worksGrid  = document.querySelector('.mobile-projects-grid');

  if (!curtainEl || !worksGrid) return;

  let RANGE = window.innerHeight; // dynamic range based on screen
  let sectionDocTop = 0;

  function measure() {
    RANGE = window.innerHeight;
    sectionDocTop = worksGrid.getBoundingClientRect().top + window.scrollY;
  }

  function update() {
    if (window.innerWidth > 768) return;

    // How far we have scrolled PAST the top of the works grid
    const relScroll = window.scrollY - sectionDocTop;

    // Calculate progress (0 when section hits top, 1 when scrolled RANGE px past it)
    const p = Math.max(0, Math.min(relScroll / RANGE, 1));

    // Curtains slide away
    topCurtain.style.transform = `translateY(-${p * 100}%)`;
    botCurtain.style.transform = `translateY(${p * 100}%)`;

    // Title splits and fades
    const offset = p * 220;
    titleTop.style.transform = `translateY(-${offset}px)`;
    titleBot.style.transform = `translateY(${offset}px)`;
    const titleOp = Math.max(0, 1 - p * 2.5).toFixed(3);
    titleTop.style.opacity = titleOp;
    titleBot.style.opacity = titleOp;
  }

  window.addEventListener('load',   () => { measure(); update(); });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) { curtainEl.style.opacity = '0'; return; }
    measure(); update();
  }, { passive: true });

  measure();
  update();
})();

// ═══════════════════════════════════════════════════════════════
// CONTACT SLIDE PANEL — Desktop Only
// ═══════════════════════════════════════════════════════════════

function openContactPanel() {
  const panel    = document.getElementById('contactPanel');
  const backdrop = document.getElementById('contactPanelBackdrop');
  if (!panel || !backdrop) return;

  // Pause Lenis smooth scroll so page doesn't scroll behind the panel
  if (window.lenis) window.lenis.stop();

  // Use rAF to ensure styles are applied before class transition fires
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.classList.add('panel-open');
      backdrop.classList.add('panel-open');
    });
  });
}

function closeContactPanel() {
  const panel    = document.getElementById('contactPanel');
  const backdrop = document.getElementById('contactPanelBackdrop');
  if (!panel || !backdrop) return;

  panel.classList.remove('panel-open');
  backdrop.classList.remove('panel-open');

  // Re-enable Lenis after the slide-out animation completes
  const SLIDE_DURATION = 680; // slightly longer than CSS 0.65s to be safe
  setTimeout(() => {
    if (window.lenis) window.lenis.start();
  }, SLIDE_DURATION);
}

// Close panel with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const panel = document.getElementById('contactPanel');
    if (panel && panel.classList.contains('panel-open')) {
      closeContactPanel();
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY MANIFESTO — scroll-driven clip-path reveal
// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY MANIFESTO — scroll-driven (desktop) + IO reveal (mobile)
// ═══════════════════════════════════════════════════════════════
(function initTypoSection() {
  const typoSection = document.getElementById('typo-section');
  if (!typoSection) return;

  const lineEls = typoSection.querySelectorAll('.line-text');
  const wordEls = typoSection.querySelectorAll('.word');

  // ── FitText (runs on both mobile and desktop) ──────────────────
  function fitText() {
    const containerW = document.getElementById('typo-inner').offsetWidth;
    lineEls.forEach(el => {
      el.style.fontSize = '100px';
      const ratio   = el.dataset.size === 'big' ? 0.98 : 0.42;
      const newSize = Math.floor(100 * ((containerW * ratio) / el.scrollWidth));
      el.style.fontSize = Math.min(newSize, 160) + 'px';
    });
  }

  // ── Scroll-driven clip-path reveal (both mobile and desktop) ──────
  // Mobile uses the same --p variable; CSS gives mobile a 250vh section
  // height so the reveal completes in a comfortable amount of scroll.

  const wordCount = wordEls.length;
  const wordStates = Array.from(wordEls).map((el, i) => ({
    el,
    threshold: i / wordCount
  }));

  const revealWindow = 1 / (wordCount + 1);

  let cachedSectionTop    = 0;
  let cachedSectionScroll = 0;
  let cachedWinH          = 0;

  function cacheLayout() {
    cachedWinH          = window.innerHeight;
    cachedSectionTop    = typoSection.offsetTop;
    cachedSectionScroll = typoSection.offsetHeight - cachedWinH;
  }

  function computeTypoP(scrollY) {
    if (cachedSectionScroll <= 0) return 0;
    return Math.max(0, Math.min(1,
      (scrollY - cachedSectionTop) / cachedSectionScroll
    ));
  }

  const progressBar = document.getElementById('progress-bar');
  const scrollCue   = document.getElementById('scroll-cue');

  function applyReveal(scrollY) {
    const typoP = computeTypoP(scrollY);
    if (progressBar) progressBar.style.transform = `scaleX(${typoP})`;
    if (scrollCue) scrollCue.classList.toggle('hidden', scrollY - cachedSectionTop > 20);
    wordStates.forEach(({ el, threshold }) => {
      const p = Math.max(0, Math.min(1, (typoP - threshold) / revealWindow));
      el.style.setProperty('--p', p.toFixed(3));
    });
  }

  let tRaf = null;
  let lastScrollY = window.scrollY;

  function scheduleRender(scrollY) {
    lastScrollY = scrollY;
    if (!tRaf) {
      tRaf = requestAnimationFrame(() => {
        applyReveal(lastScrollY);
        tRaf = null;
      });
    }
  }

  if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => scheduleRender(scroll));
  }
  window.addEventListener('scroll', () => scheduleRender(window.scrollY), { passive: true });

  function init() {
    cacheLayout();
    fitText();
    applyReveal(window.scrollY);
  }

  window.addEventListener('resize', () => {
    cacheLayout();
    fitText();
    applyReveal(window.scrollY);
  }, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();

// ═══════════════════════════════════════════════════════════════
// ABOUT ME — Desktop circle-reveal (PC only, scroll-driven)
// Uses live getBoundingClientRect so the reveal fires the instant
// the about section's top edge reaches the viewport top — no delay
// regardless of how tall the preceding typography section is.
// MAX_RADIUS = 150% guarantees a perfect circle at any aspect ratio.
// ═══════════════════════════════════════════════════════════════
(function initAboutReveal() {
  // Desktop only
  if (window.innerWidth <= 768) return;

  const revealLayer  = document.getElementById('aboutRevealLayer');
  const aboutSection = document.getElementById('about');
  const textPathEl   = document.getElementById('aboutRingTextPath');
  if (!revealLayer || !aboutSection) return;

  let isDesktop = window.innerWidth > 768;

  // ── Clip-path constants ───────────────────────────────────────
  // 55% keeps r (661px) below half-viewport-width (768px) so curved arcs
  // are visible on ALL sides — true circular window, not near full-screen.
  const ORIGIN          = '50% 50%';
  const MAX_RADIUS      = 62;
  // Spread the reveal over 1.5 viewports of scroll.
  const REVEAL_FRACTION = 1.5;
  // Lerp factor: 0.09 = responsive but still smooth.
  const LERP            = 0.09;

  // ── State ─────────────────────────────────────────────────────
  let currentP = 0;   // smoothed progress (0→1)
  let targetP  = 0;   // raw scroll-driven target
  let lastR    = 0;

  function applyClip(p) {
    if (!isDesktop) return;
    const rPct = (p * MAX_RADIUS).toFixed(3);
    revealLayer.style.clipPath = 'circle(' + rPct + '% at ' + ORIGIN + ')';

    // Synchronize text ring without scaling font size
    if (textPathEl) {
      const vw  = window.innerWidth;
      const vh  = window.innerHeight;
      const cx  = vw / 2;
      const cy  = vh / 2;
      const ref = Math.sqrt((vw * vw + vh * vh) / 2);
      
      const circleRadiusPx = ref * (p * (MAX_RADIUS / 100));
      // Min radius so text is perfectly readable even when p=0 (circle not open)
      const minTextRadius = Math.min(vw, vh) * 0.18; 
      const safeR = Math.round(Math.max(circleRadiusPx + 20, minTextRadius));

      // Update only when radius changes by >= 2 pixels to drastically cut down DOM reflows
      if (Math.abs(safeR - lastR) >= 2) {
        lastR = safeR;
        textPathEl.setAttribute('d',
          `M ${cx},${cy} m -${safeR},0 a ${safeR},${safeR} 0 1,1 ${2*safeR},0 a ${safeR},${safeR} 0 1,1 -${2*safeR},0`
        );
      }
    }
  }

  // ── Compute target from live rect ────────────────────────────
  function computeTarget() {
    const rect  = aboutSection.getBoundingClientRect();
    const into  = -rect.top;                           // 0 = section just entered
    const range = window.innerHeight * REVEAL_FRACTION;
    return Math.min(1, Math.max(0, into / range));
  }

  // ── Continuous rAF loop for smooth lerp ──────────────────────
  var loopId = null;

  function tick() {
    targetP  = computeTarget();
    currentP += (targetP - currentP) * LERP;

    // Snap to target when close enough to avoid infinite drift
    if (Math.abs(targetP - currentP) < 0.0003) currentP = targetP;

    applyClip(currentP);

    // Keep looping only while there's still motion
    if (Math.abs(targetP - currentP) > 0.0003) {
      loopId = requestAnimationFrame(tick);
    } else {
      loopId = null;
    }
  }

  function kickLoop() {
    if (!loopId) loopId = requestAnimationFrame(tick);
  }

  // Hook into Lenis — do NOT also add native scroll (fires twice).
  if (window.lenis) {
    window.lenis.on('scroll', kickLoop);
  } else {
    window.addEventListener('scroll', kickLoop, { passive: true });
  }

  // ── Resize ───────────────────────────────────────────────────
  window.addEventListener('resize', function () {
    var wasDesktop = isDesktop;
    isDesktop = window.innerWidth > 768;
    if (!isDesktop && wasDesktop) {
      revealLayer.style.clipPath = '';
      currentP = 0;
    }
    kickLoop();
  }, { passive: true });

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    isDesktop = window.innerWidth > 768;
    currentP  = 0;
    applyClip(0); // start hidden
    kickLoop();
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();

// ═══════════════════════════════════════════════════════════════
// CUSTOM CURSOR LOGIC
// ═══════════════════════════════════════════════════════════════
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const trails = [
    document.getElementById('cursor-trail-1'),
    document.getElementById('cursor-trail-2'),
    document.getElementById('cursor-trail-3')
  ];

  if (!dot || !ring) return;

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  
  let rx = cx;
  let ry = cy;
  
  let tx = [cx, cx, cx];
  let ty = [cy, cy, cy];

  window.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
  }, { passive: true });

  (function animCursor() {
    // 1. Constrain main ring to never let the dot escape
    let dx = cx - rx;
    let dy = cy - ry;
    
    rx += dx * 0.2;
    ry += dy * 0.2;
    
    let ndx = cx - rx;
    let ndy = cy - ry;
    let ndist = Math.sqrt(ndx*ndx + ndy*ndy);
    let maxDist = 12; // Must be < 18px (radius of ring)
    
    if (ndist > maxDist) {
       rx = cx - (ndx / ndist) * maxDist;
       ry = cy - (ndy / ndist) * maxDist;
    }

    dot.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;

    // 2. Animate 3 trails following the leader
    for(let i=0; i<3; i++) {
        let targetX = i === 0 ? rx : tx[i-1];
        let targetY = i === 0 ? ry : ty[i-1];
        
        // Lower interpolation factor spreads them out more
        tx[i] += (targetX - tx[i]) * 0.25;
        ty[i] += (targetY - ty[i]) * 0.25;
        
        // Sequentially shrink the trailing rings
        let scale = 1 - (i * 0.15); 
        
        if(trails[i]) {
            trails[i].style.transform = `translate3d(${tx[i]}px,${ty[i]}px,0) translate(-50%,-50%) scale(${scale})`;
        }
    }
    
    requestAnimationFrame(animCursor);
  })();

  // Interactive Hover States
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .tech-card, .burger-menu, .work-card, .footer-social-icon');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
})();

// ═══════════════════════════════════════════════════════════════
// CLOCK SVG & TICK LOGIC
// ═══════════════════════════════════════════════════════════════
(function initClock() {
    const svg = document.getElementById('clock-svg');
    if (!svg) return;
    const NS  = 'http://www.w3.org/2000/svg';
    const CX  = 200, CY = 200, R = 190;

    function el(tag, attrs) {
      const e = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v));
      return e;
    }

    // Add glow filter
    const defs = el('defs', {});
    const filter = el('filter', { id: 'clock-glow', x: '-20%', y: '-20%', width: '140%', height: '140%' });
    filter.innerHTML = `
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    `;
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Inner and outer rings
    svg.appendChild(el('circle', { cx:CX, cy:CY, r:R, fill:'none', stroke:'rgba(255,255,255,0.18)', 'stroke-width':'0.8' }));
    svg.appendChild(el('circle', { cx:CX, cy:CY, r:R-14, fill:'none', stroke:'rgba(255,255,255,0.05)', 'stroke-width':'0.5' }));

    // Decorative inner tech rings
    const innerRing1 = el('circle', { cx:CX, cy:CY, r:R*0.68, fill:'none', stroke:'rgba(255,255,255,0.12)', 'stroke-width':'1.5', 'stroke-dasharray':'2 4 8 4' });
    const innerRing2 = el('circle', { cx:CX, cy:CY, r:R*0.42, fill:'none', stroke:'rgba(255,255,255,0.08)', 'stroke-width':'4', 'stroke-dasharray':'1 10 5 10' });
    const innerRing3 = el('circle', { cx:CX, cy:CY, r:R*0.28, fill:'none', stroke:'rgba(255,255,255,0.04)', 'stroke-width':'15', 'stroke-dasharray':'2 8' });
    
    svg.appendChild(innerRing1);
    svg.appendChild(innerRing2);
    svg.appendChild(innerRing3);

    for (let i = 0; i < 60; i++) {
      const angle = (i/60)*2*Math.PI - Math.PI/2;
      const isMaj = i % 5 === 0;
      const isQuarter = i % 15 === 0;
      const outer = R - 1, inner = isMaj ? R - 18 : R - 9;
      svg.appendChild(el('line', {
        x1: CX + Math.cos(angle)*outer, y1: CY + Math.sin(angle)*outer,
        x2: CX + Math.cos(angle)*inner, y2: CY + Math.sin(angle)*inner,
        stroke: isMaj ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)',
        'stroke-width': isQuarter ? '1.5' : isMaj ? '1' : '0.5', 
        'stroke-linecap': 'round',
        filter: isQuarter ? 'url(#clock-glow)' : 'none'
      }));
    }

    [0,3,6,9].forEach(h => {
      const angle = (h/12)*2*Math.PI - Math.PI/2;
      svg.appendChild(el('line', {
        x1: CX + Math.cos(angle)*(R-1),  y1: CY + Math.sin(angle)*(R-1),
        x2: CX + Math.cos(angle)*(R-28), y2: CY + Math.sin(angle)*(R-28),
        stroke: 'rgba(255,255,255,0.9)', 'stroke-width':'2.5', 'stroke-linecap':'round',
        filter: 'url(#clock-glow)'
      }));
    });

    ['60','15','30','45'].forEach((txt, i) => {
      const angle = (i/4)*2*Math.PI - Math.PI/2;
      const t = el('text', {
        x: CX + Math.cos(angle)*(R-46), y: CY + Math.sin(angle)*(R-46),
        fill:'rgba(255,255,255,0.45)', 'font-family':'Space Mono,monospace',
        'font-size':'11', 'font-weight':'bold', 'text-anchor':'middle', 'dominant-baseline':'central', 'letter-spacing':'1.5'
      });
      t.textContent = txt;
      svg.appendChild(t);
    });

    // --- Sub-dials (Chronograph aesthetic) ---
    // Left sub-dial (Milliseconds)
    const sdLeft = el('g', { transform: `translate(${CX-55}, ${CY}) scale(0.22)` });
    sdLeft.appendChild(el('circle', { cx:0, cy:0, r:R, fill:'none', stroke:'rgba(255,255,255,0.2)', 'stroke-width':'3' }));
    for(let i=0; i<12; i++){
      const a = (i/12)*2*Math.PI;
      sdLeft.appendChild(el('line', { x1:Math.cos(a)*(R-5), y1:Math.sin(a)*(R-5), x2:Math.cos(a)*(R-20), y2:Math.sin(a)*(R-20), stroke:'rgba(255,255,255,0.3)', 'stroke-width':'2' }));
    }
    const msHand = el('line', { x1:0, y1:0, x2:0, y2:-(R-15), stroke:'rgba(255,255,255,0.7)', 'stroke-width':'4', 'stroke-linecap':'round' });
    sdLeft.appendChild(msHand);
    svg.appendChild(sdLeft);

    // Right sub-dial (24-hour / decorative)
    const sdRight = el('g', { transform: `translate(${CX+55}, ${CY}) scale(0.22)` });
    sdRight.appendChild(el('circle', { cx:0, cy:0, r:R, fill:'none', stroke:'rgba(255,255,255,0.2)', 'stroke-width':'3' }));
    for(let i=0; i<24; i++){
      const a = (i/24)*2*Math.PI;
      const maj = i%6===0;
      sdRight.appendChild(el('line', { x1:Math.cos(a)*(R-5), y1:Math.sin(a)*(R-5), x2:Math.cos(a)*(R-(maj?25:15)), y2:Math.sin(a)*(R-(maj?25:15)), stroke:maj?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.2)', 'stroke-width':maj?'3':'1.5' }));
    }
    const hr24Hand = el('line', { x1:0, y1:0, x2:0, y2:-(R-20), stroke:'rgba(255,255,255,0.7)', 'stroke-width':'4', 'stroke-linecap':'round' });
    sdRight.appendChild(hr24Hand);
    svg.appendChild(sdRight);

    // Bottom sub-dial (Seconds step indicator)
    const sdBot = el('g', { transform: `translate(${CX}, ${CY+55}) scale(0.22)` });
    sdBot.appendChild(el('circle', { cx:0, cy:0, r:R, fill:'none', stroke:'rgba(255,255,255,0.2)', 'stroke-width':'3', 'stroke-dasharray':'10 5' }));
    for(let i=0; i<60; i+=5){
      const a = (i/60)*2*Math.PI;
      sdBot.appendChild(el('line', { x1:Math.cos(a)*(R-5), y1:Math.sin(a)*(R-5), x2:Math.cos(a)*(R-15), y2:Math.sin(a)*(R-15), stroke:'rgba(255,255,255,0.3)', 'stroke-width':'2' }));
    }
    const botHand = el('line', { x1:0, y1:0, x2:0, y2:-(R-15), stroke:'rgba(255,255,255,0.9)', 'stroke-width':'4', 'stroke-linecap':'round' });
    sdBot.appendChild(botHand);
    svg.appendChild(sdBot);

    // --- Center Area & Hands ---
    
    // Hour hand: wide body
    const hourHand = document.createElementNS(NS, 'g');
    hourHand.appendChild(el('path', { d:`M${CX-2.5},${CY} L${CX-1.5},${CY-65} L${CX},${CY-85} L${CX+1.5},${CY-65} L${CX+2.5},${CY} Z`, fill:'rgba(255,255,255,0.8)', filter:'url(#clock-glow)' }));
    svg.appendChild(hourHand);

    // Minute hand: slender body
    const minHand = document.createElementNS(NS, 'g');
    minHand.appendChild(el('path', { d:`M${CX-1.5},${CY} L${CX-1},${CY-115} L${CX},${CY-140} L${CX+1},${CY-115} L${CX+1.5},${CY} Z`, fill:'rgba(255,255,255,0.6)' }));
    svg.appendChild(minHand);

    // Second hand: high-tech red sweeping line with target circle
    const secHand = document.createElementNS(NS, 'g');
    secHand.appendChild(el('line', { x1:CX, y1:CY+35, x2:CX, y2:CY-160, stroke:'rgba(255,60,60,0.9)', 'stroke-width':'1', 'stroke-linecap':'round', filter:'url(#clock-glow)' }));
    // A small target reticle on the second hand
    secHand.appendChild(el('circle', { cx:CX, cy:CY-120, r:4, fill:'none', stroke:'rgba(255,60,60,0.9)', 'stroke-width':'1.2', filter:'url(#clock-glow)' }));
    svg.appendChild(secHand);

    // Center cap details
    svg.appendChild(el('circle', { cx:CX, cy:CY, r:5, fill:'#000', stroke:'rgba(255,255,255,0.9)', 'stroke-width':'1.5' }));
    svg.appendChild(el('circle', { cx:CX, cy:CY, r:2, fill:'rgba(255,60,60,0.9)' }));

    // --- Animation logic ---
    function rotateTo(g, deg, cx=CX, cy=CY) { g.setAttribute('transform', `rotate(${deg} ${cx} ${cy})`); }
    function rotateEl(e, deg) { e.setAttribute('transform', `rotate(${deg} 0 0)`); }

    const liveTime  = document.getElementById('live-time');
    
    function tickClock() {
      const now = new Date();
      const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds(), ms = now.getMilliseconds();
      
      const sDeg = (s + ms/1000) * 6;
      rotateTo(hourHand, ((h%12) + m/60) * 30);
      rotateTo(minHand,  (m + s/60) * 6);
      rotateTo(secHand,  sDeg);

      // Rotate inner rings for visual tech effect
      rotateTo(innerRing1, -sDeg * 0.4);
      rotateTo(innerRing2, sDeg * 0.15);
      rotateTo(innerRing3, -sDeg * 0.05);

      // Sub-dials animation
      rotateEl(msHand, (ms/1000)*360);
      rotateEl(hr24Hand, ((h + m/60)/24)*360);
      rotateEl(botHand, s * 6); // Steps every second

      if (liveTime) {
          liveTime.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} - ${String(ms).padStart(3,'0')}`;
      }
      requestAnimationFrame(tickClock);
    }
    tickClock();
})();

// ═══════════════════════════════════════════════════════════════
// ABOUT REVEAL — Circular text ring that orbits the circle edge
// ═══════════════════════════════════════════════════════════════
(function initAboutCircleText() {
  if (window.innerWidth <= 768) return;

  const aboutSection = document.getElementById('about');
  const layer        = document.getElementById('aboutRingTextLayer');
  const svg          = document.getElementById('aboutRingTextSvg');
  const textPathEl   = document.getElementById('aboutRingTextPath');
  const textG        = document.getElementById('aboutRingTextG');
  if (!aboutSection || !layer || !svg || !textPathEl || !textG) return;

  // ── Match geometry to the reveal circle ──────────────────────
  function updateGeometry() {
    const vw  = window.innerWidth;
    const vh  = window.innerHeight;
    const cx  = vw / 2;
    const cy  = vh / 2;
    const ref = Math.sqrt((vw * vw + vh * vh) / 2);
    
    // Set static path to MAXIMUM radius (p=1.0)
    const maxCircleRadiusPx = ref * 0.62;
    // Add padding so it hugs the outside edge
    const safeR = Math.max(maxCircleRadiusPx + 20, 1);

    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    textPathEl.setAttribute('d',
      `M ${cx},${cy} m -${safeR},0 a ${safeR},${safeR} 0 1,1 ${2*safeR},0 a ${safeR},${safeR} 0 1,1 -${2*safeR},0`
    );

    // Rotate around viewport center
    textG.style.transformOrigin = `${cx}px ${cy}px`;
  }

  updateGeometry();
  window.addEventListener('resize', updateGeometry, { passive: true });

  // ── Opacity: fade in → hold → fade out as reveal progresses ──
  const REVEAL_FRACTION = 1.5;
  let rafId = null;

  function updateOpacity() {
    const rect  = aboutSection.getBoundingClientRect();
    const into  = -rect.top;
    const range = window.innerHeight * REVEAL_FRACTION;
    const p     = Math.min(1, Math.max(0, into / range));

    // 0→0.75: fully visible | 0.75→1: fade out
    let op = 1;
    if (p >= 0.75) {
      op = 1 - (p - 0.75) / 0.25;
    }
    layer.style.opacity = Math.max(0, op).toFixed(3);
  }

  function scheduleOpacity() {
    if (!rafId) rafId = requestAnimationFrame(() => { updateOpacity(); rafId = null; });
  }

  if (window.lenis) {
    window.lenis.on('scroll', scheduleOpacity);
  }
  window.addEventListener('scroll', scheduleOpacity, { passive: true });
  updateOpacity();
})();
