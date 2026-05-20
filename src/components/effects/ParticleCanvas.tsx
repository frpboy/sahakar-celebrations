import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  angle: number;
  spin: number;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic density: less particles on mobile to preserve CPU
    const isMobile = width < 768;
    const particleCount = isMobile ? 35 : 100;
    const particles: Particle[] = [];

    const createParticle = (initY = false): Particle => {
      return {
        x: Math.random() * width,
        y: initY ? Math.random() * height : -10,
        size: Math.random() * 2.5 + 0.5,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01,
      };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse coordinates for smooth lag-follow
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.1;
        p.angle += p.spin;

        // Mouse displacement wind vector
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const forceX = (dx / dist) * force * 1.5;
          const forceY = (dy / dist) * force * 0.8;
          p.x += forceX;
          p.y += forceY;
        }

        // Respawn if boundaries reached
        if (p.y > height || p.x < 0 || p.x > width) {
          particles[i] = createParticle(false);
        }

        // Draw gold particle (glowing soft gold circles)
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Luxury Champagne Gold gradient glow fill
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        glow.addColorStop(0, `rgba(242, 215, 148, ${p.opacity})`);
        glow.addColorStop(0.4, `rgba(223, 186, 115, ${p.opacity * 0.5})`);
        glow.addColorStop(1, 'rgba(22, 20, 29, 0)');
        
        ctx.fillStyle = glow;
        ctx.shadowColor = 'rgba(223, 186, 115, 0.4)';
        ctx.shadowBlur = p.size * 1.5;
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 block"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
