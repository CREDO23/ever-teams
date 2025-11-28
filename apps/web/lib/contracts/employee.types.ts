/**
 * Employee Types and Schemas
 * 
 * Structure:
 * - Database schemas (as stored in DB with foreign keys)
 * - Response schemas (with populated relations)
 * - Request schemas (for API endpoints)
 * 
 * @module lib/contracts/employee.types
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// DATABASE SCHEMAS (as stored in DB with foreign key IDs)
// ============================================================================

/**
 * Employee database schema - represents the employee table in database
 * Contains only foreign key IDs, not populated data
 */
export const employeeSchema = basePerTenantEntityModelSchema.extend({
	// Foreign keys
	userId: z.string(),
	contactId: z.string().nullable().optional(),
	organizationPositionId: z.string().nullable().optional(),
	
	// Employee details
	employeeLevel: z.string().nullable().optional(),
	short_description: z.string().max(200).nullable().optional(),
	description: z.string().nullable().optional(),
	startedWorkOn: z.union([z.date(), z.string()]).nullable().optional(),
	endWork: z.union([z.date(), z.string()]).nullable().optional(),
	
	// Compensation
	payPeriod: z.string().nullable().optional(),
	billRateValue: z.number().min(0).nullable().optional(),
	billRateCurrency: z.string().length(3).nullable().optional(), // ISO 4217
	minimumBillingRate: z.number().min(0).nullable().optional(),
	reWeeklyLimit: z.number().min(0).nullable().optional(), // Weekly hours limit
	
	// Display preferences
	show_anonymous_bonus: z.boolean().default(false).optional(),
	show_average_bonus: z.boolean().default(false).optional(),
	show_average_expenses: z.boolean().default(false).optional(),
	show_average_income: z.boolean().default(false).optional(),
	show_billrate: z.boolean().default(false).optional(),
	show_payperiod: z.boolean().default(false).optional(),
	show_start_work_on: z.boolean().default(false).optional(),
	
	// Status
	isJobSearchActive: z.boolean().default(false).optional(),
	isOnline: z.boolean().default(false).optional(),
	isAway: z.boolean().default(false).optional(),
	isTrackingTime: z.boolean().default(false).optional(),
	allowScreenshotCapture: z.boolean().default(true).optional(),
	
	// Statistics
	totalWorkHours: z.number().min(0).default(0).optional(),
	availableHours: z.number().min(0).nullable().optional(),
	todayDuration: z.number().min(0).default(0).optional(),
	weeklyDuration: z.number().min(0).default(0).optional()
});

// ============================================================================
// RESPONSE SCHEMAS (with populated relations for API responses)
// ============================================================================

/**
 * Employee with all relations populated - used in API responses
 */
export const employeeWithRelationsSchema = employeeSchema.extend({
	user: z.lazy(() => {
		const { userSchema } = require('./user.types');
		return userSchema.nullable().optional();
	}),
	organizationPosition: z.lazy(() => {
		const { organizationPositionSchema } = require('./organization.types');
		return organizationPositionSchema.nullable().optional();
	}),
	teams: z.lazy(() => {
		const { organizationTeamSchema } = require('./team.types');
		return z.array(organizationTeamSchema).optional();
	}),
	timeLogs: z.array(z.any()).optional(), // TimeLog schema would be defined separately
	timeSlots: z.array(z.any()).optional(), // TimeSlot schema would be defined separately
	tasks: z.array(z.any()).optional() // Task schema would be defined separately
});

// ============================================================================
// REQUEST SCHEMAS (for API endpoints)
// ============================================================================

/**
 * Get employee request schema (query params)
 */
export const getEmployeeRequestSchema = z.object({
	id: z.string().optional(),
	userId: z.string().optional(),
	includeUser: z.boolean().optional(),
	includeOrganization: z.boolean().optional(),
	includeTeams: z.boolean().optional(),
	includeTimeLogs: z.boolean().optional(),
	relations: z.array(z.string()).optional()
});

/**
 * Get employees list request schema (query params)
 */
export const getEmployeesRequestSchema = z.object({
	// Pagination
	page: z.number().min(1).optional(),
	limit: z.number().min(1).max(100).optional(),
	
	// Filtering
	search: z.string().optional(),
	organizationId: z.string().optional(),
	tenantId: z.string().optional(),
	isActive: z.boolean().optional(),
	isOnline: z.boolean().optional(),
	isTrackingTime: z.boolean().optional(),
	employeeLevel: z.string().optional(),
	
	// Date filters
	startedWorkOnFrom: z.string().optional(),
	startedWorkOnTo: z.string().optional(),
	
	// Sorting
	sortBy: z.enum(['createdAt', 'startedWorkOn', 'employeeLevel', 'totalWorkHours']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	
	// Relations
	relations: z.array(z.string()).optional()
});

/**
 * Create employee request schema
 */
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

/**
 * Update employee request schema
 */
export const updateEmployeeRequestSchema = createEmployeeRequestSchema.partial().extend({
	id: z.string(),
	endWork: z.string().nullable().optional(),
	isActive: z.boolean().optional(),
	isJobSearchActive: z.boolean().optional()
});

/**
 * Update employee status request schema
 */
export const updateEmployeeStatusRequestSchema = z.object({
	id: z.string(),
	isOnline: z.boolean().optional(),
	isAway: z.boolean().optional(),
	isTrackingTime: z.boolean().optional()
});

/**
 * Employee work statistics request schema
 */
export const getEmployeeStatisticsRequestSchema = z.object({
	id: z.string(),
	dateFrom: z.string(),
	dateTo: z.string(),
	includeTimeOff: z.boolean().optional(),
	includeExpenses: z.boolean().optional(),
	includeIncome: z.boolean().optional()
});

/**
 * Delete employee request schema
 */
export const deleteEmployeeRequestSchema = z.object({
	id: z.string(),
	userDeleteOptions: z.enum(['delete', 'deactivate', 'reassign']).optional(),
	reassignToEmployeeId: z.string().optional()
});

// ============================================================================
// RESPONSE SCHEMAS (for API responses)
// ============================================================================

/**
 * Employee response schema (single employee)
 */
export const employeeResponseSchema = z.object({
	data: employeeWithRelationsSchema,
	message: z.string().optional()
});

/**
 * Employees list response schema
 */
export const employeesListResponseSchema = z.object({
	data: z.array(employeeWithRelationsSchema),
	total: z.number(),
	page: z.number().optional(),
	limit: z.number().optional(),
	message: z.string().optional()
});

/**
 * Employee statistics response schema
 */
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
});

// ============================================================================
// INFERRED TYPES (Generated from schemas)
// ============================================================================

// Database entity types
export type Employee = z.infer<typeof employeeSchema>;

// Response types (with relations)
export type EmployeeWithRelations = z.infer<typeof employeeWithRelationsSchema>;

// Request types
export type GetEmployeeRequest = z.infer<typeof getEmployeeRequestSchema>;
export type GetEmployeesRequest = z.infer<typeof getEmployeesRequestSchema>;
export type CreateEmployeeRequest = z.infer<typeof createEmployeeRequestSchema>;
export type UpdateEmployeeRequest = z.infer<typeof updateEmployeeRequestSchema>;
export type UpdateEmployeeStatusRequest = z.infer<typeof updateEmployeeStatusRequestSchema>;
export type GetEmployeeStatisticsRequest = z.infer<typeof getEmployeeStatisticsRequestSchema>;
export type DeleteEmployeeRequest = z.infer<typeof deleteEmployeeRequestSchema>;

// Response types
export type EmployeeResponse = z.infer<typeof employeeResponseSchema>;
export type EmployeesListResponse = z.infer<typeof employeesListResponseSchema>;
export type EmployeeStatisticsResponse = z.infer<typeof employeeStatisticsResponseSchema>;
