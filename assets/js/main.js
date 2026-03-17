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
});