// Multi-paper storage utility
class PaperStorage {
  constructor() {
    this.storagePrefix = 'qmaker-paper-';
    this.indexKey = 'qmaker-papers-index';
  }

  // Save paper with unique ID
  savePaper(paperId, paperData) {
    try {
      const jsonStr = JSON.stringify(paperData);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      localStorage.setItem(`${this.storagePrefix}${paperId}`, encoded);
      this.updateIndex(paperId, paperData.metadata);
      return true;
    } catch (error) {
      console.error('Failed to save paper:', error);
      return false;
    }
  }

  // Load specific paper
  loadPaper(paperId) {
    try {
      const data = localStorage.getItem(`${this.storagePrefix}${paperId}`);
      if (!data) return null;
      
      // Try to decode base64 first (new format)
      try {
        const decoded = decodeURIComponent(escape(atob(data)));
        return JSON.parse(decoded);
      } catch (e) {
        // Fallback to old format (plain JSON)
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load paper:', error);
      return null;
    }
  }

  // Update papers index
  updateIndex(paperId, metadata) {
    const index = this.getPapersIndex();
    const paperInfo = {
      id: paperId,
      title: metadata?.examName || 'Untitled Paper',
      subject: metadata?.subject || '',
      lastModified: Date.now()
    };
    
    const filtered = index.filter(p => p.id !== paperId);
    const updated = [paperInfo, ...filtered].slice(0, 50); // Keep 50 papers max
    
    const jsonStr = JSON.stringify(updated);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    localStorage.setItem(this.indexKey, encoded);
  }

  // Get papers index
  getPapersIndex() {
    try {
      const data = localStorage.getItem(this.indexKey);
      if (!data) return [];
      
      try {
        const decoded = decodeURIComponent(escape(atob(data)));
        return JSON.parse(decoded);
      } catch (e) {
        return JSON.parse(data);
      }
    } catch {
      return [];
    }
  }

  // Delete paper
  deletePaper(paperId) {
    localStorage.removeItem(`${this.storagePrefix}${paperId}`);
    const index = this.getPapersIndex();
    const updated = index.filter(p => p.id !== paperId);
    const jsonStr = JSON.stringify(updated);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    localStorage.setItem(this.indexKey, encoded);
  }

  // Get storage usage
  getStorageInfo() {
    const papers = this.getPapersIndex();
    let totalSize = 0;
    
    papers.forEach(paper => {
      const data = localStorage.getItem(`${this.storagePrefix}${paper.id}`);
      if (data) totalSize += data.length;
    });
    
    return {
      paperCount: papers.length,
      totalSize: Math.round(totalSize / 1024), // KB
      maxPapers: 50,
      storageLimit: 5120 // 5MB typical localStorage limit
    };
  }
}

export default new PaperStorage();