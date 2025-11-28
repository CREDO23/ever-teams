# Entity Analysis Report - Ever Teams

## Overview
Comprehensive analysis of entities used in Ever Teams that require Zod schemas.

## Current Schema Status

### ✅ Existing Schemas (10 files in `/lib/contracts/`)
1. `common.types.ts` - Base schemas and shared types
2. `user.types.ts` - User authentication and profile
3. `employee.types.ts` - Employee profiles and relations
4. `organization.types.ts` - Organization entities
5. `team.types.ts` - Team and team members
6. `role.types.ts` - Role and permission types
7. `tag.types.ts` - Tag and label types
8. `invite.types.ts` - Invitation types
9. `social-account.types.ts` - OAuth social accounts
10. `index.ts` - Barrel exports

## Missing Entities Requiring Schemas

### 🔴 Priority 1 - Core Business Logic (Critical)

#### 1. **Task Management** (`task.types.ts`)
- **Interfaces Found**: 16+ interfaces
- **Location**: `/core/types/interfaces/task/`
- **API Endpoint**: `/app/api/tasks/`
- **Service**: `task.service.ts`
- **Required Schemas**:
  - `taskSchema` - Base task entity
  - `taskWithRelationsSchema` - Task with all relations
  - `createTaskRequestSchema`
  - `updateTaskRequestSchema`
  - `getTasksRequestSchema`
  - `taskResponseSchema`

#### 2. **Daily Plans** (`daily-plan.types.ts`)
- **Interfaces**: `IDailyPlan`, `IDailyPlanBase`, `ICreateDailyPlan`, `IUpdateDailyPlan`
- **API Endpoint**: `/app/api/daily-plan/`
- **Service**: `daily-plan.service.ts`
- **Required Schemas**:
  - `dailyPlanSchema`
  - `dailyPlanWithRelationsSchema`
  - `createDailyPlanRequestSchema`
  - `updateDailyPlanRequestSchema`
  - `dailyPlanTasksUpdateSchema`

#### 3. **Projects** (`project.types.ts`)
- **Interfaces**: 8 interfaces including `IOrganizationProject`, `ICreateProjectRequest`
- **API Endpoint**: `/app/api/organization-projects/`
- **Service**: `organization-project.service.ts`
- **Required Schemas**:
  - `projectSchema`
  - `projectWithRelationsSchema`
  - `createProjectRequestSchema`
  - `updateProjectRequestSchema`
  - `projectSettingsSchema`

#### 4. **Timer & Time Tracking** (`timer.types.ts`)
- **Interfaces**: `ITimerStatus`, `IDetailTimerSite`, timer logs
- **API Endpoint**: `/app/api/timer/`
- **Service**: `timer.service.ts`
- **Required Schemas**:
  - `timerSchema`
  - `timerStatusSchema`
  - `startTimerRequestSchema`
  - `stopTimerRequestSchema`
  - `toggleTimerRequestSchema`

#### 5. **Timesheet** (`timesheet.types.ts`)
- **Interfaces**: 8 interfaces including `ITimesheet`, `ITimeLog`, `ITimeSlot`
- **API Endpoints**: `/app/api/timesheet/`
- **Services**: `timesheet.service.ts`, `time-log.service.ts`, `time-slot.service.ts`
- **Required Schemas**:
  - `timesheetSchema`
  - `timeLogSchema`
  - `timeSlotSchema`
  - `addManualTimeRequestSchema`
  - `updateTimesheetStatusSchema`

### 🟡 Priority 2 - Supporting Features

#### 6. **Task Status** (`task-status.types.ts`)
- **Interface**: `ITaskStatus`, `ITaskStatusCreate`
- **API Endpoint**: `/app/api/task-statuses/`
- **Service**: `task-status.service.ts`

#### 7. **Task Priority** (`task-priority.types.ts`)
- **Interface**: `ITaskPriority`, `ITaskPrioritiesCreate`
- **API Endpoint**: `/app/api/task-priorities/`
- **Service**: `task-priority.service.ts`

#### 8. **Task Size** (`task-size.types.ts`)
- **Interface**: `ITaskSize`, `ITaskSizesCreate`
- **API Endpoint**: `/app/api/task-sizes/`
- **Service**: `task-size.service.ts`

#### 9. **Task Version** (`task-version.types.ts`)
- **Interface**: `ITaskVersion`
- **API Endpoint**: `/app/api/task-versions/`
- **Service**: `task-version.service.ts`

#### 10. **Issue Types** (`issue-type.types.ts`)
- **Interface**: `IIssueType`, `IIssueTypesCreate`
- **API Endpoint**: `/app/api/issue-types/`
- **Service**: `issue-type.service.ts`

#### 11. **Task Related Issue Types** (`task-related-issue-type.types.ts`)
- **Interface**: `ITaskRelatedIssueType`
- **API Endpoint**: `/app/api/task-related-issue-types/`
- **Service**: `task-related-issue-type.service.ts`

#### 12. **Task Linked Issues** (`task-linked-issue.types.ts`)
- **Interface**: `ITaskLinkedIssue`
- **Service**: `task-linked-issue.service.ts`

### 🟢 Priority 3 - Activity & Reporting

#### 13. **Activity** (`activity.types.ts`)
- **Interfaces**: 31 interfaces found including activity reports
- **API Endpoint**: None directly, used in reports
- **Service**: `activity.service.ts`
- **Sub-types**:
  - `activitySchema`
  - `activityReportSchema`
  - `activityFilterSchema`
  - `activityItemSchema`

#### 14. **Screenshots** (`screenshot.types.ts`)
- **Interface**: `IScreenshot`, `IScreenshootPerHour`
- **Part of timer/timesheet module**

### 🔵 Priority 4 - Infrastructure

#### 15. **Tenant** (`tenant.types.ts`)
- **Interface**: `ITenant`
- **Service**: `tenant.service.ts`

#### 16. **Integration** (`integration.types.ts`)
- **Interfaces**: `IIntegration`, `IIntegrationType`, `IIntegrationTenant`
- **API Endpoints**: `/app/api/integration/`, `/app/api/integration-tenant/`
- **Services**: `integration.service.ts`, `integration-tenant.service.ts`

#### 17. **Language** (`language.types.ts`)
- **Interface**: `ILanguage`, `ILanguageItemList`
- **API Endpoint**: `/app/api/languages/`
- **Service**: `language.service.ts`

#### 18. **Currency** (`currency.types.ts`)
- **Interface**: `ICurrency`
- **Service**: `currency.service.ts`

#### 19. **Favorites** (`favorite.types.ts`)
- **Interface**: `IFavorite`, `IFavoriteCreateRequest`
- **Service**: `favorite.service.ts`

#### 20. **Image Assets** (`image-asset.types.ts`)
- **Interface**: `IImageAsset`, `ICreateImageAssets`
- **API Endpoint**: `/app/api/image-assets/`
- **Service**: `image-assets.service.ts`

## API Coverage Analysis

### APIs with Existing Schemas ✅
- `/api/auth/*` - Covered by `user.types.ts`
- `/api/user/*` - Covered by `user.types.ts`
- `/api/employee/*` - Covered by `employee.types.ts`
- `/api/organization-team/*` - Covered by `team.types.ts`
- `/api/roles/*` - Covered by `role.types.ts`
- `/api/tags/*` - Covered by `tag.types.ts`
- `/api/invite/*` - Covered by `invite.types.ts`

### APIs Missing Schemas ❌
- `/api/tasks/*` - Needs `task.types.ts`
- `/api/daily-plan/*` - Needs `daily-plan.types.ts`
- `/api/organization-projects/*` - Needs `project.types.ts`
- `/api/timer/*` - Needs `timer.types.ts`
- `/api/timesheet/*` - Needs `timesheet.types.ts`
- `/api/task-statuses/*` - Needs `task-status.types.ts`
- `/api/task-priorities/*` - Needs `task-priority.types.ts`
- `/api/task-sizes/*` - Needs `task-size.types.ts`
- `/api/task-versions/*` - Needs `task-version.types.ts`
- `/api/issue-types/*` - Needs `issue-type.types.ts`
- `/api/task-related-issue-types/*` - Needs `task-related-issue-type.types.ts`
- `/api/integration/*` - Needs `integration.types.ts`
- `/api/integration-tenant/*` - Needs `integration.types.ts`
- `/api/languages/*` - Needs `language.types.ts`
- `/api/image-assets/*` - Needs `image-asset.types.ts`

## Implementation Recommendations

### Phase 1 (Immediate - Core Functionality)
1. Create `task.types.ts` - Most complex, most used
2. Create `daily-plan.types.ts` - Core feature
3. Create `project.types.ts` - Core organization
4. Create `timer.types.ts` - Core tracking
5. Create `timesheet.types.ts` - Core reporting

### Phase 2 (Next Sprint - Task Support)
6. Create `task-status.types.ts`
7. Create `task-priority.types.ts`
8. Create `task-size.types.ts`
9. Create `task-version.types.ts`
10. Create `issue-type.types.ts`
11. Create `task-related-issue-type.types.ts`
12. Create `task-linked-issue.types.ts`

### Phase 3 (Future - Enhanced Features)
13. Create `activity.types.ts`
14. Create `screenshot.types.ts`
15. Create `tenant.types.ts`
16. Create `integration.types.ts`
17. Create `language.types.ts`
18. Create `currency.types.ts`
19. Create `favorite.types.ts`
20. Create `image-asset.types.ts`

## Schema Pattern to Follow

Each file should contain:

```typescript
// 1. Base DB schema (foreign keys as strings)
export const entitySchema = basePerTenantEntityModelSchema.extend({
  // entity fields
  foreignKeyId: z.string().nullable().optional(),
});

// 2. WithRelations schema (populated relations)
export const entityWithRelationsSchema = entitySchema.extend({
  relation: z.lazy(() => otherSchema).optional(),
});

// 3. Request schemas
export const getEntityRequestSchema = z.object({...});
export const createEntityRequestSchema = z.object({...});
export const updateEntityRequestSchema = z.object({...});
export const deleteEntityRequestSchema = z.object({...});

// 4. Response schemas
export const entityResponseSchema = z.object({
  data: entityWithRelationsSchema,
  message: z.string().optional(),
});

// 5. Type exports (inferred from schemas)
export type Entity = z.infer<typeof entitySchema>;
export type EntityWithRelations = z.infer<typeof entityWithRelationsSchema>;
// etc.
```

## Statistics
- **Total Entities Found**: 45+
- **Schemas Completed**: 10
- **Schemas Needed**: 20+ (priority entities)
- **API Endpoints**: 33
- **Services**: 50+
- **Interfaces to Replace**: 150+

## Notes
- All schemas should be Zod-first (no explicit TypeScript interfaces)
- Use `z.lazy()` for circular dependencies
- Foreign keys should be `z.string().nullable().optional()` in base schemas
- WithRelations schemas should include populated data
- Request/Response schemas should match API contracts
- Consider creating sub-folders if entity has many related types
