import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';
import { TimeLogSourceEnum, TimeLogTypeEnum } from './timer.types';

export const timeSlotSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  employeeId: z.string(),
  projectId: z.string().nullish(),
  duration: z.number().optional(),
  keyboard: z.number().optional(),
  mouse: z.number().optional(),
  overall: z.number().optional(),
  startedAt: z.string().datetime(),
  stoppedAt: z.string().datetime().nullish(),
  percentage: z.number().optional(),
  keyboardPercentage: z.number().optional(),
  mousePercentage: z.number().optional(),
  isAllowDelete: z.boolean().default(true),
});

export const timeSlotWithRelationsSchema = timeSlotSchema.extend({
  employee: z.lazy(() => require('./employee.types').employeeSchema).optional(),
  project: z.lazy(() => require('./project.types').projectSchema).nullish(),
  activities: z.lazy(() => z.array(require('./activity.types').activitySchema)).optional(),
  screenshots: z.lazy(() => z.array(require('./screenshot.types').screenshotSchema)).optional(),
  timeLogs: z.lazy(() => z.array(require('./time-log.types').timeLogSchema)).optional(),
  timeSlotMinutes: z.lazy(() => z.array(require('./time-slot-minutes.types').timeSlotMinuteSchema)).optional(),
  tags: z.lazy(() => z.array(require('./tag.types').tagSchema)).optional(),
});

export const addManualTimeRequestSchema = z.object({
  employeeId: z.string(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  organizationContactId: z.string().optional(),
  description: z.string().optional(),
  reason: z.string().optional(),
  startedAt: z.string().datetime(),
  stoppedAt: z.string().datetime(),
  editedAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  isBillable: z.boolean().optional(),
  organizationId: z.string().nullish(),
  tenantId: z.string().optional(),
  logType: z.nativeEnum(TimeLogTypeEnum),
  source: z.literal(TimeLogSourceEnum.WEB),
});

export const getTimeSlotsRequestSchema = z.object({
  employeeId: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  projectId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const timeSlotResponseSchema = z.object({
  data: timeSlotWithRelationsSchema,
  message: z.string().optional(),
});

export const timeSlotListResponseSchema = z.object({
  items: z.array(timeSlotWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type TimeSlotWithRelations = z.infer<typeof timeSlotWithRelationsSchema>;
export type AddManualTimeRequest = z.infer<typeof addManualTimeRequestSchema>;
export type GetTimeSlotsRequest = z.infer<typeof getTimeSlotsRequestSchema>;
export type TimeSlotResponse = z.infer<typeof timeSlotResponseSchema>;
export type TimeSlotListResponse = z.infer<typeof timeSlotListResponseSchema>;
