class APIGateway {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.qmaker.app';
    this.rateLimits = new Map();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    // Rate limiting check
    if (this.isRateLimited(endpoint)) {
      throw new Error('Rate limit exceeded');
    }

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      // Update rate limit tracking
      this.updateRateLimit(endpoint);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Paper management endpoints
  async getPapers(tenantId) {
    return this.request(`/papers?tenant=${tenantId}`);
  }

  async createPaper(paperData) {
    return this.request('/papers', {
      method: 'POST',
      body: JSON.stringify(paperData)
    });
  }

  async updatePaper(paperId, paperData) {
    return this.request(`/papers/${paperId}`, {
      method: 'PUT',
      body: JSON.stringify(paperData)
    });
  }

  // Collaboration endpoints
  async sharePaper(paperId, permissions) {
    return this.request(`/papers/${paperId}/share`, {
      method: 'POST',
      body: JSON.stringify(permissions)
    });
  }

  // AI endpoints
  async generateQuestion(prompt) {
    return this.request('/ai/generate-question', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }

  // Analytics endpoints
  async getAnalytics(tenantId) {
    return this.request(`/analytics?tenant=${tenantId}`);
  }

  // Rate limiting helpers
  isRateLimited(endpoint) {
    const key = this.getRateLimitKey(endpoint);
    const limit = this.rateLimits.get(key);
    
    if (!limit) return false;
    
    const now = Date.now();
    return limit.count >= limit.max && (now - limit.resetTime) < 60000; // 1 minute window
  }

  updateRateLimit(endpoint) {
    const key = this.getRateLimitKey(endpoint);
    const now = Date.now();
    const limit = this.rateLimits.get(key) || { count: 0, max: 100, resetTime: now };
    
    if (now - limit.resetTime >= 60000) {
      limit.count = 1;
      limit.resetTime = now;
    } else {
      limit.count++;
    }
    
    this.rateLimits.set(key, limit);
  }

  getRateLimitKey(endpoint) {
    return endpoint.split('?')[0]; // Remove query params for rate limiting
  }
}

export default new APIGateway();