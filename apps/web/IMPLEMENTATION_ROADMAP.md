# Implementation Roadmap - Ever Teams Schema Migration

## Quick Start Guide

### 🎯 Immediate Actions (Day 1)
Start with these entities - they have no blockers:

```bash
# Batch 1 - Can start immediately
1. tenant.types.ts          # Foundation for multi-tenancy
2. currency.types.ts        # Simple, no dependencies
3. language.types.ts        # Simple, no dependencies  
4. image-asset.types.ts     # Needed by projects
5. task-status.types.ts     # Needed by tasks
6. task-priority.types.ts   # Needed by tasks
7. task-size.types.ts       # Needed by tasks
8. task-version.types.ts    # Needed by tasks
9. issue-type.types.ts      # Needed by tasks
```

## Implementation Batches

### 🟢 Batch 1: Foundation (Day 1-2)
**No blockers - Start immediately**

| File | Time | Developer | Dependencies | Blocks |
|------|------|-----------|--------------|--------|
| tenant.types.ts | 2h | Dev 1 | none | project, integration |
| currency.types.ts | 1h | Dev 2 | none | future billing |
| language.types.ts | 1h | Dev 2 | none | localization |
| image-asset.types.ts | 2h | Dev 3 | tenant | project |

### 🟡 Batch 2: Task Infrastructure (Day 1-2)
**No blockers - Start immediately**

| File | Time | Developer | Dependencies | Blocks |
|------|------|-----------|--------------|--------|
| task-status.types.ts | 2h | Dev 4 | none | task |
| task-priority.types.ts | 2h | Dev 4 | none | task |
| task-size.types.ts | 2h | Dev 5 | none | task |
| task-version.types.ts | 2h | Dev 5 | none | task |
| issue-type.types.ts | 2h | Dev 6 | none | task |

### 🔴 Batch 3: Project Layer (Day 3)
**Wait for: Batch 1 completion**

| File | Time | Developer | Dependencies | Blocks |
|------|------|-----------|--------------|--------|
| project.types.ts | 4h | Dev 1 | image-asset, tenant | task, timer |
| project-employee.types.ts | 2h | Dev 2 | project | task assignments |
| team-employee.types.ts | 2h | Dev 3 | none | team features |

### 🔴 Batch 4: Task Core (Day 4-5)
**Wait for: Batch 2 & 3 completion**

| File | Time | Developer | Dependencies | Blocks |
|------|------|-----------|--------------|--------|
| task.types.ts | 8h | Dev 1 & 2 | ALL task-*, project | daily-plan, timer, reports |

**⚠️ Critical Notes:**
- Most complex entity (self-referential)
- Pair programming recommended
- Extensive testing required

### 🟡 Batch 5: Planning & Time (Day 6-7)
**Wait for: Batch 4 completion**

| File | Time | Developer | Dependencies | Blocks |
|------|------|-----------|--------------|--------|
| daily-plan.types.ts | 4h | Dev 3 | task | planning UI |
| timer.types.ts | 4h | Dev 4 | task, project | time tracking |
| time-log.types.ts | 3h | Dev 5 | timer | timesheet |
| time-slot.types.ts | 3h | Dev 6 | time-log | activity |
| timesheet.types.ts | 4h | Dev 1 | time-log | reports |

### 🟢 Batch 6: Extensions (Day 8)
**Can start after respective dependencies**

| File | Time | Developer | Dependencies | Blocks |
|------|------|-----------|--------------|--------|
| task-linked-issue.types.ts | 2h | Dev 2 | task | integrations |
| task-related-issue-type.types.ts | 2h | Dev 3 | task, issue-type | - |
| screenshot.types.ts | 2h | Dev 4 | time-slot | monitoring |
| activity.types.ts | 6h | Dev 5 | task, time-slot | analytics |

### 🟢 Batch 7: Integrations (Day 8-9)
**Can start with Batch 1**

| File | Time | Developer | Dependencies | Blocks |
|------|------|-----------|--------------|--------|
| integration.types.ts | 3h | Dev 6 | tenant | GitHub, Jira |
| integration-tenant.types.ts | 2h | Dev 6 | integration | - |
| favorite.types.ts | 1h | Dev 2 | none | - |

## Critical Path Analysis

The absolute critical path (must be sequential):

```
Day 1: tenant.types.ts (2h)
    ↓
Day 1: image-asset.types.ts (2h)
    ↓
Day 3: project.types.ts (4h)
    ↓
Day 2: task-status.types.ts + task-priority.types.ts + issue-type.types.ts (6h parallel)
    ↓
Day 4-5: task.types.ts (8h)
    ↓
Day 6: daily-plan.types.ts + timer.types.ts (8h parallel)
    ↓
Day 7: time-log.types.ts (3h)
    ↓
Day 7: timesheet.types.ts (4h)
```

**Minimum Time:** 5 days with 6 developers working in parallel
**Realistic Time:** 8-10 days with 3-4 developers

## Validation Checklist

For each implemented schema:

- [ ] Schema compiles without TypeScript errors
- [ ] No circular dependency warnings
- [ ] Request schemas match API documentation
- [ ] Response schemas validate actual API responses
- [ ] WithRelations uses z.lazy() for all relations
- [ ] Foreign keys are z.string().nullable().optional()
- [ ] All types are exported and inferred from schemas
- [ ] No explicit TypeScript interfaces defined
- [ ] Test data validates successfully
- [ ] Update barrel export in index.ts

## Migration Strategy

### Phase 1: Parallel Implementation
1. Keep old interfaces intact
2. Create new schemas alongside
3. Add compatibility exports

### Phase 2: Gradual Migration
1. Update services to use new schemas
2. Update components one by one
3. Maintain backward compatibility

### Phase 3: Cleanup
1. Remove old interfaces
2. Remove compatibility layers
3. Update all imports

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Task entity complexity | High | Pair programming, extensive testing |
| Circular dependencies | Medium | Use z.lazy() consistently |
| Breaking changes | High | Keep old interfaces during transition |
| API contract mismatch | Medium | Validate with real API responses |
| Team coordination | Medium | Daily sync, clear ownership |

## Success Metrics

- [ ] All 26 missing entities have schemas
- [ ] 100% TypeScript type safety
- [ ] All API endpoints covered
- [ ] Zero runtime errors from schema validation
- [ ] Migration completed without downtime
- [ ] Documentation updated

## Commands Reference

```bash
# Type check
cd /workspace/ever-teams/apps/web
yarn tsc --noEmit

# Check for circular deps
yarn madge --circular lib/contracts

# Generate dependency graph
yarn madge --image graph.svg lib/contracts
```
