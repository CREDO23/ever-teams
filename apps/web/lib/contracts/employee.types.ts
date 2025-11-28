/**
 * Employee Types and Schemas
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { teamSchema } from './team.types';
import { userSchema } from './user.types';
import { timeLogSchema } from './time-log.types';
import { timeSlotSchema } from './time-slot.types';
import { taskSchema } from './task.types';

export const employeeSchema = basePerTenantEntityModelSchema.extend({
	userId: z.string(),
	contactId: z.string().nullish(),
	organizationPositionId: z.string().nullish(),
	employeeLevel: z.string().nullish(),
	short_description: z.string().max(200).nullish(),
	description: z.string().nullish(),
	startedWorkOn: z.union([z.date(), z.string()]).nullish(),
	endWork: z.union([z.date(), z.string()]).nullish(),
	payPeriod: z.string().nullish(),
	billRateValue: z.number().min(0).nullish(),
	billRateCurrency: z.string().length(3).nullish(),
	minimumBillingRate: z.number().min(0).nullish(),
	reWeeklyLimit: z.number().min(0).nullish(),
	show_anonymous_bonus: z.boolean().default(false).optional(),
	show_average_bonus: z.boolean().default(false).optional(),
	show_average_expenses: z.boolean().default(false).optional(),
	show_average_income: z.boolean().default(false).optional(),
	show_billrate: z.boolean().default(false).optional(),
	show_payperiod: z.boolean().default(false).optional(),
	show_start_work_on: z.boolean().default(false).optional(),
	isJobSearchActive: z.boolean().default(false).optional(),
	isOnline: z.boolean().default(false).optional(),
	isAway: z.boolean().default(false).optional(),
	isTrackingTime: z.boolean().default(false).optional(),
	allowScreenshotCapture: z.boolean().default(true).optional(),
	totalWorkHours: z.number().min(0).default(0).optional(),
	availableHours: z.number().min(0).nullish(),
	todayDuration: z.number().min(0).default(0).optional(),
	weeklyDuration: z.number().min(0).default(0).optional()
});

export const employeeWithRelationsSchema = employeeSchema.extend({
	user: z.lazy(() => userSchema.nullish()),
	organizationPositionId: z.string().nullish(),
	teams: z.lazy(() => z.array(teamSchema).optional()),
	timeLogs: z.lazy(() => z.array(timeLogSchema).optional()),
	timeSlots: z.lazy(() => z.array(timeSlotSchema).optional()),
	tasks: z.lazy(() => z.array(taskSchema).optional())
});

export const getEmployeeRequestSchema = z.object({
	id: z.string().optional(),
	userId: z.string().optional(),
	includeUser: z.boolean().optional(),
	includeOrganization: z.boolean().optional(),
	includeTeams: z.boolean().optional(),
	includeTimeLogs: z.boolean().optional(),
	relations: z.array(z.string()).optional()
});

export const getEmployeesRequestSchema = z.object({
	page: z.number().min(1).optional(),
	limit: z.number().min(1).max(100).optional(),
	search: z.string().optional(),
	organizationId: z.string().optional(),
	tenantId: z.string().optional(),
	isActive: z.boolean().optional(),
	isOnline: z.boolean().optional(),
	isTrackingTime: z.boolean().optional(),
	employeeLevel: z.string().optional(),
	startedWorkOnFrom: z.string().optional(),
	startedWorkOnTo: z.string().optional(),
	sortBy: z.enum(['createdAt', 'startedWorkOn', 'employeeLevel', 'totalWorkHours']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	relations: z.array(z.string()).optional()
});

export const createEmployeeRequestSchema = z.object({
	userId: z.string(),
	organizationId: z.string(),
	startedWorkOn: z.string().optional(),
	employeeLevel: z.string().optional(),
	short_description: z.string().max(200).optional(),
	description: z.string().optional(),
	payPeriod: z.string().optional(),
	billRateValue: z.number().min(0).optional(),
	billRateCurrency: z.string().length(3).optional(),
	minimumBillingRate: z.number().min(0).optional(),
	reWeeklyLimit: z.number().min(0).max(168).optional(), // Max 168 hours/week
	allowScreenshotCapture: z.boolean().optional()
});

export const updateEmployeeRequestSchema = createEmployeeRequestSchema.partial().extend({
	id: z.string(),
	endWork: z.string().nullish(),
	isActive: z.boolean().optional(),
	isJobSearchActive: z.boolean().optional()
});

export const updateEmployeeStatusRequestSchema = z.object({
	id: z.string(),
	isOnline: z.boolean().optional(),
	isAway: z.boolean().optional(),
	isTrackingTime: z.boolean().optional()
});

export const getEmployeeStatisticsRequestSchema = z.object({
	id: z.string(),
	dateFrom: z.string(),
	dateTo: z.string(),
	includeTimeOff: z.boolean().optional(),
	includeExpenses: z.boolean().optional(),
	includeIncome: z.boolean().optional()
});

export const deleteEmployeeRequestSchema = z.object({
	id: z.string(),
	userDeleteOptions: z.enum(['delete', 'deactivate', 'reassign']).optional(),
	reassignToEmployeeId: z.string().optional()
});

export const employeeResponseSchema = z.object({
	data: employeeWithRelationsSchema,
	message: z.string().optional()
});

export const employeesListResponseSchema = z.object({
	data: z.array(employeeWithRelationsSchema),
	total: z.number(),
	page: z.number().optional(),
	limit: z.number().optional(),
	message: z.string().optional()
});

export const employeeStatisticsResponseSchema = z.object({
	employeeId: z.string(),
	totalWorkHours: z.number(),
	todayDuration: z.number(),
	weeklyDuration: z.number(),
	monthlyDuration: z.number(),
	averageDailyHours: z.number(),
	timeOff: z.number().optional(),
	totalExpenses: z.number().optional(),
	totalIncome: z.number().optional(),
	bonus: z.number().optional()
});export type Employee = z.infer<typeof employeeSchema>;export type EmployeeWithRelations = z.infer<typeof employeeWithRelationsSchema>;export type GetEmployeeRequest = z.infer<typeof getEmployeeRequestSchema>;
export type GetEmployeesRequest = z.infer<typeof getEmployeesRequestSchema>;
export type CreateEmployeeRequest = z.infer<typeof createEmployeeRequestSchema>;
export type UpdateEmployeeRequest = z.infer<typeof updateEmployeeRequestSchema>;
export type UpdateEmployeeStatusRequest = z.infer<typeof updateEmployeeStatusRequestSchema>;
export type GetEmployeeStatisticsRequest = z.infer<typeof getEmployeeStatisticsRequestSchema>;
export type DeleteEmployeeRequest = z.infer<typeof deleteEmployeeRequestSchema>;export type EmployeeResponse = z.infer<typeof employeeResponseSchema>;
export type EmployeesListResponse = z.infer<typeof employeesListResponseSchema>;
export type EmployeeStatisticsResponse = z.infer<typeof employeeStatisticsResponseSchema>;
