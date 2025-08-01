class Analytics {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.userId = this.getUserId();
    this.sessionId = this.generateSessionId();
  }

  getUserId() {
    let userId = localStorage.getItem('qmaker-user-id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('qmaker-user-id', userId);
    }
    return userId;
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  track(eventName, properties = {}) {
    const event = {
      id: Date.now() + Math.random(),
      name: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        userId: this.userId,
        sessionId: this.sessionId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
      }
    };

    this.events.push(event);
    this.saveToStorage();
    
    // Send to analytics service (simulated)
    this.sendEvent(event);
  }

  // User behavior tracking
  trackPageView(page) {
    this.track('page_view', { page });
  }

  trackUserAction(action, details = {}) {
    this.track('user_action', { action, ...details });
  }

  trackFeatureUsage(feature, usage = {}) {
    this.track('feature_usage', { feature, ...usage });
  }

  trackPerformance(metric, value, context = {}) {
    this.track('performance', { metric, value, ...context });
  }

  trackError(error, context = {}) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  // Paper creation analytics
  trackPaperCreated(paperData) {
    this.track('paper_created', {
      language: paperData.language,
      sectionsCount: paperData.sections?.length || 0,
      questionsCount: this.getTotalQuestions(paperData.sections),
      subject: paperData.metadata?.subject
    });
  }

  trackQuestionAdded(questionData) {
    this.track('question_added', {
      type: questionData.type,
      template: questionData.template,
      marks: questionData.marks,
      language: questionData.language
    });
  }

  trackTemplateUsed(templateId, templateData) {
    this.track('template_used', {
      templateId,
      category: templateData.category,
      difficulty: templateData.difficulty
    });
  }

  trackExport(format, options = {}) {
    this.track('paper_exported', {
      format,
      includeAnswers: options.includeAnswers,
      customBranding: options.customBranding
    });
  }

  trackCollaboration(action, details = {}) {
    this.track('collaboration', { action, ...details });
  }

  // Mobile-specific tracking
  trackMobileGesture(gesture, context = {}) {
    this.track('mobile_gesture', { gesture, ...context });
  }

  trackOfflineUsage(action, duration = 0) {
    this.track('offline_usage', { action, duration });
  }

  trackPWAInstall(method) {
    this.track('pwa_install', { method });
  }

  // Session analytics
  getSessionDuration() {
    return Date.now() - this.sessionStart;
  }

  getSessionStats() {
    const events = this.events.filter(e => e.properties.sessionId === this.sessionId);
    return {
      duration: this.getSessionDuration(),
      eventCount: events.length,
      uniqueActions: [...new Set(events.map(e => e.name))].length,
      pageViews: events.filter(e => e.name === 'page_view').length
    };
  }

  // Helper methods
  getTotalQuestions(sections) {
    return sections?.reduce((total, section) => 
      total + (section.subQuestions?.length || 0), 0) || 0;
  }

  saveToStorage() {
    try {
      const recentEvents = this.events.slice(-100); // Keep last 100 events
      localStorage.setItem('qmaker-analytics', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to save analytics to storage:', error);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('qmaker-analytics');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load analytics from storage:', error);
    }
  }

  sendEvent(event) {
    // Simulate sending to analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event.name, event.properties);
    }
    
    // In production, send to actual analytics service
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // });
  }

  // Generate insights
  generateInsights() {
    const insights = {
      mostUsedFeatures: this.getMostUsedFeatures(),
      averageSessionDuration: this.getAverageSessionDuration(),
      popularTemplates: this.getPopularTemplates(),
      languagePreferences: this.getLanguagePreferences(),
      deviceUsage: this.getDeviceUsage()
    };

    return insights;
  }

  getMostUsedFeatures() {
    const featureEvents = this.events.filter(e => e.name === 'feature_usage');
    const featureCounts = {};
    
    featureEvents.forEach(event => {
      const feature = event.properties.feature;
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });

    return Object.entries(featureCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }

  getAverageSessionDuration() {
    const sessions = [...new Set(this.events.map(e => e.properties.sessionId))];
    const durations = sessions.map(sessionId => {
      const sessionEvents = this.events.filter(e => e.properties.sessionId === sessionId);
      if (sessionEvents.length < 2) return 0;
      
      const start = Math.min(...sessionEvents.map(e => e.properties.timestamp));
      const end = Math.max(...sessionEvents.map(e => e.properties.timestamp));
      return end - start;
    });

    return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  }

  getPopularTemplates() {
    const templateEvents = this.events.filter(e => e.name === 'template_used');
    const templateCounts = {};
    
    templateEvents.forEach(event => {
      const template = event.properties.templateId;
      templateCounts[template] = (templateCounts[template] || 0) + 1;
    });

    return Object.entries(templateCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  }

  getLanguagePreferences() {
    const paperEvents = this.events.filter(e => e.name === 'paper_created');
    const langCounts = {};
    
    paperEvents.forEach(event => {
      const lang = event.properties.language;
      langCounts[lang] = (langCounts[lang] || 0) + 1;
    });

    return langCounts;
  }

  getDeviceUsage() {
    const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    return {
      mobile: isMobile,
      desktop: !isMobile,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };
  }
}

export default new Analytics();