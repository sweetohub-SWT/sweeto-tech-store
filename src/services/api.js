const STORAGE_KEY_PREFIX = 'sweeto_tech_db_';

class ApiService {
  // Generic CRUD using localStorage
  async getAll(resource) {
    const data = JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}${resource}`) || '[]');
    return data;
  }

  async getOne(resource, id) {
    const data = await this.getAll(resource);
    return data.find(item => String(item.id) === String(id)) || null;
  }

  async create(resource, itemData) {
    const data = await this.getAll(resource);
    const newItem = {
      ...itemData,
      id: itemData.id || Date.now().toString()
    };
    data.push(newItem);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${resource}`, JSON.stringify(data));
    return newItem;
  }

  async update(resource, id, updates) {
    let data = await this.getAll(resource);
    let updatedItem = null;
    
    data = data.map(item => {
      if (String(item.id) === String(id)) {
        updatedItem = { ...item, ...updates };
        return updatedItem;
      }
      return item;
    });

    localStorage.setItem(`${STORAGE_KEY_PREFIX}${resource}`, JSON.stringify(data));
    return updatedItem;
  }

  async delete(resource, id) {
    let data = await this.getAll(resource);
    data = data.filter(item => String(item.id) !== String(id));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${resource}`, JSON.stringify(data));
    return { success: true };
  }

  // Synchronous convenience methods for initial state
  getProductsSync() {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}products`) || '[]');
  }
  getCategoriesSync() {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}categories`) || '[]');
  }
  getStoreSettingsSync() {
    const data = JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}storeSettings`) || '[]');
    return data[0] || null;
  }

  // Convenience methods
  async getProducts() { return this.getAll('products'); }
  async getCategories() { return this.getAll('categories'); }
  
  async getStoreSettings() {
    const data = JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}storeSettings`) || '[]');
    return data[0] || null;
  }

  async updateStoreSettings(updates) {
    const data = JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}storeSettings`) || '[]');
    const currentSettings = data[0] || { id: 'main' };
    const updatedSettings = { ...currentSettings, ...updates };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}storeSettings`, JSON.stringify([updatedSettings]));
    return updatedSettings;
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

  // Legacy compatibility
  async importDb(data) {
    for (const resource in data) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${resource}`, JSON.stringify(data[resource]));
    }
    return true;
  }

  async exportDb() {
    const db = {};
    const resources = ['products', 'categories', 'storeSettings', 'sales_records', 'stock_adjustments', 'visits', 'video_ads', 'reviews', 'notifications', 'search_logs', 'user_logs', 'subscribers'];
    for (const res of resources) {
      db[res] = await this.getAll(res);
    }
    return db;
  }
}

export const apiService = new ApiService();
export default apiService;

