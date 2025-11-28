# Contracts Module

This module contains TypeScript interfaces and Zod schemas that define the data contracts between the frontend and backend. All types are designed to match the [ever-gauzy](https://github.com/ever-co/ever-gauzy) backend API structure.

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

## File Organization

### `common.types.ts`
Contains shared types used across multiple entities:
- Base interfaces (`IBasePerTenantEntityModel`, `IRelationalImageAsset`)
- Common enums (`LanguagesEnum`, `TimeFormatEnum`, `ProviderEnum`)
- Base Zod schemas
- Utility types (`ID`)

### Entity-Specific Files
Each entity has its own file containing:
- Interfaces for the entity
- Input/Output interfaces
- Zod schemas for validation
- Type exports

#### `user.types.ts`
- `IUser` - Main user interface
- `IUserOrganization` - User-organization relationship
- Authentication interfaces (`IAuthResponse`, `IUserSigninWorkspaceResponse`)
- User input interfaces (`IUserCreateInput`, `IUserLoginInput`)

#### `role.types.ts`
- `IRole` - Role definition
- `IRolePermission` - Role permissions

#### `tag.types.ts`
- `ITag` - Tag/label definition
- `IRelationalTag` - Tag relationships

#### `organization.types.ts`
- `IOrganization` - Organization entity
- Organization preferences

#### `team.types.ts`
- `IOrganizationTeam` - Team entity
- `ITeamMember` - Team membership

#### `employee.types.ts`
- `IEmployee` - Employee profile
- `IRelationalEmployee` - Employee relationships

#### `invite.types.ts`
- `IInvite` - Invitation entity
- `InviteStatusEnum` - Invitation statuses
- Invite input interfaces

#### `social-account.types.ts`
- `ISocialAccount` - OAuth account entity
- `ISocialLoginInput` - Social login data

## Usage

### Import Patterns

```typescript
// Import from specific modules (recommended for tree-shaking)
import { IUser, userSchema } from '@/lib/contracts/user.types';
import { IRole } from '@/lib/contracts/role.types';
import { ID, IBasePerTenantEntityModel } from '@/lib/contracts/common.types';

// Or import from barrel export
import { IUser, IRole, ID, userSchema } from '@/lib/contracts';
```

### Validate Data

```typescript
import { userSchema } from '@/lib/contracts/user.types';

// Validate incoming data
try {
  const validUser = userSchema.parse(userData);
  // validUser is now type-safe
} catch (error) {
  // Handle validation errors
}

// Safe parse without throwing
const result = userSchema.safeParse(userData);
if (result.success) {
  // result.data is validated
} else {
  // result.error contains validation errors
}
```

### Type API Responses

```typescript
import { IUserLoginInput, TAuthResponse } from '@/lib/contracts/user.types';
import { authResponseSchema } from '@/lib/contracts/user.types';

async function login(credentials: IUserLoginInput): Promise<TAuthResponse> {
  const response = await api.post('/auth/login', credentials);
  return authResponseSchema.parse(response.data);
}
```

### Use in React Components

```typescript
import { IUser } from '@/lib/contracts/user.types';
import { IOrganizationTeam } from '@/lib/contracts/team.types';

interface UserProfileProps {
  user: IUser;
  team?: IOrganizationTeam;
}

export function UserProfile({ user, team }: UserProfileProps) {
  return (
    <div>
      <h1>{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
      {team && <p>Team: {team.name}</p>}
    </div>
  );
}
```

### Form Validation

```typescript
import { userRegistrationInputSchema } from '@/lib/contracts/user.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function RegistrationForm() {
  const form = useForm({
    resolver: zodResolver(userRegistrationInputSchema),
    defaultValues: {
      user: {},
      password: '',
      confirmPassword: ''
    }
  });

  // Form will automatically validate against schema
}
```

### Extending Base Types

```typescript
import { IBasePerTenantEntityModel } from '@/lib/contracts/common.types';

interface ICustomEntity extends IBasePerTenantEntityModel {
  customField: string;
  customNumber: number;
}
```

## Best Practices

1. **Import from specific modules** when possible for better tree-shaking
2. **Always validate API responses** using Zod schemas before using the data
3. **Use interfaces for props** and type inference for internal state
4. **Keep contracts in sync** with backend API changes
5. **One file per entity** - maintain separation of concerns
6. **Reuse common types** from `common.types.ts` instead of duplicating
7. **Document breaking changes** when updating contracts

## Maintenance

When the backend API changes:

1. Check the [ever-gauzy contracts](https://github.com/ever-co/ever-gauzy/tree/develop/packages/contracts/src)
2. Update the corresponding `.types.ts` file
3. Update both the interface and Zod schema
4. Run type checking to ensure no breaking changes: `yarn tsc --noEmit`
5. Update any affected components or services
6. Update this README if new files are added

## Future Additions

Planned contract files:

- `candidate.types.ts` - Candidate management types
- `task.types.ts` - Task and project types
- `project.types.ts` - Project management types
- `timesheet.types.ts` - Time tracking types
- `payment.types.ts` - Payment and billing types
- `integration.types.ts` - Third-party integration types
- `report.types.ts` - Reporting and analytics types
