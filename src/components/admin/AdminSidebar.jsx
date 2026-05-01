import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { Home, Package, Grid3x3, Warehouse, Receipt, MousePointer2, Video, Settings, X, Layout, MessageSquare } from 'lucide-react';

const AdminSidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { t } = useAdminLocale();
  const location = useLocation();

  const navItems = [
    { to: '/admin/dashboard', icon: Home, label: t('dashboard') },
    { to: '/admin/products', icon: Package, label: t('productManagement') },
    { to: '/admin/categories', icon: Grid3x3, label: t('categoryManagement') },
    { to: '/admin/stock', icon: Warehouse, label: t('stockManagement') },
    { to: '/admin/sales', icon: Receipt, label: t('salesHistory') },
    { to: '/admin/analytics', icon: MousePointer2, label: 'Analytics' },
    { to: '/admin/video-ads', icon: Video, label: 'Video Ads' },
    { to: '/admin/layout', icon: Layout, label: 'Storefront Layout' },
    { to: '/admin/hero', icon: Layout, label: 'Hero Banner' },
    { to: '/admin/home-categories', icon: Grid3x3, label: 'Category Display' },
    { to: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
    { to: '/admin/settings', icon: Settings, label: t('storeSettings') },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={onCloseMobile}
        />
      )}
      
      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 lg:top-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-[var(--border-color)] flex flex-col transition-all duration-500 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-hidden shadow-2xl shadow-black/5`}>
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[var(--primary-color)] blur-[100px]" />
        </div>
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] lg:hidden">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Admin Menu</h2>
          <button 
            onClick={onCloseMobile}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={`flex items-center px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 group ${
                  isActive 
                    ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/30' 
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-[var(--primary-color)]'
                }`}
              >
                <item.icon 
                  size={18} 
                  className={`mr-3 shrink-0 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} 
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
