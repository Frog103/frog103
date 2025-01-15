class ParticleSystem {
    constructor() {
        // Check if device is mobile or screen is too small
        if (this.isMobileDevice() || window.innerWidth < 768) {
            return; // Don't initialize on mobile/small screens
        }

        this.colors = [
            'rgba(76, 175, 80, 0.8)',  // Brighter Green
            'rgba(255, 255, 255, 0.8)', // Brighter White
            'rgba(173, 255, 47, 0.8)'   // Brighter YellowGreen
        ];
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        
        // Modified canvas initialization
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        // Changed z-index to be above background but below content
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.7';
        document.body.insertBefore(this.canvas, document.body.firstChild);

        // Add glow optimization
        this.ctx.globalCompositeOperation = 'lighter';

        // Bind methods
        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);
        this.createParticle = this.createParticle.bind(this);

        // Setup
        window.addEventListener('resize', this.resize);
        this.resize();
        this.init();
        this.animate();

        // Add pulse configuration
        this.pulseSpeed = 0.03;
        this.maxPulseSize = 1.5;
        this.minPulseSize = 0.5;
    }

    // Add device detection method
    isMobileDevice() {
        return (
            typeof window.orientation !== "undefined" ||
            navigator.userAgent.indexOf("IEMobile") !== -1 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        );
    }

    resize() {
        // Stop animation if screen becomes too small
        if (window.innerWidth < 768) {
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            window.removeEventListener('resize', this.resize);
            return;
        }

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 4 + 2, // Slightly larger particles
            speedX: Math.random() * 0.8 - 0.4,
            speedY: Math.random() * 0.8 - 0.4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            // Add pulse properties
            pulseAngle: Math.random() * Math.PI * 2,
            basePulseSize: Math.random() * 4 + 2,
            pulseRange: Math.random() * 0.5 + 0.5
        };
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    animate() {
        if (!this.ctx || !this.width || !this.height) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'lighter';

        this.particles.forEach(particle => {
            // Validate and fix particle position if needed
            if (!Number.isFinite(particle.x) || !Number.isFinite(particle.y) || 
                Number.isNaN(particle.x) || Number.isNaN(particle.y)) {
                particle.x = Math.random() * this.width;
                particle.y = Math.random() * this.height;
                particle.speedX = Math.random() * 0.8 - 0.4;
                particle.speedY = Math.random() * 0.8 - 0.4;
            }

            // Update position with boundary checking
            particle.x = ((particle.x + particle.speedX + this.width) % this.width) || 0;
            particle.y = ((particle.y + particle.speedY + this.height) % this.height) || 0;

            // Update pulse with validation
            particle.pulseAngle = (particle.pulseAngle + this.pulseSpeed) % (Math.PI * 2);
            const pulseFactor = Math.max(0, Math.min(1, ((Math.sin(particle.pulseAngle) + 1) / 2) * particle.pulseRange));
            const currentSize = Math.max(0.1, particle.basePulseSize * (this.minPulseSize + pulseFactor * (this.maxPulseSize - this.minPulseSize)));

            try {
                // Ensure coordinates are valid numbers
                const x = Math.floor(particle.x) || 0;
                const y = Math.floor(particle.y) || 0;
                const size = Math.floor(currentSize * 2) || 1;

                // Only draw if we have valid coordinates
                if (x >= 0 && y >= 0 && size > 0) {
                    // Draw glow with validated parameters
                    this.ctx.beginPath();
                    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
                    
                    const baseColor = particle.color.replace('rgba(', '').replace(')', '').split(',');
                    const pulseOpacity = Math.max(0, Math.min(0.8, 0.8 * (0.5 + pulseFactor * 0.5)));
                    
                    gradient.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${pulseOpacity})`);
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    
                    this.ctx.fillStyle = gradient;
                    this.ctx.arc(x, y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } catch (error) {
                // If drawing fails, reset the particle
                Object.assign(particle, this.createParticle());
            }
        });

        // Connection lines with validation
        this.ctx.globalCompositeOperation = 'source-over';
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                if (!Number.isFinite(p1.x) || !Number.isFinite(p1.y) || 
                    !Number.isFinite(p2.x) || !Number.isFinite(p2.y)) return;

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150 && Number.isFinite(distance)) {
                    const pulseFactor = Math.max(0, Math.min(1, (Math.sin(p1.pulseAngle) + Math.sin(p2.pulseAngle)) / 4 + 0.5));
                    const alpha = Math.max(0, Math.min(0.15, 0.15 * (1 - distance / 150) * pulseFactor));

                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(76, 175, 80, ${alpha})`;
                    this.ctx.lineWidth = Math.max(0.5, 2 * pulseFactor);
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(this.animate);
    }
}

// Modified initialization to include performance check
document.addEventListener('DOMContentLoaded', () => {
    // Check for mobile/tablet devices and screen size
    const shouldInitialize = !(
        typeof window.orientation !== "undefined" ||
        navigator.userAgent.indexOf("IEMobile") !== -1 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768
    );

    if (shouldInitialize) {
        new ParticleSystem();
    }
});
