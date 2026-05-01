const API_BASE_URL = `http://${window.location.hostname}:3001`;

class ApiService {
  /**
   * Local-disk (via JSON Server) based API service
   */
  async getAll(resource) {
    try {
      const response = await fetch(`${API_BASE_URL}/${resource}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // Update local storage for "offline" fallback
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error(`Fetch failed for ${resource}, falling back to localStorage:`, error);
      const localData = JSON.parse(localStorage.getItem(`sweeto_tech_db_${resource}`) || '[]');
      return localData;
    }
  }

  async getOne(resource, id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${resource}/${id}`);
      if (!response.ok) return null;
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const data = await response.json();
      
      // Update local storage
      const localData = await this.getAll(resource);
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(localData));
      
      return data;
    } catch (error) {
      console.error(`Create failed for ${resource}, using localStorage only:`, error);
      const data = await this.getAll(resource);
      data.push(newItem);
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(data));
      return newItem;
    }
  }

  async update(resource, id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      
      // Update local storage
      const localData = await this.getAll(resource);
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(localData));
      
      return data;
    } catch (error) {
      console.error(`Update failed for ${resource}/${id}, using localStorage only:`, error);
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
      await fetch(`${API_BASE_URL}/${resource}/${id}`, { method: 'DELETE' });
      
      // Update local storage
      const localData = await this.getAll(resource);
      localStorage.setItem(`sweeto_tech_db_${resource}`, JSON.stringify(localData));
      
      return { success: true };
    } catch (error) {
      console.error(`Delete failed for ${resource}/${id}, using localStorage only:`, error);
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
    
    // If it's a new setup, we might need to create it first
    try {
      const existing = await this.getStoreSettings();
      if (!existing) {
        return await this.create('storeSettings', updatedSettings);
      } else {
        return await this.update('storeSettings', existing.id, updates);
      }
    } catch (error) {
      // Legacy localStorage logic if backend is down
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
    // For import, we'd ideally overwrite the server's db.json
    // But for now, we just update localStorage and let the server handle its own persistence
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
