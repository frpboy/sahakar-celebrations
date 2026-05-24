import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { EffectComposer } from '@react-three/postprocessing';
import { FluidDistortion } from './FluidDistortion';
import * as THREE from 'three';

// Custom shaders for the 3D procedural water sphere
const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  uniform float uTime;

  // Simple 3D noise generator
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
                   mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
               mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
                   mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;
    
    // Deform the sphere surface using waves and noise
    vec3 noisePos = position * 3.2 + vec3(0.0, uTime * 0.6, uTime * 0.4);
    float displacement = noise(noisePos) * 0.06;
    
    // Add rhythmic sine waves for water current effect
    displacement += sin(position.y * 5.0 + uTime * 1.2) * 0.015;
    displacement += cos(position.x * 4.0 - uTime * 0.8) * 0.01;
    
    vec3 displacedPosition = position + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorWater;
  uniform vec3 uColorHighlight;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Fresnel reflection factor
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);
    
    // Organic wave coloring gradient
    float wavePattern = sin(vPosition.x * 6.0 + uTime * 1.5) * cos(vPosition.y * 6.0 + uTime * 1.0) * 0.5 + 0.5;
    
    // Base blue/sapphire color with animated flow
    vec3 baseColor = mix(uColorWater, vec3(0.05, 0.2, 0.45), wavePattern * 0.3);
    
    // Blend in the gold highlights on the glowing edges
    vec3 finalColor = mix(baseColor, uColorHighlight, fresnel * 0.65);
    
    // Dynamic specular highlights from key lights
    vec3 lightDir1 = normalize(vec3(1.5, 1.5, 1.0));
    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    float spec1 = pow(max(dot(normal, halfDir1), 0.0), 64.0);
    
    vec3 lightDir2 = normalize(vec3(-1.5, -1.0, 1.0));
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    float spec2 = pow(max(dot(normal, halfDir2), 0.0), 32.0);
    
    finalColor += vec3(spec1 * 0.75) + vec3(spec2 * 0.25) * vec3(0.5, 0.8, 1.0);
    
    // Transparency mapping (center is clear, edges are thick water)
    float alpha = mix(0.35, 0.88, fresnel);
    
    // Soft inner sparkles/glints representing stardust in water
    float sparkle = step(0.988, fract(sin(dot(vPosition.xyz * 15.0, vec3(12.9898, 78.233, 45.164))) * 43758.5453 + uTime * 0.1));
    finalColor += vec3(sparkle * 0.5 * (1.0 - fresnel));
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Procedural 3D Water Sphere Mesh
const WaterSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorWater: { value: new THREE.Color("#0B2A4C") }, // Signature deep sapphire blue
    uColorHighlight: { value: new THREE.Color("#DFBA73") }, // Gold highlights
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation to create general movement direction
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      
      // Update uniform time
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms && mat.uniforms.uTime) {
        mat.uniforms.uTime.value = state.clock.getElapsedTime();
      }
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={2}>
      <sphereGeometry args={[1.05, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
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
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -0.05]} renderOrder={1}>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial map={sTexture} transparent={true} />
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
      lightRef.current.position.x = mouse.x * 2.2;
      lightRef.current.position.y = mouse.y * 2.2;
    }
  });

  return (
    <pointLight 
      ref={lightRef}
      position={[0, 0, 2.2]} 
      intensity={15} 
      color="#EAF6FF" 
      decay={1.2}
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
          <MonogramS />
        </Suspense>
        
        <WaterSphere />

        <EffectComposer>
          <FluidDistortion />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
