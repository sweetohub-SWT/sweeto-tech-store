import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';
import { getWhatsAppLink, getInquiryWhatsAppLink } from '../utils/whatsappHelper';

/**
 * Reusable WhatsApp Button
 * @param {Object} product - The product object
 * @param {boolean} iconOnly - If true, renders as a small circle
 * @param {string} type - 'order' or 'inquiry'
 * @param {string} className - Additional CSS classes
 */
const WhatsAppButton = ({ product, iconOnly = false, type = 'order', className = '' }) => {
  const { storeSettings, formatPrice } = useStoreData();
  const whatsappNumber = storeSettings?.whatsappNumber?.trim() || '';
  const shopName = storeSettings?.shopName || 'Sweeto-Tech';

  const waLink = type === 'order' 
    ? getWhatsAppLink(whatsappNumber, product.name, formatPrice(product.price), shopName, product.image)
    : getInquiryWhatsAppLink(whatsappNumber, product.name, shopName, product.image);

  if (!waLink) return null;

  if (iconOnly) {
    const isInquiry = type === 'inquiry';
    return (
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-10 h-10 ${isInquiry ? 'bg-[var(--primary-color)]/10 dark:bg-slate-800 text-[var(--primary-color)]' : 'bg-white text-slate-900'} shadow-lg rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300 ${className}`}
        title={isInquiry ? "Check Availability" : "Chat on WhatsApp"}
        onClick={(e) => e.stopPropagation()}
      >
        <MessageCircle size={18} />
      </a>
    );
  }

  const isOrder = type === 'order';

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-grow ${isOrder ? 'bg-slate-900 hover:bg-slate-800' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center space-x-2 transform active:scale-95 ${className}`}
    >
      <MessageCircle size={18} className={isOrder ? "text-green-400" : "text-white"} />
      <span>{isOrder ? 'Chat on WhatsApp' : 'Check Availability'}</span>
    </a>
  );
};

export default WhatsAppButton;
