# Entity Implementation Plan with Dependencies

## Executive Summary
This document provides a detailed implementation plan for creating Zod schemas for all entities in Ever Teams, respecting dependencies and ensuring proper build order.

## Dependency Analysis

### Core Dependency Tree
```
└── common.types.ts (✅ exists)
    ├── tenant.types.ts
    │   └── organization.types.ts (✅ exists)
    │       ├── user.types.ts (✅ exists)
    │       │   └── employee.types.ts (✅ exists)
    │       ├── role.types.ts (✅ exists)
    │       ├── team.types.ts (✅ exists)
    │       │   └── team-employee.types.ts
    │       ├── project.types.ts
    │       │   ├── project-employee.types.ts
    │       │   └── project-settings.types.ts
    │       ├── tag.types.ts (✅ exists)
    │       └── image-asset.types.ts
    ├── task-status.types.ts
    ├── task-priority.types.ts
    ├── task-size.types.ts
    ├── task-version.types.ts
    ├── issue-type.types.ts
    └── task.types.ts (depends on all task-* types)
        ├── task-linked-issue.types.ts
        ├── task-related-issue-type.types.ts
        ├── daily-plan.types.ts
        ├── timer.types.ts
        │   ├── time-log.types.ts
        │   ├── time-slot.types.ts
        │   └── screenshot.types.ts
        └── timesheet.types.ts
```

## Implementation Phases

### Phase 0: Foundation (Already Complete ✅)
- `common.types.ts` - Base schemas
- `user.types.ts` - User authentication
- `employee.types.ts` - Employee profiles
- `organization.types.ts` - Organization
- `team.types.ts` - Teams
- `role.types.ts` - Roles and permissions
- `tag.types.ts` - Tags
- `invite.types.ts` - Invitations
- `social-account.types.ts` - OAuth

### Phase 1: Infrastructure & Assets (Week 1)
**Order matters - implement in sequence:**

#### 1.1 `tenant.types.ts`
- **Dependencies**: `common.types.ts`
- **Dependents**: All tenant-scoped entities
- **Priority**: Critical - blocks everything
- **Estimated Time**: 2 hours

#### 1.2 `image-asset.types.ts`
- **Dependencies**: `common.types.ts`, `tenant.types.ts`
- **Dependents**: Projects, Teams (for logos)
- **Priority**: High
- **Estimated Time**: 2 hours

#### 1.3 `currency.types.ts`
- **Dependencies**: `common.types.ts`
- **Dependents**: Billing, Invoicing (future)
- **Priority**: Low
- **Estimated Time**: 1 hour

#### 1.4 `language.types.ts`
- **Dependencies**: `common.types.ts`, `organization.types.ts`
- **Dependents**: User preferences, Localization
- **Priority**: Medium
- **Estimated Time**: 1 hour

### Phase 2: Project Management (Week 1-2)
**Must be done before tasks:**

#### 2.1 `project.types.ts`
- **Dependencies**: `organization.types.ts`, `image-asset.types.ts`, `tag.types.ts`
- **Dependents**: Tasks, Time tracking, Reports
- **Priority**: Critical
- **Estimated Time**: 4 hours
- **Schemas Required**:
  - `projectSchema`
  - `projectWithRelationsSchema`
  - `createProjectRequestSchema`
  - `updateProjectRequestSchema`
  - `projectResponseSchema`

#### 2.2 `project-employee.types.ts`
- **Dependencies**: `project.types.ts`, `employee.types.ts`
- **Dependents**: Task assignments
- **Priority**: High
- **Estimated Time**: 2 hours

#### 2.3 `team-employee.types.ts`
- **Dependencies**: `team.types.ts`, `employee.types.ts`
- **Dependents**: Team management
- **Priority**: High
- **Estimated Time**: 2 hours

### Phase 3: Task Infrastructure (Week 2)
**These must be complete before main task entity:**

#### 3.1 `task-status.types.ts`
- **Dependencies**: `common.types.ts`, `organization.types.ts`
- **Dependents**: `task.types.ts`
- **Priority**: Critical
- **Estimated Time**: 2 hours
- **Note**: System statuses vs custom statuses

#### 3.2 `task-priority.types.ts`
- **Dependencies**: `common.types.ts`, `organization.types.ts`
- **Dependents**: `task.types.ts`
- **Priority**: Critical
- **Estimated Time**: 2 hours

#### 3.3 `task-size.types.ts`
- **Dependencies**: `common.types.ts`, `organization.types.ts`
- **Dependents**: `task.types.ts`
- **Priority**: High
- **Estimated Time**: 2 hours

#### 3.4 `task-version.types.ts`
- **Dependencies**: `common.types.ts`, `organization.types.ts`
- **Dependents**: `task.types.ts`
- **Priority**: Medium
- **Estimated Time**: 2 hours

#### 3.5 `issue-type.types.ts`
- **Dependencies**: `common.types.ts`, `organization.types.ts`
- **Dependents**: `task.types.ts`, `task-related-issue-type.types.ts`
- **Priority**: High
- **Estimated Time**: 2 hours

### Phase 4: Core Task Management (Week 2-3)
**The main task entity and its direct relations:**

#### 4.1 `task.types.ts`
- **Dependencies**: 
  - `project.types.ts`
  - `employee.types.ts`
  - `team.types.ts`
  - `task-status.types.ts`
  - `task-priority.types.ts`
  - `task-size.types.ts`
  - `task-version.types.ts`
  - `issue-type.types.ts`
  - `tag.types.ts`
- **Dependents**: Daily plans, Time tracking, Reports
- **Priority**: Critical
- **Estimated Time**: 8 hours
- **Complexity**: High - self-referential (parent/children)

#### 4.2 `task-linked-issue.types.ts`
- **Dependencies**: `task.types.ts`
- **Dependents**: Integration features
- **Priority**: Medium
- **Estimated Time**: 2 hours

#### 4.3 `task-related-issue-type.types.ts`
- **Dependencies**: `task.types.ts`, `issue-type.types.ts`
- **Dependents**: Task categorization
- **Priority**: Medium
- **Estimated Time**: 2 hours

### Phase 5: Planning & Time Tracking (Week 3)
**Features that depend on tasks:**

#### 5.1 `daily-plan.types.ts`
- **Dependencies**: `task.types.ts`, `employee.types.ts`, `team.types.ts`
- **Dependents**: Planning features
- **Priority**: Critical
- **Estimated Time**: 4 hours
- **Note**: References tasks array

#### 5.2 `timer.types.ts`
- **Dependencies**: `task.types.ts`, `project.types.ts`, `employee.types.ts`
- **Dependents**: `time-log.types.ts`, `time-slot.types.ts`
- **Priority**: Critical
- **Estimated Time**: 4 hours

#### 5.3 `time-log.types.ts`
- **Dependencies**: `timer.types.ts`, `task.types.ts`, `project.types.ts`
- **Dependents**: `timesheet.types.ts`
- **Priority**: Critical
- **Estimated Time**: 3 hours

#### 5.4 `time-slot.types.ts`
- **Dependencies**: `time-log.types.ts`, `employee.types.ts`
- **Dependents**: Time tracking UI
- **Priority**: High
- **Estimated Time**: 3 hours

#### 5.5 `screenshot.types.ts`
- **Dependencies**: `time-slot.types.ts`, `user.types.ts`
- **Dependents**: Activity monitoring
- **Priority**: Medium
- **Estimated Time**: 2 hours

#### 5.6 `timesheet.types.ts`
- **Dependencies**: `time-log.types.ts`, `employee.types.ts`
- **Dependents**: Reporting, Approval workflows
- **Priority**: High
- **Estimated Time**: 4 hours

### Phase 6: Activity & Reporting (Week 4)
**Analytics and monitoring:**

#### 6.1 `activity.types.ts`
- **Dependencies**: `employee.types.ts`, `project.types.ts`, `task.types.ts`
- **Dependents**: Activity reports, Productivity metrics
- **Priority**: Medium
- **Estimated Time**: 6 hours
- **Note**: Complex with 31+ interfaces

### Phase 7: Integrations (Week 4)
**External system connections:**

#### 7.1 `integration.types.ts`
- **Dependencies**: `tenant.types.ts`
- **Dependents**: GitHub, Jira, etc.
- **Priority**: Medium
- **Estimated Time**: 3 hours

#### 7.2 `integration-tenant.types.ts`
- **Dependencies**: `integration.types.ts`, `tenant.types.ts`
- **Dependents**: Integration configurations
- **Priority**: Medium
- **Estimated Time**: 2 hours

#### 7.3 `favorite.types.ts`
- **Dependencies**: `employee.types.ts`
- **Dependents**: UI preferences
- **Priority**: Low
- **Estimated Time**: 1 hour

## Critical Path

The critical path for implementation (must be done in order):

1. `tenant.types.ts` (if multi-tenant)
2. `image-asset.types.ts`
3. `project.types.ts`
4. `task-status.types.ts`
5. `task-priority.types.ts`
6. `issue-type.types.ts`
7. `task.types.ts`
8. `daily-plan.types.ts`
9. `timer.types.ts`
10. `time-log.types.ts`
11. `timesheet.types.ts`

## Risk Mitigation

### High-Risk Areas
1. **Task entity** - Most complex with self-references and many relations
2. **Activity tracking** - 31+ interfaces to consolidate
3. **Circular dependencies** - Use `z.lazy()` pattern consistently

### Mitigation Strategies
1. **Test incrementally** - Validate each schema before moving to dependents
2. **Use placeholder schemas** - Create minimal versions first, enhance later
3. **Maintain backwards compatibility** - Keep old interfaces during transition

## Implementation Guidelines

### For Each Entity File

1. **Start with the base schema** (DB representation)
```typescript
export const entitySchema = basePerTenantEntityModelSchema.extend({
  // Only direct fields, foreign keys as strings
  name: z.string(),
  foreignKeyId: z.string().nullable().optional()
});
```

2. **Add the WithRelations schema**
```typescript
export const entityWithRelationsSchema = entitySchema.extend({
  // Use z.lazy() for circular deps
  relation: z.lazy(() => require('./other.types').otherSchema).optional()
});
```

3. **Create request schemas**
```typescript
export const createEntityRequestSchema = entitySchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();
```

4. **Create response schemas**
```typescript
export const entityResponseSchema = z.object({
  data: entityWithRelationsSchema,
  message: z.string().optional(),
  success: z.boolean()
});
```

5. **Export inferred types**
```typescript
export type Entity = z.infer<typeof entitySchema>;
export type EntityWithRelations = z.infer<typeof entityWithRelationsSchema>;
```

## Validation Checkpoints

After each phase:
1. Run type checking: `yarn tsc --noEmit`
2. Test schema validation with sample data
3. Verify no circular dependency errors
4. Update existing code to use new schemas
5. Document any deviations from plan

## Time Estimates

- **Phase 1**: 6 hours
- **Phase 2**: 8 hours
- **Phase 3**: 10 hours
- **Phase 4**: 12 hours
- **Phase 5**: 16 hours
- **Phase 6**: 6 hours
- **Phase 7**: 6 hours
- **Total**: ~64 hours (8 developer days)

## Success Criteria

1. All 20+ missing entities have Zod schemas
2. No TypeScript compilation errors
3. All schemas validate sample data correctly
4. Circular dependencies handled properly
5. API request/response types match actual payloads
6. Old interfaces can be safely deprecated

## Next Steps

1. Review and approve this plan
2. Begin with Phase 1 (Infrastructure)
3. Create test data for validation
4. Set up migration strategy from old interfaces
5. Update API services to use new schemas
