/**
 * Role Types and Schemas
 * 
 * Zod schemas are the single source of truth.
 * Types are inferred from schemas, no duplicate interfaces.
 * 
 * @module lib/contracts/role.types
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// SCHEMAS
// ============================================================================

/**
 * Permission schema
 */
export const permissionSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Permission name is required'),
	description: z.string().optional(),
	resource: z.string(),
	action: z.string(),
	enabled: z.boolean().default(true)
});

/**
 * Role schema - Single source of truth for role entity
 */
export const roleSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Role name is required'),
	isSystem: z.boolean().optional(),
	description: z.string().optional()
});

/**
 * Role with permissions schema
 */
export const roleWithPermissionsSchema = roleSchema.extend({
	permissions: z.array(permissionSchema).optional()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type Permission = z.infer<typeof permissionSchema>;
export type Role = z.infer<typeof roleSchema>;
export type RoleWithPermissions = z.infer<typeof roleWithPermissionsSchema>;
