import React from 'react';
import { FloatingTextProps } from '../types';

const FloatingOverlay: React.FC<FloatingTextProps> = ({ text, subtext }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 text-center">
      <div className="mt-[-15vh] animate-pulse">
        <h1 className="font-handwriting text-6xl md:text-8xl lg:text-9xl text-pink-200 drop-shadow-[0_0_15px_rgba(255,100,150,0.8)] opacity-90">
          {text}
        </h1>
        {subtext && (
          <p className="font-sans-serif text-sm md:text-lg text-pink-100 tracking-[0.2em] mt-4 opacity-70 uppercase drop-shadow-md">
            {subtext}
          </p>
        )}
      </div>
      
      <div className="absolute bottom-10 text-white/30 text-xs font-sans-serif tracking-widest">
        DRAG TO ROTATE &bull; SCROLL TO ZOOM
      </div>
    </div>
  );
};

export default FloatingOverlay;
