import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

export const teamEmployeeSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  organizationTeamId: z.string(),
  employeeId: z.string(),
  roleId: z.string().nullish(),
  order: z.number().optional(),
  isTrackingEnabled: z.boolean().default(true),
  activeTaskId: z.string().nullish(),
  isManager: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const teamEmployeeWithRelationsSchema = teamEmployeeSchema.extend({
  organizationTeam: z.lazy(() => require('./team.types').teamSchema),
  employee: z.lazy(() => require('./employee.types').employeeSchema),
  role: z.lazy(() => require('./role.types').roleSchema).nullish(),
  activeTask: z.lazy(() => require('./task.types').taskSchema).nullish(),
  totalWorkedTasks: z.lazy(() => z.array(require('./task.types').taskStatisticsSchema)).optional(),
  totalTodayTasks: z.lazy(() => z.array(require('./task.types').taskStatisticsSchema)).optional(),
});

export const teamEmployeeWithTimerSchema = teamEmployeeWithRelationsSchema.extend({
  duration: z.number().optional(),
  running: z.boolean().optional(),
  lastLog: z.lazy(() => require('./time-log.types').timeLogSchema).nullish(),
  lastWorkedTask: z.lazy(() => require('./task.types').taskSchema).nullish(),
  timerStatus: z.lazy(() => require('./timer.types').timerStatusSchema).optional(),
});

export const createTeamEmployeeRequestSchema = z.object({
  name: z.string().optional(),
  organizationId: z.string(),
  organizationTeamId: z.string(),
  tenantId: z.string(),
  employeeId: z.string(),
  roleId: z.string().optional(),
  isTrackingEnabled: z.boolean().optional(),
  activeTaskId: z.string().optional(),
  order: z.number().optional(),
});

export const updateTeamEmployeeRequestSchema = createTeamEmployeeRequestSchema.partial().extend({
  id: z.string(),
});

export const getTeamEmployeesRequestSchema = z.object({
  organizationTeamId: z.string().optional(),
  employeeId: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  includeRelations: z.array(z.string()).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const teamEmployeeResponseSchema = z.object({
  data: teamEmployeeWithRelationsSchema,
  message: z.string().optional(),
});

export const teamEmployeeListResponseSchema = z.object({
  items: z.array(teamEmployeeWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type TeamEmployee = z.infer<typeof teamEmployeeSchema>;
export type TeamEmployeeWithRelations = z.infer<typeof teamEmployeeWithRelationsSchema>;
export type TeamEmployeeWithTimer = z.infer<typeof teamEmployeeWithTimerSchema>;
export type CreateTeamEmployeeRequest = z.infer<typeof createTeamEmployeeRequestSchema>;
export type UpdateTeamEmployeeRequest = z.infer<typeof updateTeamEmployeeRequestSchema>;
export type GetTeamEmployeesRequest = z.infer<typeof getTeamEmployeesRequestSchema>;
export type TeamEmployeeResponse = z.infer<typeof teamEmployeeResponseSchema>;
export type TeamEmployeeListResponse = z.infer<typeof teamEmployeeListResponseSchema>;
