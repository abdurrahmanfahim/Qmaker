// Cloud synchronization utilities
class CloudSync {
  constructor() {
    this.syncInterval = null;
    this.lastSyncTime = localStorage.getItem('lastSyncTime') || 0;
  }

  // Initialize cloud sync
  init() {
    this.startAutoSync();
    this.handleOnlineOffline();
  }

  // Start automatic synchronization
  startAutoSync(interval = 30000) { // 30 seconds
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.syncToCloud();
      }
    }, interval);
  }

  // Sync data to cloud
  async syncToCloud() {
    try {
      const data = this.getLocalData();
      const timestamp = Date.now();
      
      // Simulate cloud API call
      const response = await this.mockCloudAPI('sync', {
        data,
        timestamp,
        lastSync: this.lastSyncTime
      });
      
      if (response.success) {
        localStorage.setItem('lastSyncTime', timestamp.toString());
        this.showSyncStatus('success', 'Synced to cloud');
      }
    } catch (error) {
      console.error('Cloud sync failed:', error);
      this.showSyncStatus('error', 'Sync failed');
    }
  }

  // Get local data for sync with sanitization
  getLocalData() {
    try {
      const paperData = localStorage.getItem('paper-storage');
      const autosave = localStorage.getItem('qmaker-autosave');
      
      return {
        paperData: paperData ? this.sanitizeData(JSON.parse(paperData)) : null,
        autosave: autosave ? this.sanitizeData(JSON.parse(autosave)) : null,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to parse local data:', error);
      return { paperData: null, autosave: null, timestamp: Date.now() };
    }
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

  // Mock cloud API (replace with real implementation)
  async mockCloudAPI(action, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data });
      }, 1000);
    });
  }

  // Handle online/offline events
  handleOnlineOffline() {
    window.addEventListener('online', () => {
      this.showSyncStatus('info', 'Back online - syncing...');
      this.syncToCloud();
    });

    window.addEventListener('offline', () => {
      this.showSyncStatus('warning', 'Offline - changes saved locally');
    });
  }

  // Show sync status to user (disabled)
  showSyncStatus(type, message) {
    // Disabled for now
    return;
  }

  // Stop sync
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

const cloudSyncInstance = new CloudSync();
export default cloudSyncInstance;