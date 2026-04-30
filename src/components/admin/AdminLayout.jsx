import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import CommandPalette from './CommandPalette';

const AdminLayout = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-secondary)] transition-colors duration-500 flex flex-col admin-theme relative">
      {/* Global Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[var(--primary-color)]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="z-50 relative">
          <AdminHeader 
            onOpenSearch={() => setIsCommandPaletteOpen(true)} 
            onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar 
            isMobileOpen={isMobileMenuOpen} 
            onCloseMobile={() => setIsMobileMenuOpen(false)} 
          />
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative lg:ml-72 transition-all duration-500">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
};

export default AdminLayout;
