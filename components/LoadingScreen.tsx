
import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onFinished: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('ESTABLISHING SECURE CONNECTION');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const initializeApp = async () => {
      // Simulation of app initialization
      const steps = [
        { p: 15, s: 'ESTABLISHING SECURE CONNECTION' },
        { p: 40, s: 'VERIFYING AUTHENTICATION' },
        { p: 75, s: 'SYNCING STUDIO CONFIGURATION' },
        { p: 100, s: 'SYSTEMS ONLINE' }
      ];

      for (const step of steps) {
        if (!isMounted) break;
        setProgress(step.p);
        setStatus(step.s);
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      if (isMounted) {
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(onFinished, 800);
        }, 500);
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative text-center">
        {/* Brand Name */}
        <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-white mb-2 overflow-hidden flex items-center justify-center">
          <span className="inline-block animate-reveal">DAT</span>
          <span className="text-red-600 inline-block animate-reveal ml-3" style={{ animationDelay: '0.2s' }}>CLOUDE</span>
        </h1>
        
        {/* Subtitle / Status */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase mb-8 h-4">
            {status}
          </p>
          
          {/* Progress Bar Container */}
          <div className="w-64 h-[2px] bg-gray-900 relative overflow-hidden rounded-full mb-4">
            <div 
              className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(220,38,38,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage */}
          <div className="font-mono text-xs font-bold text-gray-400 tracking-widest">
            {progress.toString().padStart(3, '0')}%
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-600/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-red-600/5 blur-[120px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes reveal {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-reveal {
          animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default LoadingScreen;
