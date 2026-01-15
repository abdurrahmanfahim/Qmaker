// Mobile-specific storage utilities
class MobileStorage {
  constructor() {
    this.isSupported = this.checkSupport();
    this.setupEventListeners();
  }

  checkSupport() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  setupEventListeners() {
    // Handle mobile app state changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushPendingWrites();
      }
    });

    // Handle mobile browser tab switching
    window.addEventListener('blur', () => {
      this.flushPendingWrites();
    });

    // Handle mobile back button
    window.addEventListener('beforeunload', () => {
      this.flushPendingWrites();
    });
  }

  setItem(key, value) {
    if (!this.isSupported) return false;
    
    try {
      const data = {
        value,
        timestamp: Date.now(),
        version: '1.0'
      };
      const jsonStr = JSON.stringify(data);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      localStorage.setItem(key, encoded);
      return true;
    } catch (error) {
      console.error('Mobile storage write failed:', error);
      return false;
    }
  }

  getItem(key) {
    if (!this.isSupported) return null;
    
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      try {
        const decoded = decodeURIComponent(escape(atob(stored)));
        const data = JSON.parse(decoded);
        return data.value || data;
      } catch (e) {
        const data = JSON.parse(stored);
        return data.value || data;
      }
    } catch (error) {
      console.error('Mobile storage read failed:', error);
      return null;
    }
  }

  removeItem(key) {
    if (!this.isSupported) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Mobile storage remove failed:', error);
      return false;
    }
  }

  flushPendingWrites() {
    // Force localStorage to flush on mobile
    try {
      const temp = localStorage.getItem('temp-flush') || '0';
      localStorage.setItem('temp-flush', (parseInt(temp) + 1).toString());
    } catch (error) {
      console.error('Failed to flush storage:', error);
    }
  }

  clear() {
    if (!this.isSupported) return false;
    
    try {
      // Only clear Qmaker-specific keys
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('qmaker-')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Mobile storage clear failed:', error);
      return false;
    }
  }
}

const mobileStorage = new MobileStorage();
export default mobileStorage;