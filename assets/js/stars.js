document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    let slowMotionEnabled = false;

    let meteorShowerActive = false;
    let meteorShowerTimeout = null;

    const meteorButton = document.createElement('button');
    meteorButton.innerHTML = '☄️';
    meteorButton.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        padding: 10px;
        width: 45px;
        height: 45px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        cursor: pointer;
        z-index: 999999;
        transition: all 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(meteorButton);

    function triggerMeteorShower() {
        if (meteorShowerActive) return;

        meteorShowerActive = true;
        meteorButton.style.background = 'rgba(255, 100, 100, 0.3)';
        meteorButton.disabled = true;

        const intensity = 20;
        const burstDuration = 3000;

        for (let i = 0; i < intensity; i++) {
            setTimeout(() => {
                const meteor = new ShootingStar();
                meteor.speed *= 1.5;
                meteor.length *= 1.2;
                stars.push(meteor);
            }, Math.random() * burstDuration);
        }

        meteorShowerTimeout = setTimeout(() => {
            meteorShowerActive = false;
            meteorButton.style.background = 'rgba(0, 0, 0, 0.5)';
            meteorButton.disabled = false;
        }, burstDuration + 2000);
    }

    meteorButton.addEventListener('click', triggerMeteorShower);

    canvas.addEventListener('click', (e) => {
        const burst = 5;
        for (let i = 0; i < burst; i++) {
            const star = new ShootingStar();
            star.x = e.clientX;
            star.y = e.clientY;
            star.angle = (Math.random() * 360) * Math.PI / 180;
            star.length = 100 + Math.random() * 50;
            star.hue = Math.random() * 360;
            stars.push(star);
        }
    });

    function drawBackgroundStars() {
        const numStars = 100;
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 1;
            const opacity = Math.random() * 0.5 + 0.5;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        }
    }

    class ShootingStar {
        constructor() {
            this.baseSpeed = Math.random() * 15 + 10;
            this.speed = this.baseSpeed;
            this.hue = Math.random() * 360;
            this.size = Math.random() * 3 + 2;
            this.pulsePhase = 0;
            this.trail = [];
            this.maxTrailLength = 20;
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.length = Math.random() * 150 + 100;
            this.angle = (Math.random() * 45 + 45) * Math.PI / 180;
            this.opacity = 1;
            this.fadeSpeed = 0.02;
            this.active = true;
            this.trail = [];
        }

        update() {
            if (!this.active) return;

            const speedMultiplier = slowMotionEnabled ? 0.0001 : 1;
            
            this.pulsePhase += 0.1;
            
            this.trail.unshift({ x: this.x, y: this.y, hue: this.hue });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.pop();
            }

            this.hue = (this.hue + 0.1) % 360;

            this.x += Math.cos(this.angle) * this.speed * speedMultiplier;
            this.y += Math.sin(this.angle) * this.speed * speedMultiplier;
            this.opacity -= this.fadeSpeed * speedMultiplier;

            if (this.opacity <= 0 || this.y > canvas.height || this.x > canvas.width) {
                this.reset();
            }
        }

        draw() {
            if (!this.active) return;

            const pulseFactor = 1 + Math.sin(this.pulsePhase) * 0.2;
            const adjustedSize = this.size * pulseFactor;
            const adjustedOpacity = this.opacity * (0.8 + Math.sin(this.pulsePhase) * 0.2);

            this.trail.forEach((pos, i) => {
                const alpha = (1 - i / this.maxTrailLength) * adjustedOpacity;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, adjustedSize * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${pos.hue}, 100%, 70%, ${alpha})`;
                ctx.fill();
            });

            const gradient = ctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length
            );
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${adjustedOpacity})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);

            if (slowMotionEnabled) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, adjustedSize * 2, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${adjustedOpacity})`;
                ctx.shadowBlur = 40;
                ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(
                    this.x - Math.cos(this.angle) * this.length,
                    this.y - Math.sin(this.angle) * this.length
                );
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 6;
                ctx.shadowBlur = 30;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, adjustedSize, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${adjustedOpacity})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(
                    this.x - Math.cos(this.angle) * this.length,
                    this.y - Math.sin(this.angle) * this.length
                );
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            if (Math.random() > 0.5) {
                const sparkleSize = adjustedSize * 0.5;
                ctx.beginPath();
                ctx.moveTo(this.x - sparkleSize, this.y);
                ctx.lineTo(this.x + sparkleSize, this.y);
                ctx.moveTo(this.x, this.y - sparkleSize);
                ctx.lineTo(this.x, this.y + sparkleSize);
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${adjustedOpacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    const slowMoButton = document.createElement('button');
    slowMoButton.innerHTML = '⏱️';
    slowMoButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        width: 45px;
        height: 45px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        cursor: pointer;
        z-index: 999999;
        transition: all 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(slowMoButton);

    slowMoButton.addEventListener('click', () => {
        slowMotionEnabled = !slowMotionEnabled;
        slowMoButton.style.background = slowMotionEnabled ? 
            'rgba(0, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)';
    });

    const stars = [];
    const maxStars = 2;

    function spawnStar() {
        if (stars.length < maxStars) {
            stars.push(new ShootingStar());
        }
        setTimeout(spawnStar, Math.random() * 15000 + 10000);
    }

    spawnStar();

    function isLightMode() {
        return document.body.classList.contains('light-mode');
    }

    function animate() {
        ctx.fillStyle = isLightMode() ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (!isLightMode()) drawBackgroundStars();
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        
        requestAnimationFrame(animate);
    }

    animate();
}); 