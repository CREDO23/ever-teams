/**
 * Role Types and Schemas
 * 
 * Type definitions and schemas for user roles and permissions.
 * 
 * @module lib/contracts/role.types
 */

import { z } from 'zod';
import { IBasePerTenantEntityModel, basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Role interface defining user permissions and access levels
 */
export interface IRole extends IBasePerTenantEntityModel {
	name: string;
	isSystem?: boolean;
	description?: string;
}

/**
 * Role permission interface
 */
export interface IRolePermission {
	id?: string;
	roleId: string;
	permission: string;
	enabled: boolean;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Role schema for validation
 */
export const roleSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Role name is required'),
	isSystem: z.boolean().optional(),
	description: z.string().optional()
});

/**
 * Role permission schema
 */
export const rolePermissionSchema = z.object({
	id: z.string().optional(),
	roleId: z.string(),
	permission: z.string(),
	enabled: z.boolean()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TRole = z.infer<typeof roleSchema>;
export type TRolePermission = z.infer<typeof rolePermissionSchema>;
