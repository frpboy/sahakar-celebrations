import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedurally generate a soft glowing circle texture
const createGlowTexture = () => {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
};

export const WebGLParticles: React.FC = () => {
  const ambientPointsRef = useRef<THREE.Points>(null);
  const fallingPointsRef = useRef<THREE.Points>(null);

  const ambientCount = 350;
  const fallingCount = 120;

  // Cache the procedural texture safely for client environments
  const glowTexture = useMemo(() => createGlowTexture(), []);

  // Generate random positions, velocities, colors, and phases
  const [ambientData, fallingData] = useMemo(() => {
    // 1. Ambient System
    const ambPos = new Float32Array(ambientCount * 3);
    const ambVels = new Float32Array(ambientCount * 3);
    const ambCols = new Float32Array(ambientCount * 3);
    const ambPhases = new Float32Array(ambientCount);

    for (let i = 0; i < ambientCount; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 80;
      ambPos[i * 3 + 1] = Math.random() * 25 - 5;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;

      ambVels[i * 3] = (Math.random() - 0.5) * 0.01; // slow drift
      ambVels[i * 3 + 1] = -(Math.random() * 0.012 + 0.004);
      ambVels[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      // Colors: 65% Gold, 35% Sapphire
      const isGold = Math.random() > 0.35;
      if (isGold) {
        ambCols[i * 3] = 0.95;
        ambCols[i * 3 + 1] = 0.84;
        ambCols[i * 3 + 2] = 0.58;
      } else {
        ambCols[i * 3] = 0.29;
        ambCols[i * 3 + 1] = 0.58;
        ambCols[i * 3 + 2] = 0.84;
      }

      ambPhases[i] = Math.random() * Math.PI * 2;
    }

    // 2. Falling System (larger stardust particles)
    const fallPos = new Float32Array(fallingCount * 3);
    const fallVels = new Float32Array(fallingCount * 3);
    const fallCols = new Float32Array(fallingCount * 3);
    const fallPhases = new Float32Array(fallingCount);

    for (let i = 0; i < fallingCount; i++) {
      fallPos[i * 3] = (Math.random() - 0.5) * 60;
      fallPos[i * 3 + 1] = Math.random() * 35; // starts higher up
      fallPos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5;

      fallVels[i * 3] = (Math.random() - 0.5) * 0.02;
      fallVels[i * 3 + 1] = -(Math.random() * 0.06 + 0.03); // faster fall rate
      fallVels[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Matching Colors: Gold & Sapphire
      const isGold = Math.random() > 0.4;
      if (isGold) {
        fallCols[i * 3] = 0.98;
        fallCols[i * 3 + 1] = 0.88;
        fallCols[i * 3 + 2] = 0.65;
      } else {
        fallCols[i * 3] = 0.4;
        fallCols[i * 3 + 1] = 0.7;
        fallCols[i * 3 + 2] = 0.95;
      }

      fallPhases[i] = Math.random() * Math.PI * 2;
    }

    return [
      { positions: ambPos, velocities: ambVels, colors: ambCols, phases: ambPhases },
      { positions: fallPos, velocities: fallVels, colors: fallCols, phases: fallPhases }
    ];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pointer = state.pointer; // [-1, 1]
    const mouseWorldX = pointer.x * 20;
    const mouseWorldY = pointer.y * 15;

    // 1. Update Ambient stardust
    if (ambientPointsRef.current) {
      const geo = ambientPointsRef.current.geometry;
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

      for (let i = 0; i < ambientCount; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        x += ambientData.velocities[i * 3] + Math.sin(time + ambientData.phases[i]) * 0.004;
        y += ambientData.velocities[i * 3 + 1];
        z += ambientData.velocities[i * 3 + 2];

        // Repulsion physics
        const dx = x - mouseWorldX;
        const dy = y - mouseWorldY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 36) {
          const dist = Math.sqrt(distSq);
          const force = (6 - dist) / 6;
          x += (dx / (dist + 0.1)) * force * 0.18;
          y += (dy / (dist + 0.1)) * force * 0.18;
        }

        // Wrap bottom bounds
        if (y < -8) {
          y = 20;
          x = (Math.random() - 0.5) * 80;
          z = (Math.random() - 0.5) * 80 - 10;
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    }

    // 2. Update Falling stardust
    if (fallingPointsRef.current) {
      const geo = fallingPointsRef.current.geometry;
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

      for (let i = 0; i < fallingCount; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        x += fallingData.velocities[i * 3] + Math.sin(time * 1.2 + fallingData.phases[i]) * 0.008;
        y += fallingData.velocities[i * 3 + 1];
        z += fallingData.velocities[i * 3 + 2];

        // Wrap bottom bounds
        if (y < -12) {
          y = 28;
          x = (Math.random() - 0.5) * 60;
          z = (Math.random() - 0.5) * 50 - 5;
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Ambient Background Particles */}
      <points ref={ambientPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[ambientData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[ambientData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.34}
          vertexColors
          transparent
          opacity={0.65}
          map={glowTexture || undefined}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Large Falling Bokeh Particles */}
      <points ref={fallingPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[fallingData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[fallingData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.75}
          vertexColors
          transparent
          opacity={0.7}
          map={glowTexture || undefined}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
