import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

export const CameraChoreography: React.FC = () => {
  const lookTarget = useRef(new THREE.Vector3(0, -2, 0));

  // Checkpoints mapping page scroll progression (0.0 to 1.0)
  // to Camera coordinates and where the camera looks.
  const checkpoints = [
    { p: 0.0, pos: [0, 8, 30], look: [0, -2, 0] },     // Hero
    { p: 0.22, pos: [0, 3.8, 22], look: [0, -1, -5] },  // Couples Showcase
    { p: 0.44, pos: [12, 4.5, 16], look: [-5, -1, -12] }, // Event Timeline
    { p: 0.68, pos: [0, 18, 5], look: [0, -2, -10] },    // Venue Map
    { p: 1.0, pos: [0, 2.2, 10], look: [0, 4, -15] }     // RSVP + Footer
  ];

  useFrame((state) => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollY / (maxScroll || 1)));

    // Find the bounding checkpoints
    let targetPos = checkpoints[0].pos;
    let targetLook = checkpoints[0].look;

    for (let i = 0; i < checkpoints.length - 1; i++) {
      const c1 = checkpoints[i];
      const c2 = checkpoints[i + 1];
      if (progress >= c1.p && progress <= c2.p) {
        const t = (progress - c1.p) / (c2.p - c1.p);
        
        // Easing interpolation for smooth flight path transitions
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        targetPos = [
          lerp(c1.pos[0], c2.pos[0], easeT),
          lerp(c1.pos[1], c2.pos[1], easeT),
          lerp(c1.pos[2], c2.pos[2], easeT)
        ];
        targetLook = [
          lerp(c1.look[0], c2.look[0], easeT),
          lerp(c1.look[1], c2.look[1], easeT),
          lerp(c1.look[2], c2.look[2], easeT)
        ];
        break;
      }
    }

    // Add subtle lag-follow camera sway responding to mouse coordinates
    const pointer = state.pointer; // normalized coordinates [-1, 1]
    const swayX = pointer.x * 2.5;
    const swayY = pointer.y * 1.5;

    // Lerp actual camera position
    state.camera.position.x = lerp(state.camera.position.x, targetPos[0] + swayX, 0.05);
    state.camera.position.y = lerp(state.camera.position.y, targetPos[1] + swayY, 0.05);
    state.camera.position.z = lerp(state.camera.position.z, targetPos[2], 0.05);

    // Lerp look-at target
    lookTarget.current.x = lerp(lookTarget.current.x, targetLook[0], 0.05);
    lookTarget.current.y = lerp(lookTarget.current.y, targetLook[1], 0.05);
    lookTarget.current.z = lerp(lookTarget.current.z, targetLook[2], 0.05);

    state.camera.lookAt(lookTarget.current);
  });

  return null;
};
