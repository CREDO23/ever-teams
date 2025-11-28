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
// DATABASE SCHEMAS
// ============================================================================

/**
 * Permission database schema - represents the permission table in DB
 */
export const permissionSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Permission name is required'),
	description: z.string().nullable().optional(),
	resource: z.string(),
	action: z.string(),
	enabled: z.boolean().default(true),
	
	// Foreign keys (IDs only)
	roleId: z.string().nullable().optional()
});

/**
 * Role database schema - represents the role table in DB
 */
export const roleSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Role name is required'),
	isSystem: z.boolean().nullable().optional(),
	description: z.string().nullable().optional(),
	
	// Foreign keys (IDs only)
	organizationId: z.string().nullable().optional()
});

/**
 * Role-permission join table schema
 */
export const rolePermissionSchema = basePerTenantEntityModelSchema.extend({
	roleId: z.string(),
	permissionId: z.string(),
	enabled: z.boolean().default(true)
});

// ============================================================================
// WITH RELATIONS SCHEMAS
// ============================================================================

/**
 * Permission with populated relations - for API responses
 */
export const permissionWithRelationsSchema = permissionSchema.extend({
	role: z.lazy(() => require('./role.types').roleSchema).nullable().optional()
});

/**
 * Role with populated relations - for API responses
 */
export const roleWithRelationsSchema = roleSchema.extend({
	// Populated relations
	organization: z.lazy(() => require('./organization.types').organizationSchema).nullable().optional(),
	permissions: z.array(permissionSchema).optional(),
	users: z.array(z.lazy(() => require('./user.types').userSchema)).optional(),
	employees: z.array(z.lazy(() => require('./employee.types').employeeSchema)).optional()
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Get role request schema
 */
export const getRoleRequestSchema = z.object({
	id: z.string().uuid(),
	relations: z.array(z.string()).optional() // ['permissions', 'users', 'organization']
});

/**
 * Get roles list request schema
 */
export const getRolesRequestSchema = z.object({
	organizationId: z.string().uuid().optional(),
	relations: z.array(z.string()).optional(),
	take: z.number().min(1).max(100).optional(),
	skip: z.number().min(0).optional(),
	where: z.object({
		isSystem: z.boolean().optional(),
		name: z.string().optional()
	}).optional()
});

/**
 * Create role request schema
 */
export const createRoleRequestSchema = z.object({
	name: z.string().min(1, 'Role name is required'),
	description: z.string().optional(),
	organizationId: z.string().uuid().optional(),
	permissions: z.array(z.object({
		resource: z.string(),
		action: z.string(),
		enabled: z.boolean().default(true)
	})).optional()
});

/**
 * Update role request schema
 */
export const updateRoleRequestSchema = createRoleRequestSchema.partial().extend({
	id: z.string().uuid()
});

/**
 * Delete role request schema
 */
export const deleteRoleRequestSchema = z.object({
	id: z.string().uuid()
});

/**
 * Assign role to user request
 */
export const assignRoleRequestSchema = z.object({
	userId: z.string().uuid(),
	roleId: z.string().uuid()
});

/**
 * Revoke role from user request
 */
export const revokeRoleRequestSchema = z.object({
	userId: z.string().uuid(),
	roleId: z.string().uuid()
});

/**
 * Update role permissions request
 */
export const updateRolePermissionsRequestSchema = z.object({
	roleId: z.string().uuid(),
	permissions: z.array(z.object({
		id: z.string().uuid().optional(),
		resource: z.string(),
		action: z.string(),
		enabled: z.boolean()
	}))
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Single role response
 */
export const roleResponseSchema = z.object({
	data: roleWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Roles list response
 */
export const rolesListResponseSchema = z.object({
	data: z.array(roleWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Role creation response
 */
export const createRoleResponseSchema = z.object({
	data: roleSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Role update response
 */
export const updateRoleResponseSchema = z.object({
	data: roleSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Role deletion response
 */
export const deleteRoleResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

/**
 * Role assignment response
 */
export const roleAssignmentResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

/**
 * Permissions list response
 */
export const permissionsListResponseSchema = z.object({
	data: z.array(permissionSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type Permission = z.infer<typeof permissionSchema>;
export type Role = z.infer<typeof roleSchema>;
export type RolePermission = z.infer<typeof rolePermissionSchema>;
export type PermissionWithRelations = z.infer<typeof permissionWithRelationsSchema>;
export type RoleWithRelations = z.infer<typeof roleWithRelationsSchema>;

// Request types
export type GetRoleRequest = z.infer<typeof getRoleRequestSchema>;
export type GetRolesRequest = z.infer<typeof getRolesRequestSchema>;
export type CreateRoleRequest = z.infer<typeof createRoleRequestSchema>;
export type UpdateRoleRequest = z.infer<typeof updateRoleRequestSchema>;
export type DeleteRoleRequest = z.infer<typeof deleteRoleRequestSchema>;
export type AssignRoleRequest = z.infer<typeof assignRoleRequestSchema>;
export type RevokeRoleRequest = z.infer<typeof revokeRoleRequestSchema>;
export type UpdateRolePermissionsRequest = z.infer<typeof updateRolePermissionsRequestSchema>;

// Response types
export type RoleResponse = z.infer<typeof roleResponseSchema>;
export type RolesListResponse = z.infer<typeof rolesListResponseSchema>;
export type CreateRoleResponse = z.infer<typeof createRoleResponseSchema>;
export type UpdateRoleResponse = z.infer<typeof updateRoleResponseSchema>;
export type DeleteRoleResponse = z.infer<typeof deleteRoleResponseSchema>;
export type RoleAssignmentResponse = z.infer<typeof roleAssignmentResponseSchema>;
export type PermissionsListResponse = z.infer<typeof permissionsListResponseSchema>;
