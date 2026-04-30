import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { compressImage } from '../../utils/imageCompressor';
import { uploadToStorage } from '../../utils/storageHelper';
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  Image as ImageIcon, 
  AlertCircle, 
  Tag 
} from 'lucide-react';

// No longer using hardcoded permanent departments - now driven by data
const DEFAULT_PERMANENT = ['Computers', 'Electronics', 'Accessories'];

const CategoryManagerPage = () => {
  const { categories, addCategory, deleteCategory, updateCategory } = useStoreData();
  const { t } = useAdminLocale();
  
  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryParent, setCategoryParent] = useState('');
  const [showOnHome, setShowOnHome] = useState(false);
  const [isPermanent, setIsPermanent] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  
  // UI State
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressedBlob = await compressImage(file);
        const downloadURL = await uploadToStorage(compressedBlob, 'categories');
        setCategoryImage(downloadURL);
        setError('');
      } catch (err) {
        console.error("Error processing category image:", err);
        setError("Failed to process image. Please try another one.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryImage(category.image || '');
    setCategoryParent(category.parentCategory || '');
    setShowOnHome(category.showOnHome || false);
    setIsPermanent(category.isPermanent || false);
    setSortOrder(category.sortOrder || 0);
    setError('');
    setSuccess('');
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryImage('');
    setCategoryParent('');
    setShowOnHome(false);
    setIsPermanent(false);
    setSortOrder(0);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (categoryName.trim()) {
      const isDuplicate = categories.some(c => 
        c.name.toLowerCase() === categoryName.trim().toLowerCase() && 
        (!editingCategory || c.id !== editingCategory.id)
      );

      if (isDuplicate) {
        setError(`A category named "${categoryName.trim()}" already exists. Please use a unique name.`);
        return;
      }
    }

    const categoryData = {
      name: categoryName.trim(),
      image: categoryImage,
      parentCategory: categoryParent,
      showOnHome: showOnHome,
      isPermanent: isPermanent,
      sortOrder: parseInt(sortOrder) || 0
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
        setSuccess('Category updated successfully!');
      } else {
        await addCategory(categoryData);
        setSuccess('Category added successfully!');
      }

      // Reset form
      cancelEdit();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save category. Please try again.');
    }
  };

  const handleToggleHome = async (category) => {
    try {
      await updateCategory(category.id, {
        ...category,
        showOnHome: !category.showOnHome
      });
      setSuccess(`${category.name} homepage status updated!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleDelete = async (id, name, isPerm) => {
    if (isPerm || DEFAULT_PERMANENT.includes(name)) {
      setError("This is a permanent system category and cannot be deleted.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setError('');
    setSuccess('');
    
    try {
      const result = await deleteCategory(id);
      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess('Category deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error("Delete category error:", err);
      setError("An unexpected error occurred during deletion.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto transition-colors duration-500 min-h-screen pb-32 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary-color)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter italic uppercase leading-none">
              Category <span className="text-[var(--primary-color)]">Mapping</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center">
              <span className="w-12 h-px bg-[var(--primary-color)] mr-3"></span>
              Architect the structural hierarchy of your storefront
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {categories.filter(c => c.isPermanent || DEFAULT_PERMANENT.includes(c.name)).slice(0, 3).map(dept => {
              const count = categories.filter(c => c.parentCategory === dept.name).length;
              return (
                <div key={dept.id} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-2xl border border-gray-100 dark:border-white/5 min-w-[120px]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">{dept.name}</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white italic">{count} <span className="text-[10px] not-italic text-[var(--primary-color)] opacity-60">Sub-Cats</span></p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <div className={`bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border p-10 sticky top-10 transition-all duration-500 ${
            editingCategory ? 'border-[var(--primary-color)] shadow-[var(--primary-color)]/10' : 'shadow-black/5 border-white dark:border-white/5'
          }`}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center uppercase italic">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-white shadow-xl bg-[var(--primary-color)] animate-pulse-subtle">
                  {editingCategory ? <Pencil size={20} /> : <Plus size={22} />}
                </div>
                {editingCategory ? 'Modify Layer' : 'New Category'}
              </h2>
              {editingCategory && (
                <button 
                  onClick={cancelEdit}
                  className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  title="Cancel Edit"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-600 ml-2" htmlFor="categoryName">Designation</label>
                <input
                  id="categoryName"
                  name="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. ULTRA-BOOKS"
                  className="w-full px-6 py-5 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold uppercase tracking-tight"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-600 ml-2" htmlFor="categoryParent">Parent Architecture</label>
                <select
                  id="categoryParent"
                  name="categoryParent"
                  value={categoryParent}
                  onChange={(e) => setCategoryParent(e.target.value)}
                  className="w-full px-6 py-5 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold uppercase"
                >
                  <option value="">Top Level Domain</option>
                  <optgroup label="Core Departments">
                    {categories.filter(c => c.isPermanent || DEFAULT_PERMANENT.includes(c.name)).map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Sub-Architecture">
                    {categories
                      .filter(c => !c.isPermanent && !DEFAULT_PERMANENT.includes(c.name) && (!editingCategory || c.id !== editingCategory.id))
                      .map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))
                    }
                  </optgroup>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-600 ml-2">Visual Identifier</label>
                <div className="flex gap-4">
                  <div className="relative flex-grow">
                    <input
                      id="categoryImageUrl"
                      name="categoryImageUrl"
                      type="text"
                      value={categoryImage}
                      onChange={(e) => setCategoryImage(e.target.value)}
                      placeholder="Source URL"
                      className="w-full pl-12 pr-4 py-5 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white text-xs font-medium"
                    />
                    <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" size={18} />
                  </div>
                  <input
                    type="file"
                    id="category-image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="category-image-upload"
                    className={`p-5 ${isUploading ? 'opacity-50' : 'hover:scale-105 active:scale-95'} bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl cursor-pointer transition-all shadow-xl flex items-center justify-center shrink-0`}
                  >
                    {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                  </label>
                </div>
              </div>

              <div className="bg-[var(--primary-color)]/5 rounded-2xl p-6 border border-[var(--primary-color)]/10">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative w-12 h-6 bg-gray-200 dark:bg-slate-800 rounded-full transition-colors group-hover:bg-gray-300 dark:group-hover:bg-slate-700">
                    <input
                      type="checkbox"
                      checked={showOnHome}
                      onChange={(e) => setShowOnHome(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all ${showOnHome ? 'translate-x-6 bg-[var(--primary-color)] shadow-lg shadow-[var(--primary-color)]/30' : 'bg-gray-400 dark:bg-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Show on Homepage</p>
                    <p className="text-[9px] font-medium text-gray-500 dark:text-slate-400">Display this category in the 'Shop by Category' section</p>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative w-12 h-6 bg-gray-200 dark:bg-slate-800 rounded-full transition-colors group-hover:bg-gray-300 dark:group-hover:bg-slate-700">
                      <input
                        type="checkbox"
                        checked={isPermanent}
                        onChange={(e) => setIsPermanent(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all ${isPermanent ? 'translate-x-6 bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-400 dark:bg-slate-600'}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Permanent</p>
                      <p className="text-[9px] font-medium text-gray-500 dark:text-slate-400">Lock category</p>
                    </div>
                  </label>
                </div>

                <div className="bg-purple-500/5 rounded-2xl p-6 border border-purple-500/10">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white" htmlFor="sortOrder">Position</label>
                    <input
                      id="sortOrder"
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-lg text-[var(--primary-color)]"
                    />
                  </div>
                </div>
              </div>
              {categoryImage && (
                <div className="relative w-full aspect-video rounded-[1.5rem] overflow-hidden border-2 border-[var(--primary-color)]/20 group">
                  <img src={categoryImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    type="button"
                    onClick={() => setCategoryImage('')}
                    className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg scale-0 group-hover:scale-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-6 bg-[var(--primary-color)] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 hover:-translate-y-1 active:scale-95 transition-all shadow-2xl shadow-[var(--primary-color)]/30 flex items-center justify-center gap-3"
              >
                {editingCategory ? <Save size={18} /> : <Plus size={18} />}
                {editingCategory ? 'Update Architecture' : 'Provision Category'}
              </button>
            </form>

            {error && (
              <div className="mt-8 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-shake flex items-center gap-3">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="mt-8 bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                <Tag size={16} />
                {success}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hierarchy List */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.4em] ml-2 flex items-center gap-4">
              Core Architecture
              <div className="h-px flex-grow bg-gray-100 dark:bg-white/5" />
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories
                .filter(c => c.isPermanent || DEFAULT_PERMANENT.includes(c.name))
                .sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map((category) => (
                <div key={category.id} className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-[2rem] p-6 border border-white dark:border-white/5 group hover:border-[var(--primary-color)]/30 transition-all relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-[8px] font-black text-gray-300 dark:text-slate-700 tracking-tighter">ORD: {category.sortOrder || 0}</div>
                  <div className="w-14 h-14 bg-[var(--primary-color)]/10 text-[var(--primary-color)] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[var(--primary-color)]/10">
                    <Tag size={24} />
                  </div>
                  <h4 className="font-black text-gray-900 dark:text-white uppercase italic mb-1">{category.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permanent Node</p>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <button
                      onClick={() => handleToggleHome(category)}
                      className={`text-[9px] font-black uppercase tracking-widest italic transition-all ${
                        category.showOnHome ? 'text-[var(--primary-color)]' : 'text-gray-400 opacity-40 hover:opacity-100'
                      }`}
                    >
                      {category.showOnHome ? '● Active on Home' : '○ Hidden on Home'}
                    </button>
                    <button
                      onClick={() => handleEditClick(category)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Categories Architecture */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.4em] ml-2 flex items-center gap-4">
              Sub-Architecture
              <div className="h-px flex-grow bg-gray-100 dark:bg-white/5" />
            </h3>

            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white dark:border-white/5 overflow-hidden">
              {categories.filter(c => !c.isPermanent && !DEFAULT_PERMANENT.includes(c.name)).length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                  {categories
                    .filter(c => !c.isPermanent && !DEFAULT_PERMANENT.includes(c.name))
                    .sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    .map((category) => (
                    <div key={category.id} className={`p-8 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-all group ${
                      editingCategory?.id === category.id ? 'bg-[var(--primary-color)]/5 border-l-[6px] border-[var(--primary-color)]' : ''
                    }`}>
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gray-50 dark:bg-black/20 rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/5 group-hover:scale-105 transition-all shadow-sm">
                            {category.image ? (
                              <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-slate-800">
                                <Tag size={32} strokeWidth={1} />
                              </div>
                            )}
                          </div>
                          <div className="absolute -top-2 -left-2 w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-900 shadow-lg">
                            {category.sortOrder || 0}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase italic group-hover:text-[var(--primary-color)] transition-colors">
                              {category.name}
                            </h4>
                            {category.parentCategory && (
                              <span className="px-3 py-1 bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-[8px] font-black uppercase tracking-widest rounded-lg border border-[var(--primary-color)]/20">
                                {category.parentCategory}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                            Node ID: <span className="font-mono text-[var(--primary-color)] opacity-60">#{category.id.slice(-6)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleHome(category)}
                          className={`p-4 rounded-2xl transition-all group/btn ${
                            category.showOnHome 
                              ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] shadow-inner' 
                              : 'bg-gray-50 dark:bg-black/20 text-gray-400 hover:text-[var(--primary-color)]'
                          }`}
                          title={category.showOnHome ? "Remove from Home" : "Add to Home"}
                        >
                          <div className={`w-2 h-2 rounded-full mb-0.5 mx-auto ${category.showOnHome ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`} />
                          <span className="text-[8px] font-black block leading-none tracking-tighter">HOME</span>
                        </button>
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-4 rounded-2xl bg-gray-50 dark:bg-black/20 text-gray-400 hover:text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 transition-all group/btn"
                        >
                          <Pencil size={20} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name, category.isPermanent)}
                          className="p-4 rounded-2xl bg-gray-50 dark:bg-black/20 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all group/btn"
                        >
                          <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-24 text-center">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-black/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Tag size={40} className="text-gray-200 dark:text-slate-800" strokeWidth={1} />
                  </div>
                  <h4 className="text-xl font-black text-gray-700 dark:text-white uppercase italic mb-2 tracking-tight">Empty Architecture</h4>
                  <p className="text-sm text-gray-400 dark:text-slate-500 font-medium max-w-xs mx-auto">Establish new sub-categories to define your storefront hierarchy.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default CategoryManagerPage;
