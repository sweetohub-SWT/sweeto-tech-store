import React, { useState, useRef, useEffect } from 'react';
import { Share2, X, Link2, Check, MessageCircle, Send } from 'lucide-react';

// ── Platform icon helpers ─────────────────────────────────────────────────────

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.861L1.254 2.25H8.08l4.26 5.632 5.905-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────

const ProductShareButton = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  const pageUrl = window.location.href;
  const shareText = `Check out ${product?.name} on Sweeto Hubs! ${product?.tagline ? '— ' + product.tagline : ''}`;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ── Native Web Share API (mobile) ────────────────────────────────────────
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: shareText,
          url: pageUrl,
        });
        setIsOpen(false);
      } catch (err) {
        // User cancelled — do nothing
      }
    }
  };

  // ── Platform share links ─────────────────────────────────────────────────
  const shareOptions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <WhatsAppIcon />,
      color: 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white',
      borderColor: 'border-[#25D366]/20',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + pageUrl)}`,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: <TelegramIcon />,
      color: 'bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white',
      borderColor: 'border-[#229ED9]/20',
      url: `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: <FacebookIcon />,
      color: 'bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white',
      borderColor: 'border-[#1877F2]/20',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    },
    {
      id: 'twitter',
      label: 'X (Twitter)',
      icon: <XIcon />,
      color: 'bg-gray-900/10 text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900',
      borderColor: 'border-gray-200 dark:border-slate-700',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = pageUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Share Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        id="product-share-btn"
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 transform active:scale-95 select-none
          ${isOpen
            ? 'bg-[var(--primary-color)] border-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/20'
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-[var(--primary-color)]/60 hover:text-[var(--primary-color)]'
          }`}
        aria-label="Share this product"
        title="Share this product"
      >
        <Share2 size={18} className={isOpen ? 'text-white' : ''} />
        <span>Share</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-gray-300/50 dark:shadow-black/50 border border-gray-100 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200"
          style={{ minWidth: '17rem' }}
        >
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-b border-r border-gray-100 dark:border-slate-800 rotate-45" />

          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Share Product</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-gray-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Platform Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            {shareOptions.map(opt => (
              <a
                key={opt.id}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border text-sm font-bold transition-all duration-200 active:scale-95 ${opt.color} ${opt.borderColor}`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-800 my-3" />

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border text-sm font-bold transition-all duration-200 active:scale-95
              ${copied
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-[var(--primary-color)]/10 hover:border-[var(--primary-color)]/40 hover:text-[var(--primary-color)]'
              }`}
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-500" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 size={16} />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Native Share — only shown on mobile devices that support it */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full mt-2 flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-[var(--primary-color)]/20 bg-[var(--primary-color)]/5 text-[var(--primary-color)] text-sm font-bold hover:bg-[var(--primary-color)]/10 transition-all duration-200 active:scale-95"
            >
              <Send size={16} />
              <span>More Apps…</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductShareButton;
