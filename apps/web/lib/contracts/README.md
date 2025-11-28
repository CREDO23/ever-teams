# Contracts Module

This module contains TypeScript interfaces and Zod schemas that define the data contracts between the frontend and backend. All types are designed to match the [ever-gauzy](https://github.com/ever-co/ever-gauzy) backend API structure.

## Important: Avoiding Circular Dependencies

To prevent circular dependencies, we separate schemas into two categories:

### 1. Base Schemas (Default)
- Contain only primitive fields and IDs
- No nested entity references
- Safe to import anywhere
- Named: `{entityName}Schema`

### 2. WithRelations Schemas
- Include full nested entity references
- Use `z.lazy()` and dynamic imports to avoid circular deps
- Use only when you need the full related data
- Named: `{entityName}WithRelationsSchema`

**Example:**
```typescript
// ✅ Use base schema for simple validation (no circular deps)
import { userSchema, employeeSchema } from '@/lib/contracts';

// ✅ Use WithRelations schema when you need nested data
import { userWithRelationsSchema } from '@/lib/contracts';

const userWithEmployee = userWithRelationsSchema.parse({
  id: '123',
  email: 'user@example.com',
  employee: { /* full employee data */ }
});
```

## Structure

```
lib/contracts/
├── index.ts                 # Main barrel export file
├── common.types.ts          # Shared base types, enums, and utilities
├── user.types.ts            # User authentication and profile types
├── role.types.ts            # Role and permission types
├── tag.types.ts             # Tag and label types
├── organization.types.ts   # Organization types
├── team.types.ts            # Team and team member types
├── employee.types.ts       # Employee profile types
├── invite.types.ts          # Invitation types
├── social-account.types.ts  # OAuth social account types
└── README.md                # This file
```

## Available Modules

| Module | Base Schema | WithRelations Schema | Key Types |
|--------|-------------|---------------------|----------|
| `user.types.ts` | `userSchema` | `userWithRelationsSchema` | `IUser`, `TUser`, `TUserWithRelations` |
| `employee.types.ts` | `employeeSchema` | `employeeWithRelationsSchema` | `IEmployee`, `TEmployee`, `TEmployeeWithRelations` |
| `role.types.ts` | `roleSchema` | - | `IRole`, `IPermission` |
| `tag.types.ts` | `tagSchema` | - | `ITag`, `IRelationalTag` |
| `organization.types.ts` | `organizationSchema` | - | `IOrganization` |
| `team.types.ts` | `organizationTeamSchema` | - | `IOrganizationTeam`, `ITeamMember` |
| `invite.types.ts` | `inviteSchema` | - | `IInvite`, `InviteStatusEnum` |
| `social-account.types.ts` | `socialAccountSchema` | - | `ISocialAccount` |

## Usage Examples

### Basic Import (No Circular Deps)

```typescript
import { IUser, userSchema } from '@/lib/contracts';

// Validate user data
const validatedUser = userSchema.parse(userData);
```

### Using WithRelations Schemas

```typescript
// When you need the full nested data
import { userWithRelationsSchema, TUserWithRelations } from '@/lib/contracts';

const userWithAllData: TUserWithRelations = userWithRelationsSchema.parse({
  id: '123',
  email: 'user@example.com',
  employee: { 
    id: '456',
    userId: '123',
    employeeLevel: 'Senior'
  },
  role: { 
    id: '789',
    name: 'Admin'
  },
  tags: [{ id: 'tag1', name: 'VIP' }]
});
```

### Type Guards

```typescript
import { userSchema } from '@/lib/contracts';

function isValidUser(data: unknown): data is IUser {
  try {
    userSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}
```

### API Response Handling

```typescript
import { authResponseSchema, TAuthResponse } from '@/lib/contracts';

async function login(credentials: LoginCredentials): Promise<TAuthResponse> {
  const response = await api.post('/auth/login', credentials);
  // Validate and type the response
  return authResponseSchema.parse(response.data);
}
```

## Development Guidelines

### Adding New Types

1. Create a new file: `{entity}.types.ts`
2. Define interfaces first
3. Create base Zod schemas (without relations)
4. If needed, create WithRelations schemas (with nested entities)
5. Export inferred types from schemas
6. Add exports to `index.ts`
7. Document in this README

### Template for New Entity Type

```typescript
// {entity}.types.ts
import { z } from 'zod';
import { IBasePerTenantEntityModel, basePerTenantEntityModelSchema } from './common.types';

// Interfaces
export interface I{Entity} extends IBasePerTenantEntityModel {
  name: string;
  // ... other fields
}

// Base schema (no relations)
export const {entity}Schema = basePerTenantEntityModelSchema.extend({
  name: z.string(),
  // ... other fields (IDs only for relations)
});

// WithRelations schema (if needed)
export const {entity}WithRelationsSchema = {entity}Schema.extend({
  relatedEntity: z.lazy(() => {
    const { relatedEntitySchema } = require('./related-entity.types');
    return relatedEntitySchema.optional();
  })
});

// Type exports
export type T{Entity} = z.infer<typeof {entity}Schema>;
export type T{Entity}WithRelations = z.infer<typeof {entity}WithRelationsSchema>;
```

### Naming Conventions

- **Interfaces**: `I{EntityName}` (e.g., `IUser`)
- **Types**: `T{EntityName}` (e.g., `TUser`)
- **Base Schemas**: `{entityName}Schema` (e.g., `userSchema`)
- **Relation Schemas**: `{entityName}WithRelationsSchema` (e.g., `userWithRelationsSchema`)
- **Enums**: `{EntityName}Enum` (e.g., `InviteStatusEnum`)
- **Input Types**: `I{Action}{Entity}Input` (e.g., `IUserCreateInput`)

### Best Practices

1. **Always create base schemas first** - They should work independently
2. **Use WithRelations schemas sparingly** - Only when you actually need nested data
3. **Keep types aligned with backend DTOs** - Match the ever-gauzy structure
4. **Use Zod for runtime validation** - Catch errors early
5. **Prefer composition over duplication** - Reuse common schemas
6. **Document complex types with JSDoc** - Help future developers
7. **Use enums for fixed sets of values** - Type safety for constants
8. **Test imports** - Ensure no circular dependencies

## Testing

```bash
# Type check
yarn typecheck

# Test schemas
yarn test

# Quick test for circular deps
npx tsx -e "import * as contracts from './lib/contracts'; console.log('✅ No circular deps');"
```

## Migration Guide

### From Old Types

```typescript
// ❌ Old
import { IUser } from '@/core/types/interfaces';

// ✅ New
import { IUser } from '@/lib/contracts';
```

### Handling Relations

```typescript
// ❌ Old - might cause circular deps
const userSchema = z.object({
  employee: employeeSchema
});

// ✅ New - base schema
const userSchema = z.object({
  employeeId: z.string()
});

// ✅ New - with relations when needed
const userWithRelationsSchema = userSchema.extend({
  employee: z.lazy(() => require('./employee.types').employeeSchema)
});
```

## Future Additions

Planned entity types:
- `task.types.ts` - Task management
- `project.types.ts` - Project management
- `timesheet.types.ts` - Time tracking
- `payment.types.ts` - Payments and billing
- `candidate.types.ts` - Candidate management
- `integration.types.ts` - Third-party integrations
- `report.types.ts` - Reporting and analytics

## Troubleshooting

### Circular Dependency Error

If you see: `Cannot access 'X' before initialization`

**Solution:** Use the base schema instead of WithRelations schema, or use `z.lazy()` with dynamic imports.

### Type Inference Issues

If TypeScript can't infer types from WithRelations schemas:

**Solution:** Explicitly type the variable:
```typescript
const user: TUserWithRelations = userWithRelationsSchema.parse(data);
```
