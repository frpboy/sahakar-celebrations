import React, { useEffect, useRef, useState } from 'react';

export const MouseGlow: React.FC = () => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    if (isTouch) return;

    let animationId: number;
    let isAnimating = false;

    const animate = () => {
      const lerpFactor = 0.08;
      const dx = mouseRef.current.x - glowRef.current.x;
      const dy = mouseRef.current.y - glowRef.current.y;

      // If the gap is tiny, snap to destination and stop loop
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        glowRef.current.x = mouseRef.current.x;
        glowRef.current.y = mouseRef.current.y;
        if (containerRef.current) {
          containerRef.current.style.transform = `translate3d(${glowRef.current.x}px, ${glowRef.current.y}px, 0)`;
        }
        isAnimating = false;
        return;
      }

      glowRef.current.x += dx * lerpFactor;
      glowRef.current.y += dy * lerpFactor;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${glowRef.current.x}px, ${glowRef.current.y}px, 0)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      mouseRef.current = { x: e.clientX, y: e.clientY };

      if (!isAnimating) {
        isAnimating = true;
        animationId = requestAnimationFrame(animate);
      }
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isTouch, visible]);

  if (isTouch) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 pointer-events-none z-[100] transition-opacity duration-700 ease-in-out"
      style={{
        opacity: visible ? 1 : 0,
        willChange: 'transform',
      }}
    >
      <div
        className="w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(223, 186, 115, 0.06) 0%, rgba(223, 186, 115, 0.02) 30%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};
