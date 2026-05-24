import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Terrain } from './Terrain';
import { WebGLParticles } from './WebGLParticles';
import { CameraChoreography } from './CameraChoreography';

export const WebGLCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-[#05060A]">
      <Canvas
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 8, 30], fov: 45, near: 0.1, far: 200 }}
      >
        {/* Hazy dark cyan-obsidian fog */}
        <fogExp2 attach="fog" args={["#05060A", 0.022]} />
        
        {/* Soft atmospheric ambient light */}
        <ambientLight intensity={0.4} color="#1E6BB8" />

        {/* Directional Keylight (creates golden highlights on the terrain) */}
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.2} 
          color="#DFBA73" 
          castShadow
        />

        {/* Sapphire blue accent backlight */}
        <pointLight 
          position={[-15, 5, -10]} 
          intensity={1.8} 
          color="#4A95D6" 
        />

        <Suspense fallback={null}>
          {/* Deformed Mesh Terrain */}
          <Terrain />
          
          {/* Floating Gold & Sapphire Particles */}
          <WebGLParticles />
          
          {/* Scroll-driven Camera path controller */}
          <CameraChoreography />
        </Suspense>

        {/* Post processing effects (disabled on mobile for performance) */}
        {!isMobile && (
          <EffectComposer>
            <Bloom 
              intensity={0.4} 
              luminanceThreshold={0.7} 
              luminanceSmoothing={0.3} 
            />
            <Noise opacity={0.035} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};
