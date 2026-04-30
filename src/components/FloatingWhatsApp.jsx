import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const FloatingWhatsApp = () => {
  const { storeSettings } = useStoreData();
  const whatsappNumber = storeSettings?.whatsappNumber?.trim();
  const shopName = storeSettings?.shopName || storeSettings?.storeName || 'us';
  const message = encodeURIComponent(`Hello ${shopName}! I need some help.`);

  // Don't render if no number is configured
  if (!whatsappNumber) return null;

  const waLink = `https://wa.me/${whatsappNumber.replace(/[\s\-\+]/g, '')}?text=${message}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[60] w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300 group"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
      {/* Ping Notification Bubble */}
      <span className="absolute top-0 right-0 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#25D366]"></span>
      </span>
      
      {/* Tooltip */}
      <span className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
        Need help? Chat with us!
        <div className="absolute top-1/2 -left-1 w-2 h-2 bg-slate-900 rotate-45 -translate-y-1/2"></div>
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
