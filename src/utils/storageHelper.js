import { supabase } from '../services/supabaseClient';

export const uploadToStorage = async (file, bucketName = 'products') => {
  try {
    const fileExt = file.name?.split('.').pop() || 'png';
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to storage:', error.message);
    throw error;
  }
};

export const uploadVideoToStorage = async (file, bucketName = 'products') => {
  try {
    const fileExt = file.name?.split('.').pop() || 'mp4';
    const fileName = `video_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading video to storage:', error.message);
    throw error;
  }
};
