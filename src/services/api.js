import { supabase } from './supabaseClient';

class ApiService {
  /**
   * Generic CRUD using Supabase
   * Tables must exist in your Supabase project with appropriate RLS policies.
   */
  async getAll(resource) {
    const { data, error } = await supabase
      .from(resource)
      .select('*');
    
    if (error) {
      console.error(`Supabase: Error fetching all from ${resource}:`, error);
      // Fallback to local storage if supabase is not configured/available
      return JSON.parse(localStorage.getItem(`sweeto_tech_db_${resource}`) || '[]');
    }
    return data;
  }

  async getOne(resource, id) {
    const { data, error } = await supabase
      .from(resource)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Supabase: Error fetching one from ${resource}:`, error);
      const localData = await this.getAll(resource);
      return localData.find(item => String(item.id) === String(id)) || null;
    }
    return data;
  }

  async create(resource, itemData) {
    const newItem = {
      ...itemData,
      id: itemData.id || crypto.randomUUID()
    };

    const { data, error } = await supabase
      .from(resource)
      .insert([newItem])
      .select()
      .single();

    if (error) {
      console.error(`Supabase: Error creating in ${resource}:`, error);
      // Local fallback
      const localData = await this.getAll(resource);
      localData.push(newItem);
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(localData));
      return newItem;
    }
    return data;
  }

  async update(resource, id, updates) {
    const { data, error } = await supabase
      .from(resource)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase: Error updating in ${resource}:`, error);
      // Local fallback
      let localData = await this.getAll(resource);
      let updatedItem = null;
      localData = localData.map(item => {
        if (String(item.id) === String(id)) {
          updatedItem = { ...item, ...updates };
          return updatedItem;
        }
        return item;
      });
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(localData));
      return updatedItem;
    }
    return data;
  }

  async delete(resource, id) {
    const { error } = await supabase
      .from(resource)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Supabase: Error deleting from ${resource}:`, error);
      // Local fallback
      let localData = await this.getAll(resource);
      localData = localData.filter(item => String(item.id) !== String(id));
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(localData));
    }
    return { success: !error };
  }

  // Synchronous convenience methods (still using localStorage for speed if needed)
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
    const data = await this.getAll('store_settings');
    return data[0] || null;
  }

  async updateStoreSettings(updates) {
    const currentSettings = await this.getStoreSettings() || { id: 'main' };
    const updatedSettings = { ...currentSettings, ...updates };
    
    const { data, error } = await supabase
      .from('store_settings')
      .upsert(updatedSettings)
      .select()
      .single();

    if (error) {
      console.error('Supabase: Error updating store settings:', error);
      localStorage.setItem('sweeto_tech_db_storeSettings', JSON.stringify([updatedSettings]));
      return updatedSettings;
    }
    return data;
  }

  async getSalesRecords() { return this.getAll('sales_records'); }
  async getStockAdjustments() { return this.getAll('stock_adjustments'); }
  async getVisits() { return this.getAll('visits'); }
  async getVideoAds() { return this.getAll('video_ads'); }
  async getReviews() { return this.getAll('reviews'); }
  async getNotifications() { return this.getAll('notifications'); }
  async getSearchLogs() { return this.getAll('search_logs'); }
  async getUserLogs() { return this.getAll('user_logs'); }
  async getSubscribers() { return this.getAll('subscribers'); }

  // Legacy compatibility / Mass Migration tool
  async importDb(data) {
    // This will try to push all local data to Supabase
    for (const resource in data) {
      const tableName = resource === 'storeSettings' ? 'store_settings' : resource;
      const { error } = await supabase.from(tableName).upsert(data[resource]);
      if (error) console.warn(`Import failed for ${resource}:`, error);
      
      // Also keep local as backup
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(data[resource]));
    }
    return true;
  }

  async exportDb() {
    const db = {};
    const resources = ['products', 'categories', 'sales_records', 'stock_adjustments', 'visits', 'video_ads', 'reviews', 'notifications', 'search_logs', 'user_logs', 'subscribers'];
    for (const res of resources) {
      db[res] = await this.getAll(res);
    }
    db['storeSettings'] = await this.getAll('store_settings');
    return db;
  }
}

export const apiService = new ApiService();
export default apiService;
