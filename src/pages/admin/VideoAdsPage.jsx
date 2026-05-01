import React, { useState } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { Video, Plus, Trash2, Edit2, Link as LinkIcon, Loader2, CheckCircle2, AlertCircle, PlaySquare } from 'lucide-react';
import { uploadVideoToStorage as uploadToStorage } from '../../utils/storageHelper';

const VideoAdsPage = () => {
  const { videoAds, products, addVideoAd, updateVideoAd, deleteVideoAd, storeSettings } = useStoreData();
  const { t } = useAdminLocale();
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    productId: '',
    videoUrl: '',
    imageUrl: '',
    type: 'video', // 'video' or 'image'
    description: '',
    isActive: true
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [detectedDuration, setDetectedDuration] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');

    if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setError('Please upload a valid video file (MP4 or WebM).');
      return;
    }
    if (file.size > 100 * 1024 * 1024) { 
      setError('Video is too large. Please upload an advert under 100MB.');
      return;
    }

    // Duration Extraction & Validation
    const objectUrl = URL.createObjectURL(file);
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';

    let metadataHandled = false;

    // Timeout fallback: if metadata never loads in 10s, just upload without duration check
    const metadataTimeout = setTimeout(() => {
      if (!metadataHandled) {
        metadataHandled = true;
        URL.revokeObjectURL(objectUrl);
        console.warn('Video metadata timeout — skipping duration check and uploading directly.');
        startUpload(file);
      }
    }, 10000);

    videoElement.onloadedmetadata = () => {
      if (metadataHandled) return;
      metadataHandled = true;
      clearTimeout(metadataTimeout);

      const duration = videoElement.duration;
      // Revoke AFTER reading metadata
      URL.revokeObjectURL(objectUrl);
      setDetectedDuration(duration);

      // Check Duration Limits (1s to 50s)
      if (duration < 1) {
        setError('Video is too short. Adverts must be at least 1 second.');
        return;
      }
      if (duration > 50.5) {
        setError(`Video is too long (${Math.round(duration)}s). Adverts must be 50 seconds or less.`);
        return;
      }

      startUpload(file);
    };

    videoElement.onerror = () => {
      if (metadataHandled) return;
      metadataHandled = true;
      clearTimeout(metadataTimeout);
      URL.revokeObjectURL(objectUrl);
      setError('Could not read video metadata. The format might be unsupported or corrupted.');
    };

    // Set src AFTER attaching handlers
    videoElement.src = objectUrl;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(20);
    setError('');

    try {
      const downloadURL = await uploadToStorage(file, 'banners');
      setFormData(prev => ({ ...prev, imageUrl: downloadURL, videoUrl: '' }));
      setUploadProgress(100);
      setSuccess('Image successfully uploaded!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const startUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(10); 
    setError('');
    
    try {
      const folder = 'marketing-videos';
      setUploadProgress(50); 
      const downloadURL = await uploadToStorage(file, folder);
      
      setFormData(prev => ({ ...prev, videoUrl: downloadURL, imageUrl: '' }));
      setUploadProgress(100);
      setSuccess('Video successfully uploaded!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Video upload error:', err);
      setError(`Upload failed: ${err.message || 'Unknown error.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    // Abort logic not implemented for local FileReader
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || (formData.type === 'video' && !formData.videoUrl) || (formData.type === 'image' && !formData.imageUrl)) {
      setError('Please provide a title and upload the required media.');
      return;
    }

    try {
      if (editingAd) {
        await updateVideoAd(editingAd.id, formData);
        setSuccess('Banner Advert updated successfully!');
      } else {
        await addVideoAd({ ...formData, isActive: true });
        setSuccess('Banner Advert published successfully!');
      }
      
      setTimeout(() => {
        setShowForm(false);
        setEditingAd(null);
        setFormData({ title: '', productId: '', videoUrl: '', imageUrl: '', type: 'video', description: '', isActive: true });
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(editingAd ? 'Failed to update advert.' : 'Failed to publish advert.');
    }
  };

  const toggleStatus = async (ad) => {
    try {
      await updateVideoAd(ad.id, { isActive: !ad.isActive });
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this video advert? This action cannot be undone.')) {
      deleteVideoAd(id);
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      productId: ad.productId || '',
      videoUrl: ad.videoUrl,
      imageUrl: ad.imageUrl || '',
      type: ad.type || 'video',
      description: ad.description || '',
      isActive: ad.isActive ?? true
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  return (
    <div className="p-6 w-full max-w-[1920px] mx-auto transition-colors duration-500 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight italic uppercase">Video Adverts</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center">
            <span className="w-8 h-px bg-pink-600 mr-2"></span>
            Manage global promotional videos
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { 
              setEditingAd(null);
              setFormData({ title: '', productId: '', videoUrl: '', imageUrl: '', type: 'video', description: '', isActive: true });
              setShowForm(true); 
              setError(''); 
              setSuccess(''); 
            }}
            className="flex items-center px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl bg-pink-600 text-white hover:bg-pink-700 shadow-pink-500/20 dark:shadow-none hover:-translate-y-1"
          >
            <Plus size={20} className="mr-3" />
            Create New Banner
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-pink-500/5 border border-gray-100 dark:border-slate-800 p-10 mb-16 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center uppercase italic">
              <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center mr-4 text-white shadow-lg shadow-pink-200 dark:shadow-none">
                <Video size={24} />
              </div>
              {editingAd ? 'Edit Video Commercial' : 'Create Video Commercial'}
            </h2>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[10px] font-black uppercase border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-gray-500">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Advert Campaign Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Summer Mega Sale 2026"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Banner Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell your customers more about this promotion or product..."
                  rows="3"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium resize-none"
                ></textarea>
                <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">Visible on the banner. If left empty and a product is linked, we will use the product's description.</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Banner Type</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: 'video' }))}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${formData.type === 'video' ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-500/20' : 'bg-gray-50 dark:bg-slate-950/50 border-gray-200 dark:border-slate-800 text-gray-400'}`}
                  >
                    Video Commercial
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: 'image' }))}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${formData.type === 'image' ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-500/20' : 'bg-gray-50 dark:bg-slate-950/50 border-gray-200 dark:border-slate-800 text-gray-400'}`}
                  >
                    Static Image
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Link to Product (Optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium appearance-none"
                  >
                    <option value="">No Link (Just ambient banner)</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">If selected, the 'Shop Now' button on the banner will take users to this product.</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">
                {formData.type === 'video' ? 'Upload Commercial Video *' : 'Upload Banner Image *'}
              </label>
              
              {formData.type === 'video' ? (
                !formData.videoUrl ? (
                  <div className="relative">
                    <label className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${isUploading ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/10 dark:border-pink-900/50 cursor-wait' : 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-950/50 hover:bg-pink-50 hover:border-pink-500 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-pink-600'}`}>
                      {isUploading ? (
                        <>
                          <Loader2 size={32} className="animate-spin mb-3 text-pink-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-pink-600">Uploading {uploadProgress}%</span>
                          <div className="w-1/2 bg-gray-200 dark:bg-slate-800 rounded-full h-1 mt-3 overflow-hidden">
                            <div className="bg-pink-500 h-1 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                          <button 
                            type="button" 
                            onClick={cancelUpload}
                            className="mt-4 px-4 py-1.5 bg-white dark:bg-slate-900 border border-pink-200 text-pink-600 text-[10px] font-black uppercase rounded-full hover:bg-pink-50 transition-all"
                          >
                            Cancel Upload
                          </button>
                        </>
                      ) : (
                        <>
                          <Video size={36} className="mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Select MP4 Video</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="video/mp4,video/webm" onChange={handleVideoUpload} disabled={isUploading} />
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-black aspect-video flex items-center justify-center">
                    <video src={formData.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80"></video>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                      <CheckCircle2 size={40} className="text-green-400 mb-2" />
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Video Ready</span>
                      {detectedDuration && (
                        <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1 italic">
                          {detectedDuration.toFixed(1)}s Recorded
                        </span>
                      )}
                    </div>
                    <button type="button" onClick={() => setFormData(p => ({ ...p, videoUrl: '' }))} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-[10px] font-bold uppercase z-10 transition-colors shadow-lg">
                      Change
                    </button>
                  </div>
                )
              ) : (
                !formData.imageUrl ? (
                  <div className="relative">
                    <label className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${isUploading ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/10 dark:border-pink-900/50 cursor-wait' : 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-950/50 hover:bg-pink-50 hover:border-pink-500 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-pink-600'}`}>
                      {isUploading ? (
                        <>
                          <Loader2 size={32} className="animate-spin mb-3 text-pink-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-pink-600">Uploading {uploadProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Plus size={36} className="mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Select Banner Image</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-gray-100 aspect-video flex items-center justify-center">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                      <CheckCircle2 size={40} className="text-green-400 mb-2" />
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Image Ready</span>
                    </div>
                    <button type="button" onClick={() => setFormData(p => ({ ...p, imageUrl: '' }))} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-[10px] font-bold uppercase z-10 transition-colors shadow-lg">
                      Change
                    </button>
                  </div>
                )
              )}

              {/* Status Messages for Form */}
              {error && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 mt-4">
                  <AlertCircle size={16} className="mr-3 shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20 mt-4">
                  <CheckCircle2 size={16} className="mr-3 shrink-0" /> {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isUploading || (formData.type === 'video' ? !formData.videoUrl : !formData.imageUrl)}
                className="w-full mt-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:from-pink-700 hover:to-rose-700 transition-all shadow-xl shadow-pink-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingAd ? 'Update Banner' : 'Publish Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoAds.length > 0 ? (
          videoAds.map((ad) => {
            const linkedProduct = products.find(p => p.id === ad.productId);
            return (
              <div key={ad.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="relative aspect-video bg-black overflow-hidden">
                   {ad.type === 'image' ? (
                     <img 
                       src={ad.imageUrl} 
                       alt={ad.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                     />
                   ) : (
                     <video 
                       src={ad.videoUrl} 
                       autoPlay loop muted playsInline 
                       className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                     />
                   )}
                   <div className="absolute top-3 left-3 bg-pink-600 text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center">
                      {ad.type === 'image' ? <Plus size={10} className="mr-1.5" /> : <PlaySquare size={10} className="mr-1.5" />} 
                      {ad.type === 'image' ? 'Image Banner' : 'Video Banner'}
                   </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight mb-2 line-clamp-1">{ad.title}</h3>
                    {linkedProduct ? (
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest flex items-center">
                        <LinkIcon size={12} className="mr-1 inline" /> Linked: {linkedProduct.name}
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">No product linked</p>
                    )}
                  </div>
                  <div className="mt-6 border-t border-gray-50 dark:border-slate-800 pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <button
                         onClick={() => toggleStatus(ad)}
                         className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${ad.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-500'}`}
                       >
                         {ad.isActive ? 'Active' : 'Inactive'}
                       </button>
                    </div>
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => handleEdit(ad)}
                         className="px-4 py-2.5 text-[10px] font-black bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/10 dark:text-blue-400 rounded-xl transition-all flex items-center uppercase tracking-widest"
                       >
                         <Edit2 size={14} className="mr-1.5" /> Edit
                       </button>
                       <button
                         onClick={() => handleDelete(ad.id)}
                         className="px-4 py-2.5 text-[10px] font-black bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/10 dark:text-red-400 rounded-xl transition-all flex items-center uppercase tracking-widest"
                       >
                         <Trash2 size={14} className="mr-1.5" /> Remove
                       </button>
                     </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border-2 border-dashed border-gray-100 dark:border-slate-800">
            <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-full w-fit mx-auto mb-4">
              <Video size={48} className="text-pink-400" />
            </div>
            <h3 className="text-xl font-black text-gray-700 dark:text-white uppercase tracking-tight italic">No Video Adverts</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Create an eye-catching commercial to display proudly on your storefront.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAdsPage;
