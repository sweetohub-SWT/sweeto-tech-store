import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import {
  Monitor, Smartphone, Plug, ChevronRight, Zap, QrCode, X, Globe, Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';

const CategorySidebar = () => {
  const { categories, products } = useStoreData();
  const { t } = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const [activeDept, setActiveDept] = useState(null);
  const [isQROpen, setIsQROpen] = useState(false);
  const storeUrl = window.location.origin;

  const departments = useMemo(() => {
    return categories
      .filter(c => c.isPermanent || ['Computers', 'Electronics', 'Accessories'].includes(c.name))
      .sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map(c => ({
        name: c.name,
        icon: c.name === 'Computers' ? <Monitor size={22} /> : 
              c.name === 'Electronics' ? <Smartphone size={22} /> : 
              c.name === 'Accessories' ? <Plug size={22} /> : <Zap size={22} />,
        path: `/category/${encodeURIComponent(c.name)}`
      }));
  }, [categories]);

  // Dynamically derive categories from both categories table and product inventory
  const allSubCategories = useMemo(() => {
    const subs = new Map();

    // 1. Add categories from the dedicated categories table
    (categories || []).forEach(cat => {
      subs.set(cat.name, { id: cat.id, name: cat.name, department: cat.department });
    });

    // 2. Scan products to find any missing categories (Migration/Consistency check)
    (products || []).forEach(prod => {
      const catName = prod.category || '';
      if (catName && !subs.has(catName)) {
        subs.set(catName, { id: `auto-${catName}`, name: catName, department: null });
      }
    });

    return Array.from(subs.values());
  }, [categories, products]);

  // Get sub-categories with intelligent auto-mapping
  const getSubCategories = (deptName) => {
    if (!deptName) return [];
    
    return allSubCategories.filter(cat => {
      // 1. Exact match if department field exists
      if (cat.department === deptName) return true;
      
      // 2. Auto-mapping for categories missing the department field
      const name = (cat.name || '').toLowerCase();
      if (deptName === 'Computers') {
        return name.includes('laptop') || name.includes('computer') || name.includes('monitor') || name.includes('pc') || name.includes('informatique');
      }
      if (deptName === 'Electronics') {
        return name.includes('phone') || name.includes('tv') || name.includes('audio') || name.includes('cinema') || name.includes('speaker') || name.includes('camera') || name.includes('smartphone') || name.includes('video') || name.includes('réfrigérateur') || name.includes('electroménager') || name.includes('fan');
      }
      if (deptName === 'Accessories') {
        return name.includes('case') || name.includes('watch') || name.includes('drive') || name.includes('memory') || name.includes('cable') || name.includes('mouse') || name.includes('keyboard') || name.includes('ear') || name.includes('head') || name.includes('accessoires');
      }
      return false;
    });
  };

  const activeDeptData = departments.find(d => d.name === activeDept);

  return (
    <>
    <aside 
      className={`fixed left-0 top-0 bottom-0 z-[90] bg-white dark:bg-black border-r border-gray-100 dark:border-white/5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hidden lg:block ${
        isHovered || isQROpen ? 'w-[320px] shadow-[20px_0_50px_rgba(0,0,0,0.1)]' : 'w-[84px]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isQROpen) {
          setIsHovered(false);
          setActiveDept(null);
        }
      }}
    >
      {/* Top Header Section (Moved down to clear Header) */}
      <div className="pt-24 pb-4 flex flex-col items-center w-full">
        <div className={`flex items-center transition-all duration-500 ease-out cursor-pointer ${
          isHovered ? 'p-4 h-16 w-full' : 'w-14 h-14 justify-center hover:scale-110'
        }`}>
          <div className="flex flex-col gap-1.5 items-center justify-center shrink-0">
            <div className="w-6 h-[3px] bg-slate-900 dark:bg-white rounded-full"></div>
            <div className="w-6 h-[3px] bg-slate-900 dark:bg-white rounded-full"></div>
            <div className="w-6 h-[3px] bg-slate-900 dark:bg-white rounded-full"></div>
          </div>
          <span className={`ml-4 text-slate-900 dark:text-white text-lg font-black tracking-tight whitespace-nowrap transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}>
            {t('categories')}
          </span>
        </div>
      </div>

      {/* Main Departments List */}
      <div className="mt-8 flex flex-col w-full px-4 gap-2">
        {departments.map((dept) => (
          <Link
            key={dept.name}
            to={dept.path}
            onMouseEnter={() => setActiveDept(dept.name)}
            className={`group flex items-center h-16 w-full rounded-2xl transition-all duration-300 relative ${
              activeDept === dept.name && isHovered ? 'bg-gray-50 dark:bg-white/5 shadow-sm' : ''
            }`}
          >
            {/* Icon Container */}
            <div className={`shrink-0 flex items-center justify-center transition-all duration-500 ${
              isHovered ? 'w-12 ml-2' : 'w-full'
            }`}>
              <div className={`transform transition-all duration-300 ${
                activeDept === dept.name && isHovered ? 'text-[#E31E1E] scale-110 rotate-6' : 'text-gray-900 dark:text-gray-400 group-hover:text-[#E31E1E]'
              }`}>
                {dept.icon}
              </div>
            </div>

            {/* Label */}
            <span className={`flex-grow text-[15px] font-bold transition-all duration-500 whitespace-nowrap overflow-hidden ${
              isHovered ? 'opacity-100 ml-4 max-w-[200px]' : 'opacity-0 max-w-0'
            } ${activeDept === dept.name ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
              {dept.name === 'Computers' ? t('computers') : 
               dept.name === 'Electronics' ? t('electronics') : 
               dept.name === 'Accessories' ? t('accessories') : dept.name}
            </span>

            {/* Chevron */}
            <div className={`shrink-0 mr-4 transition-all duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <ChevronRight size={18} className={`transition-all ${
                activeDept === dept.name ? 'text-gray-900 dark:text-white translate-x-1' : 'text-gray-300'
              }`} />
            </div>
          </Link>
        ))}
      </div>

      {/* STATIC MEGA MENU FLYOUT */}
      <div className={`absolute left-full top-0 bottom-0 w-[400px] bg-white dark:bg-black border-l border-gray-100 dark:border-white/5 shadow-[40px_0_80px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
        activeDept && isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'
      }`}>
        {activeDeptData && (
          <div className="p-4 h-full flex flex-col">
            {/* Header synced with Sidebar Button Height */}
            <div className="h-16 flex items-center gap-4 mb-12 mt-0">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#E31E1E]">
                {activeDeptData.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E31E1E] mb-1">{t('department')}</span>
                <h4 className="text-3xl font-black text-black dark:text-white tracking-tighter leading-none">
                  {activeDeptData.name === 'Computers' ? t('computers') : 
                   activeDeptData.name === 'Electronics' ? t('electronics') : 
                   activeDeptData.name === 'Accessories' ? t('accessories') : activeDeptData.name}
                </h4>
              </div>
            </div>

            {/* Sub-categories List */}
            <div className="flex flex-col gap-6">
              {getSubCategories(activeDept).length > 0 ? (
                getSubCategories(activeDept).map((sub) => (
                  <Link 
                    key={sub.id} 
                    to={`/category/${encodeURIComponent(sub.name)}`}
                    className="group/sub flex items-center justify-between py-1 text-[15px] font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span className="group-hover/sub:translate-x-2 transition-transform duration-300">{sub.name}</span>
                    <div className="w-2 h-2 rounded-full bg-[#E31E1E] opacity-0 group-hover/sub:opacity-100 transition-opacity"></div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col gap-4">
                  <span className="text-sm text-gray-400 font-medium">{t('noProducts')}</span>
                  <Link to={activeDeptData.path} className="text-[#E31E1E] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    {t('browseAllGear')} <ChevronRight size={12} />
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* QR Share Button at bottom of sidebar */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center px-4">
        <button
          onClick={() => setIsQROpen(true)}
          title="Share Store"
          className={`flex items-center transition-all duration-500 rounded-2xl bg-[var(--primary-color)]/10 hover:bg-[var(--primary-color)] text-[var(--primary-color)] hover:text-white ${
            isHovered ? 'w-full h-12 px-4 gap-4' : 'w-14 h-14 justify-center'
          }`}
        >
          <QrCode size={22} className="shrink-0" />
          <span className={`font-black text-sm uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          }`}>{t('shareStore')}</span>
        </button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </aside>

    {/* QR Modal — rendered via Portal at document.body to escape sidebar stacking context */}
    {isQROpen && ReactDOM.createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        onClick={() => { setIsQROpen(false); setIsHovered(false); }}
      >
        <div
          className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 p-8 max-w-sm w-full text-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--primary-color)]/10 to-transparent pointer-events-none" />
          <button
            onClick={() => { setIsQROpen(false); setIsHovered(false); }}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors z-10"
          >
            <X size={20} />
          </button>
          <div className="flex justify-center mb-6 relative z-10">
            <div className="p-4 rounded-[2rem] bg-[var(--primary-color)]/10 relative">
              <Globe size={32} className="text-[var(--primary-color)]" />
              <Sparkles className="absolute -top-1 -right-1 text-yellow-400" size={16} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 italic uppercase tracking-tight relative z-10">{t('shareStore')}</h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 px-4 relative z-10">
            {t('shareStoreDesc')}
          </p>
          <div className="flex justify-center mb-8 relative z-10">
            <div className="p-5 bg-white rounded-3xl shadow-xl shadow-[var(--primary-color)]/10 border border-[var(--primary-color)]/20">
              <QRCodeSVG value={storeUrl} size={200} bgColor="#ffffff" fgColor="#1e293b" level="H" includeMargin={false} />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-5 py-4 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('storeLink')}</p>
            <p className="text-sm font-bold text-[var(--primary-color)] break-all select-all">{storeUrl}</p>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default CategorySidebar;
