import React, { useState } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { Plus, Package, Trash2, Edit, AlertCircle, CheckCircle2, Image as ImageIcon, X, Sparkles, Loader2, Check, Star, TrendingUp, Zap, Clock, Smartphone, Tv, Speaker, Snowflake } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { uploadToStorage } from '../../utils/storageHelper';
import { generateAIProductDescription } from '../../utils/aiService';

const ProductManagerPage = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, formatPrice, currencySymbol, storeSettings } = useStoreData();
  const { t } = useAdminLocale();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    status: 'active',
    description: '',
    image: '',
    originalPrice: '',
    additionalImages: [],
    featured: false,
    trending: false,
    dealOfDay: false,
    newArrival: false,
    smartphonesPlacement: false,
    homeCinemaPlacement: false,
    speakersPlacement: false,
    refrigeratorsPlacement: false,
    rating: '',
    reviewsCount: '',
    colors: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploadingImage(true);
        const compressedBlob = await compressImage(file);
        const downloadURL = await uploadToStorage(compressedBlob, 'products');
        setFormData(prev => ({ ...prev, image: downloadURL }));
        setError('');
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Failed to process image. Please try another one.");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleAdditionalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.additionalImages?.length >= 5) {
        setError('You can only upload up to 5 additional images.');
        return;
      }
      try {
        setIsUploadingAdditional(true);
        const compressedBlob = await compressImage(file);
        const downloadURL = await uploadToStorage(compressedBlob, 'products/additional');
        setFormData(prev => ({ ...prev, additionalImages: [...(prev.additionalImages || []), downloadURL] }));
        setError('');
      } catch (err) {
        console.error("Error processing additional image:", err);
        setError("Failed to process image. Please try another one.");
      } finally {
        setIsUploadingAdditional(false);
      }
    }
  };

  const removeAdditionalImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  const openAddForm = () => {
    setFormData({ name: '', price: '', categoryId: '', status: 'active', description: '', image: '', originalPrice: '', additionalImages: [], featured: false, trending: false, dealOfDay: false, newArrival: false, smartphonesPlacement: false, homeCinemaPlacement: false, speakersPlacement: false, refrigeratorsPlacement: false, rating: '', reviewsCount: '', colors: [] });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setFormData({
      name: product.name || '',
      price: product.price || '',
      categoryId: product.categoryId || '',
      status: product.status || 'active',
      description: product.description || '',
      image: product.image || '',
      originalPrice: product.originalPrice || '',
      additionalImages: product.additionalImages || [],
      featured: product.featured || false,
      trending: product.trending || false,
      dealOfDay: product.dealOfDay || false,
      newArrival: product.newArrival || false,
      smartphonesPlacement: product.smartphonesPlacement || false,
      homeCinemaPlacement: product.homeCinemaPlacement || false,
      speakersPlacement: product.speakersPlacement || false,
      refrigeratorsPlacement: product.refrigeratorsPlacement || false,
      rating: product.rating || '',
      reviewsCount: product.reviewsCount || '',
      colors: product.colors || []
    });
    setEditingProduct(product);
    setError('');
    setSuccess('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', categoryId: '', status: 'active', description: '', image: '', originalPrice: '', additionalImages: [], featured: false, trending: false, dealOfDay: false, newArrival: false, smartphonesPlacement: false, homeCinemaPlacement: false, speakersPlacement: false, refrigeratorsPlacement: false, rating: '', reviewsCount: '', colors: [] });
    setError('');
    setSuccess('');
    setAiSuggestion('');
  };

  const handleAIGenerate = async () => {
    if (!storeSettings?.geminiApiKey) {
      setError("AI Configuration Required: Please add your Gemini API Key in Store Settings first.");
      const errorEl = document.getElementById('ai-error-anchor');
      if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!formData.image) {
      setError("Image Required: Please upload a product image first so the AI can analyze it.");
      return;
    }

    setIsGeneratingAI(true);
    setError('');
    setAiSuggestion('');

    try {
      const description = await generateAIProductDescription(
        formData.image,
        storeSettings.geminiApiKey,
        storeSettings.adminLanguage || 'en',
        { name: formData.name },
        storeSettings.geminiModel || 'gemini-1.5-flash'
      );
      setAiSuggestion(description);
    } catch (err) {
      console.error("AI Generation failed:", err);
      if (err.message === 'MISSING_API_KEY') {
        setError("AI Configuration Required: Please add your Gemini API Key in Store Settings first.");
        return;
      }
      if (err.message === 'INVALID_API_KEY') {
        setError("Invalid API key. Please check your Store Settings and ensure your Gemini API key is active.");
        return;
      }
      if (err.message === 'AI_QUOTA_EXCEEDED') {
        setError("AI Quote exceeded. Please try again in 60 seconds.");
        return;
      }
      if (err.message === 'AI_SAFETY_BLOCK') {
        setError("The AI could not generate a description for this image due to safety policies.");
        return;
      }
      if (err.message === 'AI_MODEL_OVERLOADED') {
        setError("The AI model is currently busy. Please wait a few seconds and try again.");
        return;
      }
      if (err.message === 'AI_MODEL_NOT_FOUND') {
        setError("AI Model Configuration Error: The specified Gemini model version is not available for your API key. Please check your browser console for 'Available Models' and verify your setup in Google AI Studio.");
        return;
      }
      if (err.message.startsWith('AI_GEN_ERROR:')) {
        const detail = err.message.replace('AI_GEN_ERROR: ', '');
        setError(`AI Service Error: ${detail}`);
        return;
      }
      
      setError(`AI Generation failed: ${err.message || 'Unknown error'}. Please check your connection or try again later.`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const applyAISuggestion = () => {
    setFormData(prev => ({ ...prev, description: aiSuggestion }));
    setAiSuggestion('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || formData.price === '' || !formData.categoryId) {
      setError('Please fill in all required fields (Name, Price, Category)');
      return;
    }

    if (Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      reviewsCount: formData.reviewsCount ? parseInt(formData.reviewsCount, 10) : 0
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setSuccess('Product listing updated successfully!');
    } else {
      payload.stockQuantity = 1;
      payload.lowStockThreshold = 5;
      addProduct(payload);
      setSuccess('Product added successfully with 1 initial stock!');
    }

    setTimeout(() => {
      closeForm();
    }, 2000);
  };

  const toggleProductSelection = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProductIds.length} products?`)) {
      selectedProductIds.forEach(id => deleteProduct(id));
      setSelectedProductIds([]);
    }
  };

  const handleBulkStatusChange = (status) => {
    selectedProductIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) updateProduct(id, { ...product, status });
    });
    setSelectedProductIds([]);
  };

  return (
    <div className="p-6 w-full max-w-[1920px] mx-auto transition-colors duration-500 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight italic uppercase">{t('productManagement')}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center">
            <span className="w-8 h-px bg-[var(--primary-color)] mr-2"></span>
            Manage storefront listings
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl bg-[var(--primary-color)] text-white hover:opacity-90 shadow-[var(--primary-color)]/20 dark:shadow-none hover:-translate-y-1"
          >
            <Plus size={20} className="mr-3" />
            {t('addProduct')}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[var(--primary-color)]/5 border border-gray-100 dark:border-slate-800 p-10 mb-16 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-color)] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center uppercase italic">
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-xl flex items-center justify-center mr-4 text-white shadow-lg shadow-[var(--primary-color)]/20 dark:shadow-none">
                {editingProduct ? <Edit size={24} /> : <Plus size={24} />}
              </div>
              {editingProduct ? `Edit Web Listing: ${editingProduct.name}` : 'Create New Product'}
            </h2>
            <button onClick={closeForm} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-gray-100 dark:bg-slate-800 rounded-full">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. MacBook Pro M3"
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="price">Price ({currencySymbol}) *</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="originalPrice">Original Price (Optional)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    id="originalPrice"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="e.g. 599.99"
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="rating">Rating (0-5) (Optional)</label>
                  <input
                    type="number"
                    name="rating"
                    id="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="e.g. 4.5"
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="reviewsCount">Reviews Count (Optional)</label>
                  <input
                    type="number"
                    name="reviewsCount"
                    id="reviewsCount"
                    step="1"
                    min="0"
                    value={formData.reviewsCount}
                    onChange={handleInputChange}
                    placeholder="e.g. 12"
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="categoryId">Category *</label>
                   <select
                    name="categoryId"
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                  >
                    <option value="">Select Category</option>
                    {['Computers', 'Electronics', 'Accessories'].map(dept => {
                      const deptCats = categories.filter(c => c.parentCategory === dept);
                      const deptId = categories.find(c => c.name === dept)?.id;
                      
                      return (
                        <optgroup key={dept} label={dept}>
                          {deptId && <option value={deptId}>All {dept}</option>}
                          {deptCats.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </optgroup>
                      );
                    })}
                    <optgroup label="Other">
                      {categories
                        .filter(c => !['Computers', 'Electronics', 'Accessories'].includes(c.name) && !['Computers', 'Electronics', 'Accessories'].includes(c.parentCategory))
                        .map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      }
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Status</label>
                  <div className="flex gap-4">
                    {['active', 'draft'].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, status }))}
                        className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all capitalize font-black tracking-widest text-xs ${formData.status === status
                            ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10 text-[var(--primary-color)] shadow-lg shadow-[var(--primary-color)]/10'
                            : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-gray-200 dark:hover:border-slate-700'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 ml-1">Storefront Placement</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all font-black tracking-widest text-[10px] sm:text-xs ${
                        formData.featured
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-amber-200'
                      }`}
                    >
                      <Star size={14} className={formData.featured ? 'fill-amber-500 text-amber-500' : ''} />
                      Featured
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, trending: !p.trending }))}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all font-black tracking-widest text-[10px] sm:text-xs ${
                        formData.trending
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 shadow-lg shadow-rose-500/10'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-rose-200'
                      }`}
                    >
                      <TrendingUp size={14} />
                      Trending
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, dealOfDay: !p.dealOfDay }))}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all font-black tracking-widest text-[10px] sm:text-xs ${
                        formData.dealOfDay
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-blue-200'
                      }`}
                    >
                      <Zap size={14} className={formData.dealOfDay ? 'fill-blue-500 text-blue-500' : ''} />
                      Daily Deal
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, newArrival: !p.newArrival }))}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all font-black tracking-widest text-[10px] sm:text-xs ${
                        formData.newArrival
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-emerald-200'
                      }`}
                    >
                      <Clock size={14} />
                      New Arrival
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, smartphonesPlacement: !p.smartphonesPlacement }))}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all font-black tracking-widest text-[10px] sm:text-xs ${
                        formData.smartphonesPlacement
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-indigo-200'
                      }`}
                    >
                      <Smartphone size={14} />
                      Mobiles
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, homeCinemaPlacement: !p.homeCinemaPlacement }))}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all font-black tracking-widest text-[10px] sm:text-xs ${
                        formData.homeCinemaPlacement
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-500/10'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-violet-200'
                      }`}
                    >
                      <Tv size={14} />
                      Cinema
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, speakersPlacement: !p.speakersPlacement }))}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all font-black tracking-widest text-[10px] sm:text-xs ${
                        formData.speakersPlacement
                          ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 shadow-lg shadow-fuchsia-500/10'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-fuchsia-200'
                      }`}
                    >
                      <Speaker size={14} />
                      Speakers
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, refrigeratorsPlacement: !p.refrigeratorsPlacement }))}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all font-black tracking-widest text-[10px] sm:text-xs ${
                        formData.refrigeratorsPlacement
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 shadow-lg shadow-cyan-500/10'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-cyan-200'
                      }`}
                    >
                      <Snowflake size={14} />
                      Fridge
                    </button>

                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-2 ml-1 font-medium">Toggle to show this product in the corresponding sections on the homepage.</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="image">Product Image</label>
                <div className="flex gap-4">
                  <div className="relative flex-grow">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" size={18} />
                    <input
                      type="text"
                      name="image"
                      id="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Image URL or upload"
                      autoComplete="off"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <label className={`cursor-pointer ${isUploadingImage ? 'bg-[var(--primary-color)]/50' : 'bg-[var(--primary-color)] hover:opacity-90'} text-white p-4 rounded-2xl transition-all shadow-xl shadow-[var(--primary-color)]/30 flex items-center justify-center shrink-0 hover:-rotate-6`}>
                    {isUploadingImage ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                    <input
                      type="file"
                      id="productImageUpload"
                      name="productImageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Additional Gallery Images (Max 5)</label>
                <div className="flex gap-4 flex-wrap">
                  {formData.additionalImages?.map((imgStr, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-slate-800">
                      <img src={imgStr} className="w-full h-full object-cover" alt={`Additional ${idx+1}`} />
                      <button type="button" onClick={() => removeAdditionalImage(idx)} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full items-center justify-center backdrop-blur-sm">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(!formData.additionalImages || formData.additionalImages.length < 5) && (
                    <label className={`cursor-pointer w-24 h-24 flex items-center justify-center flex-col bg-gray-50 dark:bg-slate-950/50 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl hover:border-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 transition-colors text-gray-400 hover:text-[var(--primary-color)] ${isUploadingAdditional ? 'opacity-50' : ''}`}>
                      {isUploadingAdditional ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} className="mb-1" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest">{isUploadingAdditional ? 'Uploading...' : 'Add More'}</span>
                      <input id="additionalImageUpload" name="additionalImageUpload" type="file" className="hidden" accept="image/*" onChange={handleAdditionalImageUpload} disabled={isUploadingAdditional} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2 ml-1">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500" htmlFor="description">Description</label>
                  <button 
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={isGeneratingAI}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border transition-all ${
                      isGeneratingAI 
                      ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] opacity-50 border-[var(--primary-color)]/20 cursor-not-allowed'
                      : 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] hover:opacity-90 hover:shadow-lg shadow-[var(--primary-color)]/20 active:scale-95'
                    } disabled:opacity-50`}
                  >
                    {isGeneratingAI ? (
                      <><Loader2 size={12} className="animate-spin" /> ANALYZING IMAGE...</>
                    ) : (
                      <><Sparkles size={12} className="animate-pulse" /> MAGIC DESCRIBE</>
                    )}
                  </button>
                </div>
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell customers about this product..."
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white dark:focus:bg-slate-950 transition-all outline-none resize-none text-gray-900 dark:text-white font-medium mb-4"
                ></textarea>

                {aiSuggestion && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-2xl mb-4">
                    <p className="text-xs text-purple-800 dark:text-purple-300 mb-3 leading-relaxed">{aiSuggestion}</p>
                    <button type="button" onClick={applyAISuggestion} className="text-[10px] font-black uppercase tracking-widest text-white bg-purple-600 px-4 py-2 rounded-xl">
                      Apply Suggestion
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-slate-950/30 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 ml-1">Color Variants</label>
                
                <div className="flex gap-3 mb-6">
                  <div className="flex-grow grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      id="newColorName"
                      placeholder="Color Name (e.g. Red)"
                      className="px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="newColorCode"
                        defaultValue="#0066FF"
                        className="w-12 h-11 p-1 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nameInput = document.getElementById('newColorName');
                          const codeInput = document.getElementById('newColorCode');
                          if (nameInput.value) {
                            setFormData(prev => ({
                              ...prev,
                              colors: [...(prev.colors || []), { name: nameInput.value, code: codeInput.value }]
                            }));
                            nameInput.value = '';
                          }
                        }}
                        className="flex-grow bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-xl hover:opacity-90 active:scale-95 transition-all"
                      >
                        Add Color
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.colors?.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm animate-in zoom-in duration-300">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color.code }} />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{color.name}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          colors: prev.colors.filter((_, i) => i !== idx)
                        }))}
                        className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {(!formData.colors || formData.colors.length === 0) && (
                    <p className="text-[10px] text-gray-400 italic font-medium">No color variants added yet.</p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex flex-col space-y-4">
                <button
                  type="submit"
                  className="w-full py-5 bg-[var(--primary-color)] text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:opacity-90 transition-all shadow-2xl shadow-[var(--primary-color)]/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                >
                  {editingProduct ? 'Update Storefront Listing' : 'Confirm & Save Product'}
                </button>

                {error && (
                  <div id="ai-error-anchor" className="flex items-center text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/20 animate-shake">
                    <AlertCircle size={18} className="mr-3 shrink-0" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/20">
                    <CheckCircle2 size={18} className="mr-3 shrink-0" />
                    {success}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-[var(--primary-color)]/5 transition-all duration-500 group flex flex-col">
              <div className="relative aspect-[4/3] bg-gray-50 dark:bg-slate-950 rounded-2xl mb-5 overflow-hidden border border-gray-100 dark:border-slate-800/50">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-800">
                    <Package size={60} strokeWidth={1} />
                  </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-widest shadow-lg ${product.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                  {product.status}
                </div>

                {/* Featured / Trending / Deals badges */}
                <div className="absolute bottom-4 left-4 flex gap-1.5 flex-wrap max-w-[80%]">
                  {product.featured && (
                    <span className="flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow">
                      <Star size={9} className="fill-white" /> Featured
                    </span>
                  )}
                  {product.trending && (
                    <span className="flex items-center gap-1 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow">
                      <TrendingUp size={9} /> Trending
                    </span>
                  )}
                  {product.dealOfDay && (
                    <span className="flex items-center gap-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow">
                      <Zap size={9} className="fill-white" /> Deal
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow">
                      <Clock size={9} /> New
                    </span>
                  )}
                </div>

                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleProductSelection(product.id)}
                  className={`absolute top-4 right-4 w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                    selectedProductIds.includes(product.id)
                    ? 'bg-[var(--primary-color)] border-[var(--primary-color)] text-white scale-110 shadow-lg shadow-[var(--primary-color)]/30'
                    : 'bg-white/20 backdrop-blur-md border-white/50 hover:border-white'
                  }`}
                >
                  {selectedProductIds.includes(product.id) && <Check size={14} strokeWidth={4} />}
                </button>
              </div>
              <div className="flex justify-between items-start mb-4 px-1 flex-grow">
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-[var(--primary-color)] transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    {product.categoryId ? (categories.find(c => c.id.toString() === product.categoryId.toString())?.name || 'Uncategorized') : 'No Category Setup'}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                    Stock: {product.stockQuantity || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[var(--primary-color)] text-lg font-mono tracking-tighter">{formatPrice(product.price)}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-auto pt-6 border-t border-gray-50 dark:border-slate-800">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex-grow flex items-center justify-center py-3.5 px-4 text-xs font-black uppercase tracking-widest text-[var(--primary-color)] hover:text-white border border-[var(--primary-color)]/20 hover:border-[var(--primary-color)] hover:bg-[var(--primary-color)] rounded-xl transition-all"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Listing
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="px-4 flex items-center justify-center py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-red-50 dark:border-red-900/20"
                  title="Delete Product"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-20 text-center border-2 border-dashed border-gray-100 dark:border-slate-800">
            <div className="p-8 bg-gray-50 dark:bg-slate-950 rounded-full w-fit mx-auto mb-6">
              <Package size={80} strokeWidth={1} className="text-gray-200 dark:text-slate-850" />
            </div>
            <h3 className="text-2xl font-black text-gray-700 dark:text-white uppercase tracking-tight italic">No Storefront Items</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-3 font-medium">
              Start by adding an item or defining your physical inventory first in the Stock Management page.
            </p>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedProductIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-5 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 dark:border-slate-200 flex items-center gap-8 z-[100] animate-in slide-in-from-bottom-10 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary-color)] rounded-2xl flex items-center justify-center font-black">
              {selectedProductIds.length}
            </div>
            <span className="text-sm font-black uppercase tracking-widest">Selected</span>
          </div>
          
          <div className="w-px h-8 bg-white/20 dark:bg-slate-200" />
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBulkStatusChange('active')}
              className="px-4 py-2 hover:bg-white/10 dark:hover:bg-slate-100 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
            >
              Set Active
            </button>
            <button
              onClick={() => handleBulkStatusChange('draft')}
              className="px-4 py-2 hover:bg-white/10 dark:hover:bg-slate-100 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
            >
              Set Draft
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
            >
              Delete All
            </button>
          </div>
          
          <button 
            onClick={() => setSelectedProductIds([])}
            className="p-2 hover:bg-white/10 dark:hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManagerPage;
