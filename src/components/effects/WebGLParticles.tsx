import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const WebGLParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;

  // Generate random particle positions and velocities
  const [positions, velocities, colors, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Position: random distribution in a big box around the canyon
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 25 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;

      // Velocity
      vels[i * 3] = (Math.random() - 0.5) * 0.02; // x speed
      vels[i * 3 + 1] = -(Math.random() * 0.03 + 0.01); // falling down speed
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // z speed

      // Colors: 70% Gold, 30% Sapphire Blue
      const isGold = Math.random() > 0.3;
      if (isGold) {
        cols[i * 3] = 0.95; // R (Gold light)
        cols[i * 3 + 1] = 0.84; // G
        cols[i * 3 + 2] = 0.58; // B
      } else {
        cols[i * 3] = 0.29; // R (Sapphire light)
        cols[i * 3 + 1] = 0.58; // G
        cols[i * 3 + 2] = 0.84; // B
      }

      // Phase for shimmering
      phs[i] = Math.random() * Math.PI * 2;
    }

    return [pos, vels, cols, phs];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const pointer = state.pointer; // Normalized mouse coordinates [-1, 1]

    // Convert mouse screen-space to approximate 3D world coords
    const mouseWorldX = pointer.x * 20;
    const mouseWorldY = pointer.y * 15;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // 1. Move particle by velocity
      x += velocities[i * 3] + Math.sin(state.clock.elapsedTime + phases[i]) * 0.005;
      y += velocities[i * 3 + 1];
      z += velocities[i * 3 + 2];

      // 2. Cursor repulsion physics
      const dx = x - mouseWorldX;
      const dy = y - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      if (distSq < 49) { // 7 units radius
        const dist = Math.sqrt(distSq);
        const force = (7 - dist) / 7;
        x += (dx / (dist + 0.1)) * force * 0.2;
        y += (dy / (dist + 0.1)) * force * 0.2;
      }

      // 3. Reset boundaries
      if (y < -8) {
        y = 20;
        x = (Math.random() - 0.5) * 80;
        z = (Math.random() - 0.5) * 80 - 10;
      }

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
