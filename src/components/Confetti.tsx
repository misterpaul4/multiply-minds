import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  shape: number;
}

const COLORS = ["#f97316", "#22c55e", "#8b5cf6", "#ec4899", "#facc15", "#38bdf8"];

export default function Confetti({
  burstKey,
  intensity = 1,
}: {
  burstKey: number;
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (burstKey === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const count = Math.round(110 * intensity);
    const parts: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const fromLeft = i % 2 === 0;
      parts.push({
        x: fromLeft ? 0 : w,
        y: h * (0.25 + Math.random() * 0.35),
        vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 10) * dpr,
        vy: -(8 + Math.random() * 9) * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        size: (6 + Math.random() * 7) * dpr,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: (Math.random() * 2) | 0,
      });
    }
    particlesRef.current = parts;

    const gravity = 0.35 * dpr;
    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of parts) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rot += p.vr;
        if (p.y < h + 40 * dpr) alive++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 0) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      frame++;
      if (alive > 0 && frame < 220) {
        rafRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    render();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [burstKey, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden
    />
  );
}
