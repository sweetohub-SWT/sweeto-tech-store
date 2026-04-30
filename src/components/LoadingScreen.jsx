import React from 'react';
import { useStoreData } from '../contexts/StoreDataContext';
import { Package } from 'lucide-react';

const LoadingScreen = () => {
  const { storeSettings } = useStoreData();
  const shopName = storeSettings?.shopName?.toUpperCase() || 'SWEETO-HUB';

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black overflow-hidden">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinReverse { to { transform: rotate(-360deg); } }
        @keyframes scanDown {
          0% { top: -10%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>

      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(var(--primary-color)_1px,transparent_1px),linear-gradient(90deg,var(--primary-color)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        <div className="absolute left-0 w-full h-[100px] bg-gradient-to-b from-transparent via-current opacity-[0.05] animate-[scanDown_4s_linear_infinite]"></div>
      </div>

      {/* Luxury Spinner */}
      <div className="relative flex flex-col items-center">
        {/* Luxury Tech Spinner */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-current opacity-10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-current rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-transparent border-b-current rounded-full animate-[spin_2s_linear_infinite_reverse] opacity-60"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-8 w-8 text-[#0066FF] dark:text-white animate-pulse" />
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-[6px] uppercase mb-2 font-['Playfair_Display']">
            {shopName}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-8 bg-current opacity-20 rounded-full overflow-hidden">
              <div className="h-full w-full bg-current animate-[shimmer_2s_infinite]"></div>
            </div>
            <span className="text-[10px] tracking-[4px] text-[#0066FF] dark:text-white font-black uppercase">Loading</span>
            <div className="h-1 w-8 bg-current opacity-20 rounded-full overflow-hidden">
              <div className="h-full w-full bg-current animate-[shimmer_2s_infinite_0.5s]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Orbs */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,var(--primary-color),transparent)] opacity-[0.05] blur-[80px] -top-20 -right-20"></div>
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,var(--primary-color),transparent)] opacity-[0.05] blur-[80px] -bottom-20 -left-20"></div>
    </div>
  );
};

export default LoadingScreen;
