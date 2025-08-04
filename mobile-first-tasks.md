# Qmaker Mobile-First Development Tasks

**Created:** January 4, 2025  
**Focus:** Core features, clean code, mobile UX consistency

---

## 🎯 **Core Feature Priority**

### **Essential Features Only:**
1. **Question Creation** - Add/edit/delete sub-questions
2. **Section Management** - Organize questions into sections
3. **Rich Text Editing** - Basic formatting (bold, italic, underline)
4. **Preview & Export** - View and download question papers
5. **Multi-language Support** - Arabic, Bangla, Urdu, English

### **Remove/Simplify:**
- Complex animations and transitions
- Advanced export options
- Unused components and features
- Redundant UI elements

---

## 📱 **Mobile-First Task List**

### **Phase 1: Code Cleanup & Core Stability (Week 1)**

#### **Task 1.1: Remove Unused Code**
- [ ] Delete unused imports in all components
- [ ] Remove commented-out code blocks
- [ ] Clean up unused CSS classes
- [ ] Remove redundant state variables
- [ ] Simplify complex conditional rendering

**Files to clean:**
```
src/components/Header.js
src/components/SubQuestionEditor.js
src/components/FloatingToolbar.js
src/components/SectionEditor.js
```

#### **Task 1.2: Consolidate Styling**
- [ ] Create single mobile-first CSS file
- [ ] Remove duplicate styles
- [ ] Standardize spacing (8px, 16px, 24px, 32px)
- [ ] Unify color variables
- [ ] Simplify responsive breakpoints

**Target:** One consistent style system

#### **Task 1.3: Optimize Component Structure**
- [ ] Merge similar components
- [ ] Remove wrapper divs where possible
- [ ] Simplify prop passing
- [ ] Reduce component nesting depth
- [ ] Standardize event handlers

---

### **Phase 2: Mobile UI Consistency (Week 2)**

#### **Task 2.1: Touch-First Interface**
- [ ] **Minimum touch targets:** 44px × 44px for all buttons
- [ ] **Finger-friendly spacing:** 16px minimum between interactive elements
- [ ] **Swipe gestures:** Left/right between sections
- [ ] **Pull-to-refresh:** Reload data
- [ ] **Long-press actions:** Context menus

#### **Task 2.2: Mobile Navigation**
- [ ] **Bottom tab bar:** Primary navigation
- [ ] **Sticky toolbar:** Always accessible formatting
- [ ] **Breadcrumb trail:** Show current location
- [ ] **Back button behavior:** Consistent navigation
- [ ] **Keyboard shortcuts:** Hide on mobile

#### **Task 2.3: Mobile Typography**
- [ ] **Base font size:** 16px (prevents zoom on iOS)
- [ ] **Line height:** 1.5 for readability
- [ ] **Font weights:** 400 (normal), 600 (semibold) only
- [ ] **Text contrast:** WCAG AA compliance
- [ ] **RTL support:** Proper Arabic/Urdu layout

---

### **Phase 3: Core Feature Optimization (Week 3)**

#### **Task 3.1: Question Editor Mobile UX**
- [ ] **Single-column layout:** Stack elements vertically
- [ ] **Auto-expanding textarea:** Grows with content
- [ ] **Floating toolbar:** Above keyboard
- [ ] **Quick actions:** Swipe to delete/duplicate
- [ ] **Visual feedback:** Loading states, success animations

#### **Task 3.2: Section Management**
- [ ] **Horizontal scroll tabs:** Easy section switching
- [ ] **Drag indicators:** Clear visual cues
- [ ] **Add section button:** Always visible
- [ ] **Section preview:** Quick content overview
- [ ] **Bulk actions:** Select multiple questions

#### **Task 3.3: Preview & Export**
- [ ] **Mobile preview:** Optimized for small screens
- [ ] **Share options:** Native mobile sharing
- [ ] **Download progress:** Visual feedback
- [ ] **Offline support:** Cache generated PDFs
- [ ] **Print preview:** Mobile-friendly layout

---

### **Phase 4: Lighthouse Performance Optimization (Week 4)**

#### **Task 4.1: Core Web Vitals Optimization**
- [ ] **LCP Optimization:**
  - Preload critical fonts (Amiri, SolaimanLipi)
  - Optimize hero section rendering
  - Remove render-blocking resources
  - Use resource hints (preconnect, dns-prefetch)

- [ ] **FID Optimization:**
  - Code splitting for non-critical JavaScript
  - Defer non-essential scripts
  - Optimize event handlers
  - Reduce main thread blocking time

- [ ] **CLS Optimization:**
  - Set explicit dimensions for dynamic content
  - Reserve space for floating toolbar
  - Avoid layout shifts in rich text editor
  - Optimize font loading (font-display: swap)

#### **Task 4.2: Lighthouse Performance Audit**
- [ ] **Bundle Analysis:**
  - Remove unused dependencies
  - Tree shake unused code
  - Optimize TipTap extensions
  - Minimize React Beautiful DnD impact

- [ ] **Resource Optimization:**
  - Compress and optimize all assets
  - Implement lazy loading for sections
  - Use WebP images where supported
  - Minify CSS and JavaScript

- [ ] **Network Optimization:**
  - Enable gzip/brotli compression
  - Implement service worker caching
  - Use CDN for static assets
  - Optimize API calls and reduce requests

#### **Task 4.3: Lighthouse Accessibility & SEO**
- [ ] **Accessibility Optimization:**
  - ARIA labels for all interactive elements
  - Proper heading hierarchy (h1 → h2 → h3)
  - Color contrast ratio > 4.5:1
  - Keyboard navigation support
  - Screen reader compatibility

- [ ] **SEO Optimization:**
  - Meta descriptions and titles
  - Structured data markup
  - Open Graph tags
  - Canonical URLs
  - XML sitemap

- [ ] **PWA Features:**
  - Web app manifest
  - Service worker for offline support
  - Install prompt
  - Splash screen
  - Theme color optimization

#### **Task 4.4: Performance Monitoring**
- [ ] **Lighthouse CI Integration:**
  - Automated Lighthouse audits on build
  - Performance regression detection
  - Budget alerts for bundle size
  - Core Web Vitals monitoring

- [ ] **Real User Monitoring:**
  - Web Vitals library integration
  - Performance analytics
  - Error tracking
  - User experience metrics

---

## 🎨 **Mobile Design System**

### **Color Palette (Mobile Optimized)**
```css
:root {
  /* High contrast for mobile screens */
  --primary: #09302f;      /* Dark green - main actions */
  --primary-light: #4ade80; /* Light green - secondary */
  --accent: #3b82f6;       /* Blue - interactive elements */
  --text-primary: #111827;  /* Dark text - high contrast */
  --text-secondary: #6b7280; /* Gray text - secondary info */
  --background: #ffffff;    /* White background */
  --surface: #f9fafb;      /* Light gray - cards/sections */
  --border: #e5e7eb;       /* Light border */
  --error: #ef4444;        /* Red - errors */
  --success: #10b981;      /* Green - success */
}
```

### **Mobile Typography Scale**
```css
/* Mobile-first typography */
.text-xs { font-size: 12px; }    /* Captions */
.text-sm { font-size: 14px; }    /* Secondary text */
.text-base { font-size: 16px; }  /* Body text (prevents zoom) */
.text-lg { font-size: 18px; }    /* Subheadings */
.text-xl { font-size: 20px; }    /* Section titles */
.text-2xl { font-size: 24px; }   /* Page titles */
```

### **Mobile Spacing System**
```css
/* Consistent spacing for mobile */
.space-2 { margin: 8px; }   /* Tight spacing */
.space-4 { margin: 16px; }  /* Standard spacing */
.space-6 { margin: 24px; }  /* Loose spacing */
.space-8 { margin: 32px; }  /* Section spacing */
```

---

## 📋 **Implementation Checklist**

### **Week 1: Foundation**
- [ ] Remove all unused imports and code
- [ ] Create unified mobile.css file
- [ ] Implement consistent spacing system
- [ ] Fix all ESLint warnings
- [ ] Test on actual mobile devices

### **Week 2: Mobile UX**
- [ ] Implement 44px minimum touch targets
- [ ] Add bottom navigation bar
- [ ] Fix keyboard toolbar positioning
- [ ] Add swipe gestures for sections
- [ ] Test with one-handed usage

### **Week 3: Core Features**
- [ ] Optimize question editor for mobile
- [ ] Improve section management UX
- [ ] Mobile-friendly preview mode
- [ ] Native mobile sharing
- [ ] Offline functionality

### **Week 4: Lighthouse Performance**
- [ ] Achieve Lighthouse Performance Score > 90
- [ ] Optimize Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Implement PWA features
- [ ] Set up Lighthouse CI monitoring
- [ ] Test on low-end devices with Lighthouse mobile audit

---

## 🧪 **Mobile Testing Strategy**

### **Device Testing**
- [ ] **iPhone SE** (small screen)
- [ ] **iPhone 12/13** (standard)
- [ ] **Android mid-range** (Samsung Galaxy A series)
- [ ] **Android budget** (low-end device)
- [ ] **Tablet** (iPad/Android tablet)

### **Browser Testing**
- [ ] **Safari iOS** (primary mobile browser)
- [ ] **Chrome Android** (primary Android browser)
- [ ] **Samsung Internet** (Samsung devices)
- [ ] **Firefox Mobile** (alternative browser)

### **Network Testing**
- [ ] **3G connection** (slow network)
- [ ] **WiFi** (fast connection)
- [ ] **Offline mode** (no connection)
- [ ] **Poor signal** (intermittent connection)

---

## 🎯 **Success Metrics**

### **Lighthouse Performance Targets**
- [ ] **Performance Score:** > 90
- [ ] **Accessibility Score:** > 95
- [ ] **Best Practices Score:** > 90
- [ ] **SEO Score:** > 90
- [ ] **PWA Score:** > 80

### **Core Web Vitals (Lighthouse)**
- [ ] **First Contentful Paint (FCP):** < 1.8s
- [ ] **Largest Contentful Paint (LCP):** < 2.5s
- [ ] **First Input Delay (FID):** < 100ms
- [ ] **Cumulative Layout Shift (CLS):** < 0.1
- [ ] **Speed Index:** < 3.4s
- [ ] **Total Blocking Time (TBT):** < 200ms

### **UX Targets**
- [ ] **Touch target compliance:** 100% buttons ≥ 44px
- [ ] **Accessibility score:** > 95%
- [ ] **Mobile usability:** > 90%
- [ ] **Task completion rate:** > 95%
- [ ] **User satisfaction:** > 4.5/5

### **Lighthouse Technical Targets**
- [ ] **Performance Score:** > 90 (mobile & desktop)
- [ ] **Accessibility Score:** > 95
- [ ] **Best Practices Score:** > 90
- [ ] **SEO Score:** > 90
- [ ] **Bundle size:** < 400KB gzipped
- [ ] **Time to Interactive:** < 3.8s
- [ ] **ESLint warnings:** 0
- [ ] **Console errors:** 0 in production

---

## 🚀 **Deployment Strategy**

### **Staging Environment**
- [ ] **Mobile-first testing:** All features tested on mobile first
- [ ] **Performance monitoring:** Real device testing
- [ ] **User feedback:** Beta testing with actual teachers
- [ ] **A/B testing:** Compare mobile UX variations

### **Production Rollout**
- [ ] **Progressive deployment:** 10% → 50% → 100%
- [ ] **Error monitoring:** Real-time error tracking
- [ ] **Performance monitoring:** Core Web Vitals tracking
- [ ] **User analytics:** Mobile usage patterns
- [ ] **Feedback collection:** In-app feedback system

---

---

## 🚀 **Lighthouse Performance Implementation**

### **Critical Performance Optimizations**

#### **1. Font Loading Optimization**
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/Amiri-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/SolaimanLipi.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Roboto-Regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display swap for better LCP -->
<style>
@font-face {
  font-family: 'Amiri';
  src: url('/fonts/Amiri-Regular.woff2') format('woff2');
  font-display: swap;
}
</style>
```

#### **2. Code Splitting for Better FID**
```javascript
// Lazy load heavy components
const PreviewPanel = React.lazy(() => import('./PreviewPanel'));
const ExportModal = React.lazy(() => import('./ExportModal'));

// Wrap in Suspense with loading fallback
<Suspense fallback={<div className="loading-skeleton">Loading...</div>}>
  <PreviewPanel />
</Suspense>
```

#### **3. CLS Prevention**
```css
/* Reserve space for floating toolbar */
.main-content {
  padding-bottom: 60px; /* Toolbar height */
}

/* Prevent layout shift in editor */
.ProseMirror {
  min-height: 120px;
  contain: layout;
}

/* Skeleton loading to prevent CLS */
.loading-skeleton {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
```

#### **4. Bundle Optimization**
```javascript
// Tree shake TipTap extensions
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
// Only import needed extensions
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';

// Remove unused dependencies
// ❌ import { debounce } from 'lodash';
// ✅ const debounce = (fn, delay) => { /* custom implementation */ };
```

#### **5. Service Worker for PWA**
```javascript
// public/sw.js
const CACHE_NAME = 'qmaker-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/fonts/Amiri-Regular.woff2',
  '/fonts/SolaimanLipi.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

### **Lighthouse CI Configuration**
```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### **Web Vitals Monitoring**
```javascript
// src/utils/webVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

**Priority:** Lighthouse Performance Score > 90  
**Goal:** Fast, accessible, SEO-optimized question paper builder  
**Timeline:** 4 weeks to Lighthouse-optimized mobile app