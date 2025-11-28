import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

// ============ Enums ============
export const taskPriorityEnum = z.enum([
  'NO_PRIORITY',
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
  'CUSTOM'
]);

// ============ Database Schema ============
export const taskPrioritySchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  name: z.string(),
  value: z.string(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  isSystem: z.boolean().default(false).optional(),
  // Foreign keys
  organizationTeamId: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
});

// ============ With Relations ============
export const taskPriorityWithRelationsSchema = taskPrioritySchema.extend({
  fullIconUrl: z.string().url().optional(),
  organizationTeam: z.lazy(() =>
    require('./team.types').teamSchema
  ).optional(),
  project: z.lazy(() =>
    require('./project.types').projectSchema
  ).optional(),
});

// ============ Request Schemas ============
export const getTaskPriorityRequestSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string().optional(),
  organizationTeamId: z.string().optional(),
  projectId: z.string().optional(),
  tenantId: z.string().optional(),
});

export const getTaskPrioritiesRequestSchema = z.object({
  organizationId: z.string().optional(),
  organizationTeamId: z.string().optional(),
  projectId: z.string().optional(),
  tenantId: z.string().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().optional(),
});

export const createTaskPriorityRequestSchema = z.object({
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

export const updateTaskPriorityRequestSchema = createTaskPriorityRequestSchema.partial();

// ============ Response Schemas ============
export const taskPriorityResponseSchema = z.object({
  data: taskPriorityWithRelationsSchema,
  success: z.boolean(),
  message: z.string().optional(),
});

export const taskPriorityListResponseSchema = z.object({
  data: z.array(taskPriorityWithRelationsSchema),
  total: z.number(),
  success: z.boolean(),
});

// ============ Type Exports ============
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type TaskPriorityWithRelations = z.infer<typeof taskPriorityWithRelationsSchema>;
export type GetTaskPriorityRequest = z.infer<typeof getTaskPriorityRequestSchema>;
export type GetTaskPrioritiesRequest = z.infer<typeof getTaskPrioritiesRequestSchema>;
export type CreateTaskPriorityRequest = z.infer<typeof createTaskPriorityRequestSchema>;
export type UpdateTaskPriorityRequest = z.infer<typeof updateTaskPriorityRequestSchema>;
export type TaskPriorityResponse = z.infer<typeof taskPriorityResponseSchema>;
export type TaskPriorityListResponse = z.infer<typeof taskPriorityListResponseSchema>;
