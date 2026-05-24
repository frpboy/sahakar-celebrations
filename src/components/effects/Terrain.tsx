import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const Terrain: React.FC = () => {
  const terrainTex = useTexture('/wedding-terrain.png');

  // Deform plane geometry procedurally for smooth canyon dunes and valleys (no needle spikes)
  const geometry = useMemo(() => {
    // 120 subdivisions is plenty for smooth visual hills
    const geo = new THREE.PlaneGeometry(140, 140, 120, 120);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Multi-frequency wave formula (fBm) for realistic hills
      const h1 = Math.sin(x * 0.04) * Math.cos(y * 0.03) * 6; // Large hills
      const h2 = Math.cos(x * 0.08) * Math.sin(y * 0.06) * 2;   // Medium ridges
      const h3 = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 0.5; // Small waves
      
      const baseHeight = h1 + h2 + h3;

      // Canyon valley math: keep center path clear and raise tall side peaks
      const centerDamp = Math.min(1, Math.abs(x) / 18); // 0 at center, 1 at 18 units away
      const sideRise = Math.max(0, (Math.abs(x) - 10) * 0.25); // rises beyond 10 units away

      const heightVal = baseHeight * (0.1 + 0.9 * centerDamp) + sideRise;
      pos.setZ(i, heightVal);
    }

    // Recalculate normal vectors so directional lights reflect smoothly
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* Primary Subdivided Terrain Mesh */}
      <mesh 
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -6, -10]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          map={terrainTex}
          bumpMap={terrainTex}
          bumpScale={0.15} // Low bump scale for smooth leather/glass feel
          roughness={0.7}
          metalness={0.2}
          flatShading={false}
        />
      </mesh>

      {/* Decorative Grid Overlay (for that tech/luxury sidewave vector mesh vibe) */}
      <mesh 
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -5.92, -10]}
      >
        <meshBasicMaterial
          color="#DFBA73"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
};
