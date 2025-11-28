/**
 * Contracts Module - Central export point for all contract types and schemas
 * 
 * This module provides type-safe contracts that match the backend API structure.
 * All types and schemas are designed to be consistent with the ever-gauzy backend.
 * 
 * @module lib/contracts
 */

// Common types and utilities
export * from './common.types';

// Entity-specific contracts
export * from './user.types';
export * from './role.types';
export * from './tag.types';
export * from './organization.types';
export * from './team.types';
export * from './employee.types';
export * from './invite.types';
export * from './social-account.types';

// Future contract exports can be added here:
// export * from './task.types';
// export * from './project.types';
// export * from './timesheet.types';
// export * from './payment.types';
// export * from './candidate.types';

/**
 * Usage Examples:
 * 
 * @example
 * // Import specific types from individual modules
 * import { User, userSchema } from '@/lib/contracts/user.types';
 * import { Role, roleSchema } from '@/lib/contracts/role.types';
 * 
 * @example
 * // Or import from the barrel export
 * import { User, Role, Team, userSchema } from '@/lib/contracts';
 * 
 * @example
 * // Validate user data
 * import { userSchema } from '@/lib/contracts';
 * const validatedUser = userSchema.parse(userData);
 * 
 * @example
 * // Use in API responses
 * import { LoginResponse } from '@/lib/contracts';
 * const response: LoginResponse = await api.login(credentials);
 * 
 * @example
 * // Use common types
 * import { BasePerTenantEntityModel } from '@/lib/contracts';
 * interface MyEntity extends BasePerTenantEntityModel {
 *   myField: string;
 * }
 */
