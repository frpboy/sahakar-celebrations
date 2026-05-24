import { Effect } from 'postprocessing';
import * as THREE from 'three';
import { forwardRef, useMemo, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const fragmentShader = `
  uniform vec2 uRipples[6];
  uniform float uRipplesAge[6];
  uniform float uRipplesForce[6];
  uniform float uAspect;
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 totalOffset = vec2(0.0);
    
    for (int i = 0; i < 6; i++) {
      float age = uRipplesAge[i];
      if (age >= 0.0 && age < 1.0) {
        vec2 center = uRipples[i];
        vec2 dir = uv - center;
        
        // Aspect ratio correction for circular ripples
        vec2 correctedDir = vec2(dir.x * uAspect, dir.y);
        float dist = length(correctedDir);
        
        float maxRadius = 0.28;
        if (dist < maxRadius) {
          // Concentric ripples radiating outward
          float wave = sin(dist * 55.0 - age * 16.0) * uRipplesForce[i] * 0.015;
          // Smooth decay toward the edges and over time
          float edgeDecay = 1.0 - (dist / maxRadius);
          float timeDecay = 1.0 - age;
          float decay = edgeDecay * edgeDecay * timeDecay;
          
          totalOffset += normalize(dir) * wave * decay;
        }
      }
    }
    
    outputColor = texture2D(inputBuffer, uv + totalOffset);
  }
`;

class FluidDistortionEffect extends Effect {
  constructor() {
    const ripples = Array.from({ length: 6 }, () => new THREE.Vector2(-2.0, -2.0));
    const ages = Array.from({ length: 6 }, () => -1.0);
    const forces = Array.from({ length: 6 }, () => 0.0);
    
    super('FluidDistortionEffect', fragmentShader, {
      uniforms: new Map<string, THREE.Uniform<any>>([
        ['uRipples', new THREE.Uniform(ripples)],
        ['uRipplesAge', new THREE.Uniform(ages)],
        ['uRipplesForce', new THREE.Uniform(forces)],
        ['uAspect', new THREE.Uniform(1.0)]
      ])
    });
  }
}

export const FluidDistortion = forwardRef<any, {}>((_, ref) => {
  const { size, gl } = useThree();
  const effect = useMemo(() => new FluidDistortionEffect(), []);
  
  // Track ripple state values
  const rippleData = useRef({
    centers: Array.from({ length: 6 }, () => new THREE.Vector2(-2.0, -2.0)),
    ages: new Float32Array(6).fill(-1.0),
    forces: new Float32Array(6).fill(0.0),
    currentIndex: 0,
    lastMouse: new THREE.Vector2(-1.0, -1.0)
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - ((e.clientY - rect.top) / rect.height);
      
      const mousePos = new THREE.Vector2(x, y);
      const data = rippleData.current;
      
      if (data.lastMouse.x < 0.0) {
        data.lastMouse.copy(mousePos);
        return;
      }

      const dist = mousePos.distanceTo(data.lastMouse);
      
      // Spawn ripple if mouse movement speed exceeds minimum threshold
      if (dist > 0.01) {
        const index = data.currentIndex;
        data.centers[index].copy(mousePos);
        data.ages[index] = 0.0;
        // Limit force mapping to prevent extreme clipping distortions
        data.forces[index] = Math.min(dist * 2.8, 0.95);
        
        data.currentIndex = (data.currentIndex + 1) % 6;
        data.lastMouse.copy(mousePos);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const data = rippleData.current;
    
    // Update active ripples' ages
    for (let i = 0; i < 6; i++) {
      if (data.ages[i] >= 0.0) {
        data.ages[i] += delta * 1.6; // duration ~0.62 seconds
        if (data.ages[i] >= 1.0) {
          data.ages[i] = -1.0; // deactivate
          data.centers[i].set(-2.0, -2.0);
        }
      }
    }

    // Set uniform values
    const ageUniform = effect.uniforms.get('uRipplesAge');
    const centersUniform = effect.uniforms.get('uRipples');
    const forcesUniform = effect.uniforms.get('uRipplesForce');
    const aspectUniform = effect.uniforms.get('uAspect');

    if (ageUniform) ageUniform.value = Array.from(data.ages);
    if (centersUniform) centersUniform.value = data.centers;
    if (forcesUniform) forcesUniform.value = Array.from(data.forces);
    if (aspectUniform) aspectUniform.value = size.width / size.height;
  });

  return <primitive ref={ref} object={effect} dispose={null} />;
});

FluidDistortion.displayName = 'FluidDistortion';
