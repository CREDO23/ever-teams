import { z } from 'zod';
import { baseEntityModelSchema } from './common.types';
import { imageAssetSchema } from './image-asset.types';
import { organizationSchema } from './organization.types';
import { rolePermissionSchema } from './role.types';

// ============ Database Schema ============
export const tenantSchema = baseEntityModelSchema.extend({
	name: z.string().nullish(),
	logo: z.string().nullish(),
	standardWorkHoursPerDay: z.number().default(8).optional(),
	imageId: z.string().nullish(),
});

// ============ With Relations ============
export const tenantWithRelationsSchema = tenantSchema.extend({
	organizations: z.lazy(() =>
	z.array(organizationSchema)
	).optional(),
	rolePermissions: z.lazy(() =>
	z.array(rolePermissionSchema)
	).optional(),
	image: z.lazy(() =>
	imageAssetSchema
	).optional(),
});

// ============ Request Schemas ============
export const getTenantRequestSchema = z.object({
	id: z.string().optional(),
	includeRelations: z.boolean().optional(),
});

export const createTenantRequestSchema = z.object({
	name: z.string().min(1),
  });

export const updateTenantRequestSchema = createTenantRequestSchema.partial();

// ============ Response Schemas ============
export const tenantResponseSchema = z.object({
	data: tenantWithRelationsSchema,
	success: z.boolean(),
	message: z.string().optional(),
});

export const tenantListResponseSchema = z.object({
	data: z.array(tenantWithRelationsSchema),
	total: z.number(),
	success: z.boolean(),
});

// ============ Type Exports ============
export type Tenant = z.infer<typeof tenantSchema>;
export type TenantWithRelations = z.infer<typeof tenantWithRelationsSchema>;
export type GetTenantRequest = z.infer<typeof getTenantRequestSchema>;
export type CreateTenantRequest = z.infer<typeof createTenantRequestSchema>;
export type UpdateTenantRequest = z.infer<typeof updateTenantRequestSchema>;
export type TenantResponse = z.infer<typeof tenantResponseSchema>;
export type TenantListResponse = z.infer<typeof tenantListResponseSchema>;
