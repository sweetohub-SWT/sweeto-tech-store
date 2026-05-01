import { supabase } from './supabaseClient';

class ApiService {
  async getAll(resource) {
    try {
      const { data, error } = await supabase.from(resource).select('*');
      if (error) throw error;
      
      // Keep local storage as a fallback cache
      if (data && data.length > 0) {
        localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(data));
      }
      return data || [];
    } catch (error) {
      console.error(`Supabase fetch failed for ${resource}, falling back to localStorage:`, error);
      const localData = JSON.parse(localStorage.getItem(`sweeto_tech_db_${resource}`) || '[]');
      return localData;
    }
  }

  async getOne(resource, id) {
    try {
      const { data, error } = await supabase.from(resource).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      const data = await this.getAll(resource);
      return data.find(item => String(item.id) === String(id)) || null;
    }
  }

  async create(resource, itemData) {
    const newItem = {
      ...itemData,
      id: itemData.id || crypto.randomUUID()
    };

    try {
      const { data, error } = await supabase.from(resource).insert([newItem]).select();
      if (error) throw error;
      
      // Update local cache
      const localData = await this.getAll(resource);
      const exists = localData.find(i => i.id === newItem.id);
      if (!exists) {
        localData.push(data?.[0] || newItem);
        localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(localData));
      }
      
      return data?.[0] || newItem;
    } catch (error) {
      console.error(`Supabase create failed for ${resource}, using localStorage only:`, error);
      const data = await this.getAll(resource);
      data.push(newItem);
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(data));
      return newItem;
    }
  }

  async update(resource, id, updates) {
    try {
      const { data, error } = await supabase.from(resource).update(updates).eq('id', id).select();
      if (error) throw error;
      
      return data?.[0] || null;
    } catch (error) {
      console.error(`Supabase update failed for ${resource}/${id}, using localStorage only:`, error);
      let data = await this.getAll(resource);
      let updatedItem = null;
      
      data = data.map(item => {
        if (String(item.id) === String(id)) {
          updatedItem = { ...item, ...updates };
          return updatedItem;
        }
        return item;
      });
      
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(data));
      return updatedItem;
    }
  }

  async delete(resource, id) {
    try {
      const { error } = await supabase.from(resource).delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Supabase delete failed for ${resource}/${id}, using localStorage only:`, error);
      let data = await this.getAll(resource);
      data = data.filter(item => String(item.id) !== String(id));
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(data));
      return { success: true };
    }
  }

  // Synchronous convenience methods (for initial state)
  getProductsSync() {
    return JSON.parse(localStorage.getItem('sweeto_tech_db_products') || '[]');
  }
  getCategoriesSync() {
    return JSON.parse(localStorage.getItem('sweeto_tech_db_categories') || '[]');
  }
  getStoreSettingsSync() {
    const data = JSON.parse(localStorage.getItem('sweeto_tech_db_storeSettings') || '[]');
    return data[0] || null;
  }

  // Convenience methods
  async getProducts() { return this.getAll('products'); }
  async getCategories() { return this.getAll('categories'); }
  
  async getStoreSettings() {
    const data = await this.getAll('storeSettings');
    return data[0] || null;
  }

  async updateStoreSettings(updates) {
    const currentSettings = await this.getStoreSettings() || { id: 'main' };
    const updatedSettings = { ...currentSettings, ...updates };
    
    try {
      const existing = await this.getStoreSettings();
      if (!existing || Object.keys(existing).length === 0) {
        return await this.create('storeSettings', updatedSettings);
      } else {
        return await this.update('storeSettings', existing.id, updates);
      }
    } catch (error) {
      localStorage.setItem('sweeto_tech_db_storeSettings', JSON.stringify([updatedSettings]));
      return updatedSettings;
    }
  }

  async getSalesRecords() { return this.getAll('salesRecords'); }
  async getStockAdjustments() { return this.getAll('stockAdjustments'); }
  async getVisits() { return this.getAll('visits'); }
  async getVideoAds() { return this.getAll('video_ads'); }
  async getReviews() { return this.getAll('reviews'); }
  async getNotifications() { return this.getAll('notifications'); }
  async getSearchLogs() { return this.getAll('searchLogs'); }
  async getUserLogs() { return this.getAll('userLogs'); }
  async getSubscribers() { return this.getAll('subscribers'); }

  // Database Management
  async importDb(data) {
    for (const resource in data) {
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(data[resource]));
    }
    return true;
  }

  async exportDb() {
    const db = {};
    const resources = ['products', 'categories', 'salesRecords', 'stockAdjustments', 'visits', 'video_ads', 'reviews', 'notifications', 'searchLogs', 'userLogs', 'subscribers', 'storeSettings'];
    for (const res of resources) {
      db[res] = await this.getAll(res);
    }
    return db;
  }
}

export const apiService = new ApiService();
export default apiService;
