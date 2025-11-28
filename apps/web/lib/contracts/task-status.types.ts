import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

// ============ Enums ============
export const taskStatusNameEnum = z.enum([
  'TODO',
  'IN_PROGRESS',
  'READY_FOR_REVIEW',
  'IN_REVIEW',
  'BLOCKED',
  'COMPLETED',
  'CUSTOM'
]);

// ============ Database Schema ============
export const taskStatusSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  name: z.string(),
  value: z.string(),
  description: z.string().nullish(),
  icon: z.string().nullish(),
  color: z.string().nullish(),
  order: z.number().nullish(),
  isSystem: z.boolean().default(false).optional(),
  isCollapsed: z.boolean().default(false).optional(),
  isDefault: z.boolean().default(false).optional(),
  template: taskStatusNameEnum.nullish(),
  // Workflow flags
  isTodo: z.boolean().default(false).optional(),
  isInProgress: z.boolean().default(false).optional(),
  isDone: z.boolean().default(false).optional(),
  // Foreign keys
  organizationTeamId: z.string().nullish(),
  projectId: z.string().nullish(),
});

// ============ With Relations ============
export const taskStatusWithRelationsSchema = taskStatusSchema.extend({
  fullIconUrl: z.string().url().optional(),
  organizationTeam: z.lazy(() =>
    require('./team.types').teamSchema
  ).optional(),
  project: z.lazy(() =>
    require('./project.types').projectSchema
  ).optional(),
});

// ============ Request Schemas ============
export const getTaskStatusRequestSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string().optional(),
  organizationTeamId: z.string().optional(),
  projectId: z.string().optional(),
  tenantId: z.string().optional(),
});

export const getTaskStatusesRequestSchema = z.object({
  organizationId: z.string().optional(),
  organizationTeamId: z.string().optional(),
  projectId: z.string().optional(),
  tenantId: z.string().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().optional(),
});

export const createTaskStatusRequestSchema = taskStatusSchema
  .omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true,
    deletedAt: true,
    isActive: true,
    isArchived: true,
    isSystem: true,
  })
  .extend({
    name: z.string().min(1),
    value: z.string().min(1),
  });

export const updateTaskStatusRequestSchema = createTaskStatusRequestSchema.partial();

export const reorderTaskStatusRequestSchema = z.object({
  reorder: z.array(z.object({
    id: z.string(),
    order: z.number(),
  })),
});

// ============ Response Schemas ============
export const taskStatusResponseSchema = z.object({
  data: taskStatusWithRelationsSchema,
  success: z.boolean(),
  message: z.string().optional(),
});

export const taskStatusListResponseSchema = z.object({
  data: z.array(taskStatusWithRelationsSchema),
  total: z.number(),
  success: z.boolean(),
});

// ============ Type Exports ============
export type TaskStatusName = z.infer<typeof taskStatusNameEnum>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskStatusWithRelations = z.infer<typeof taskStatusWithRelationsSchema>;
export type GetTaskStatusRequest = z.infer<typeof getTaskStatusRequestSchema>;
export type GetTaskStatusesRequest = z.infer<typeof getTaskStatusesRequestSchema>;
export type CreateTaskStatusRequest = z.infer<typeof createTaskStatusRequestSchema>;
export type UpdateTaskStatusRequest = z.infer<typeof updateTaskStatusRequestSchema>;
export type ReorderTaskStatusRequest = z.infer<typeof reorderTaskStatusRequestSchema>;
export type TaskStatusResponse = z.infer<typeof taskStatusResponseSchema>;
export type TaskStatusListResponse = z.infer<typeof taskStatusListResponseSchema>;
