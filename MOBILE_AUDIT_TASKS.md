# Mobile UI/UX Audit & Fix Tasks

## 🔍 Current Issues Identified

### 1. **Layout & Spacing Issues**
- [ ] **Layout.js**: Remove horizontal padding on mobile (`sm:px-6 lg:px-8` should be `px-0 sm:px-6 lg:px-8`)
- [ ] **SectionEditor.js**: Reduce section tab padding on mobile (currently `px-4 py-3` needs mobile-specific sizing)
- [ ] **SubQuestionEditor.js**: Excessive padding on mobile (`p-4 sm:p-6` could be `p-2 sm:p-4 md:p-6`)

### 2. **Section Navigation Issues**
- [ ] **SectionEditor.js**: Section tabs overflow horizontally with poor scrolling UX
- [ ] **SectionEditor.js**: "Add Section" button gets cut off on small screens
- [ ] **SectionEditor.js**: Delete icon in section tabs too small for touch targets (needs min 44px)

### 3. **SubQuestion Editor Issues**
- [ ] **SubQuestionEditor.js**: Toolbar buttons too small for mobile (currently 44px, good)
- [ ] **SubQuestionEditor.js**: Toolbar scrolls horizontally but lacks visual indicators
- [ ] **SubQuestionEditor.js**: Question label circle and marks input layout breaks on very small screens
- [ ] **SubQuestionEditor.js**: Delete button needs better mobile touch target
- [ ] **SubQuestionEditor.js**: Rich text editor min-height too small on mobile

### 4. **Header Issues** ✅ (Already Fixed)
- [x] Header padding reduced for mobile
- [x] Page info icon added with proper contrast

### 5. **Modal & Overlay Issues**
- [ ] **HamburgerMenu.js**: Menu width (w-80) too wide on small screens
- [ ] **SubQuestionEditor.js**: Table modal not responsive
- [ ] **HamburgerMenu.js**: Paper info modal needs better mobile layout

### 6. **Typography & Readability**
- [ ] **SubQuestionEditor.js**: Font sizes need mobile optimization
- [ ] **SectionEditor.js**: Section titles truncate poorly on mobile
- [ ] **SubQuestionEditor.js**: Placeholder text too long for mobile inputs

### 7. **Touch & Interaction Issues**
- [ ] **SectionEditor.js**: Drag handles not optimized for touch
- [ ] **SubQuestionEditor.js**: Editor focus states need improvement for mobile
- [ ] **SubQuestionEditor.js**: Save status indicators too small

## 🛠️ Priority Fix Tasks

### **HIGH PRIORITY** (Critical UX Issues)

#### Task 1: Fix Layout Container Padding
```javascript
// Layout.js - Remove horizontal padding on mobile
<div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
```

#### Task 2: Optimize Section Navigation for Mobile
```javascript
// SectionEditor.js - Improve section tabs
- Add better horizontal scroll indicators
- Reduce padding: px-2 py-2 sm:px-4 sm:py-3
- Make "Add Section" button sticky/always visible
- Improve delete button touch target
```

#### Task 3: Optimize SubQuestion Editor Mobile Layout
```javascript
// SubQuestionEditor.js - Mobile-first improvements
- Reduce padding: p-2 sm:p-4 md:p-6
- Stack question label and marks vertically on mobile
- Improve toolbar scroll UX with indicators
- Increase editor min-height on mobile
```

#### Task 4: Fix Modal Responsiveness
```javascript
// HamburgerMenu.js - Responsive menu
- Change w-80 to w-full max-w-sm
- Improve paper info modal layout for mobile
// SubQuestionEditor.js - Responsive table modal
- Make table modal full-width on mobile
```

### **MEDIUM PRIORITY** (UX Improvements)

#### Task 5: Improve Touch Targets
- Ensure all interactive elements are minimum 44px
- Add proper touch feedback animations
- Improve focus states for keyboard navigation

#### Task 6: Optimize Typography
- Reduce font sizes appropriately for mobile
- Improve text truncation strategies
- Optimize placeholder text length

#### Task 7: Enhance Visual Feedback
- Add loading states for mobile interactions
- Improve save status visibility
- Add haptic feedback simulation

### **LOW PRIORITY** (Polish & Accessibility)

#### Task 8: Accessibility Improvements
- Improve ARIA labels for mobile screen readers
- Add skip links for mobile navigation
- Ensure proper focus management

#### Task 9: Performance Optimizations
- Lazy load heavy components on mobile
- Optimize re-renders for mobile performance
- Add mobile-specific optimizations

## 📱 Mobile-Specific Design Patterns to Implement

1. **Bottom Sheet Pattern**: For modals on mobile
2. **Sticky Actions**: Keep important buttons accessible
3. **Swipe Gestures**: For section navigation
4. **Collapsible Sections**: To save screen space
5. **Mobile-First Toolbar**: Prioritize most-used tools

## 🧪 Testing Checklist

- [ ] Test on iPhone SE (375px width)
- [ ] Test on standard mobile (390px width)
- [ ] Test on tablet (768px width)
- [ ] Test touch interactions
- [ ] Test keyboard navigation
- [ ] Test with different content lengths
- [ ] Test in both portrait and landscape

## 📊 Success Metrics

- All touch targets ≥ 44px
- No horizontal scrolling except where intended
- Modals fit within viewport
- Text remains readable at all sizes
- All functionality accessible on mobile
- Smooth 60fps interactions