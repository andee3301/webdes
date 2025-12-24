# Style Consolidation Summary

## Changes Made

### 1. Removed QR Payment Section
- **Deleted**: `FinalizeOrderSection` component from [src/App.tsx](src/App.tsx)
- **Removed**: QR Pay navigation link from header
- **Removed**: "Pay by QR" button from hero section
- **Removed**: `qrImage` import (image.png)

### 2. Unified CSS Theme
Both EJS pages and React SPA now use the **same dark theme** with consistent design tokens:

#### Master Color Palette
```css
--cream-canvas: #0f0b09       /* Main background */
--roast-brown: #e6d6c4        /* Primary text/headings */
--stone-gray: #f0e6da         /* Body text */
--muted-ink: #c7b6a4          /* Muted text */
--burnt-amber: #d9a25f        /* Primary accent/CTA */
--surface-elevated: #18120f   /* Card backgrounds */
--surface-border: rgba(255, 255, 255, 0.08)  /* Borders */
```

#### Typography
- **Headings**: `Cormorant Garamond` (serif)
- **Body**: `Inter` / Segoe UI (sans-serif)
- **Letter spacing**: -0.01em for headings

#### Layout
- **Max width**: 1240px
- **Padding**: clamp(1.1rem, 3vw, 2.6rem)
- **Card heights**: 220px (fixed, image-independent)

### 3. Files Modified

#### [src/App.tsx](src/App.tsx)
- Removed `FinalizeOrderSection` component (lines 361-481)
- Removed QR Pay nav link
- Removed Pay by QR hero button
- Removed `qrImage` import

#### [src/landing.css](src/landing.css)
- Replaced light theme tokens with dark theme tokens from [public/css/main.css](public/css/main.css)
- Updated all color references:
  - `--ink-strong` → `--roast-brown`
  - `--ink-muted` → `--muted-ink`
  - `--accent` → `--burnt-amber`
  - `--surface` → `--surface-elevated`
  - `--leaf` → `--burnt-amber`
- Updated all component backgrounds to dark theme
- Changed gradients from light to dark
- Updated button shadows and hover states

### 4. Build Status
✅ React SPA builds successfully  
✅ No breaking changes to EJS views  
✅ All card heights now consistent across both systems

## Visual Consistency Achieved

### Before
- **EJS pages**: Dark theme (#0f0b09 background, cream text)
- **React SPA**: Light theme (#f7efe4 background, dark text)
- **Result**: Jarring contrast when navigating between pages

### After
- **All pages**: Unified dark theme
- **Consistent colors**: Same brand amber, cream, and browns everywhere
- **Matching spacing**: Same shell padding, section gaps, card heights
- **One design language**: Users see seamless visual continuity

## Testing Checklist

- [ ] Visit `/` (React SPA landing) - should show dark theme
- [ ] Visit `/shop` (EJS) - should match landing colors
- [ ] Visit `/about` (EJS) - should match landing colors
- [ ] Visit `/menu` (EJS) - should match landing colors
- [ ] Verify all cards are same height regardless of image
- [ ] Check navigation hover states match
- [ ] Verify buttons use same amber accent color
- [ ] Confirm no QR payment section appears anywhere

## Next Steps (Optional)

1. **Remove unused light theme assets** (if any remain in public/images)
2. **Update meta theme-color** in HTML head to match new dark theme
3. **Add dark mode toggle** (if you want to support light mode as option)
4. **Optimize animations** to feel consistent across EJS and React
