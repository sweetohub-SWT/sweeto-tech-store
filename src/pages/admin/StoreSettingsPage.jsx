import React, { useState, useRef } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { 
  Settings, Save, Globe, Banknote, Mail, Info, Image as ImageIcon, 
  Plus, Sparkles, ExternalLink, Loader2, MessageSquare, Phone, 
  MapPin, Share2, Camera, MessageCircle, AlertCircle, CheckCircle2,
  Database, Download, Upload, Trash2, Palette, Layout, Check
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { uploadToStorage } from '../../utils/storageHelper';
import { testGeminiConnection } from '../../utils/aiService';

const StoreSettingsPage = () => {
  const { storeSettings, updateStoreSettings, exportDb, importDb } = useStoreData();
  const { t } = useAdminLocale();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({ ...storeSettings });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Sync internal form state if store settings load after initial mount
  React.useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      ...storeSettings,
      // Keep unsaved changes if the user already started typing
      ...(Object.keys(formData).some(key => formData[key] !== storeSettings[key]) ? {} : storeSettings)
    }));
  }, [storeSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploadingLogo(true);
        const compressedBlob = await compressImage(file);
        const downloadURL = await uploadToStorage(compressedBlob, 'branding');
        setFormData(prev => ({ ...prev, shopLogo: downloadURL }));
      } catch (err) {
        console.error("Error processing shop logo image:", err);
        setError("Failed to process image. Please try another one.");
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    setError('');

    const wasSuccessful = await updateStoreSettings(formData);
    
    setIsSaving(false);
    if (wasSuccessful) {
      setSuccess('Settings saved! Please refresh (F5) to ensure all services are updated.');
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError('Failed to save settings. Please check your connection and try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleVerifyAiKey = async () => {
    if (!formData.geminiApiKey) {
      setTestResult({ success: false, message: 'Please enter a key first' });
      return;
    }
    
    setIsTestingAi(true);
    setTestResult(null);
    
    const result = await testGeminiConnection(formData.geminiApiKey);
    setTestResult(result);
    setIsTestingAi(false);
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const data = await exportDb();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sweeto_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccess('Database exported successfully!');
    } catch (err) {
      setError('Export failed: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('WARNING: Importing data will overwrite your current database. This cannot be undone. Continue?')) {
      return;
    }

    try {
      setIsImporting(true);
      const text = await file.text();
      const data = JSON.parse(text);
      await importDb(data);
      setSuccess('Data imported successfully! Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError('Import failed: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('DANGER: This will wipe all your products, categories, and settings. Are you absolutely sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto transition-colors duration-500 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight italic uppercase">{t('storeSettings')}</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center">
          <span className="w-8 h-px bg-[var(--primary-color)] mr-2"></span>
          Configure your store identity and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Shop Identity Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[var(--primary-color)]/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-color)] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Info className="text-[var(--primary-color)] mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">Shop Identity</h2>
          </div>
          <div className="p-8 space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="shopName">Shop Name</label>
                <input
                  id="shopName"
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  autoComplete="organization"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="shopLogo">Shop Logo</label>
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" size={18} />
                    <input
                      id="shopLogo"
                      type="text"
                      name="shopLogo"
                      value={formData.shopLogo}
                      onChange={handleInputChange}
                      autoComplete="off"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white text-sm"
                      placeholder="Logo URL or upload"
                    />
                  </div>
                  <label className={`cursor-pointer ${isUploadingLogo ? 'bg-[var(--primary-color)]/50' : 'bg-[var(--primary-color)] hover:opacity-90'} text-white p-4 rounded-2xl transition-all shadow-xl shadow-[var(--primary-color)]/30 flex items-center justify-center shrink-0 hover:-rotate-6`}>
                    {isUploadingLogo ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                    <input 
                      type="file" 
                      id="shopLogoUpload"
                      name="shopLogoUpload"
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="storeTagline">Store Tagline</label>
                <input
                  id="storeTagline"
                  type="text"
                  name="storeTagline"
                  value={formData.storeTagline}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="faviconUrl">Favicon URL</label>
                <input
                  id="faviconUrl"
                  type="text"
                  name="faviconUrl"
                  value={formData.faviconUrl || ''}
                  onChange={handleInputChange}
                  placeholder="URL for browser icon (.ico or .png)"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Customization Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[var(--primary-color)]/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-color)] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Palette className="text-[var(--primary-color)] mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">Theme Customization</h2>
          </div>
          <div className="p-8 space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="theme">Storefront Theme</label>
                <div className="relative">
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme || 'Classic Blue'}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                  >
                    <option value="Classic Blue">Classic Blue (Original)</option>
                    <option value="Pink-Blue">Pink-Blue (Cyberpunk)</option>
                    <option value="Cyan-Pink">Cyan-Pink (Dreamy Glass)</option>
                    <option value="Green-Blue">Green-Blue (Circuit)</option>
                    <option value="Yellow-Red">Yellow-Red (Speed)</option>
                    <option value="Peach-Pink">Peach-Pink (Luxury)</option>
                    <option value="Yellow-Cyan">Yellow-Cyan (Sunny)</option>
                    <option value="Pink-Violet">Pink-Violet (Cosmic)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <Layout size={14} />
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-gray-500 font-medium italic">
                  * Selecting a theme changes the storefront colors, gradients, and border radius.
                </p>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="p-6 rounded-[var(--radius-premium,2rem)] border border-[var(--primary-color)]/20 bg-[var(--primary-color)]/5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-[var(--primary-color)] shadow-lg shadow-[var(--primary-color)]/30 flex items-center justify-center text-white`}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Theme Preview</h3>
                    <p className="text-xs text-gray-500 font-medium">Currently using: <span className="font-bold text-[var(--primary-color)]">{formData.theme || 'Classic Blue'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional & Contact Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[var(--primary-color)]/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-color)] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Globe className="text-[var(--primary-color)] mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">Regional & Contact</h2>
          </div>
          <div className="p-8 space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="defaultCurrency">
                  <Banknote size={14} className="mr-1.5" /> Default Currency
                </label>
                <select
                  id="defaultCurrency"
                  name="defaultCurrency"
                  value={formData.defaultCurrency}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="XOF">XOF - CFA Franc</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="defaultLanguage">
                  <Globe size={14} className="mr-1.5" /> {t('defaultLanguage')}
                </label>
                <select
                  id="defaultLanguage"
                  name="defaultLanguage"
                  value={formData.defaultLanguage}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="adminLanguage">
                  <Globe size={14} className="mr-1.5" /> {t('adminPanelLanguage')}
                </label>
                <select
                  id="adminLanguage"
                  name="adminLanguage"
                  value={formData.adminLanguage}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="contactEmail">
                  <Mail size={14} className="mr-1.5" /> Contact Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="whatsappNumber">
                  <MessageSquare size={14} className="mr-1.5" /> WhatsApp Number
                </label>
                <input
                  id="whatsappNumber"
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 2376XXXXXXXX"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="shopPhone">
                  <Phone size={14} className="mr-1.5" /> Support Phone
                </label>
                <input
                  id="shopPhone"
                  type="text"
                  name="shopPhone"
                  value={formData.shopPhone || ''}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="shopAddress">
                  <MapPin size={14} className="mr-1.5" /> Store Address
                </label>
                <input
                  id="shopAddress"
                  type="text"
                  name="shopAddress"
                  value={formData.shopAddress || ''}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Presence Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[var(--primary-color)]/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Share2 className="text-[var(--primary-color)] mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">Social Presence</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="facebookUrl">
                <MessageCircle size={14} className="mr-1.5" /> Facebook URL
              </label>
              <input
                id="facebookUrl"
                type="text"
                name="facebookUrl"
                value={formData.facebookUrl || ''}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="instagramUrl">
                <Camera size={14} className="mr-1.5" /> Instagram URL
              </label>
              <input
                id="instagramUrl"
                type="text"
                name="instagramUrl"
                value={formData.instagramUrl || ''}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="twitterUrl">
                <Share2 size={14} className="mr-1.5" /> Twitter / X URL
              </label>
              <input
                id="twitterUrl"
                type="text"
                name="twitterUrl"
                value={formData.twitterUrl || ''}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="tiktokUrl">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" className="mr-1.5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68l.05.31A6.34 6.34 0 0011.38 22h.2a6.33 6.33 0 005.8-5.32l.06-.51V9.29a8.27 8.27 0 004.15 1.15v-3.4a4.57 4.57 0 01-2-1v.05h-.01z"/></svg>
                TikTok URL
              </label>
              <input
                id="tiktokUrl"
                type="text"
                name="tiktokUrl"
                value={formData.tiktokUrl || ''}
                onChange={handleInputChange}
                placeholder="https://tiktok.com/@yourpage"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[var(--primary-color)]/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-color)] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Sparkles className="text-[var(--primary-color)] mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">AI Configuration</h2>
          </div>
          <div className="p-8 space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="geminiApiKey">Gemini API Key</label>
                  <div className="relative">
                    <input
                      id="geminiApiKey"
                      type="password"
                      name="geminiApiKey"
                      value={formData.geminiApiKey || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your Google AI API key"
                      autoComplete="off"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-mono"
                    />
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--primary-color)] opacity-50 pointer-events-none" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="geminiModel">AI model version</label>
                  <div className="relative">
                    <select
                      id="geminiModel"
                      name="geminiModel"
                      value={formData.geminiModel || 'gemini-1.5-flash'}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                    >
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard)</option>
                      <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Latest - Recommended)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Powerful but Slower)</option>
                      <option value="gemini-1.0-pro">Gemini 1.0 Pro (Text Only)</option>
                      {testResult?.success && testResult.models?.filter(m => !['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'].some(base => m.includes(base))).map(model => (
                        <option key={model} value={model}>{model} (Auto-detected)</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <Layout size={14} />
                    </div>
                  </div>
                  {testResult?.success && (
                    <p className="mt-2 text-[9px] font-black text-green-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Check size={10} /> {testResult.models?.length} compatible models found for your key
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  type="button"
                  onClick={handleVerifyAiKey}
                  disabled={isTestingAi}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all bg-white dark:bg-slate-950 border-2 border-[var(--primary-color)]/20 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 active:scale-95"
                >
                  {isTestingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {isTestingAi ? 'Verifying Key...' : 'Test AI Connection'}
                </button>
                
                {testResult && (
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in duration-300 ${testResult.success ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/10 dark:border-green-900/20 dark:text-green-400' : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/10 dark:border-red-900/20 dark:text-red-400'}`}>
                    {testResult.success ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {testResult.success ? 'Ready to use!' : 'Verification Failed'}
                      </span>
                      <span className="text-[11px] font-medium leading-tight mt-0.5">
                        {testResult.message === 'READY' ? `Connection established. Serving ${testResult.models?.length} models.` : 
                         testResult.message === 'API_NOT_ENABLED' ? 'The "Generative Language API" is not enabled in your Google Cloud Console.' :
                         testResult.message === 'INVALID_KEY' ? 'This API key appears to be invalid or restricted.' :
                         testResult.message}
                      </span>
                    </div>
                  </div>
                )}

                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--primary-color)]/60 hover:text-[var(--primary-color)] transition-colors p-2"
                >
                  Get Free API Key <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-relaxed italic">
              * The Gemini API key enables "Magic Describe" for products. We recommend 1.5 Flash for the best vision results.
            </p>
          </div>
        </div>

        
        {/* SEO & Search Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[var(--primary-color)]/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Globe className="text-green-600 dark:text-green-400 mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">SEO & Search</h2>
          </div>
          <div className="p-8 space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium resize-none"
                placeholder="Brief description for search results..."
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Meta Keywords</label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords || ''}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                placeholder="e.g. electronics, laptop, smartphone"
              />
            </div>
          </div>
        </div>

        {/* Database Management Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[var(--primary-color)]/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Database className="text-amber-600 dark:text-amber-400 mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">Data Management (Local Storage)</h2>
          </div>
          <div className="p-8 space-y-6 relative z-10">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Your store now runs entirely in your browser. Use these tools to backup your data or migrate between devices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                type="button"
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all active:scale-95"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                Export Database
              </button>

              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 text-[var(--primary-color)] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[var(--primary-color)]/20 transition-all active:scale-95"
              >
                {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Import Backup
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".json"
                  onChange={handleImportData}
                />
              </button>

              <button 
                type="button"
                onClick={handleResetData}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95"
              >
                <Trash2 size={16} />
                Wipe All Data
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          <p className="text-xs text-gray-400 dark:text-slate-500 italic font-medium">
            * Changes are saved immediately to local state and synchronized.
          </p>
          <div className="flex items-center gap-6 w-full md:w-auto">
            {success && (
              <span className="text-green-600 dark:text-green-400 font-black uppercase tracking-widest text-[10px] animate-pulse">
                {success}
              </span>
            )}
            {error && (
              <span className="text-red-600 dark:text-red-400 font-black uppercase tracking-widest text-[10px] animate-shake">
                {error}
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-grow md:flex-none px-10 py-5 bg-[var(--primary-color)] text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:opacity-90 transition-all shadow-2xl shadow-[var(--primary-color)]/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <><Loader2 size={20} className="mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save size={20} className="mr-2" /> Save All Settings</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoreSettingsPage;
