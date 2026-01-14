import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Cloud, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const Background: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Points>(null);

  // Memoize to prevent recreation
  const starsMaterial = useMemo(() => new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    vertexColors: true
  }), []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group>
      {/* Distant Stars - BRIGHTER & FASTER */}
      <Stars 
        radius={100} 
        depth={50} 
        count={8000} 
        factor={6} 
        saturation={0.2} 
        fade 
        speed={2.5}
      />
      
      {/* Floating Sparkles around the heart area - FASTER & VARIED SIZES */}
      <Sparkles 
        count={400} 
        scale={25} 
        size={[2, 8]}
        speed={1.2} 
        opacity={0.8} 
        color="#ffddee"
      />
      
      {/* Additional sparkles layer - FASTER & SMALLER */}
      <Sparkles 
        count={200} 
        scale={30} 
        size={[1, 5]}
        speed={0.8} 
        opacity={0.6} 
        color="#ffffff"
      />

      {/* Subtle Atmospheric Clouds - FASTER */}
      <group position={[0, -10, -20]}>
         <Cloud opacity={0.3} speed={0.6} bounds={[30, 2, 5]} segments={10} color="#300520" />
      </group>
      <group position={[10, 10, -20]}>
         <Cloud opacity={0.2} speed={0.5} bounds={[20, 2, 5]} segments={10} color="#1a0b2e" />
      </group>

      <group ref={group}>
         {/* Moving starfield layer for depth - FASTER */}
         <Stars radius={50} depth={10} count={2000} factor={8} fade speed={4.0} />
      </group>
    </group>
  );
};

export default Background;