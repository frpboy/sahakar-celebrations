import React, { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

export const SilkMouseTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Point>({ x: -1000, y: -1000 });
  const targetRef = useRef<Point>({ x: -1000, y: -1000 });
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number | null>(null);
  const [isTouch, setIsTouch] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const detectTouch = () => {
      setIsTouch(window.innerWidth < 768 || navigator.maxTouchPoints > 0);
    };
    detectTouch();
    window.addEventListener('resize', detectTouch);
    return () => window.removeEventListener('resize', detectTouch);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const maxPoints = 18;
    const lerp = 0.22;

    const draw = () => {
      const { x: tx, y: ty } = targetRef.current;
      mouseRef.current.x += (tx - mouseRef.current.x) * lerp;
      mouseRef.current.y += (ty - mouseRef.current.y) * lerp;

      pointsRef.current.unshift({ x: mouseRef.current.x, y: mouseRef.current.y });
      pointsRef.current = pointsRef.current.slice(0, maxPoints);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < pointsRef.current.length - 1; i++) {
        const p0 = pointsRef.current[i];
        const p1 = pointsRef.current[i + 1];
        const t = 1 - i / (maxPoints - 1);

        const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
        grad.addColorStop(0, `rgba(223, 186, 115, ${0.26 * t})`);
        grad.addColorStop(0.55, `rgba(255, 243, 209, ${0.16 * t})`);
        grad.addColorStop(1, `rgba(223, 186, 115, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 10 * t;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      const head = pointsRef.current[0];
      if (head) {
        const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 18);
        glow.addColorStop(0, 'rgba(255, 243, 209, 0.28)');
        glow.addColorStop(0.45, 'rgba(223, 186, 115, 0.18)');
        glow.addColorStop(1, 'rgba(223, 186, 115, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (mouseRef.current.x < 0) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch, visible]);

  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[14] pointer-events-none transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
};

