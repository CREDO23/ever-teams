# Entity Dependency Matrix Report

## Overview
This matrix shows the interdependencies between all entities in the Ever Teams system.

## Dependency Matrix

| Entity | Depends On | Required By | Status | Priority |
|--------|------------|--------------|--------|----------|
| **common** | - | ALL | ✅ Done | - |
| **tenant** | common | organization, all tenant-scoped | ❌ Missing | P0 |
| **user** | common, tenant | employee, invite, social-account | ✅ Done | - |
| **organization** | common, tenant | employee, team, project, all org-scoped | ✅ Done | - |
| **employee** | user, organization | team-employee, project-employee, task, daily-plan, timer | ✅ Done | - |
| **role** | common, tenant | user, invite | ✅ Done | - |
| **tag** | common, organization | task, project, team | ✅ Done | - |
| **team** | organization, employee | team-employee, task, daily-plan | ✅ Done | - |
| **invite** | user, role, organization, team | - | ✅ Done | - |
| **social-account** | user | - | ✅ Done | - |
| **image-asset** | common, tenant | organization, team, project | ❌ Missing | P1 |
| **currency** | common | billing, invoices (future) | ❌ Missing | P4 |
| **language** | common, organization | user preferences | ❌ Missing | P3 |
| **project** | organization, image-asset, tag | task, timer, time-log, activity | ❌ Missing | P0 |
| **project-employee** | project, employee | task assignments | ❌ Missing | P1 |
| **team-employee** | team, employee | team management | ❌ Missing | P1 |
| **task-status** | common, organization | task | ❌ Missing | P0 |
| **task-priority** | common, organization | task | ❌ Missing | P0 |
| **task-size** | common, organization | task | ❌ Missing | P1 |
| **task-version** | common, organization | task | ❌ Missing | P2 |
| **issue-type** | common, organization | task, task-related-issue-type | ❌ Missing | P1 |
| **task** | project, employee, team, task-status, task-priority, task-size, task-version, issue-type, tag | daily-plan, timer, time-log, activity | ❌ Missing | P0 |
| **task-linked-issue** | task | integrations | ❌ Missing | P2 |
| **task-related-issue-type** | task, issue-type | task categorization | ❌ Missing | P2 |
| **daily-plan** | task, employee, team | planning UI | ❌ Missing | P0 |
| **timer** | task, project, employee | time-log, time-slot | ❌ Missing | P0 |
| **time-log** | timer, task, project, employee, team | timesheet | ❌ Missing | P0 |
| **time-slot** | time-log, employee | screenshot, activity | ❌ Missing | P1 |
| **screenshot** | time-slot, user | activity monitoring | ❌ Missing | P2 |
| **timesheet** | time-log, employee | reporting, approvals | ❌ Missing | P1 |
| **activity** | employee, project, task, time-slot | reports, analytics | ❌ Missing | P2 |
| **integration** | tenant | integration-tenant, GitHub, Jira | ❌ Missing | P3 |
| **integration-tenant** | integration, tenant | integration configs | ❌ Missing | P3 |
| **favorite** | employee | UI preferences | ❌ Missing | P4 |

## Dependency Complexity Score

| Entity | Dependencies | Dependents | Complexity Score | Risk Level |
|--------|--------------|------------|------------------|------------|
| **task** | 9 | 4 | 36 | 🔴 High |
| **employee** | 2 | 7 | 14 | 🟡 Medium |
| **project** | 3 | 4 | 12 | 🟡 Medium |
| **time-log** | 5 | 1 | 5 | 🟡 Medium |
| **organization** | 2 | 8 | 16 | 🟡 Medium |
| **team** | 2 | 3 | 6 | 🟢 Low |
| **daily-plan** | 3 | 0 | 0 | 🟢 Low |
| **timer** | 3 | 2 | 6 | 🟢 Low |
| **timesheet** | 2 | 0 | 0 | 🟢 Low |
| **activity** | 4 | 0 | 0 | 🟢 Low |

*Complexity Score = Dependencies × Dependents*

## Implementation Order (Respecting Dependencies)

### Batch 1: Foundation Extensions
**Can start immediately (no missing dependencies)**
- `tenant.types.ts` - No deps on missing entities
- `currency.types.ts` - No deps on missing entities
- `language.types.ts` - No deps on missing entities
- `image-asset.types.ts` - No deps on missing entities

### Batch 2: Project Foundation
**Requires Batch 1**
- `project.types.ts` - Needs image-asset
- `project-employee.types.ts` - Needs project
- `team-employee.types.ts` - No missing deps

### Batch 3: Task Infrastructure
**Can start with Batch 1**
- `task-status.types.ts` - No missing deps
- `task-priority.types.ts` - No missing deps
- `task-size.types.ts` - No missing deps
- `task-version.types.ts` - No missing deps
- `issue-type.types.ts` - No missing deps

### Batch 4: Core Task
**Requires Batch 2 & 3**
- `task.types.ts` - Needs project and all task-* types

### Batch 5: Task Extensions
**Requires Batch 4**
- `task-linked-issue.types.ts` - Needs task
- `task-related-issue-type.types.ts` - Needs task, issue-type
- `daily-plan.types.ts` - Needs task

### Batch 6: Time Tracking
**Requires Batch 4**
- `timer.types.ts` - Needs task, project
- `time-log.types.ts` - Needs timer, task
- `time-slot.types.ts` - Needs time-log
- `screenshot.types.ts` - Needs time-slot
- `timesheet.types.ts` - Needs time-log

### Batch 7: Analytics
**Requires Batch 6**
- `activity.types.ts` - Needs task, time-slot

### Batch 8: Integrations
**Can start with Batch 1**
- `integration.types.ts` - Needs tenant
- `integration-tenant.types.ts` - Needs integration
- `favorite.types.ts` - No missing deps

## Circular Dependencies Detected

| Entity A | Entity B | Resolution Strategy |
|----------|----------|--------------------|
| task | task (self) | Use `z.lazy()` for parent/children |
| employee | user | Already resolved with `z.lazy()` |
| organization | team | Already resolved with `z.lazy()` |

## API Endpoint Coverage

| API Endpoint | Entity Schema | Status | Priority |
|--------------|---------------|--------|----------|
| `/api/auth/*` | user | ✅ Covered | - |
| `/api/user/*` | user | ✅ Covered | - |
| `/api/employee/*` | employee | ✅ Covered | - |
| `/api/organization-team/*` | team | ✅ Covered | - |
| `/api/roles/*` | role | ✅ Covered | - |
| `/api/tags/*` | tag | ✅ Covered | - |
| `/api/invite/*` | invite | ✅ Covered | - |
| `/api/tasks/*` | task | ❌ Missing | P0 |
| `/api/daily-plan/*` | daily-plan | ❌ Missing | P0 |
| `/api/organization-projects/*` | project | ❌ Missing | P0 |
| `/api/timer/*` | timer | ❌ Missing | P0 |
| `/api/timesheet/*` | timesheet | ❌ Missing | P1 |
| `/api/task-statuses/*` | task-status | ❌ Missing | P0 |
| `/api/task-priorities/*` | task-priority | ❌ Missing | P0 |
| `/api/task-sizes/*` | task-size | ❌ Missing | P1 |
| `/api/task-versions/*` | task-version | ❌ Missing | P2 |
| `/api/issue-types/*` | issue-type | ❌ Missing | P1 |
| `/api/integration/*` | integration | ❌ Missing | P3 |
| `/api/languages/*` | language | ❌ Missing | P3 |
| `/api/image-assets/*` | image-asset | ❌ Missing | P1 |

## Risk Assessment

### High Risk Entities
1. **task.types.ts**
   - 9 dependencies (highest)
   - Self-referential structure
   - Central to most features
   - Risk: Breaking changes affect entire system

2. **time-log.types.ts**
   - 5 dependencies
   - Complex relationships
   - Risk: Data integrity issues

### Medium Risk Entities
1. **project.types.ts**
   - Foundation for tasks
   - Risk: Blocking task implementation

2. **employee.types.ts** (✅ Done but high dependents)
   - 7 entities depend on it
   - Risk: Changes affect many features

### Low Risk Entities
- Simple structure entities (currency, language, favorite)
- Leaf nodes in dependency tree (screenshot, activity)

## Parallel Work Streams

Teams can work in parallel on:

**Stream 1: Infrastructure**
- tenant.types.ts
- image-asset.types.ts
- currency.types.ts
- language.types.ts

**Stream 2: Task Setup**
- task-status.types.ts
- task-priority.types.ts
- task-size.types.ts
- task-version.types.ts
- issue-type.types.ts

**Stream 3: Team Management**
- team-employee.types.ts
- favorite.types.ts

**Stream 4: Integrations**
- integration.types.ts
- integration-tenant.types.ts

## Merge Points
After parallel streams complete:
1. **Merge Point 1**: Complete project.types.ts (needs Stream 1)
2. **Merge Point 2**: Complete task.types.ts (needs Streams 1, 2, and Merge Point 1)
3. **Merge Point 3**: Complete time tracking (needs Merge Point 2)

## Validation Requirements

For each entity implementation:

| Validation Step | Description | Tools |
|-----------------|-------------|-------|
| Schema Validation | Test with sample data | Zod `.parse()` |
| Type Checking | No TypeScript errors | `tsc --noEmit` |
| Circular Dep Check | No infinite loops | Runtime tests |
| API Contract | Matches backend responses | Integration tests |
| Migration Path | Old interfaces still work | Compatibility layer |

## Success Metrics

- **Coverage**: 100% of API endpoints have schemas
- **Type Safety**: 0 TypeScript errors
- **Validation**: All schemas validate real data
- **Performance**: Schema parsing < 10ms
- **Migration**: Gradual transition without breaking changes

## Recommended Implementation Schedule

| Week | Batches | Entities | Hours |
|------|---------|----------|-------|
| Week 1 | Batch 1, 2, 3 | 13 entities | 24h |
| Week 2 | Batch 4, 5 | 4 entities | 16h |
| Week 3 | Batch 6 | 5 entities | 16h |
| Week 4 | Batch 7, 8 | 4 entities | 8h |

**Total: 26 entities, 64 hours, 4 weeks**
