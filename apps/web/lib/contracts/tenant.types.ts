import { z } from 'zod';
import { baseEntitySchema } from './common.types';

// ============ Database Schema ============
export const tenantSchema = baseEntitySchema.extend({
  name: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  standardWorkHoursPerDay: z.number().default(8).optional(),
  imageId: z.string().nullable().optional(),
});

// ============ With Relations ============
export const tenantWithRelationsSchema = tenantSchema.extend({
  organizations: z.lazy(() =>
    z.array(require('./organization.types').organizationSchema)
  ).optional(),
  rolePermissions: z.lazy(() =>
    z.array(require('./role.types').rolePermissionSchema)
  ).optional(),
  image: z.lazy(() => 
    require('./image-asset.types').imageAssetSchema
  ).optional(),
});

// ============ Request Schemas ============
export const getTenantRequestSchema = z.object({
  id: z.string().optional(),
  includeRelations: z.boolean().optional(),
});

export const createTenantRequestSchema = tenantSchema
  .omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true,
    deletedAt: true,
    isActive: true,
    isArchived: true,
  })
  .extend({
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
