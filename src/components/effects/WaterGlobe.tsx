import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { EffectComposer } from '@react-three/postprocessing';
import { FluidDistortion } from './FluidDistortion';
import * as THREE from 'three';

// Rotating Water Background Plane
const WaterBackground: React.FC = () => {
  const texture = useTexture('/water-globe.png');
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (ref.current) {
      // Slow rotation to simulate swirling water
      ref.current.rotation.z += 0.1 * delta;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -0.2]}>
      <planeGeometry args={[2.2, 2.2]} />
      <meshBasicMaterial map={texture} transparent={true} opacity={0.95} />
    </mesh>
  );
};

// Golden "S" monogram inside/behind the water globe
const MonogramS: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);

  // SVG Data URL for the golden S monogram
  const sSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="256" height="256">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stop-color="#F2D794" />
          <stop offset="50%" stop-color="#DFBA73" />
          <stop offset="100%" stop-color="#A48F65" />
        </linearGradient>
      </defs>
      <text x="50" y="64" text-anchor="middle" fill="url(#gold)" font-family="'Cinzel', 'Playfair Display', 'serif'" font-size="52" font-weight="bold">S</text>
    </svg>
  `;
  
  const sUrl = `data:image/svg+xml;utf8,${encodeURIComponent(sSvg)}`;
  const sTexture = useTexture(sUrl);

  useFrame((state) => {
    if (ref.current) {
      // Gentle floating animation
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.04;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0.05]}>
      <planeGeometry args={[1.3, 1.3]} />
      <meshBasicMaterial map={sTexture} transparent={true} />
    </mesh>
  );
};

// Shiny Glass/Water Shell sphere for 3D reflections and shading
const GlassSphere: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      // Very slight wobble/rotation
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      ref.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0.1]}>
      <sphereGeometry args={[1.05, 64, 64]} />
      <meshStandardMaterial 
        color="#D6ECFF"
        roughness={0.02}
        metalness={0.9}
        transparent={true}
        opacity={0.25}
        depthWrite={false}
      />
    </mesh>
  );
};

// Light source that moves with the mouse to create dynamic reflection highlights
const DynamicLight: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      const mouse = state.pointer; // Normalized mouse coordinates [-1, 1]
      // Move light in front of the sphere based on mouse
      lightRef.current.position.x = mouse.x * 2.5;
      lightRef.current.position.y = mouse.y * 2.5;
    }
  });

  return (
    <pointLight 
      ref={lightRef}
      position={[0, 0, 2.5]} 
      intensity={12} 
      color="#E6F2FF" 
      decay={1.5}
    />
  );
};

interface WaterGlobeProps {
  className?: string;
}

export const WaterGlobe: React.FC<WaterGlobeProps> = ({ className }) => {
  return (
    <div className={`w-full h-full relative ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.5} color="#FFFFFF" />
        <DynamicLight />
        
        <Suspense fallback={null}>
          <WaterBackground />
          <MonogramS />
        </Suspense>
        
        <GlassSphere />

        <EffectComposer>
          <FluidDistortion />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
