/**
 * Role Types and Schemas
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { employeeSchema } from './employee.types';
import { organizationSchema } from './organization.types';
import { userSchema } from './user.types';

export const permissionSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Permission name is required'),
	description: z.string().nullish(),
	resource: z.string(),
	action: z.string(),
	enabled: z.boolean().default(true),
	roleId: z.string().nullish()
});

export const roleSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Role name is required'),
	isSystem: z.boolean().nullish(),
	description: z.string().nullish(),
	organizationId: z.string().nullish()
});

export const rolePermissionSchema = basePerTenantEntityModelSchema.extend({
	roleId: z.string(),
	permissionId: z.string(),
	enabled: z.boolean().default(true)
});

export const permissionWithRelationsSchema = permissionSchema.extend({
	role: z.lazy(() => roleSchema).nullish()
});

export const roleWithRelationsSchema = roleSchema.extend({
	organization: z.lazy(() => organizationSchema).nullish(),
	permissions: z.array(permissionSchema).optional(),
	users: z.array(z.lazy(() => userSchema)).optional(),
	employees: z.array(z.lazy(() => employeeSchema)).optional()
});

export const getRoleRequestSchema = z.object({
	id: z.string().uuid(),
	relations: z.array(z.string()).optional() // ['permissions', 'users', 'organization']
});

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

export const updateRoleRequestSchema = createRoleRequestSchema.partial().extend({
	id: z.string().uuid()
});

export const deleteRoleRequestSchema = z.object({
	id: z.string().uuid()
});

export const assignRoleRequestSchema = z.object({
	userId: z.string().uuid(),
	roleId: z.string().uuid()
});

export const revokeRoleRequestSchema = z.object({
	userId: z.string().uuid(),
	roleId: z.string().uuid()
});

export const updateRolePermissionsRequestSchema = z.object({
	roleId: z.string().uuid(),
	permissions: z.array(z.object({
	id: z.string().uuid().optional(),
	resource: z.string(),
	action: z.string(),
	enabled: z.boolean()
	}))
});

export const roleResponseSchema = z.object({
	data: roleWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const rolesListResponseSchema = z.object({
	data: z.array(roleWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export const createRoleResponseSchema = z.object({
	data: roleSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const updateRoleResponseSchema = z.object({
	data: roleSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const deleteRoleResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

export const roleAssignmentResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

export const permissionsListResponseSchema = z.object({
	data: z.array(permissionSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export type Permission = z.infer<typeof permissionSchema>;
export type Role = z.infer<typeof roleSchema>;
export type RolePermission = z.infer<typeof rolePermissionSchema>;
export type PermissionWithRelations = z.infer<typeof permissionWithRelationsSchema>;
export type RoleWithRelations = z.infer<typeof roleWithRelationsSchema>;export type GetRoleRequest = z.infer<typeof getRoleRequestSchema>;
export type GetRolesRequest = z.infer<typeof getRolesRequestSchema>;
export type CreateRoleRequest = z.infer<typeof createRoleRequestSchema>;
export type UpdateRoleRequest = z.infer<typeof updateRoleRequestSchema>;
export type DeleteRoleRequest = z.infer<typeof deleteRoleRequestSchema>;
export type AssignRoleRequest = z.infer<typeof assignRoleRequestSchema>;
export type RevokeRoleRequest = z.infer<typeof revokeRoleRequestSchema>;
export type UpdateRolePermissionsRequest = z.infer<typeof updateRolePermissionsRequestSchema>;export type RoleResponse = z.infer<typeof roleResponseSchema>;
export type RolesListResponse = z.infer<typeof rolesListResponseSchema>;
export type CreateRoleResponse = z.infer<typeof createRoleResponseSchema>;
export type UpdateRoleResponse = z.infer<typeof updateRoleResponseSchema>;
export type DeleteRoleResponse = z.infer<typeof deleteRoleResponseSchema>;
export type RoleAssignmentResponse = z.infer<typeof roleAssignmentResponseSchema>;
export type PermissionsListResponse = z.infer<typeof permissionsListResponseSchema>;
