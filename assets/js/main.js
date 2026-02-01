const bgCanvas = document.getElementById("hero-bg");
const bgCtx = bgCanvas.getContext("2d", { alpha: false });

// 1. BUFFERED STAR (Pre-rendered for GPU efficiency)
const starCache = document.createElement('canvas');
const sCtx = starCache.getContext('2d');
starCache.width = 40;
starCache.height = 40;
const gradient = sCtx.createRadialGradient(20, 20, 0, 20, 20, 20);
gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
sCtx.fillStyle = gradient;
sCtx.beginPath();
sCtx.arc(20, 20, 15, 0, Math.PI * 2);
sCtx.fill();

// 2. PARALLAX & SETTINGS
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
const speed = 3;
const stars = [];
const particleCount = window.innerWidth < 768 ? 150 : 400;

function resize() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.5;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.5;
});
resize();

// Init Stars
for (let i = 0; i < particleCount; i++) {
    stars.push({
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        z: Math.random() * 2000,
        px: 0, py: 0 // Previous positions for stretching
    });
}

// 3. THE ANIMATION LOOP
function animate() {
    // Smooth Mouse Easing (Prevents jerky movement)
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    bgCtx.fillStyle = "#000";
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    const centerX = bgCanvas.width / 2;
    const centerY = bgCanvas.height / 2;

    for (let i = 0; i < stars.length; i++) {
        let s = stars[i];
        
        // Move star forward
        s.z -= speed;

        // Reset star when it passes the camera
        if (s.z <= 1) {
            s.z = 2000;
            s.x = (Math.random() - 0.5) * 3000;
            s.y = (Math.random() - 0.5) * 3000;
            s.px = 0; s.py = 0;
        }

        // Projection logic
        const scale = 800 / s.z;
        const x = centerX + (s.x + mouseX) * scale;
        const y = centerY + (s.y + mouseY) * scale;

        // Only draw if on screen
        if (x > 0 && x < bgCanvas.width && y > 0 && y < bgCanvas.height) {
            const size = (2000 - s.z) / 500; // Size increases as it gets closer
            const opacity = Math.min(1, (2000 - s.z) / 1000);
            
            bgCtx.globalAlpha = opacity;

            // MOTION BLUR EFFECT: 
            // If we have a previous position, draw a "stretch" instead of a dot
            if (s.px !== 0) {
                bgCtx.beginPath();
                bgCtx.strokeStyle = "white";
                bgCtx.lineWidth = size;
                bgCtx.moveTo(x, y);
                bgCtx.lineTo(s.px, s.py);
                bgCtx.stroke();
            }

            // Draw the star head
            bgCtx.drawImage(starCache, x - size, y - size, size * 2, size * 2);
            
            // Store current position for next frame's stretch
            s.px = x;
            s.py = y;
        }
    }

    requestAnimationFrame(animate);
}

animate();