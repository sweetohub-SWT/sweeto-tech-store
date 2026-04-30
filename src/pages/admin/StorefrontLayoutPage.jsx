import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { Layout, GripVertical, Plus, Trash2, Edit2, CheckCircle2, Eye, EyeOff, Save, X, ChevronUp, ChevronDown, TrendingUp } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const AVAILABLE_COMPONENTS = [
  { id: 'hero', name: 'Hero Banner', description: 'Large promotional banner with CTA' },
  { id: 'shop_by_category', name: 'Shop By Category', description: 'Circular category navigation icons' },
  { id: 'video_banner', name: 'Video Advertisement', description: 'Cinematic full-width video promo' },
  { id: 'deal_of_the_day', name: 'Deal Of The Day', description: 'Timed promotional section' },
  { id: 'just_arrived', name: 'Just Arrived', description: 'Latest added products' },
  { id: 'featured_products', name: 'Featured Products', description: 'Pinned/Featured products' },
  { id: 'smartphones', name: 'Smartphones & Tablets', description: 'Mobile technology section' },
  { id: 'home_cinema', name: 'Home Cinema', description: 'TVs and Home Theater systems' },
  { id: 'speakers', name: 'Speakers', description: 'Audio and Bluetooth speakers' },
  { id: 'refrigerators', name: 'Refrigerators', description: 'Kitchen and Home appliances' },
  { id: 'trending', name: 'Trending Products', description: 'Most viewed/popular items' },
];

const StorefrontLayoutPage = () => {
  const { storeSettings, updateStoreSettings, videoAds } = useStoreData();
  const { showToast } = useToast();
  
  const [sections, setSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'hero', enabled: true, showVideoPromo: false, videoAdId: '' });

  useEffect(() => {
    if (storeSettings?.homepageSections) {
      setSections(storeSettings.homepageSections);
    }
  }, [storeSettings]);

  const handleOpenModal = (section = null) => {
    if (section) {
      setEditingSection(section);
      setFormData({ ...section });
    } else {
      setEditingSection(null);
      setFormData({ name: '', type: 'hero', enabled: true, showVideoPromo: false, videoAdId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveSection = () => {
    if (!formData.name.trim()) {
      showToast('Please enter a section name', 'error');
      return;
    }

    if (editingSection) {
      setSections(prev => prev.map(s => s.id === editingSection.id ? { ...formData } : s));
    } else {
      const newSection = {
        ...formData,
        id: `section-${Date.now()}` // Truly unique ID
      };
      setSections(prev => [...prev, newSection]);
    }
    setIsModalOpen(false);
  };

  const deleteSection = (index) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      const newSections = [...sections];
      newSections.splice(index, 1);
      setSections(newSections);
    }
  };

  const toggleSection = (index) => {
    const newSections = [...sections];
    newSections[index].enabled = !newSections[index].enabled;
    setSections(newSections);
  };

  const moveSection = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === sections.length - 1)) return;
    
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;
    
    setSections(newSections);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const success = await updateStoreSettings({ homepageSections: sections });
      if (success) {
        showToast('Storefront layout updated successfully', 'success');
      } else {
        showToast('Failed to update layout. Please try again.', 'error');
      }
    } catch (error) {
      showToast('An error occurred while saving', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 lg:p-12 max-w-[1600px] mx-auto space-y-8 animate-ai-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
            <Layout size={36} className="text-[var(--primary-color)]" />
            Section Management
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-bold mt-2 text-sm uppercase tracking-widest">
            Add, Edit, Reorder and Manage Homepage Sections
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleOpenModal()}
            className="flex-1 sm:flex-none bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Section
          </button>
          
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 sm:flex-none bg-[var(--primary-color)] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-[0_0_40px_var(--primary-color)]/30 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? 'Saving...' : 'Save Layout'}
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800 p-8">
        {sections.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layout size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">No Sections Added</h3>
            <p className="text-gray-500 font-bold mt-2">Start by adding your first homepage section</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-8 bg-[var(--primary-color)] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
            >
              Create New Section
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sections.map((section, index) => (
              <div 
                key={section.id + index} 
                className={`group flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                  section.enabled 
                    ? 'bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-[var(--primary-color)]/30' 
                    : 'bg-gray-50/50 dark:bg-slate-900/30 border-transparent opacity-60'
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Order Controls */}
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => moveSection(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-[var(--primary-color)] hover:bg-white dark:hover:bg-slate-700 rounded-lg disabled:opacity-0 transition-all"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button 
                      onClick={() => moveSection(index, 1)}
                      disabled={index === sections.length - 1}
                      className="p-1.5 text-gray-400 hover:text-[var(--primary-color)] hover:bg-white dark:hover:bg-slate-700 rounded-lg disabled:opacity-0 transition-all"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary-color)]/5 flex items-center justify-center text-[var(--primary-color)]">
                    <Layout size={24} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-lg">{section.name}</h3>
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {section.type}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                      {AVAILABLE_COMPONENTS.find(c => c.id === section.type)?.description || 'Dynamic layout section'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSection(index)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      section.enabled 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 hover:scale-110' 
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:scale-110'
                    }`}
                    title={section.enabled ? 'Disable Section' : 'Enable Section'}
                  >
                    {section.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  
                  <button
                    onClick={() => handleOpenModal(section)}
                    className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:scale-110 transition-all flex items-center justify-center"
                    title="Edit Section"
                  >
                    <Edit2 size={20} />
                  </button>
                  
                  <button
                    onClick={() => deleteSection(index)}
                    className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:scale-110 transition-all flex items-center justify-center"
                    title="Delete Section"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 animate-ai-zoom-in border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-4 -mr-4 custom-scrollbar space-y-8 mb-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Section Display Name</label>
                <input
                  type="text"
                  placeholder="e.g., Best Smartphones"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-[var(--primary-color)] rounded-2xl px-6 py-4 outline-none transition-all text-gray-900 dark:text-white font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Component Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_COMPONENTS.map(comp => (
                    <button
                      key={comp.id}
                      onClick={() => setFormData({ ...formData, type: comp.id })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        formData.type === comp.id 
                          ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5 shadow-lg' 
                          : 'border-gray-100 dark:border-slate-800 hover:border-gray-200'
                      }`}
                    >
                      <h4 className={`font-black uppercase text-[10px] tracking-widest ${formData.type === comp.id ? 'text-[var(--primary-color)]' : 'text-gray-500'}`}>
                        {comp.name}
                      </h4>
                      <p className="text-[9px] font-bold text-gray-400 mt-1">{comp.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Promotion Settings */}
              {['hero', 'shop_by_category', 'video_banner'].indexOf(formData.type) === -1 && (
                <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Video Promotion</h4>
                      <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">Add a side-by-side video promo</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, showVideoPromo: !formData.showVideoPromo })}
                      className={`w-14 h-8 rounded-full transition-all relative ${formData.showVideoPromo ? 'bg-[var(--primary-color)]' : 'bg-gray-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${formData.showVideoPromo ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {formData.showVideoPromo && (
                    <div className="animate-ai-fade-in space-y-4 pt-2">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Select Video Advertisement</label>
                      <select
                        className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-[var(--primary-color)] rounded-xl px-4 py-3 outline-none transition-all text-xs font-bold text-gray-900 dark:text-white"
                        value={formData.videoAdId}
                        onChange={(e) => setFormData({ ...formData, videoAdId: e.target.value })}
                      >
                        <option value="">Default/Latest Video</option>
                        {videoAds?.map(ad => (
                          <option key={ad.id} value={ad.id}>{ad.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleSaveSection}
              className="w-full bg-[var(--primary-color)] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:shadow-[0_0_40px_var(--primary-color)]/30 hover:-translate-y-1 transition-all active:scale-95"
            >
              {editingSection ? 'Update Section' : 'Add to Layout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontLayoutPage;
