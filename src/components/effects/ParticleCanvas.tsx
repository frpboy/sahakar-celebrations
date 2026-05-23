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

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  age: number;
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
    
    // Interactive mouse trail nodes history
    const trail: TrailPoint[] = [];
    let lastMouseX = -1000;
    let lastMouseY = -1000;

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

      // Spawn mouse trail points if mouse has moved
      if (lastMouseX !== -1000 && lastMouseY !== -1000) {
        const dx = mouse.x - lastMouseX;
        const dy = mouse.y - lastMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Limit point spawning distance to avoid huge loops
        if (dist > 1.5 && dist < 300) {
          const steps = Math.min(6, Math.floor(dist / 5));
          for (let s = 0; s <= steps; s++) {
            const ratio = steps === 0 ? 0 : s / steps;
            const px = lastMouseX + dx * ratio;
            const py = lastMouseY + dy * ratio;
            
            trail.push({
              x: px,
              y: py,
              vx: dx * 0.04 + (Math.random() * 0.4 - 0.2),
              vy: dy * 0.04 + (Math.random() * 0.4 - 0.2),
              alpha: 1.0,
              age: 0,
            });
          }
        }
      }

      // Track last mouse frame
      if (mouse.x > -500) {
        lastMouseX = mouse.x;
        lastMouseY = mouse.y;
      }

      // Update and draw dynamic fluid light trail (glowing overlapping ribbons)
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // Friction damping
        p.vy *= 0.94;
        p.vy -= 0.02; // Soft heat rise upward drift
        p.alpha -= 0.024; // Age decay
        p.age += 1;

        if (p.alpha <= 0) {
          trail.splice(i, 1);
          continue;
        }

        // Draw soft glowing fluid particle node
        ctx.save();
        ctx.beginPath();
        const size = (12 + Math.sin(p.age * 0.08) * 3) * p.alpha;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 1.5);
        
        // Alternate colors in the trail for an organic blue-gold liquid fusion look
        if (i % 2 === 0) {
          glow.addColorStop(0, `rgba(74, 149, 214, ${p.alpha * 0.5})`);
          glow.addColorStop(0.4, `rgba(30, 107, 184, ${p.alpha * 0.2})`);
          glow.addColorStop(1, 'rgba(10, 14, 25, 0)');
          ctx.shadowColor = 'rgba(30, 107, 184, 0.4)';
        } else {
          glow.addColorStop(0, `rgba(242, 215, 148, ${p.alpha * 0.4})`);
          glow.addColorStop(0.4, `rgba(223, 186, 115, ${p.alpha * 0.15})`);
          glow.addColorStop(1, 'rgba(10, 14, 25, 0)');
          ctx.shadowColor = 'rgba(223, 186, 115, 0.3)';
        }

        ctx.fillStyle = glow;
        ctx.shadowBlur = size * 2;
        ctx.fill();
        ctx.restore();
      }

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

        // Interactive mouse trail vortex wake (swirl particles near trail)
        for (let j = 0; j < trail.length; j += 3) { // sample every 3rd trail point for speed
          const tp = trail[j];
          const tdx = p.x - tp.x;
          const tdy = p.y - tp.y;
          const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
          const tmaxDist = 55;

          if (tdist < tmaxDist) {
            const tforce = (tmaxDist - tdist) / tmaxDist;
            
            // Drag the particle along with the trail point's velocity
            p.x += tp.vx * tforce * 0.6;
            p.y += tp.vy * tforce * 0.6;
            
            // Add a swirl force (perpendicular to displacement)
            p.x += (-tdy / (tdist + 1)) * tforce * 0.8;
            p.y += (tdx / (tdist + 1)) * tforce * 0.8;
          }
        }

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
        // Custom elegant diamond-like shape
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.7, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.7, 0);
        ctx.closePath();

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
