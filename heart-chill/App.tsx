import React from 'react';
import Scene from './components/Scene';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden text-white" style={{ backgroundColor: '#000000' }}>
      <Scene />
      
      {/* Keyboard shortcut hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/40 text-xs font-sans-serif tracking-widest text-center z-20">
        <p>PRESS <span className="text-pink-300/60 font-bold">D</span> OR <span className="text-pink-300/60 font-bold">SPACE</span> TO DISPERSE/CONVERGE</p>
      </div>
    </div>
  );
};

export default App;