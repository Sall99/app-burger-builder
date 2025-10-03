# Performance Optimization Guide

This document outlines the performance optimization strategies implemented in the Burger Builder application.

## Table of Contents

- [Overview](#overview)
- [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
- [Image Optimization](#image-optimization)
- [Bundle Optimization](#bundle-optimization)
- [Performance Monitoring](#performance-monitoring)
- [Font Optimization](#font-optimization)
- [Best Practices](#best-practices)

## Overview

The application implements several performance optimization strategies:

- **Dynamic Imports**: Heavy components loaded on-demand
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Modern formats (AVIF, WebP) with responsive sizes
- **Bundle Analysis**: Tools to identify and reduce bundle size
- **Performance Monitoring**: Web Vitals tracking and reporting
- **Font Optimization**: Using `next/font` for optimal font loading

---

## Code Splitting & Lazy Loading

### Dynamic Component Imports

Heavy components are loaded dynamically to reduce initial bundle size:

#### Modal Component

```tsx
import { ModalLazy } from '@/components/ui/modal/modal-lazy'

// Use instead of regular Modal
;<ModalLazy isOpen={isOpen} setIsOpen={setIsOpen} title="Title" content={<Content />} />
```

**Benefits**:

- Loaded only when needed
- Reduces initial bundle by ~50KB
- Shows loading spinner during load

#### Popover Component

```tsx
import PopoverLazy from '@/components/layout/popover-lazy'

// Used in Header component
{
    session ? <PopoverLazy /> : <NavLinks />
}
```

**Benefits**:

- Only loaded for authenticated users
- Includes Headless UI dependencies
- Reduces bundle for non-authenticated users

### Route-Based Code Splitting

Next.js automatically code-splits at the route level:

```
/auth/sign-in    → sign-in.js (separate chunk)
/profile         → profile.js (separate chunk)
/history         → history.js (separate chunk)
```

**Automatic Benefits**:

- Each route loads only required code
- Parallel chunk downloads
- Cached chunks reused across routes

---

## Image Optimization

### Next.js Image Component

All images use the optimized `next/image` component:

```tsx
import Image from 'next/image'

// Responsive with priority loading
<Image
    src="/images/logo.png"
    width={34}
    height={34}
    alt="logo"
    priority  // Load immediately
/>

// Lazy load with sizes
<Image
    src="/images/burger.png"
    fill
    sizes="(max-width: 640px) 100vw, 640px"
    alt="burger"
/>
```

### Configuration

**`next.config.js`:**

```javascript
images: {
    formats: ['image/avif', 'image/webp'],  // Modern formats
    minimumCacheTTL: 60,  // Cache images for 60 seconds
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
}
```

**Benefits**:

- Automatic format selection (AVIF → WebP → original)
- Responsive images for different devices
- Lazy loading by default
- Automatic caching

### Image Optimization Tips

1. **Use appropriate formats**:
    - AVIF: Best compression (60% smaller than JPEG)
    - WebP: Good compression with wide support
    - PNG: For transparency
    - SVG: For logos/icons

2. **Specify sizes**:

    ```tsx
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    ```

3. **Use priority for above-the-fold images**:

    ```tsx
    <Image src="hero.jpg" priority />
    ```

4. **Optimize source images**:
    - Use tools like ImageOptim, Squoosh
    - Target dimensions close to display size
    - Remove metadata

---

## Bundle Optimization

### Bundle Analyzer

Analyze bundle size and identify opportunities:

```bash
# Analyze entire bundle
npm run analyze

# Analyze server bundle only
npm run analyze:server

# Analyze browser bundle only
npm run analyze:browser
```

**Output**: Opens interactive treemap showing:

- Chunk sizes
- Module sizes
- Dependencies
- Duplicate code

### Package Optimization

**Configured in `next.config.js`:**

```javascript
experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'react-icons']
}
```

**Benefits**:

- Tree-shaking for icon libraries
- Only imports used icons
- Reduces bundle by ~200KB

### Build Optimization

```javascript
compress: true,  // Gzip compression
productionBrowserSourceMaps: false,  // Disable source maps in prod
```

### Bundle Size Goals

| Category      | Target  | Current |
| ------------- | ------- | ------- |
| First Load JS | < 150KB | TBD     |
| Route Chunks  | < 50KB  | TBD     |
| Shared Chunks | < 100KB | TBD     |

---

## Performance Monitoring

### Web Vitals Tracking

Automatic tracking of Core Web Vitals:

```tsx
// Configured in layout.tsx
import { WebVitals } from '@/app/web-vitals'

;<WebVitals />
```

**Tracked Metrics**:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTFB** (Time to First Byte): < 800ms
- **INP** (Interaction to Next Paint): < 200ms

### Performance Utilities

**`src/lib/performance.ts`:**

```typescript
import { reportWebVitals, mark, measure } from '@/lib/performance'

// Report custom metrics
reportWebVitals({
    name: 'CustomMetric',
    value: 100,
    rating: 'good',
    timestamp: Date.now()
})

// Measure operations
mark('start-operation')
// ... operation code ...
mark('end-operation')
const duration = measure('operation', 'start-operation', 'end-operation')
```

### Monitoring Features

1. **Long Task Detection**:
    - Tracks tasks > 50ms
    - Logs warnings for blocking operations

2. **Resource Monitoring**:
    - Tracks slow resources (> 1s)
    - Identifies bottlenecks

3. **Analytics Integration**:
    - Sends metrics to Google Analytics
    - Custom endpoint support

---

## Font Optimization

### Next.js Font Optimization

Using `next/font` for optimal font loading:

```tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
    weight: ['400', '500', '700', '900'],
    subsets: ['latin'],
    display: 'swap'  // Show fallback while loading
})

<body className={roboto.className}>
```

**Benefits**:

- Self-hosted fonts (no external requests)
- Automatic subsetting
- Font display optimization
- Zero layout shift

### Font Loading Strategy

1. **Critical fonts**: Preloaded
2. **Display**: `swap` (show fallback immediately)
3. **Subsets**: Only Latin characters
4. **Weights**: Only used weights (400, 500, 700, 900)

---

## Best Practices

### 1. Component Lazy Loading

```tsx
// ❌ Bad - Loads immediately
import { Modal } from '@/components/ui/modal'

// ✅ Good - Loads on demand
import { ModalLazy } from '@/components/ui/modal/modal-lazy'
```

### 2. Image Optimization

```tsx
// ❌ Bad - No optimization
<img src="/image.png" alt="image" />

// ✅ Good - Optimized
<Image
    src="/image.png"
    width={800}
    height={600}
    alt="image"
    sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 3. Bundle Size

```tsx
// ❌ Bad - Imports entire library
import _ from 'lodash'

// ✅ Good - Import specific function
import debounce from 'lodash/debounce'
```

### 4. Performance Monitoring

```tsx
// ❌ Bad - No monitoring
function expensiveOperation() {
    // ... code ...
}

// ✅ Good - With monitoring
function expensiveOperation() {
    mark('operation-start')
    // ... code ...
    mark('operation-end')
    measure('expensive-operation', 'operation-start', 'operation-end')
}
```

### 5. Conditional Loading

```tsx
// ❌ Bad - Always loads heavy component
;<HeavyComponent />

// ✅ Good - Conditional loading
{
    shouldShow && <HeavyComponentLazy />
}
```

---

## Performance Checklist

### Build Time

- [ ] Run bundle analyzer
- [ ] Check for duplicate dependencies
- [ ] Verify code splitting
- [ ] Review chunk sizes
- [ ] Optimize imports

### Runtime

- [ ] Monitor Core Web Vitals
- [ ] Check for long tasks
- [ ] Verify lazy loading works
- [ ] Test on slow connections
- [ ] Test on mobile devices

### Images

- [ ] Use `next/image` for all images
- [ ] Specify appropriate sizes
- [ ] Use modern formats (AVIF/WebP)
- [ ] Optimize source images
- [ ] Use `priority` for critical images

### Fonts

- [ ] Use `next/font` for all fonts
- [ ] Subset fonts appropriately
- [ ] Use font-display: swap
- [ ] Limit font weights
- [ ] Self-host fonts

---

## Performance Goals

| Metric                   | Target  | Current |
| ------------------------ | ------- | ------- |
| Lighthouse Performance   | > 90    | TBD     |
| First Contentful Paint   | < 1.8s  | TBD     |
| Largest Contentful Paint | < 2.5s  | TBD     |
| Time to Interactive      | < 3.8s  | TBD     |
| Total Blocking Time      | < 200ms | TBD     |
| Cumulative Layout Shift  | < 0.1   | TBD     |

---

## Tools & Resources

### Analysis Tools

- **Bundle Analyzer**: `npm run analyze`
- **Lighthouse**: Chrome DevTools
- **WebPageTest**: https://webpagetest.org
- **PageSpeed Insights**: https://pagespeed.web.dev

### Monitoring Services

- **Vercel Analytics**: Built-in
- **Vercel Speed Insights**: Built-in
- **Google Analytics**: Configured
- **Custom endpoint**: `/api/analytics/performance`

### Optimization Tools

- **ImageOptim**: Image compression
- **Squoosh**: Online image optimizer
- **Next.js Image**: Automatic optimization
- **Bundle Analyzer**: Identify large modules

---

## Troubleshooting

### Large Bundle Size

1. Run `npm run analyze`
2. Identify large dependencies
3. Consider alternatives or lazy loading
4. Check for duplicate packages

### Slow Page Load

1. Check Lighthouse report
2. Identify blocking resources
3. Optimize images and fonts
4. Implement lazy loading

### Poor Core Web Vitals

1. Check specific metric
2. Use performance utilities
3. Optimize critical rendering path
4. Reduce JavaScript execution

---

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Bundle Analysis](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)

---

**Last Updated**: October 2025

For questions about performance, contact the development team.
