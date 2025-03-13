import { useRef, useEffect } from "react";

const BackgroundEffect = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let animationFrameId: number;
    let particles: Particle[] = [];
    let beams: Beam[] = [];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Gradient background setup
        let backgroundGradient: CanvasGradient;
        
        const resizeCanvas = () => {
            if (!canvas || !ctx) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Create fresh gradient
            backgroundGradient = ctx.createLinearGradient(
                0, 0, 
                canvas.width, 
                canvas.height * 0.8
            );
            backgroundGradient.addColorStop(0, "#001220");
            backgroundGradient.addColorStop(0.5, "#2a0845");
            backgroundGradient.addColorStop(1, "#001220");
            
            initParticles(canvas);
            initBeams(canvas);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        function initParticles(canvas: HTMLCanvasElement) {
            particles = [];
            const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas));
            }
        }

        function initBeams(canvas: HTMLCanvasElement) {
            beams = [];
            const beamCount = Math.min(Math.floor(canvas.width / 80), 30);
            for (let i = 0; i < beamCount; i++) {
                beams.push(new Beam(canvas));
            }
        }

        const animate = () => {
            if (!canvas || !ctx) return;
            
            // Draw background
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = backgroundGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add glowing composite operation
            ctx.globalCompositeOperation = "lighter";

            // Draw elements
            particles.forEach((particle) => {
                particle.update();
                particle.draw(ctx);
            });

            beams.forEach((beam) => {
                beam.update();
                beam.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

class Particle {
    x: number;
    y: number;
    radius: number;
    speedX: number;
    speedY: number;
    canvas: HTMLCanvasElement;
    hue: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.hue = Math.random() * 360;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;

        // Slowly change hue over time
        this.hue = (this.hue + 0.3) % 360;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0, 
            this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 1)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

class Beam {
    x: number;
    y: number;
    length: number;
    speedY: number;
    canvas: HTMLCanvasElement;
    hue: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.speedY = Math.random() * 3 + 1;
        this.hue = Math.random() * 360;
    }

    update() {
        this.y += this.speedY;
        if (this.y > this.canvas.height) {
            this.y = -this.length;
            this.hue = Math.random() * 360;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createLinearGradient(
            this.x, this.y, 
            this.x, this.y + this.length
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 0.7)`);
        gradient.addColorStop(1, `hsla(${this.hue + 30}, 100%, 50%, 0.1)`);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

export default BackgroundEffect;