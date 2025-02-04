'use client'
import {useEffect, useRef} from "react";

interface Star {
    x: number;
    y: number;
    size: number;
    speed: number;
    update: () => void;
    draw: () => void;
}

const stars: Star[] = [];
const numStars = 150;

const createStar = (canvas): Star => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.2,
    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.x = Math.random() * canvas.width;
            this.y = 0;
        }
    },
    draw() {
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
});

const StarsBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();

        for (let i = 0; i < numStars; i++) {
            stars.push(createStar(canvas));
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((star) => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(animate);
        };

        animate();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    return <canvas ref={canvasRef} className="canvas-background"/>;
};

export default StarsBackground;
