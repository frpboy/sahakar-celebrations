import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const Terrain: React.FC = () => {
  const terrainTex = useTexture('/wedding-terrain.png');

  // Configure texture wrapping
  terrainTex.wrapS = THREE.ClampToEdgeWrapping;
  terrainTex.wrapT = THREE.ClampToEdgeWrapping;

  return (
    <group>
      {/* Primary Subdivided Terrain Mesh */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -5, -10]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[140, 140, 256, 256]} />
        <meshStandardMaterial
          map={terrainTex}
          displacementMap={terrainTex}
          displacementScale={14}
          displacementBias={-1.5}
          bumpMap={terrainTex}
          bumpScale={0.8}
          roughness={0.6}
          metalness={0.15}
          flatShading={false}
        />
      </mesh>

      {/* Decorative Grid Overlay (for that tech/luxury sidewave vector mesh vibe) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -4.95, -10]}
      >
        <planeGeometry args={[140, 140, 100, 100]} />
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
