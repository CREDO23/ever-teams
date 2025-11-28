# Inconsistencies Between Manual Analysis and Knip

## 1. PACKAGES FOUND ONLY BY MANUAL ANALYSIS (Not detected by Knip)

### Workspace Packages (5 packages)
**Manual found these as unused, Knip didn't:**
- `@ever-teams/constants`
- `@ever-teams/hooks` 
- `@ever-teams/services`
- `@ever-teams/types`
- `@ever-teams/utils`

**Why the discrepancy?**
- These are internal workspace packages with wildcard versions ("*")
- Knip may treat workspace packages differently
- Could be re-exported through other modules

### LiveKit Related (2 packages)
**Manual found as unused:**
- `@livekit/components-styles: ^1.0.12`
- `@livekit/krisp-noise-filter: ^0.2.5`

**Why Knip missed them:**
- `@livekit/components-styles` might be imported via CSS files
- Knip doesn't analyze CSS imports by default
- Krisp filter might be conditionally imported

### Chart/Visualization (1 package)
**Manual found as unused:**
- `@nivo/core: ^0.89.1`

**Why Knip missed it:**
- Might be a peer dependency of `@nivo/calendar` which IS used
- Could be imported indirectly

### Development Tools (3 packages)
**Manual found as unused:**
- `@tanstack/react-query-devtools: ^5.79.0`
- `autoprefixer: ^10.4.12`
- `eslint: ^9.38.0`

**Why Knip missed them:**
- DevTools might be conditionally imported in development
- Autoprefixer is used in PostCSS config (not JS/TS files)
- ESLint might be seen as necessary (though eslint-config-next includes it)

### Firebase (1 package) - FALSE POSITIVE
**Manual incorrectly marked as unused:**
- `firebase: 8.3.3`

**Why the mistake:**
- Firebase is dynamically imported: `await import('firebase/app')`
- Manual grep search missed dynamic imports
- Found in: `core/lib/helpers/firebase.ts`

## 2. PACKAGES FOUND ONLY BY KNIP (Not detected by Manual)

### Missed Package (1 package)
**Knip found, Manual missed:**
- `ni18n: ^1.1.0`

**Why manual analysis missed it:**
- Overlooked during manual scanning
- Similar name to `i18next` might have caused confusion

## 3. CRITICAL FINDING - MISSING DEPENDENCIES (Knip exclusive)

**Knip found 8 packages used but NOT in package.json:**
```
- react-phone-number-input
- validator
- is-hotkey  
- embla-carousel
- domutils
- tslib
- react-phone-number-input/locale/en.json
- react-phone-number-input/style.css
```

**Why manual analysis didn't catch this:**
- Manual analysis only looked for unused packages, not missing ones
- These work due to hoisting from other packages
- This is a critical issue that only Knip detected

## 4. DIFFERENT CATEGORIZATION

### @ever-teams/ts-config
- **Manual**: Listed as "Definitely Unused"
- **Knip**: Listed as "Unused devDependency"
- Both agree it's unused, just different categories

### @svgr/webpack
- **Manual**: Listed as "Unused"
- **Knip**: Listed as "Unused devDependency"
- Both agree, just categorized differently

## 5. SUMMARY OF DISCREPANCIES

### Manual Analysis Mistakes:
1. **False Positive**: Firebase (actually used via dynamic import)
2. **Missed Package**: ni18n
3. **Didn't Check**: Missing dependencies (8 packages)
4. **Too Aggressive**: Found 26 unused vs Knip's 12

### Knip Limitations:
1. **Missed Workspace Packages**: 5 @ever-teams/* packages
2. **Missed CSS Imports**: @livekit/components-styles
3. **Missed Build Tools**: autoprefixer (PostCSS config)
4. **Missed Conditional Imports**: @tanstack/react-query-devtools
5. **Conservative**: Only found 12 vs manual's 26

### Why These Differences Exist:

1. **Dynamic Imports**: Manual grep misses them, Knip sometimes too
2. **CSS/Style Imports**: Knip doesn't analyze by default
3. **Build Configuration**: Tools used in configs not always detected
4. **Workspace Packages**: Different handling of monorepo dependencies
5. **Conditional/Dev Imports**: Development-only imports handled differently
6. **Transitive Dependencies**: Packages used indirectly

## 6. PACKAGES BOTH AGREE ON (100% Confidence)

These can be safely removed:
- ✅ All 6 OpenTelemetry packages
- ✅ cookie (replaced by cookies-next)
- ✅ geist (font package)
- ✅ i18next (replaced by next-intl)
- ✅ jwt-decode
- ✅ novel (text editor)
- ✅ react-country-flag
- ✅ @svgr/webpack
- ✅ @ever-teams/ts-config
- ✅ ni18n (found by Knip, confirmed unused)

## 7. PACKAGES NEEDING INVESTIGATION

Due to discrepancies:
- ⚠️ @ever-teams/* workspace packages (5)
- ⚠️ @livekit/components-styles
- ⚠️ @livekit/krisp-noise-filter
- ⚠️ @nivo/core
- ⚠️ @tanstack/react-query-devtools
- ⚠️ autoprefixer
- ⚠️ eslint (duplicate)
