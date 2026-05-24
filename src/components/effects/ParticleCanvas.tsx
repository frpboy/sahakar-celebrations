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
  flop: number;
  flopSpeed: number;
  shimmerSpeed: number;
  phase: number;
  depth: number;
  colorType: 'gold' | 'sapphire';
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
    const particleCount = isMobile ? 35 : 90;
    const particles: Particle[] = [];
    

    const createParticle = (initY = false): Particle => {
      const depth = Math.random() * 1.5 + 0.5; // Depth factor: 0.5 to 2.0
      // 35% chance to generate Sapphire Stardust, 65% chance for Gold Leaf Flakes
      const colorType = Math.random() < 0.35 ? 'sapphire' : 'gold';
      
      return {
        x: Math.random() * width,
        y: initY ? Math.random() * height : -20,
        size: (colorType === 'sapphire' ? (Math.random() * 1.5 + 0.4) : (Math.random() * 2.0 + 0.5)) * depth,
        speedY: (colorType === 'sapphire' ? (Math.random() * 0.6 + 0.3) : (Math.random() * 0.4 + 0.2)) * depth,
        speedX: Math.random() * 0.2 - 0.1,
        opacity: (Math.random() * 0.4 + 0.2) / depth,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.01 - 0.005,
        flop: Math.random() * Math.PI * 2,
        flopSpeed: Math.random() * 0.03 + 0.01,
        shimmerSpeed: (colorType === 'sapphire' ? (Math.random() * 0.03 + 0.01) : (Math.random() * 0.015 + 0.005)),
        phase: Math.random() * Math.PI * 2,
        depth: depth,
        colorType: colorType,
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


      // Draw and update falling particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Physics update
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.15;
        p.angle += p.spin;
        p.flop += p.flopSpeed;
        p.phase += p.shimmerSpeed;

        // Twinkling opacity modulation
        const currentOpacity = Math.max(0.08, p.opacity * (0.6 + Math.sin(p.phase) * 0.4));


        // Standard mouse displacement wind vector (foreground layers)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120 * p.depth;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const forceX = (dx / (dist + 1)) * force * 2.0 * p.depth;
          const forceY = (dy / (dist + 1)) * force * 1.0 * p.depth;
          p.x += forceX;
          p.y += forceY;
        }

        // Respawn if boundaries reached
        if (p.y > height + 20 || p.x < -20 || p.x > width + 20) {
          particles[i] = createParticle(false);
          continue;
        }

        // Render 3D tumbling gold leaf flake / sapphire stardust
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        
        // Simulate 3D tilt flip by scaling along the local X-axis
        const scaleX = Math.sin(p.flop);
        ctx.scale(scaleX, 1);

        ctx.beginPath();
        // Soft circular glow shape instead of square/diamond
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);

        // 3D reflection sparkle when flake edge tilts toward viewport
        const isReflecting = Math.abs(scaleX) < 0.22;
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.5);
        
        if (p.colorType === 'sapphire') {
          // Sapphire Blue Color Logic
          if (isReflecting) {
            glow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 1.6})`);
            glow.addColorStop(0.3, `rgba(74, 149, 214, ${currentOpacity * 1.2})`);
            glow.addColorStop(1, 'rgba(10, 14, 25, 0)');
          } else {
            glow.addColorStop(0, `rgba(74, 149, 214, ${currentOpacity})`);
            glow.addColorStop(0.4, `rgba(30, 107, 184, ${currentOpacity * 0.5})`);
            glow.addColorStop(1, 'rgba(10, 14, 25, 0)');
          }
          ctx.shadowColor = isReflecting ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 107, 184, 0.4)';
        } else {
          // Gold Color Logic
          if (isReflecting) {
            glow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 1.6})`);
            glow.addColorStop(0.3, `rgba(253, 237, 196, ${currentOpacity * 1.2})`);
            glow.addColorStop(1, 'rgba(10, 14, 25, 0)');
          } else {
            glow.addColorStop(0, `rgba(242, 215, 148, ${currentOpacity})`);
            glow.addColorStop(0.4, `rgba(223, 186, 115, ${currentOpacity * 0.5})`);
            glow.addColorStop(1, 'rgba(10, 14, 25, 0)');
          }
          ctx.shadowColor = isReflecting ? 'rgba(255, 255, 255, 0.7)' : 'rgba(223, 186, 115, 0.4)';
        }

        ctx.fillStyle = glow;
        ctx.shadowBlur = p.size * (isReflecting ? 2.5 : 1.2);
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
