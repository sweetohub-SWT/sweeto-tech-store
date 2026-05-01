import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, LogOut, Trash2, Shield, Settings, ChevronRight, AlertTriangle } from 'lucide-react';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useToast } from '../contexts/ToastContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';

const CustomerProfilePage = () => {
  const { user, logout, deleteAccount } = useUserAuth();
  const { showToast } = useToast();
  const { storeSettings } = useStoreData();
  const { t, language } = useLocale();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully. Come back soon!', 'success');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      showToast('Your account and data have been permanently removed.', 'success');
      navigate('/');
    } else {
      showToast(result.error || 'Failed to delete account.', 'error');
      setIsDeleting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
      {/* Editorial Header */}
      <div className="relative h-64 lg:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)]/20 to-transparent mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--primary-color)]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
        </div>
        
        <div className="relative h-full max-w-[1500px] mx-auto px-6 lg:px-20 flex flex-col justify-end pb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 w-fit">
            <User size={14} /> {t('memberProfile')}
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
            {user.displayName?.split(' ')[0] || t('member')} <span className="text-[var(--primary-color)]">{user.displayName?.split(' ').slice(1).join(' ') || t('hub')}</span>
          </h1>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-20 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info Card */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 lg:p-16 shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-2">{t('accountDetails')}</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium italic uppercase tracking-widest text-xs">{t('managePersonalSettings')}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleLogout} className="flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-100 dark:border-slate-700 active:scale-95">
                    <LogOut size={16} /> {t('signOut')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-[var(--primary-color)] transition-colors border border-gray-100 dark:border-slate-700">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('fullName')}</p>
                      <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight italic">{user.displayName || 'Not Provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-[var(--primary-color)] transition-colors border border-gray-100 dark:border-slate-700">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('emailAddress')}</p>
                      <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight italic">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-[var(--primary-color)] transition-colors border border-gray-100 dark:border-slate-700">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('memberSince')}</p>
                      <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight italic">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'pt' ? 'pt-BR' : language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' }) : 'May 2026'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-[var(--primary-color)] transition-colors border border-gray-100 dark:border-slate-700">
                      <Shield size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('status')}</p>
                      <p className="text-lg font-black text-[var(--primary-color)] tracking-tight italic uppercase">{t('verifiedMember')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/30 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-[3rem] p-10 lg:p-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <h3 className="text-2xl font-black text-red-600 dark:text-red-500 uppercase tracking-tight italic mb-2 flex items-center gap-3">
                    <AlertTriangle size={24} /> {t('dangerZone')}
                  </h3>
                  <p className="text-sm font-medium text-red-700/60 dark:text-red-400/60 max-w-md">
                    {t('deleteAccountDesc')}
                  </p>
                </div>
                
                {!showDeleteConfirm ? (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95"
                  >
                    <Trash2 size={16} /> {t('deleteAccount')}
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-4 animate-in fade-in slide-in-from-right-4">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{t('areYouSure')}</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-6 py-3 bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-slate-700 transition-all"
                      >
                        {t('cancel')}
                      </button>
                      <button 
                        disabled={isDeleting}
                        onClick={handleDeleteAccount}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
                      >
                        {isDeleting ? t('deleting') : t('yesDeleteEverything')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Settings List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-color)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--primary-color)]/10 transition-colors" />
              
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">{t('quickSettings')}</h4>
              <nav className="space-y-2">
                {[
                  { icon: <Settings size={18} />, label: t('privacySettings'), path: '/privacy' },
                  { icon: <Shield size={18} />, label: t('security'), path: '/security' },
                  { icon: <MapPin size={18} />, label: t('cookiesAndData'), path: '/cookies' },
                  { icon: <Calendar size={18} />, label: t('termsOfUse'), path: '/terms' }
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.path}
                    className="w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest group/item hover:bg-[var(--primary-color)] hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 group-hover/item:text-white/70 transition-colors">{item.icon}</span>
                      {item.label}
                    </div>
                    <ChevronRight size={16} className="group-hover/item:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-8 bg-gray-900 dark:bg-white rounded-[2.5rem] text-white dark:text-black space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary-color)]">{t('support')}</p>
              <h4 className="text-xl font-black uppercase italic tracking-tighter">{t('needAssistance')}</h4>
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500 leading-relaxed">
                {t('supportDesc')}
              </p>
              <button className="w-full py-4 bg-[var(--primary-color)] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                {t('contactSupport')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
