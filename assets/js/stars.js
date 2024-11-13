document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    document.body.prepend(canvas);

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get context
    const ctx = canvas.getContext('2d');

    // Star class
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.length = Math.random() * 80 + 20;
            this.speed = Math.random() * 10 + 5;
            this.angle = (Math.random() * 45 + 45) * Math.PI / 180;
            this.opacity = 1;
            this.fadeSpeed = 0.01;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= this.fadeSpeed;

            if (this.opacity <= 0 || this.y > canvas.height || this.x > canvas.width) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length
            );
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Create stars
    const stars = Array(3).fill().map(() => new ShootingStar());

    // Animation loop
    function animate() {
        // Clear canvas with semi-transparent black
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}); 