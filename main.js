// =============================================
// Hero Starfield Background Animation
// =============================================

const bgCanvas = document.getElementById("hero-bg");

// Reliable mobile/tablet detection
const isMobile = window.innerWidth <= 767 || 
                 'ontouchstart' in window || 
                 navigator.maxTouchPoints > 0;

// ────────────────────────────────────────────────
// MOBILE & TABLET: disable everything Mobile guard
// ────────────────────────────────────────────────
if (isMobile) {
    if (bgCanvas) {
        bgCanvas.style.display = 'none';
        // bgCanvas.remove();     // optional but good
    }
    console.log("Starfield animation disabled on mobile/tablet.");
    return;   // ← STOP HERE — no more code executes
}
else {
    // ────────────────────────────────────────────────
    // DESKTOP ONLY: initialize and run animation
    // ────────────────────────────────────────────────
    if (!bgCanvas) {
        console.error("Canvas element with id 'hero-bg' not found.");
    } else {
        const bgCtx = bgCanvas.getContext("2d", { alpha: false });

        let animationRunning = true;

        // Pause animation when tab is not visible (saves resources)
        document.addEventListener('visibilitychange', () => {
            animationRunning = !document.hidden;
        });

        // ─── Prepare single star image (drawn once for performance) ───
        const starCache = document.createElement('canvas');
        const sCtx = starCache.getContext('2d');
        starCache.width = 40;
        starCache.height = 40;

        const gradient = sCtx.createRadialGradient(20, 20, 0, 20, 20, 20);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(200, 230, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sCtx.fillStyle = gradient;
        sCtx.beginPath();
        sCtx.arc(20, 20, 15, 0, Math.PI * 2);
        sCtx.fill();

        // ─── Configuration ───
        const speed = 3;
        const particleCount = 400;
        const stars = [];

        let mouseX = 0;
        let mouseY = 0;

        // ─── Resize handling ───
        function resizeCanvas() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // ─── Create stars ───
        for (let i = 0; i < particleCount; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 3000,
                y: (Math.random() - 0.5) * 3000,
                z: Math.random() * 2000 + 1, // avoid division by zero
                px: 0,
                py: 0
            });
        }

        // ─── Main animation loop ───
        function animate() {
            if (!animationRunning) {
                requestAnimationFrame(animate);
                return;
            }

            // Clear canvas
            bgCtx.fillStyle = "#000";
            bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

            const centerX = bgCanvas.width / 2;
            const centerY = bgCanvas.height / 2;

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];

                // Move star towards camera
                s.z -= speed;

                // Reset star when it gets too close
                if (s.z <= 1) {
                    s.z = 2000;
                    s.x = (Math.random() - 0.5) * 3000;
                    s.y = (Math.random() - 0.5) * 3000;
                    s.px = 0;
                    s.py = 0;
                }

                // Project 3D → 2D
                const scale = 800 / s.z;
                const x = centerX + (s.x + mouseX) * scale;
                const y = centerY + (s.y + mouseY) * scale;

                // Only draw if inside canvas
                if (x > 0 && x < bgCanvas.width && y > 0 && y < bgCanvas.height) {
                    const size = Math.max(0.5, (2000 - s.z) / 500);
                    const opacity = Math.min(1, (2000 - s.z) / 1000);

                    bgCtx.globalAlpha = opacity;

                    // Draw trail line (if previous position exists)
                    if (s.px !== 0) {
                        bgCtx.beginPath();
                        bgCtx.strokeStyle = "white";
                        bgCtx.lineWidth = size;
                        bgCtx.moveTo(x, y);
                        bgCtx.lineTo(s.px, s.py);
                        bgCtx.stroke();
                    }

                    // Draw star
                    bgCtx.drawImage(starCache, x - size, y - size, size * 2, size * 2);

                    // Save current position for next frame trail
                    s.px = x;
                    s.py = y;
                }
            }

            requestAnimationFrame(animate);
        }

        // Start animation
        animate();
        console.log("Starfield animation started on desktop.");
    }
}