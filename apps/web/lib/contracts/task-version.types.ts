import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

// ============ Database Schema ============
export const taskVersionSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  name: z.string(),
  value: z.string(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  isSystem: z.boolean().default(false).optional(),
  // Foreign keys
  projectId: z.string().nullable().optional(),
  organizationTeamId: z.string().nullable().optional(),
});

// ============ With Relations ============
export const taskVersionWithRelationsSchema = taskVersionSchema.extend({
  fullIconUrl: z.string().url().optional(),
  project: z.lazy(() =>
    require('./project.types').projectSchema
  ).optional(),
  organizationTeam: z.lazy(() =>
    require('./team.types').teamSchema
  ).optional(),
});

// ============ Request Schemas ============
export const getTaskVersionRequestSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string().optional(),
  projectId: z.string().optional(),
  organizationTeamId: z.string().optional(),
  tenantId: z.string().optional(),
});

export const getTaskVersionsRequestSchema = z.object({
  organizationId: z.string().optional(),
  projectId: z.string().optional(),
  organizationTeamId: z.string().optional(),
  tenantId: z.string().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().optional(),
});

export const createTaskVersionRequestSchema = z.object({
  name: z.string().min(1),
  value: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  projectId: z.string().optional(),
  organizationId: z.string(),
  tenantId: z.string().nullable().optional(),
  organizationTeamId: z.string().nullable().optional(),
});

export const updateTaskVersionRequestSchema = createTaskVersionRequestSchema.partial();

// ============ Response Schemas ============
export const taskVersionResponseSchema = z.object({
  data: taskVersionWithRelationsSchema,
  success: z.boolean(),
  message: z.string().optional(),
});

export const taskVersionListResponseSchema = z.object({
  data: z.array(taskVersionWithRelationsSchema),
  total: z.number(),
  success: z.boolean(),
});

// ============ Type Exports ============
export type TaskVersion = z.infer<typeof taskVersionSchema>;
export type TaskVersionWithRelations = z.infer<typeof taskVersionWithRelationsSchema>;
export type GetTaskVersionRequest = z.infer<typeof getTaskVersionRequestSchema>;
export type GetTaskVersionsRequest = z.infer<typeof getTaskVersionsRequestSchema>;
export type CreateTaskVersionRequest = z.infer<typeof createTaskVersionRequestSchema>;
export type UpdateTaskVersionRequest = z.infer<typeof updateTaskVersionRequestSchema>;
export type TaskVersionResponse = z.infer<typeof taskVersionResponseSchema>;
export type TaskVersionListResponse = z.infer<typeof taskVersionListResponseSchema>;
