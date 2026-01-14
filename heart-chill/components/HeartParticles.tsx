import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HeartParticleProps } from '../types';

const HeartParticles: React.FC<HeartParticleProps> = ({ count = 15000, scale = 1 }) => {
  const mesh = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const animationProgress = useRef(0);
  const isAnimating = useRef(true);
  const isDisperseModeRef = useRef(false); // Use ref instead of state for sync
  const disperseProgress = useRef(1); // Start at 1 (fully converged)
  const originalPositions = useRef<Float32Array | null>(null); // Store original positions
  
  // Memoize shader uniforms to prevent recreation
  const shaderUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 200.0 },
    uAnimationProgress: { value: 0.001 },
    uDisperseProgress: { value: 1.0 }, // New: control disperse in shader
  }), []);
  
  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        isDisperseModeRef.current = !isDisperseModeRef.current;
        console.log('Toggle to:', isDisperseModeRef.current ? 'DISPERSE' : 'CONVERGE');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress, true);
    return () => window.removeEventListener('keydown', handleKeyPress, true);
  }, []);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const randoms = [];
    const scales = [];
    const initialPositions = [];
    const dispersePositions = []; // New: positions when dispersed
    
    const shellCount = Math.floor(count * 0.75);
    const coreCount = count - shellCount;

    const addParticle = (u: number, v: number, isShell: boolean) => {
      const xBase = 16 * Math.pow(Math.sin(u), 3);
      const yBase = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
      
      const sinV = Math.sin(v);
      const cosV = Math.cos(v);

      let x = xBase * sinV;
      let y = yBase * sinV;
      let z = cosV * 8.0; 

      const normalizeFactor = 0.8;
      x *= normalizeFactor;
      y *= normalizeFactor;
      z *= normalizeFactor;

      const distFromCenter = Math.sqrt(x * x + y * y + z * z);
      const isOuterEdge = distFromCenter > 8;

      if (!isShell) {
        const r = Math.pow(Math.random(), 0.7);
        x *= r;
        y *= r;
        z *= r;
      }

      positions.push(x, y, z);
      
      // Initial position: particles flow from screen edges toward center
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 40;
      const spread = (Math.random() - 0.5) * 60;
      
      initialPositions.push(
        Math.cos(angle) * distance,
        spread,
        100 + Math.random() * 50
      );
      
      // Disperse position: scattered within visible area (not flying out)
      const disperseRadius = 15 + Math.random() * 20; // Stay within view
      const disperseAngle = Math.random() * Math.PI * 2;
      const dispersePhi = Math.acos(2 * Math.random() - 1);
      
      dispersePositions.push(
        disperseRadius * Math.sin(dispersePhi) * Math.cos(disperseAngle),
        disperseRadius * Math.sin(dispersePhi) * Math.sin(disperseAngle),
        disperseRadius * Math.cos(dispersePhi) - 5 // Keep in front of camera
      );
      
      randoms.push(Math.random());

      if (isShell) {
        if (isOuterEdge) {
          scales.push(1.3);
          const isBright = Math.random() > 0.5;
          if (isBright) {
            colors.push(3.5, 2.0, 2.5); 
          } else {
            colors.push(3.0, 1.5, 2.0);
          }
        } else {
          scales.push(0.8);
          colors.push(1.5, 0.5, 0.9);
        }
      } else {
        scales.push(0.5);
        colors.push(0.6, 0.15, 0.3);
      }
    };

    for (let i = 0; i < shellCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      addParticle(u, v, true);
    }

    for (let i = 0; i < coreCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      addParticle(u, v, false);
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      randoms: new Float32Array(randoms),
      scales: new Float32Array(scales),
      initialPositions: new Float32Array(initialPositions),
      dispersePositions: new Float32Array(dispersePositions)
    };
  }, [count]);

  // Memoize shader code
  const vertexShader = useMemo(() => `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uSize;
    uniform float uAnimationProgress;
    uniform float uDisperseProgress;
    
    attribute float aRandom;
    attribute float aScale;
    attribute vec3 aInitialPosition;
    attribute vec3 aDispersePosition;
    
    varying vec3 vColor;

    void main() {
      vColor = color;
      
      // Step 1: Intro animation (initial -> heart)
      vec3 heartPosition = position; // Original heart position (NEVER MUTATED)
      vec3 afterIntro = mix(aInitialPosition, heartPosition, uAnimationProgress);
      
      // Step 2: Disperse/Converge animation (heart <-> dispersed)
      // uDisperseProgress: 1 = heart, 0 = dispersed
      vec3 finalPosition = mix(aDispersePosition, afterIntro, uDisperseProgress);
      
      vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Twinkle logic
      float pulse = sin(uTime * 3.0 + aRandom * 15.0) * 0.3 + 0.9;
      gl_PointSize = uSize * aScale * pulse * uPixelRatio / -mvPosition.z;
    }
  `, []);

  const fragmentShader = useMemo(() => `
    varying vec3 vColor;
    
    void main() {
      // Circle shape
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;

      // Soft glow gradient from center
      float strength = 1.0 - (r * 2.0);
      strength = pow(strength, 2.0);

      gl_FragColor = vec4(vColor * strength, 1.0);
    }
  `, []);

  useFrame((state) => {
    if (!materialRef.current || !mesh.current) return;
    
    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;
    
    // Intro animation - SLOW: 0 to 1 over 8 seconds
    if (isAnimating.current && animationProgress.current < 1) {
      animationProgress.current = Math.min(animationProgress.current + 0.00208, 1);
      
      const introT = animationProgress.current;
      const easedIntro = introT * introT * (3 - 2 * introT);
      
      materialRef.current.uniforms.uAnimationProgress.value = easedIntro;
      
      if (animationProgress.current >= 1) {
        isAnimating.current = false;
        console.log('✓ Intro complete, disperse/converge ready');
      }
      return;
    }
    
    // After intro: Handle disperse/converge via shader uniform
    if (!isAnimating.current) {
      const targetProgress = isDisperseModeRef.current ? 0 : 1;
      
      // Animate disperseProgress toward target
      if (Math.abs(disperseProgress.current - targetProgress) > 0.001) {
        if (isDisperseModeRef.current) {
          disperseProgress.current = Math.max(disperseProgress.current - 0.008, 0);
        } else {
          disperseProgress.current = Math.min(disperseProgress.current + 0.008, 1);
        }
        
        // Apply easing
        const t = disperseProgress.current;
        const eased = t * t * (3 - 2 * t);
        
        // Update shader uniform (NO position mutation!)
        materialRef.current.uniforms.uDisperseProgress.value = eased;
        
        console.log('Disperse:', disperseProgress.current.toFixed(3), 'Mode:', isDisperseModeRef.current ? 'DISPERSE' : 'CONVERGE');
      }
      
      // Heartbeat only when fully converged
      if (disperseProgress.current > 0.95) {
        const beat = Math.sin(time * 2.0) * 0.05 + Math.sin(time * 4.0) * 0.01;
        mesh.current.scale.setScalar(scale + beat * 0.1);
      } else {
        mesh.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <points ref={mesh} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={particles.randoms.length}
          array={particles.randoms}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={particles.scales.length}
          array={particles.scales}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aInitialPosition"
          count={particles.initialPositions.length / 3}
          array={particles.initialPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aDispersePosition"
          count={particles.dispersePositions.length / 3}
          array={particles.dispersePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent={true}
        vertexColors={true}
        uniforms={shaderUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};
export default HeartParticles;  