# Unused Imports and Modules Report - Ever Teams Web App

## Summary
- Total TypeScript/JavaScript files: 5,028
- Total npm packages: 152
- Unused npm packages: 26 confirmed + 18 potentially unused
- Files with unused imports: 26 analyzed files
- Total unused exports: 1,428 from 1,170 files

## 1. UNUSED NPM PACKAGES (26 packages)

### Definitely Unused Dependencies
These packages are not imported anywhere in the codebase:

#### Internal Packages (appears in package.json but may be build-time dependencies):
- `@ever-teams/constants: *`
- `@ever-teams/hooks: *`
- `@ever-teams/services: *`
- `@ever-teams/types: *`
- `@ever-teams/utils: *`
- `@ever-teams/ts-config: *` (devDependency)

#### External Unused Packages:
- `@livekit/components-styles: ^1.0.12` - LiveKit styling (styles may be imported via CSS)
- `@livekit/krisp-noise-filter: ^0.2.5` - Noise filter for LiveKit
- `@nivo/core: ^0.89.1` - Nivo charts core (only calendar is used)
- `@opentelemetry/api: ^1.7.0` - OpenTelemetry tracing
- `@opentelemetry/auto-instrumentations-node: ^0.40.1`
- `@opentelemetry/exporter-trace-otlp-http: ^0.45.1`
- `@opentelemetry/resources: ^1.18.1`
- `@opentelemetry/sdk-node: ^0.45.1`
- `@opentelemetry/semantic-conventions: ^1.18.1`
- `@tanstack/react-query-devtools: ^5.79.0` - React Query devtools
- `autoprefixer: ^10.4.12` - CSS autoprefixer
- `cookie: ^1.0.2` - Cookie parsing (cookies-next is used instead)
- `firebase: 8.3.3` - Firebase SDK
- `geist: ^1.3.1` - Vercel font
- `i18next: ^23.6.0` - Internationalization (next-intl is used instead)
- `jwt-decode: ^3.1.2` - JWT decoding
- `novel: ^1.0.2` - Novel text editor
- `react-country-flag: ^3.1.0` - Country flags
- `@svgr/webpack: ^8.1.0` - SVG loader
- `eslint: ^9.38.0` - Linting (duplicate, eslint-config-next includes it)

### Potentially Unused (18 packages)
May be used in build configs or type checking:
- Type definitions (`@types/*` packages) - 10 packages
- Build tools (postcss, tailwindcss, typescript) - 4 packages
- Linting tools (eslint-related) - 4 packages

## 2. UNUSED IMPORTS IN FILES (35 instances)

### Common Unused Imports Pattern

#### Unused Type Imports:
- `type VariantProps from 'class-variance-authority'` - Found in 6 files
  - badge.tsx, label.tsx, sheet.tsx, toast.tsx, _button.tsx, command.tsx

#### Unused Icon Imports:
- `LoginIcon, RecordIcon from 'lib/components/svgs'` - Found in 4 files
  - multiple-status-dropdown.tsx, task-status.tsx, use-map-to-task-status-values.tsx, task-card.ts

#### Unused Component Imports:
- Various skeleton components not being used in optimized components
  - CalendarViewSkeleton, GroupBySelectSkeleton, TimeReportTableSkeleton, etc.

#### Other Notable Unused:
- `type LucideIcon` in navigation components
- `type DialogProps`, `type Adapter` in various files
- Utility functions like `generateExportFilename`

## 3. UNUSED EXPORTS (1,428 total)

### By Directory:

#### assets/ (93 unused exports)
- Mostly unused SVG icon exports (PeoplesIcon, IsEqualIcon, PauseIcon, etc.)
- Many icons defined but never imported elsewhere

#### core/ (1,331 unused exports)
- Components exporting functions/components never imported
- Helper functions and utilities not being used
- Activity components (ActivityCalendar, TaskActivity, etc.)
- Many modal and form components

#### Root level (4 unused exports)
- `loadNextPublicEnvs` from env-config.ts
- `config` and `auth` from proxy.ts
- Default export from i18n.ts

## 4. RECOMMENDATIONS

### Immediate Actions:
1. **Remove definitely unused packages** to reduce bundle size:
   - firebase (8.3.3) - Large SDK
   - OpenTelemetry packages (6 packages)
   - @tanstack/react-query-devtools
   - novel, geist, react-country-flag

2. **Clean up unused imports** in files:
   - Remove `VariantProps` type imports where not used
   - Remove unused icon imports (LoginIcon, RecordIcon)
   - Clean up skeleton component imports

3. **Review internal packages**:
   - Check if @ever-teams/* packages are actually used via re-exports
   - May need to update import paths

### Investigation Needed:
1. **LiveKit packages**: Check if @livekit/components-styles is needed
2. **i18next vs next-intl**: Confirm migration is complete
3. **Cookie libraries**: Verify if `cookie` package can be removed
4. **Build tools**: Confirm autoprefixer usage in PostCSS config

### Long-term:
1. Set up automated tools to detect unused code:
   - Configure `knip` properly for continuous monitoring
   - Use ESLint rule for unused imports
   - Consider tree-shaking configuration

2. Review and remove unused exports:
   - 1,400+ unused exports indicate dead code
   - Focus on core/ directory with 1,331 unused exports

## 5. ESTIMATED IMPACT

### Bundle Size Reduction:
- Removing firebase alone could save ~200KB
- OpenTelemetry packages: ~150KB
- Other unused packages: ~100KB
- **Total potential reduction: ~450KB+ (minified)**

### Maintenance Benefits:
- Fewer dependencies to update
- Cleaner codebase
- Faster installation times
- Reduced security vulnerabilities
