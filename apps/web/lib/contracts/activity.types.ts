import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

export enum ActivityTypeEnum {
  URL = 'URL',
  APP = 'APP',
  CUSTOM = 'CUSTOM'
}

export enum ActivitySourceEnum {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  WEB = 'WEB'
}

export const urlMetaDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const activitySchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  title: z.string(),
  description: z.string().nullish(),
  timeSlotId: z.string().nullish(),
  taskId: z.string().nullish(),
  projectId: z.string().nullish(),
  employeeId: z.string(),
  metaData: z.union([z.string(), urlMetaDataSchema]).nullish(),
  date: z.string(),
  time: z.string(),
  duration: z.number().optional(),
  type: z.string().optional(),
  source: z.string().optional(),
  activityTimestamp: z.string().optional(),
  recordedAt: z.string().datetime().optional(),
});

export const activityWithRelationsSchema = activitySchema.extend({
  timeSlot: z.lazy(() => require('./time-slot.types').timeSlotSchema).nullish(),
  task: z.lazy(() => require('./task.types').taskSchema).nullish(),
  project: z.lazy(() => require('./project.types').projectSchema).nullish(),
  employee: z.lazy(() => require('./employee.types').employeeSchema).optional(),
});

export const activityFilterSchema = z.object({
  type: z.enum(['DATE', 'TICKET']),
  member: z.lazy(() => require('./team-employee.types').teamEmployeeSchema).nullable(),
  taskId: z.string().optional(),
  dateStart: z.string().datetime().optional(),
  dateStop: z.string().datetime().optional(),
});

export const createActivityRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  timeSlotId: z.string().optional(),
  taskId: z.string().optional(),
  projectId: z.string().optional(),
  employeeId: z.string(),
  metaData: z.union([z.string(), urlMetaDataSchema]).optional(),
  date: z.string(),
  time: z.string(),
  duration: z.number().optional(),
  type: z.string().optional(),
  source: z.string().optional(),
  activityTimestamp: z.string().optional(),
  recordedAt: z.string().datetime().optional(),
  organizationId: z.string(),
  tenantId: z.string(),
});

export const getActivitiesRequestSchema = z.object({
  employeeId: z.string().optional(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  dateStart: z.string().optional(),
  dateStop: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const activityResponseSchema = z.object({
  data: activityWithRelationsSchema,
  message: z.string().optional(),
});

export const activityListResponseSchema = z.object({
  items: z.array(activityWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type UrlMetaData = z.infer<typeof urlMetaDataSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type ActivityWithRelations = z.infer<typeof activityWithRelationsSchema>;
export type ActivityFilter = z.infer<typeof activityFilterSchema>;
export type CreateActivityRequest = z.infer<typeof createActivityRequestSchema>;
export type GetActivitiesRequest = z.infer<typeof getActivitiesRequestSchema>;
export type ActivityResponse = z.infer<typeof activityResponseSchema>;
export type ActivityListResponse = z.infer<typeof activityListResponseSchema>;
