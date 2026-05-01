import React, { useState, useEffect, useRef } from 'react';
import { useStoreData } from '../contexts/StoreDataContext';
import { Package, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const WelcomeScreen = ({ onEnter }) => {
  const { storeSettings } = useStoreData();
  const { t } = useLocale();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const shopName = storeSettings?.shopName?.toUpperCase() || 'SWEETO-HUB';
  const shopTagline = storeSettings?.shopTagline || 'Premium Tech Solutions';

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 2 + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          setShowCompleteScreen(true);
        }, 800);
      }, 600);
    }
  }, [progress]);

  useEffect(() => {
    if (showCompleteScreen) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCompleteScreen]);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[10000] font-['Inter'] transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
      <style>{`
        @keyframes liquidGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .brand-text-shimmer {
          background: linear-gradient(-45deg, #0066FF 0%, #00a2ff 25%, #0052cc 50%, #0066FF 75%, #0f172a 100%);
          background-size: 400% 400%;
          animation: liquidGradient 8s ease infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* Blue & White / B&W Background */}
      <div className="absolute inset-0 bg-white dark:bg-black overflow-hidden">
        {/* Parallax Orbs */}
        <div 
          className="absolute -top-24 -left-24 w-96 h-96 bg-[#0066FF] dark:bg-white opacity-10 blur-[100px] rounded-full transition-transform duration-700 ease-out"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
        />
        <div 
          className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-[#00a2ff] dark:bg-slate-500 opacity-10 blur-[120px] rounded-full transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--primary-color) 1px, transparent 1px), linear-gradient(90deg, var(--primary-color) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Loading State Content */}
      <div className={`relative z-10 h-full flex flex-col items-center justify-center transition-all duration-1000 ${isComplete ? 'opacity-0 scale-95 blur-md' : 'opacity-100'}`}>
        <div className="flex flex-col items-center gap-12 animate-[fadeInUp_1.2s_cubic-bezier(0.2,0.8,0.2,1)]">
          <div className="text-center">
            <div className="h-20 w-20 mx-auto rounded-3xl bg-[#0066FF] dark:bg-white flex items-center justify-center shadow-[0_20px_50px_rgba(0,102,255,0.3)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] mb-8">
              <Package className="h-10 w-10 text-white dark:text-black" strokeWidth={1.5} />
            </div>
            <h1 className="brand-text-shimmer font-['Playfair_Display'] text-6xl md:text-8xl font-bold tracking-[15px] uppercase">
              {shopName}
            </h1>
            <p className="mt-4 text-[11px] tracking-[10px] text-[#0066FF] dark:text-white uppercase font-light opacity-80">
              {shopTagline}
            </p>
          </div>

          <div className="w-[300px] space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] tracking-[2px] text-slate-400 dark:text-white/40 uppercase font-black">{t('initializingStore')}</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">{Math.floor(progress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0066FF] dark:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(0,102,255,0.4)] dark:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Complete State Content */}
      <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-1000 ${showCompleteScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl border border-white dark:border-white/10 p-12 md:p-20 rounded-[4rem] shadow-2xl flex flex-col items-center text-center max-w-2xl w-full mx-6">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="w-10 h-10 text-blue-500" />
          </div>
          
          <h2 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-4 uppercase tracking-[2px]">
            {t('readyToExplore')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-12 max-w-md font-light">
            {t('welcomeExploreDesc')}
          </p>

          <button
            onClick={handleEnter}
            className="group relative overflow-hidden bg-[#0066FF] hover:bg-[#0052cc] text-white px-16 py-6 rounded-full font-black uppercase tracking-[4px] text-xs transition-all duration-500 shadow-[0_20px_40px_rgba(0,102,255,0.25)] hover:-translate-y-1 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              {t('enterStore')} <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
