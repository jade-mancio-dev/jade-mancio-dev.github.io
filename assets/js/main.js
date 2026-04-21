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
  // UNIFIED WORKS SCROLL ANIMATION (Entrance + Gallery)
  // ═══════════════════════════════════════════════════════════════
  const worksScene = document.getElementById('works-scroll-scene');
  if (worksScene) {
    // --- Entrance elements ---
    const wWrap     = document.getElementById('works-title-wrap');
    const wTitle    = document.querySelector('.works-entrance-title');
    const wEyebrow  = document.querySelector('.works-eyebrow');
    const wVignette = document.getElementById('works-vignette');
    const wHint     = document.getElementById('works-scroll-hint');

    const wStrips = [
      { el: document.getElementById('wt1'), dir:  1, base: -500 },
      { el: document.getElementById('wt2'), dir: -1, base: -300 },
      { el: document.getElementById('wb1'), dir: -1, base: -500 },
      { el: document.getElementById('wb2'), dir:  1, base: -300 },
    ];

    // --- Gallery elements ---
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

    let uRaf = null, uSceneH = 0, uViewH = 0;
    // Smoothed values for lerp-based animation
    let smoothRaw = 0;
    const LERP_FACTOR = 0.12; // lower = smoother/slower, higher = snappier

    const uMeasure = () => {
      uSceneH = worksScene.offsetHeight;
      uViewH  = window.innerHeight;
    };
    uMeasure();

    // Timeline thresholds — responsive to viewport
    const isMobileInit = window.innerWidth <= 768;
    // Desktop: 500vh scene, 400vh scrollable | Mobile: 280vh scene, 180vh scrollable
    const ENTRANCE_END  = isMobileInit ? 0.44 : 0.25;
    const GALLERY_START = isMobileInit ? 0.42 : 0.22;
    const GALLERY_END   = 0.98;

    // Store current positions for smooth interpolation
    // Indices: 0..numCards-1 = desktop X, numCards..2*numCards-1 = mobile Y, 2*numCards..3*numCards-1 = mobile scale
    const cardCurrentX = [];
    for (let i = 0; i < numCards; i++) {
      cardCurrentX[i] = 110;             // desktop X
      cardCurrentX[i + numCards] = 100;   // mobile Y
      cardCurrentX[i + numCards * 2] = 0.92; // mobile scale
    }

    const uRender = () => {
      const targetRaw = clamp(
        -worksScene.getBoundingClientRect().top / (uSceneH - uViewH), 0, 1
      );

      // Lerp toward target for buttery smoothness
      smoothRaw += (targetRaw - smoothRaw) * LERP_FACTOR;
      // Snap if very close to avoid infinite loop
      if (Math.abs(smoothRaw - targetRaw) < 0.0001) smoothRaw = targetRaw;

      const raw = smoothRaw;

      // ─── ENTRANCE PHASE ───
      const entranceP = clamp(raw / ENTRANCE_END, 0, 1);

      // Center title zoom
      const sc      = lerp(1, 15, easeExp(entranceP));
      const titleOp = entranceP < 0.82 ? 1 : clamp(1 - (entranceP - 0.82) / 0.18, 0, 1);

      wWrap.style.transform       = `scale(${sc.toFixed(5)})`;
      wWrap.style.opacity         = titleOp.toFixed(4);
      wTitle.style.letterSpacing  = lerp(0.02, 0.55, easeInOut(entranceP)) + 'em';
      wEyebrow.style.opacity      = clamp(1 - entranceP / 0.22, 0, 1);
      wVignette.style.opacity     = clamp(lerp(0.45, 0.96, easeInOut(entranceP)), 0, 1);
      wHint.style.opacity         = clamp(1 - entranceP * 4.5, 0, 1);

      // Marquees
      const travel  = entranceP * 1100;
      const groupOp = entranceP < 0.2
        ? lerp(0, 1, entranceP / 0.2)
        : entranceP < 0.8 ? 1
        : lerp(1, 0, (entranceP - 0.8) / 0.2);

      wStrips.forEach(s => {
        s.el.style.transform = `translate3d(${(s.base + s.dir * travel).toFixed(1)}px, 0, 0)`;
        s.el.style.opacity   = groupOp.toFixed(4);
      });

      // Hide entrance elements once gallery starts
      const entranceVis = raw < GALLERY_START ? '1' : 
                          raw < GALLERY_START + 0.05 ? clamp(1 - (raw - GALLERY_START) / 0.05, 0, 1).toFixed(4) : '0';
      const groupTop = document.getElementById('works-group-top');
      const groupBot = document.getElementById('works-group-bot');
      if (groupTop) groupTop.style.opacity = entranceVis;
      if (groupBot) groupBot.style.opacity = entranceVis;
      // Also hide vignette and title so they don't dim the cards
      wVignette.style.opacity = raw >= GALLERY_START ? entranceVis : wVignette.style.opacity;
      wWrap.style.opacity = raw >= GALLERY_START ? entranceVis : wWrap.style.opacity;

      // ─── GALLERY PHASE ───
      if (numCards > 0) {
        const galleryP = clamp(
          (raw - GALLERY_START) / (GALLERY_END - GALLERY_START), 0, 1
        );

        const segSize = 1 / numCards;
        const isMobile = window.innerWidth <= 768;
        const slideRatio = isMobile ? 0.80 : 0.45; // desktop: snappy with clear gaps, mobile: smooth pile-up

        cardWrappers.forEach((wrapper, i) => {
          const segStart = i * segSize;
          const slideEnd = segStart + segSize * slideRatio;

          let targetX, targetY, targetScale;

          if (isMobile) {
            // ─── MOBILE: Pile-up from bottom ───
            if (galleryP <= segStart) {
              targetY = 100;
              targetScale = 0.92;
            } else if (galleryP <= slideEnd) {
              const p = (galleryP - segStart) / (slideEnd - segStart);
              const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
              targetY = (1 - ease) * 100;
              targetScale = 0.92 + ease * 0.08;
            } else {
              targetY = 0;
              targetScale = 1;
            }

            // Lerp for smooth movement
            cardCurrentX[i + numCards] += (targetY - cardCurrentX[i + numCards]) * LERP_FACTOR;
            cardCurrentX[i + numCards * 2] += (targetScale - cardCurrentX[i + numCards * 2]) * LERP_FACTOR;

            if (Math.abs(cardCurrentX[i + numCards] - targetY) < 0.05) cardCurrentX[i + numCards] = targetY;
            if (Math.abs(cardCurrentX[i + numCards * 2] - targetScale) < 0.001) cardCurrentX[i + numCards * 2] = targetScale;

            const curY = cardCurrentX[i + numCards];
            const curS = cardCurrentX[i + numCards * 2];
            wrapper.style.transform = `translate3d(0, ${curY.toFixed(2)}%, 0) scale(${curS.toFixed(4)})`;
          } else {
            // ─── DESKTOP: Slide from right ───
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

            wrapper.style.transform = `translate3d(${cardCurrentX[i].toFixed(2)}%, 0, 0)`;
          }
        });
      }

    };

    // Continuous rAF loop — lerp runs every frame for buttery-smooth interpolation
    const uLoop = () => {
      uRender();
      requestAnimationFrame(uLoop);
    };
    window.addEventListener('resize', uMeasure, { passive: true });
    requestAnimationFrame(uLoop);
  }
});

// ═══════════════════════════════════════════════════════════════
// CONTACT SLIDE PANEL — Desktop Only
// ═══════════════════════════════════════════════════════════════
function openContactPanel() {
  const panel    = document.getElementById('contactPanel');
  const backdrop = document.getElementById('contactPanelBackdrop');
  if (!panel || !backdrop) return;

  // Make elements visible before animating so the GPU layer is ready
  panel.style.visibility    = 'visible';
  backdrop.style.visibility = 'visible';

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
