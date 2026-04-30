import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Globe, Sparkles } from 'lucide-react';

const QRShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Use the live store URL dynamically
  const storeUrl = window.location.origin;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/30 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Share Store"
        title="Share this store"
      >
        <QrCode size={24} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 p-8 max-w-sm w-full text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--primary-color)]/10 to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6 relative z-10">
              <div className="p-4 rounded-[2rem] bg-[var(--primary-color)]/10 relative">
                <Globe size={32} className="text-[var(--primary-color)] animate-spin-slow" />
                <Sparkles className="absolute -top-1 -right-1 text-yellow-400" size={16} />
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 italic uppercase tracking-tight relative z-10">
              Share Store
            </h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 px-4 relative z-10">
              Let others discover our premium electronics collection
            </p>

            {/* QR Code */}
            <div className="flex justify-center mb-8 relative z-10">
              <div className="p-5 bg-white rounded-3xl shadow-xl shadow-[var(--primary-color)]/10 border border-[var(--primary-color)]/20">
                <QRCodeSVG
                  value={storeUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            {/* URL Display */}
            <div className="bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-5 py-4 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Store Link</p>
              <p className="text-sm font-bold text-[var(--primary-color)] break-all select-all">
                {storeUrl}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRShareButton;
