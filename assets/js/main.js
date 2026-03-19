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
    const target = this.getAttribute('href');
    if (target && target !== '#') {
      lenis.scrollTo(target);
    } else if (target === '#') {
      lenis.scrollTo(0);
    }
  });
});

// Video Background Optimization
// Pauses the video when the user scrolls past the hero section to save CPU/GPU and prevent scroll lag
document.addEventListener('DOMContentLoaded', () => {
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
});