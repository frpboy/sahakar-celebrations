import React, { useEffect, useState } from 'react';

export const MouseGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Detect touch support
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(hasTouch);
    };

    checkTouch();

    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      
      // Interpolation done via css transition to avoid re-render performance costs
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouch, visible]);

  if (isTouch || !visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="absolute w-[400px] h-[400px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-[200ms] ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'radial-gradient(circle, rgba(223, 186, 115, 0.08) 0%, rgba(22, 20, 29, 0) 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};
