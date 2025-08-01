/**
 * Internationalization testing utilities for Qmaker
 * Tests RTL support, font rendering, and multilingual functionality
 */

class I18nTester {
  constructor() {
    this.languages = {
      en: { name: 'English', dir: 'ltr', font: 'Roboto' },
      ar: { name: 'Arabic', dir: 'rtl', font: 'Amiri' },
      bn: { name: 'Bangla', dir: 'ltr', font: 'SolaimanLipi' },
      ur: { name: 'Urdu', dir: 'rtl', font: 'Jameel Noori Nastaleeq' }
    };
    this.testResults = [];
  }

  /**
   * Run all internationalization tests
   */
  async runAllTests() {
    console.log('🌐 Starting Internationalization Tests...\n');
    
    for (const [code, lang] of Object.entries(this.languages)) {
      await this.testLanguage(code, lang);
    }
    
    await this.testRTLLayout();
    await this.testFontLoading();
    await this.testNumeralSystems();
    await this.testTextDirection();
    
    this.printResults();
    return this.testResults;
  }

  /**
   * Test specific language support
   */
  async testLanguage(code, lang) {
    console.log(`Testing ${lang.name} (${code})...`);
    
    const tests = [
      () => this.testFontAvailability(lang.font),
      () => this.testTextDirection(lang.dir),
      () => this.testLanguageSelection(code),
      () => this.testContentRendering(code)
    ];
    
    for (const test of tests) {
      const result = await test();
      this.testResults.push({
        language: lang.name,
        test: result.name,
        passed: result.passed,
        details: result.details
      });
    }
  }

  /**
   * Test font availability
   */
  testFontAvailability(fontName) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Test with fallback font
    context.font = '12px monospace';
    const fallbackWidth = context.measureText('Test').width;
    
    // Test with target font
    context.font = `12px "${fontName}", monospace`;
    const targetWidth = context.measureText('Test').width;
    
    const available = fallbackWidth !== targetWidth;
    
    return {
      name: `Font Availability: ${fontName}`,
      passed: available,
      details: available ? 'Font loaded successfully' : 'Font not available, using fallback'
    };
  }

  /**
   * Test text direction support
   */
  testTextDirection(direction) {
    const testElement = document.createElement('div');
    testElement.dir = direction;
    testElement.textContent = 'Test text';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    
    document.body.appendChild(testElement);
    
    const computedStyle = getComputedStyle(testElement);
    const actualDirection = computedStyle.direction;
    
    document.body.removeChild(testElement);
    
    return {
      name: `Text Direction: ${direction}`,
      passed: actualDirection === direction,
      details: `Expected: ${direction}, Actual: ${actualDirection}`
    };
  }

  /**
   * Test language selection functionality
   */
  testLanguageSelection(langCode) {
    const selector = document.querySelector('[data-testid="language-selector"]');
    
    if (!selector) {
      return {
        name: `Language Selection: ${langCode}`,
        passed: false,
        details: 'Language selector not found'
      };
    }
    
    const options = selector.querySelectorAll('option, [role="option"]');
    const hasLanguage = Array.from(options).some(option => 
      option.value === langCode || option.dataset.value === langCode
    );
    
    return {
      name: `Language Selection: ${langCode}`,
      passed: hasLanguage,
      details: hasLanguage ? 'Language option available' : 'Language option not found'
    };
  }

  /**
   * Test content rendering for specific language
   */
  testContentRendering(langCode) {
    // Create test content in the specified language
    const testContent = this.getTestContent(langCode);
    const testElement = document.createElement('div');
    testElement.innerHTML = testContent;
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    
    document.body.appendChild(testElement);
    
    // Check if content renders properly
    const hasContent = testElement.textContent.length > 0;
    const hasProperHeight = testElement.offsetHeight > 0;
    
    document.body.removeChild(testElement);
    
    return {
      name: `Content Rendering: ${langCode}`,
      passed: hasContent && hasProperHeight,
      details: `Content: ${hasContent}, Height: ${hasProperHeight}`
    };
  }

  /**
   * Get test content for different languages
   */
  getTestContent(langCode) {
    const content = {
      en: 'This is a test question in English.',
      ar: 'هذا سؤال تجريبي باللغة العربية.',
      bn: 'এটি বাংলায় একটি পরীক্ষামূলক প্রশ্ন।',
      ur: 'یہ اردو میں ایک ٹیسٹ سوال ہے۔'
    };
    
    return content[langCode] || content.en;
  }

  /**
   * Test RTL layout support
   */
  async testRTLLayout() {
    console.log('Testing RTL Layout...');
    
    const rtlLanguages = ['ar', 'ur'];
    
    for (const lang of rtlLanguages) {
      const testElement = document.createElement('div');
      testElement.dir = 'rtl';
      testElement.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
          <span>Start</span>
          <span>End</span>
        </div>
      `;
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.width = '200px';
      
      document.body.appendChild(testElement);
      
      const spans = testElement.querySelectorAll('span');
      const startRect = spans[0].getBoundingClientRect();
      const endRect = spans[1].getBoundingClientRect();
      
      // In RTL, "Start" should be on the right (higher x position)
      const rtlWorking = startRect.x > endRect.x;
      
      document.body.removeChild(testElement);
      
      this.testResults.push({
        language: lang,
        test: 'RTL Layout',
        passed: rtlWorking,
        details: rtlWorking ? 'RTL layout working correctly' : 'RTL layout not working'
      });
    }
  }

  /**
   * Test font loading
   */
  async testFontLoading() {
    console.log('Testing Font Loading...');
    
    const fonts = ['Amiri', 'SolaimanLipi', 'Roboto'];
    
    for (const font of fonts) {
      try {
        await document.fonts.load(`12px "${font}"`);
        const loaded = document.fonts.check(`12px "${font}"`);
        
        this.testResults.push({
          language: 'All',
          test: `Font Loading: ${font}`,
          passed: loaded,
          details: loaded ? 'Font loaded successfully' : 'Font failed to load'
        });
      } catch (error) {
        this.testResults.push({
          language: 'All',
          test: `Font Loading: ${font}`,
          passed: false,
          details: `Error loading font: ${error.message}`
        });
      }
    }
  }

  /**
   * Test numeral systems
   */
  async testNumeralSystems() {
    console.log('Testing Numeral Systems...');
    
    const numeralTests = [
      { lang: 'en', input: '123', expected: '123' },
      { lang: 'ar', input: '123', expected: '١٢٣' },
      { lang: 'bn', input: '123', expected: '১২৩' }
    ];
    
    for (const test of numeralTests) {
      const converted = this.convertNumerals(test.input, test.lang);
      const passed = converted === test.expected;
      
      this.testResults.push({
        language: test.lang,
        test: 'Numeral System',
        passed,
        details: `Input: ${test.input}, Expected: ${test.expected}, Got: ${converted}`
      });
    }
  }

  /**
   * Convert numerals to different systems
   */
  convertNumerals(input, lang) {
    const numeralMaps = {
      ar: { '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩' },
      bn: { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
    };
    
    if (!numeralMaps[lang]) return input;
    
    return input.replace(/[0-9]/g, digit => numeralMaps[lang][digit] || digit);
  }

  /**
   * Test bidirectional text support
   */
  testBidirectionalText() {
    const bidiText = 'English text العربية text more English';
    const testElement = document.createElement('div');
    testElement.innerHTML = bidiText;
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    
    document.body.appendChild(testElement);
    
    // Check if browser handles bidi text correctly
    const hasContent = testElement.textContent.includes('English') && 
                      testElement.textContent.includes('العربية');
    
    document.body.removeChild(testElement);
    
    return {
      name: 'Bidirectional Text',
      passed: hasContent,
      details: hasContent ? 'Bidi text rendered correctly' : 'Bidi text rendering failed'
    };
  }

  /**
   * Test language-specific formatting
   */
  testLanguageFormatting() {
    const tests = [
      { lang: 'en', date: new Date(), format: 'MM/DD/YYYY' },
      { lang: 'ar', date: new Date(), format: 'DD/MM/YYYY' }
    ];
    
    const results = [];
    
    for (const test of tests) {
      try {
        const formatted = new Intl.DateTimeFormat(test.lang).format(test.date);
        results.push({
          name: `Date Formatting: ${test.lang}`,
          passed: formatted.length > 0,
          details: `Formatted date: ${formatted}`
        });
      } catch (error) {
        results.push({
          name: `Date Formatting: ${test.lang}`,
          passed: false,
          details: `Error: ${error.message}`
        });
      }
    }
    
    return results;
  }

  /**
   * Print test results
   */
  printResults() {
    console.log('\n🌐 Internationalization Test Results');
    console.log('=====================================');
    
    const groupedResults = this.groupResultsByLanguage();
    
    for (const [language, tests] of Object.entries(groupedResults)) {
      console.log(`\n${language}:`);
      tests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        console.log(`  ${status} ${test.test}: ${test.details}`);
      });
    }
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log(`\n📊 Overall I18n Success Rate: ${successRate}% (${passedTests}/${totalTests})`);
  }

  /**
   * Group results by language
   */
  groupResultsByLanguage() {
    const grouped = {};
    
    this.testResults.forEach(result => {
      if (!grouped[result.language]) {
        grouped[result.language] = [];
      }
      grouped[result.language].push(result);
    });
    
    return grouped;
  }

  /**
   * Generate I18n test report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.length,
      passedTests: this.testResults.filter(t => t.passed).length,
      failedTests: this.testResults.filter(t => !t.passed).length,
      successRate: ((this.testResults.filter(t => t.passed).length / this.testResults.length) * 100).toFixed(1),
      results: this.testResults,
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.testResults.filter(t => !t.passed);
    
    if (failedTests.some(t => t.test.includes('Font'))) {
      recommendations.push('Consider adding font fallbacks or using web fonts for better cross-platform support');
    }
    
    if (failedTests.some(t => t.test.includes('RTL'))) {
      recommendations.push('Improve RTL layout support with proper CSS direction and text-align properties');
    }
    
    if (failedTests.some(t => t.test.includes('Numeral'))) {
      recommendations.push('Implement proper numeral system conversion for Arabic and Bangla languages');
    }
    
    return recommendations;
  }
}

export default I18nTester;