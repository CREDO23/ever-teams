import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';
import { TimeLogSourceEnum, TimeLogTypeEnum } from './timer.types';

export const timeLogSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  timesheetId: z.string().nullish(),
  taskId: z.string().nullish(),
  projectId: z.string().nullish(),
  organizationContactId: z.string().nullish(),
  employeeId: z.string(),
  organizationTeamId: z.string().nullish(),
  source: z.nativeEnum(TimeLogSourceEnum).optional(),
  startedAt: z.string().datetime(),
  stoppedAt: z.string().datetime().nullish(),
  editedAt: z.string().datetime().nullish(),
  logType: z.nativeEnum(TimeLogTypeEnum),
  description: z.string().nullish(),
  reason: z.string().nullish(),
  duration: z.number(),
  isBillable: z.boolean().default(false),
  isRunning: z.boolean().default(false),
  isEdited: z.boolean().default(false),
  version: z.string().optional(),
});

export const timeLogWithRelationsSchema = timeLogSchema.extend({
  timesheet: z.lazy(() => require('./timesheet.types').timesheetSchema).nullish(),
  task: z.lazy(() => require('./task.types').taskSchema).nullish(),
  project: z.lazy(() => require('./project.types').projectSchema).nullish(),
  employee: z.lazy(() => require('./employee.types').employeeSchema).optional(),
  organizationTeam: z.lazy(() => require('./team.types').teamSchema).nullish(),
  timeSlots: z.lazy(() => z.array(require('./time-slot.types').timeSlotSchema)).optional(),
  tags: z.lazy(() => z.array(require('./tag.types').tagSchema)).optional(),
});

export const createTimeLogRequestSchema = z.object({
  taskId: z.string().optional(),
  projectId: z.string().optional(),
  employeeId: z.string(),
  organizationTeamId: z.string().optional(),
  source: z.nativeEnum(TimeLogSourceEnum),
  startedAt: z.string().datetime(),
  stoppedAt: z.string().datetime().optional(),
  logType: z.nativeEnum(TimeLogTypeEnum),
  description: z.string().optional(),
  duration: z.number().min(0),
  isBillable: z.boolean().optional(),
  organizationId: z.string(),
  tenantId: z.string(),
});

export const updateTimeLogRequestSchema = createTimeLogRequestSchema.partial().omit({
  employeeId: true,
  organizationId: true,
  tenantId: true,
});

export const getTimeLogsRequestSchema = z.object({
  employeeId: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  teamId: z.string().optional(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  source: z.nativeEnum(TimeLogSourceEnum).optional(),
  logType: z.nativeEnum(TimeLogTypeEnum).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const timeLogResponseSchema = z.object({
  data: timeLogWithRelationsSchema,
  message: z.string().optional(),
});

export const timeLogListResponseSchema = z.object({
  items: z.array(timeLogWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type TimeLog = z.infer<typeof timeLogSchema>;
export type TimeLogWithRelations = z.infer<typeof timeLogWithRelationsSchema>;
export type CreateTimeLogRequest = z.infer<typeof createTimeLogRequestSchema>;
export type UpdateTimeLogRequest = z.infer<typeof updateTimeLogRequestSchema>;
export type GetTimeLogsRequest = z.infer<typeof getTimeLogsRequestSchema>;
export type TimeLogResponse = z.infer<typeof timeLogResponseSchema>;
export type TimeLogListResponse = z.infer<typeof timeLogListResponseSchema>;
