import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import HeartParticles from './HeartParticles';
import Background from './Background';

const Scene: React.FC = () => {
  // Memoize camera position to prevent recreation
  const cameraPosition = useMemo(() => [0, 0, 35] as [number, number, number], []);
  
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-black via-[#0a0208] to-[#120412]">
      <Canvas 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          toneMappingExposure: 1,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        frameloop="always"
        flat
        linear
        performance={{ min: 0.5 }}
      >
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        
        <color attach="background" args={['#050105']} />
        
        {/* Lights */}
        <ambientLight intensity={0.2} color="#ffb6c1" />
        
        {/* Objects */}
        <React.Suspense fallback={null}>
          <HeartParticles count={15000} scale={1} />
          <Background />
        </React.Suspense>

        {/* Controls */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={15} 
          maxDistance={60}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
          makeDefault
        />

        {/* Post Processing */}
        <EffectComposer 
          enableNormalPass={false} 
          multisampling={0}
        >
          <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={2.5} 
            radius={0.8}
            levels={9}
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Scene;