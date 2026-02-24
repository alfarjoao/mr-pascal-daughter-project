# 🧪 Testing Checklist

## ✅ Desktop Browsers

### Chrome (Latest)
- [ ] Home page loads correctly
- [ ] Calculator form (3 steps)
- [ ] Scenario selection works
- [ ] Form validation (red borders on invalid)
- [ ] Charts display (bar, pie, line, table)
- [ ] PDF download works
- [ ] Mobile menu (resize to <768px)
- [ ] Smooth scroll navigation
- [ ] FAQ accordion expands
- [ ] Console: no errors

### Firefox (Latest)
- [ ] All above tests
- [ ] PDF generation (Firefox specific)
- [ ] SVG icons render correctly

### Safari (macOS)
- [ ] All above tests
- [ ] CSS variables support
- [ ] Smooth animations

### Edge (Latest)
- [ ] All above tests
- [ ] Chart.js compatibility

---

## 📱 Mobile Devices

### iOS Safari (iPhone)
- [ ] Page loads fast
- [ ] Touch interactions smooth
- [ ] Mobile menu hamburger works
- [ ] Form inputs accessible (no zoom)
- [ ] Calculator form navigation
- [ ] Charts responsive
- [ ] PDF download triggers
- [ ] Orientation change (portrait/landscape)

### Android Chrome (Latest)
- [ ] All above tests
- [ ] Back button behavior correct

---

## 🔢 Edge Cases & Validation

### Input Validation
- [ ] Building Area = 1 → error "must be between 50-100,000"
- [ ] Building Area = 200,000 → error
- [ ] Lifespan = 5 → error "must be between 10-100"
- [ ] Lifespan = 150 → error
- [ ] Embodied Energy = 10 → error "must be between 50-5,000"
- [ ] Operational Energy = 1000 → error "must be between 10-500"
- [ ] Empty required field → red border + error message
- [ ] Valid input → green border + checkmark

### Extreme Values (Valid Range)
- [ ] Area = 50 m² (minimum)
- [ ] Area = 100,000 m² (maximum)
- [ ] Lifespan = 10 years (minimum)
- [ ] Lifespan = 100 years (maximum)
- [ ] All scenarios calculate correctly

### Calculation Logic
- [ ] Light Renovation: lower carbon than New Build
- [ ] Deep Renovation: moderate carbon
- [ ] New Build: highest embodied carbon
- [ ] Savings calculation correct (absolute + %)
- [ ] Decision badge shows correct choice
- [ ] Numbers animate smoothly

---

## 📊 Charts & Visualizations

### Bar Chart (Comparison)
- [ ] Two bars visible (Renovation, New Build)
- [ ] Legend shows Embodied vs Operational
- [ ] Hover tooltips work
- [ ] Colors: green (renovation), red (new build)

### Pie Chart (Breakdown)
- [ ] Two slices (Embodied, Operational)
- [ ] Percentages shown
- [ ] Legend visible

### Line Chart (Timeline)
- [ ] Two lines (Renovation, New Build)
- [ ] X-axis: years (0 to lifespan)
- [ ] Y-axis: cumulative carbon
- [ ] Hover shows values

### Comparison Table
- [ ] Three columns (Light, Deep, New Build)
- [ ] All metrics populated
- [ ] Best value highlighted green

### Tab Switching
- [ ] "Comparison" tab active by default
- [ ] Clicking tabs switches charts
- [ ] Active tab has green underline

---

## 📄 PDF Export

### PDF Generation
- [ ] Click "Download PDF" → file downloads
- [ ] Filename: `SustainaBuild_Report_DD-MM-YYYY.pdf`
- [ ] PDF opens correctly
- [ ] Page 1: Header, decision, carbon values, bar + pie chart
- [ ] Page 2: Line chart (timeline)
- [ ] Page 3: Comparison table (all scenarios)
- [ ] Footer on every page with page numbers
- [ ] All text readable (not white on white)
- [ ] Charts clear (not pixelated)

---

## 🎨 UI/UX

### Navigation
- [ ] Desktop menu visible >768px
- [ ] Mobile menu hidden >768px
- [ ] Hamburger icon visible <768px
- [ ] Menu opens with animation
- [ ] Overlay darkens background
- [ ] Close (X) button works
- [ ] Click outside menu → closes
- [ ] ESC key → closes menu
- [ ] Links scroll smoothly to sections

### Forms
- [ ] Scenario cards: hover effect
- [ ] Selected scenario: green border + checkmark
- [ ] "Next" button disabled until scenario selected
- [ ] "Back" button appears on step 2+
- [ ] Step transitions smooth (fade)
- [ ] "Calculate Results" shows spinner

### Animations
- [ ] Numbers count up smoothly
- [ ] Results section fades in
- [ ] Scroll to results smooth
- [ ] FAQ accordion expands/collapses
- [ ] Hover effects on cards

---

## ♿ Accessibility (A11y)

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus visible (blue outline)
- [ ] Enter key activates buttons
- [ ] ESC closes mobile menu
- [ ] Arrow keys navigate scenario cards

### Screen Reader
- [ ] Page title reads correctly
- [ ] Form labels associated with inputs
- [ ] Error messages announced
- [ ] ARIA labels on icons
- [ ] Alt text on images/graphics

### Color Contrast
- [ ] Text on backgrounds: WCAG AA minimum
- [ ] Links distinguishable
- [ ] Error messages readable

---

## 🐛 Console Errors

### Check Browser Console (F12)
- [ ] No JavaScript errors
- [ ] No 404 errors (missing files)
- [ ] No CORS errors
- [ ] Chart.js loads successfully
- [ ] jsPDF loads successfully
- [ ] html2canvas loads successfully

---

## 🌐 Cross-Section Testing

### Navigation Flow
- [ ] Home → Calculator → Results → FAQ → About → Footer
- [ ] All anchor links work (#calculator, #faq, etc.)
- [ ] Smooth scroll on all links

### Data Persistence
- [ ] Form data retained when clicking "Back"
- [ ] Scenario selection remembered

---

## 📈 Performance

### Load Times
- [ ] Initial page load <3s (desktop)
- [ ] Initial page load <5s (mobile 3G)
- [ ] Charts render <1s after calculation
- [ ] PDF generation <3s

### Lighthouse Audit (Chrome DevTools)
- [ ] Performance: >80
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >90

---

## ✅ Final Checks

- [ ] All links work (no 404s)
- [ ] Email link opens mail client
- [ ] GitHub link opens repo
- [ ] Vercel URL correct in footer
- [ ] Copyright year correct (2026)
- [ ] No Lorem Ipsum text
- [ ] No TODO comments in code
- [ ] Favicon shows in browser tab
- [ ] OG image shows when shared on social media

---

## 📝 Test Report Template

**Date:** ___________  
**Tester:** ___________  
**Browser/Device:** ___________

**Issues Found:**
1. 
2. 
3. 

**Critical Bugs:** ___________  
**Minor Issues:** ___________  
**Overall Status:** ✅ Pass / ⚠️ Needs fixes / ❌ Fail

---

## 🚀 Sign-Off

When all boxes are checked:
- [ ] Ready for production deployment
- [ ] Ready for thesis defense demo
- [ ] Approved by advisor (if applicable)

**Approved by:** ___________  
**Date:** ___________
