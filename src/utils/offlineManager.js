class OfflineManager {
  constructor() {
    this.dbName = 'QmakerDB';
    this.version = 1;
    this.db = null;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    
    this.init();
    this.setupEventListeners();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Papers store
        if (!db.objectStoreNames.contains('papers')) {
          const papersStore = db.createObjectStore('papers', { keyPath: 'id' });
          papersStore.createIndex('lastModified', 'lastModified');
        }
        
        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineChanges();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async savePaper(paperData) {
    const paper = {
      ...paperData,
      id: paperData.id || Date.now().toString(),
      lastModified: Date.now(),
      synced: this.isOnline
    };

    if (!this.db) await this.init();
    
    const transaction = this.db.transaction(['papers'], 'readwrite');
    const store = transaction.objectStore('papers');
    
    return new Promise((resolve, reject) => {
      const request = store.put(paper);
      request.onsuccess = () => {
        if (!this.isOnline) {
          this.addToSyncQueue('save', paper);
        }
        resolve(paper);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getPaper(id) {
    if (!this.db) await this.init();
    
    const transaction = this.db.transaction(['papers'], 'readonly');
    const store = transaction.objectStore('papers');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPapers() {
    if (!this.db) await this.init();
    
    const transaction = this.db.transaction(['papers'], 'readonly');
    const store = transaction.objectStore('papers');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deletePaper(id) {
    if (!this.db) await this.init();
    
    const transaction = this.db.transaction(['papers'], 'readwrite');
    const store = transaction.objectStore('papers');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => {
        if (!this.isOnline) {
          this.addToSyncQueue('delete', { id });
        }
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  addToSyncQueue(action, data) {
    const syncItem = {
      action,
      data,
      timestamp: Date.now()
    };
    
    const transaction = this.db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    store.add(syncItem);
  }

  async syncOfflineChanges() {
    if (!this.isOnline || !this.db) return;
    
    const transaction = this.db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    const request = store.getAll();
    request.onsuccess = async () => {
      const items = request.result;
      
      for (const item of items) {
        try {
          // Simulate API sync
          await this.syncToServer(item.action, item.data);
          store.delete(item.id);
        } catch (error) {
          console.error('Sync failed:', error);
        }
      }
    };
  }

  async syncToServer(action, data) {
    // Sanitize data before sync
    const sanitizedData = this.sanitizeData(data);
    // Simulate server sync
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Sanitize data to prevent XSS
  sanitizeData(data) {
    if (typeof data === 'string') {
      return data.replace(/[<>"'&]/g, (match) => {
        const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return entities[match];
      });
    }
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }
    if (data && typeof data === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }
    return data;
  }

  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      hasUnsyncedChanges: this.syncQueue.length > 0
    };
  }
}

export default new OfflineManager();