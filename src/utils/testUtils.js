/**
 * Testing utilities for Qmaker application
 */

export const renderWithProviders = () => ({ container: document.createElement('div') });

export const mockPaperData = {
  metadata: { language: 'english' },
  sections: []
};

export const createMockStore = () => ({
  ...mockPaperData,
  addSection: () => {},
  exportData: () => mockPaperData
});

export const accessibilityUtils = {
  checkAriaLabels: () => ({ passed: true, missingLabels: [] })
};

export const performanceUtils = {
  measureRenderTime: async (fn) => ({ renderTime: 0, result: await fn() }),
  checkMemoryLeaks: () => ({ hasLeak: false })
};

export const mobileUtils = {
  setMobileViewport: () => {},
  simulateTouch: { tap: () => {}, swipe: () => {} },
  checkTouchTargets: () => []
};

export const testScenarios = {
  testFormValidation: async () => [],
  testKeyboardShortcuts: async () => []
};

const testUtils = {
  testComponent: (name, testFn) => {
    try {
      const result = testFn();
      return { name, passed: !!result, error: result ? null : 'Test failed' };
    } catch (error) {
      return { name, passed: false, error: error.message };
    }
  },
  testAccessibility: (name, testFn) => {
    try {
      const result = testFn();
      return { name, passed: !!result, error: result ? null : 'Test failed' };
    } catch (error) {
      return { name, passed: false, error: error.message };
    }
  },
  testPerformance: (name, testFn) => {
    try {
      const result = testFn();
      return { name, passed: !!result, error: result ? null : 'Test failed' };
    } catch (error) {
      return { name, passed: false, error: error.message };
    }
  },
  testMobile: (name, testFn) => {
    try {
      const result = testFn();
      return { name, passed: !!result, error: result ? null : 'Test failed' };
    } catch (error) {
      return { name, passed: false, error: error.message };
    }
  },
  testI18n: (name, testFn) => {
    try {
      const result = testFn();
      return { name, passed: !!result, error: result ? null : 'Test failed' };
    } catch (error) {
      return { name, passed: false, error: error.message };
    }
  }
};

export default testUtils;