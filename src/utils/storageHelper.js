// Convert files to base64 for local json-server storage
export const uploadToStorage = async (file, pathPrefix = 'images') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const uploadVideoToStorage = async (file, pathPrefix = 'videos') => {
  // Warn if video is too large, as base64 videos can cause massive db.json bloat
  if (file.size > 50 * 1024 * 1024) { // 50MB
     console.warn("Video is very large. Consider a smaller file for local storage.");
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};
