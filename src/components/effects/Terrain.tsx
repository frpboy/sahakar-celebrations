import React, { useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Terrain: React.FC = () => {
  const terrainTex = useTexture('/wedding-terrain.png');
  
  const meshRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.Mesh>(null);

  // Subdivisions set to 80x80 (6,400 vertices) for 60fps frame loop iteration in JS
  const gridWidth = 80;
  const gridHeight = 80;

  // Initialize and cache base position grid coordinates
  const [geometry, initialPositions] = useMemo(() => {
    const geo = new THREE.PlaneGeometry(140, 140, gridWidth, gridHeight);
    const pos = geo.attributes.position;
    const initPos = new Float32Array(pos.count * 2); // cache X and Y only

    for (let i = 0; i < pos.count; i++) {
      initPos[i * 2] = pos.getX(i);
      initPos[i * 2 + 1] = pos.getY(i);
    }
    
    return [geo, initPos];
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !gridRef.current) return;

    const time = state.clock.getElapsedTime();
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const gridPosAttr = gridRef.current.geometry.attributes.position as THREE.BufferAttribute;
    
    // Heartbeat pulse cycle modifier (~65 BPM)
    const pulse = Math.sin(time * 0.8) + Math.sin(time * 1.6) * 0.4;
    const morphOffset = time * 0.15 + pulse * 0.06;

    // Track cursor location projected onto plane bounds
    const pointer = state.pointer; // [-1, 1]
    const targetX = pointer.x * 65;
    // Map mouse vertical position to Z coordinate in 3D (corresponds to local Y in plane)
    const targetY = pointer.y * 50 - 10;

    for (let i = 0; i < posAttr.count; i++) {
      const x = initialPositions[i * 2];
      const y = initialPositions[i * 2 + 1];

      // 1. Dynamic morphing waves (Silk wave effect)
      const h1 = Math.sin(x * 0.04 + morphOffset) * Math.cos(y * 0.03 + morphOffset) * 5;
      const h2 = Math.cos(x * 0.08 - morphOffset * 0.5) * Math.sin(y * 0.05 + morphOffset * 0.7) * 1.5;
      const h3 = Math.sin(x * 0.15 + morphOffset * 1.2) * Math.cos(y * 0.12 - morphOffset) * 0.3;

      const baseHeight = h1 + h2 + h3;

      // Canyon valley: flatten center path, raise walls on side
      const centerDamp = Math.min(1, Math.abs(x) / 18);
      const sideRise = Math.max(0, (Math.abs(x) - 10) * 0.26);

      let heightVal = baseHeight * (0.15 + 0.85 * centerDamp) + sideRise;

      // 2. Cursor repulsion ripple (push vertices down near mouse)
      const dx = x - targetX;
      const dy = y - targetY;
      const distSq = dx * dx + dy * dy;
      const radius = 28;

      if (distSq < radius * radius) {
        const dist = Math.sqrt(distSq);
        const force = (radius - dist) / radius;
        // Smooth ease-out push
        const smoothForce = force * force * (3 - 2 * force);
        heightVal -= smoothForce * 3.6;
      }

      posAttr.setZ(i, heightVal);
      gridPosAttr.setZ(i, heightVal + 0.08); // slightly higher to prevent Z-fighting
    }

    posAttr.needsUpdate = true;
    gridPosAttr.needsUpdate = true;

    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <group>
      {/* Primary Subdivided Terrain Mesh */}
      <mesh 
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -6, -10]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          map={terrainTex}
          bumpMap={terrainTex}
          bumpScale={0.1}
          roughness={0.52} // satin/silk sheen
          metalness={0.45} // golden metallic light reflection
          flatShading={false}
        />
      </mesh>

      {/* Decorative Grid Overlay (Upgraded with emissive gold bloom properties) */}
      <mesh 
        ref={gridRef}
        geometry={useMemo(() => geometry.clone(), [geometry])}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -5.92, -10]}
      >
        <meshStandardMaterial
          color="#DFBA73"
          emissive="#DFBA73"
          emissiveIntensity={1.8} // Strong glow for bloom post-process
          wireframe
          transparent
          opacity={0.12} // Slightly brighter grid lines
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};
