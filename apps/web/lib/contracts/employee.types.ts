/**
 * Employee Types and Schemas
 * 
 * Zod schemas are the single source of truth.
 * Types are inferred from schemas, no duplicate interfaces.
 * 
 * @module lib/contracts/employee.types
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// BASE SCHEMAS (without relations to avoid circular deps)
// ============================================================================

/**
 * Base employee schema - Single source of truth for employee entity
 */
export const employeeSchema = basePerTenantEntityModelSchema.extend({
	userId: z.string().min(1, 'User ID is required'),
	employeeLevel: z.string().optional(),
	short_description: z.string().max(200).optional(),
	description: z.string().optional(),
	startedWorkOn: z.union([z.date(), z.string()]).optional(),
	endWork: z.union([z.date(), z.string()]).optional(),
	payPeriod: z.string().optional(),
	billRateValue: z.number().min(0).optional(),
	billRateCurrency: z.string().length(3).optional(), // ISO 4217 currency code
	minimumBillingRate: z.number().min(0).optional(),
	show_anonymous_bonus: z.boolean().optional(),
	show_average_bonus: z.boolean().optional(),
	show_average_expenses: z.boolean().optional(),
	show_average_income: z.boolean().optional(),
	show_billrate: z.boolean().optional(),
	show_payperiod: z.boolean().optional(),
	show_start_work_on: z.boolean().optional(),
	isJobSearchActive: z.boolean().optional(),
	isOnline: z.boolean().optional(),
	isAway: z.boolean().optional(),
	isTrackingTime: z.boolean().optional(),
	totalWorkHours: z.number().min(0).optional(),
	availableHours: z.number().min(0).optional()
});

/**
 * Relational employee schema
 */
export const relationalEmployeeSchema = z.object({
	employeeId: z.string().optional()
});

// ============================================================================
// SCHEMAS WITH RELATIONS (use carefully to avoid circular deps)
// ============================================================================

/**
 * Employee schema with all relations
 * Use this only when you need the full related data
 */
export const employeeWithRelationsSchema = employeeSchema.extend({
	user: z.lazy(() => {
		const { userSchema } = require('./user.types');
		return userSchema.optional();
	})
});

/**
 * Relational employee schema with full employee object
 */
export const relationalEmployeeWithRelationsSchema = z.object({
	employee: z.lazy(() => employeeWithRelationsSchema).optional(),
	employeeId: z.string().optional()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeWithRelations = z.infer<typeof employeeWithRelationsSchema>;
export type RelationalEmployee = z.infer<typeof relationalEmployeeSchema>;
export type RelationalEmployeeWithRelations = z.infer<typeof relationalEmployeeWithRelationsSchema>;
