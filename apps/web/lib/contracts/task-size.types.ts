import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { projectSchema } from './project.types';
import { teamSchema } from './team.types';

// ============ Enums ============
export const taskSizeEnum = z.enum([
  'X_LARGE',
  'LARGE',
  'MEDIUM',
  'SMALL',
  'TINY',
  'CUSTOM'
]);

// ============ Database Schema ============
export const taskSizeSchema = basePerTenantEntityModelSchema.extend({
  name: z.string(),
  value: z.string(),
  description: z.string().nullish(),
  icon: z.string().nullish(),
  color: z.string().nullish(),
  isSystem: z.boolean().default(false).optional(),
  // Foreign keys
  organizationTeamId: z.string().nullish(),
  projectId: z.string().nullish(),
});

// ============ With Relations ============
export const taskSizeWithRelationsSchema = taskSizeSchema.extend({
  fullIconUrl: z.string().url().optional(),
  organizationTeam: z.lazy(() =>
    teamSchema
  ).optional(),
  project: z.lazy(() =>
    projectSchema
  ).optional(),
});

// ============ Request Schemas ============
export const getTaskSizeRequestSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string().optional(),
  organizationTeamId: z.string().optional(),
  projectId: z.string().optional(),
  tenantId: z.string().optional(),
});

export const getTaskSizesRequestSchema = z.object({
  organizationId: z.string().optional(),
  organizationTeamId: z.string().optional(),
  projectId: z.string().optional(),
  tenantId: z.string().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().optional(),
});

export const createTaskSizeRequestSchema = z.object({
  name: z.string().min(1),
  value: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  projectId: z.string().optional(),
  organizationId: z.string(),
  tenantId: z.string().nullish(),
  organizationTeamId: z.string().nullish(),
});

export const updateTaskSizeRequestSchema = createTaskSizeRequestSchema.partial();

// ============ Response Schemas ============
export const taskSizeResponseSchema = z.object({
  data: taskSizeWithRelationsSchema,
  success: z.boolean(),
  message: z.string().optional(),
});

export const taskSizeListResponseSchema = z.object({
  data: z.array(taskSizeWithRelationsSchema),
  total: z.number(),
  success: z.boolean(),
});

// ============ Type Exports ============
export type TaskSize = z.infer<typeof taskSizeSchema>;
export type TaskSizeWithRelations = z.infer<typeof taskSizeWithRelationsSchema>;
export type GetTaskSizeRequest = z.infer<typeof getTaskSizeRequestSchema>;
export type GetTaskSizesRequest = z.infer<typeof getTaskSizesRequestSchema>;
export type CreateTaskSizeRequest = z.infer<typeof createTaskSizeRequestSchema>;
export type UpdateTaskSizeRequest = z.infer<typeof updateTaskSizeRequestSchema>;
export type TaskSizeResponse = z.infer<typeof taskSizeResponseSchema>;
export type TaskSizeListResponse = z.infer<typeof taskSizeListResponseSchema>;
