import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HeartParticleProps } from '../types';

const HeartParticles: React.FC<HeartParticleProps> = ({ 
  count = 15000, 
  scale = 1, 
  customText = 'Hào',
  onTextModeChange 
}) => {
  const mesh = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const animationProgress = useRef(0);
  const isAnimating = useRef(true);
  const isDisperseModeRef = useRef(false);
  const disperseProgress = useRef(1);
  const isTextModeRef = useRef(false);
  const textProgress = useRef(0);
  const prevTextRef = useRef(customText);
  const typewriterProgress = useRef(0);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  
  // Memoize shader uniforms to prevent recreation
  const shaderUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 200.0 },
    uAnimationProgress: { value: 0.001 },
    uDisperseProgress: { value: 1.0 },
    uTextProgress: { value: 0.0 },
    uTypewriterProgress: { value: 0.0 }, // New: for typewriter effect
  }), []);
  
  // Update text positions when customText changes
  useEffect(() => {
    if (prevTextRef.current !== customText && geometryRef.current) {
      console.log('Text changed from', prevTextRef.current, 'to', customText);
      
      // Regenerate text positions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 2400;
      canvas.height = 800;
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 280px "Arial", "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(customText, canvas.width / 2, canvas.height / 2);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      const textPixels: [number, number][] = [];
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          if (pixels[index] > 128) {
            textPixels.push([x, y]);
          }
        }
      }
      
      console.log(`Updated text "${customText}" has ${textPixels.length} pixels`);
      
      if (textPixels.length === 0) {
        console.warn('No pixels found for updated text:', customText);
        return;
      }
      
      const charBoundaries: number[] = [];
      let minX = Infinity;
      let maxX = -Infinity;
      
      for (const pixel of textPixels) {
        if (pixel[0] < minX) minX = pixel[0];
        if (pixel[0] > maxX) maxX = pixel[0];
      }
      
      const textWidth = maxX - minX;
      
      for (let i = 0; i <= customText.length; i++) {
        charBoundaries.push(minX + (textWidth / customText.length) * i);
      }
      
      const newTextPositions: number[] = [];
      const newCharIndices: number[] = [];
      
      for (let i = 0; i < count; i++) {
        if (textPixels.length > 0) {
          const randomPixel = textPixels[Math.floor(Math.random() * textPixels.length)];
          const x = (randomPixel[0] - canvas.width / 2) / 20;
          const y = -(randomPixel[1] - canvas.height / 2) / 20;
          const z = (Math.random() - 0.5) * 2;
          
          let charIndex = 0;
          for (let j = 0; j < charBoundaries.length - 1; j++) {
            if (randomPixel[0] >= charBoundaries[j] && randomPixel[0] < charBoundaries[j + 1]) {
              charIndex = j;
              break;
            }
          }
          
          newTextPositions.push(x, y, z);
          newCharIndices.push(charIndex / customText.length);
        } else {
          newTextPositions.push(0, 0, 0);
          newCharIndices.push(0);
        }
      }
      
      // Update buffer attributes
      const textPosAttr = geometryRef.current.getAttribute('aTextPosition') as THREE.BufferAttribute;
      const charIndexAttr = geometryRef.current.getAttribute('aCharIndex') as THREE.BufferAttribute;
      
      if (textPosAttr && charIndexAttr) {
        textPosAttr.set(new Float32Array(newTextPositions));
        textPosAttr.needsUpdate = true;
        
        charIndexAttr.set(new Float32Array(newCharIndices));
        charIndexAttr.needsUpdate = true;
        
        console.log('✓ Updated text positions and char indices');
      }
      
      // Reset typewriter progress when text changes
      typewriterProgress.current = 0;
      if (materialRef.current) {
        materialRef.current.uniforms.uTypewriterProgress.value = 0;
      }
      
      prevTextRef.current = customText;
    }
  }, [customText, count]);
  
  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input field
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key === 'd' || e.key === 'D' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        // Only allow disperse when NOT in text mode
        if (!isTextModeRef.current) {
          isDisperseModeRef.current = !isDisperseModeRef.current;
          console.log('Toggle to:', isDisperseModeRef.current ? 'DISPERSE' : 'CONVERGE');
        }
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        e.stopPropagation();
        // Reset disperse mode when entering text mode
        if (!isTextModeRef.current) {
          isDisperseModeRef.current = false;
          disperseProgress.current = 1;
        }
        isTextModeRef.current = !isTextModeRef.current;
        onTextModeChange?.(isTextModeRef.current);
        console.log('Toggle to:', isTextModeRef.current ? `TEXT MODE (${customText})` : 'HEART MODE');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress, true);
    return () => window.removeEventListener('keydown', handleKeyPress, true);
  }, [customText, onTextModeChange]);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const randoms = [];
    const scales = [];
    const initialPositions = [];
    const dispersePositions = []; // New: positions when dispersed
    const textPositions = []; // New: positions for text "Hào"
    
    // Function to generate text positions using canvas
    const generateTextPositions = (text: string, particleCount: number) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return { positions: [], charBoundaries: [] };
      
      // Set canvas size - MUCH LARGER with padding
      canvas.width = 2400;
      canvas.height = 800;
      
      // Draw text - BIGGER FONT with better support for Vietnamese
      ctx.fillStyle = 'white';
      ctx.font = 'bold 280px "Arial", "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add padding and draw text
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.fillText(text, centerX, centerY);
      
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Collect all white pixels with their x position for character detection
      const textPixels: [number, number][] = [];
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          if (pixels[index] > 128) {
            textPixels.push([x, y]);
          }
        }
      }
      
      console.log(`Text "${text}" has ${textPixels.length} pixels`);
      
      if (textPixels.length === 0) {
        console.warn('No pixels found for text:', text);
        return { positions: [], charBoundaries: [] };
      }
      
      // Calculate character boundaries for typewriter effect
      // FIX: Use loop instead of spread operator to avoid stack overflow
      const charBoundaries: number[] = [];
      let minX = Infinity;
      let maxX = -Infinity;
      
      for (const pixel of textPixels) {
        if (pixel[0] < minX) minX = pixel[0];
        if (pixel[0] > maxX) maxX = pixel[0];
      }
      
      const textWidth = maxX - minX;
      
      // Divide text width by character count
      for (let i = 0; i <= text.length; i++) {
        charBoundaries.push(minX + (textWidth / text.length) * i);
      }
      
      // Sample particles from text pixels with character index
      // Use MORE particles per pixel for better coverage
      const sampledPositions: number[] = [];
      const pixelsPerParticle = Math.max(1, Math.floor(textPixels.length / particleCount));
      
      for (let i = 0; i < particleCount; i++) {
        if (textPixels.length > 0) {
          const randomPixel = textPixels[Math.floor(Math.random() * textPixels.length)];
          const x = (randomPixel[0] - canvas.width / 2) / 20;
          const y = -(randomPixel[1] - canvas.height / 2) / 20;
          const z = (Math.random() - 0.5) * 2;
          
          // Determine which character this particle belongs to
          let charIndex = 0;
          for (let j = 0; j < charBoundaries.length - 1; j++) {
            if (randomPixel[0] >= charBoundaries[j] && randomPixel[0] < charBoundaries[j + 1]) {
              charIndex = j;
              break;
            }
          }
          
          sampledPositions.push(x, y, z, charIndex / text.length);
        } else {
          sampledPositions.push(0, 0, 0, 0);
        }
      }
      
      return { positions: sampledPositions, charBoundaries };
    };
    
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
    
    // Generate text positions for custom text
    const textData = generateTextPositions(customText, count);
    textPositions.push(...textData.positions.filter((_, i) => (i + 1) % 4 !== 0)); // Remove char index for position array
    const charIndices: number[] = [];
    for (let i = 3; i < textData.positions.length; i += 4) {
      charIndices.push(textData.positions[i]);
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      randoms: new Float32Array(randoms),
      scales: new Float32Array(scales),
      initialPositions: new Float32Array(initialPositions),
      dispersePositions: new Float32Array(dispersePositions),
      textPositions: new Float32Array(textPositions),
      charIndices: new Float32Array(charIndices)
    };
  }, [count, customText]);

  // Memoize shader code
  const vertexShader = useMemo(() => `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uSize;
    uniform float uAnimationProgress;
    uniform float uDisperseProgress;
    uniform float uTextProgress;
    uniform float uTypewriterProgress;
    
    attribute float aRandom;
    attribute float aScale;
    attribute vec3 aInitialPosition;
    attribute vec3 aDispersePosition;
    attribute vec3 aTextPosition;
    attribute float aCharIndex;
    
    varying vec3 vColor;
    varying float vTextProgress;

    void main() {
      // Typewriter effect: only apply when in text mode (uTextProgress > 0.5)
      float typewriterVisible = step(aCharIndex, uTypewriterProgress);
      float visibilityMultiplier = mix(1.0, typewriterVisible, step(0.5, uTextProgress));
      
      // INCREASE color intensity when in text mode for better visibility
      float colorMultiplier = mix(1.0, 1.2, uTextProgress);
      vColor = color * colorMultiplier;
      vTextProgress = uTextProgress;
      
      // Step 1: Intro animation (initial -> heart)
      vec3 heartPosition = position;
      vec3 afterIntro = mix(aInitialPosition, heartPosition, uAnimationProgress);
      
      // Step 2: Disperse/Converge animation (heart <-> dispersed)
      vec3 afterDisperse = mix(aDispersePosition, afterIntro, uDisperseProgress);
      
      // Step 3: Text morph (heart/dispersed <-> text)
      vec3 finalPosition = mix(afterDisperse, aTextPosition, uTextProgress);
      
      vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Increase size slightly in text mode for better readability
      float sizeMultiplier = mix(1.0, 0.7, uTextProgress);
      float pulse = sin(uTime * 3.0 + aRandom * 15.0) * 0.3 + 0.9;
      gl_PointSize = uSize * aScale * pulse * sizeMultiplier * visibilityMultiplier * uPixelRatio / -mvPosition.z;
    }
  `, []);

  const fragmentShader = useMemo(() => `
    varying vec3 vColor;
    varying float vTextProgress;
    
    void main() {
      // Circle shape
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;

      // Soft glow gradient from center
      float strength = 1.0 - (r * 2.0);
      strength = pow(strength, 2.0);
      
      // INCREASE brightness in text mode for better readability
      float alphaMult = mix(1.0, 1.0, vTextProgress);

      gl_FragColor = vec4(vColor * strength, alphaMult);
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
      // Handle text mode transition - SLOWER ANIMATION
      const targetTextProgress = isTextModeRef.current ? 1 : 0;
      if (Math.abs(textProgress.current - targetTextProgress) > 0.001) {
        if (isTextModeRef.current) {
          textProgress.current = Math.min(textProgress.current + 0.004, 1);
        } else {
          textProgress.current = Math.max(textProgress.current - 0.004, 0);
          // Reset typewriter when exiting text mode
          typewriterProgress.current = 0;
        }
        
        const t = textProgress.current;
        const eased = t * t * (3 - 2 * t);
        materialRef.current.uniforms.uTextProgress.value = eased;
      }
      
      // Typewriter effect: animate character appearance when in text mode
      if (isTextModeRef.current && textProgress.current > 0.8) {
        if (typewriterProgress.current < 1.0) {
          typewriterProgress.current = Math.min(typewriterProgress.current + 0.008, 1.0); // Adjust speed here
          materialRef.current.uniforms.uTypewriterProgress.value = typewriterProgress.current;
        }
      } else if (!isTextModeRef.current) {
        typewriterProgress.current = 0;
        materialRef.current.uniforms.uTypewriterProgress.value = 0;
      }
      
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
      
      // Heartbeat only when fully converged and not in text mode
      if (disperseProgress.current > 0.95 && textProgress.current < 0.05) {
        const beat = Math.sin(time * 2.0) * 0.05 + Math.sin(time * 4.0) * 0.01;
        mesh.current.scale.setScalar(scale + beat * 0.1);
      } else {
        mesh.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <points ref={mesh} frustumCulled={false}>
      <bufferGeometry ref={geometryRef}>
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
        <bufferAttribute
          attach="attributes-aTextPosition"
          count={particles.textPositions.length / 3}
          array={particles.textPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aCharIndex"
          count={particles.charIndices.length}
          array={particles.charIndices}
          itemSize={1}
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