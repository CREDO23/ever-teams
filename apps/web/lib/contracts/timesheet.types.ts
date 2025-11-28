import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';
import { TimeLogSourceEnum, TimeLogTypeEnum } from './timer.types';

export enum TimesheetStatusEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  DENIED = 'DENIED',
  APPROVED = 'APPROVED'
}

export const timesheetSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  employeeId: z.string(),
  approvedById: z.string().nullable().optional(),
  duration: z.number().optional(),
  keyboard: z.number().optional(),
  mouse: z.number().optional(),
  overall: z.number().optional(),
  startedAt: z.string().datetime().nullable().optional(),
  stoppedAt: z.string().datetime().nullable().optional(),
  approvedAt: z.string().datetime().nullable().optional(),
  submittedAt: z.string().datetime().nullable().optional(),
  lockedAt: z.string().datetime().nullable().optional(),
  editedAt: z.string().datetime().nullable().optional(),
  isBilled: z.boolean().default(false),
  status: z.nativeEnum(TimesheetStatusEnum),
  isEdited: z.boolean().default(false),
  version: z.string().optional(),
});

export const timesheetWithRelationsSchema = timesheetSchema.extend({
  employee: z.lazy(() => require('./employee.types').employeeSchema),
  approvedBy: z.lazy(() => require('./user.types').userSchema).nullable().optional(),
  timeLogs: z.lazy(() => z.array(require('./time-log.types').timeLogSchema)).optional(),
});

export const updateTimesheetStatusRequestSchema = z.object({
  ids: z.union([z.string(), z.array(z.string())]),
  organizationId: z.string().optional(),
  status: z.nativeEnum(TimesheetStatusEnum),
  tenantId: z.string().optional(),
});

export const timesheetCountsStatisticsSchema = z.object({
  employeesCount: z.number(),
  projectsCount: z.number(),
  weekActivities: z.number(),
  weekDuration: z.number(),
  todayActivities: z.number(),
  todayDuration: z.number(),
});

export const updateTimesheetRequestSchema = z.object({
  id: z.string().optional(),
  reason: z.string().optional(),
  organizationContactId: z.string().optional(),
  description: z.string().optional(),
  organizationTeamId: z.string().optional(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  employeeId: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  logType: z.nativeEnum(TimeLogTypeEnum).optional(),
  source: z.nativeEnum(TimeLogSourceEnum).optional(),
  startedAt: z.string().datetime(),
  stoppedAt: z.string().datetime(),
  isBillable: z.boolean(),
});

export const getTimesheetsRequestSchema = z.object({
  employeeId: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  status: z.nativeEnum(TimesheetStatusEnum).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const timesheetResponseSchema = z.object({
  data: timesheetWithRelationsSchema,
  message: z.string().optional(),
});

export const timesheetListResponseSchema = z.object({
  items: z.array(timesheetWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type Timesheet = z.infer<typeof timesheetSchema>;
export type TimesheetWithRelations = z.infer<typeof timesheetWithRelationsSchema>;
export type UpdateTimesheetStatusRequest = z.infer<typeof updateTimesheetStatusRequestSchema>;
export type TimesheetCountsStatistics = z.infer<typeof timesheetCountsStatisticsSchema>;
export type UpdateTimesheetRequest = z.infer<typeof updateTimesheetRequestSchema>;
export type GetTimesheetsRequest = z.infer<typeof getTimesheetsRequestSchema>;
export type TimesheetResponse = z.infer<typeof timesheetResponseSchema>;
export type TimesheetListResponse = z.infer<typeof timesheetListResponseSchema>;
