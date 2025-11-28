/**
 * Employee Types and Schemas
 * 
 * Type definitions and schemas for employee entities.
 * 
 * @module lib/contracts/employee.types
 */

import { z } from 'zod';
import { IBasePerTenantEntityModel, basePerTenantEntityModelSchema, ID } from './common.types';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Employee interface
 */
export interface IEmployee extends IBasePerTenantEntityModel {
	userId: ID;
	employeeLevel?: string;
	short_description?: string;
	description?: string;
	startedWorkOn?: Date | string;
	endWork?: Date | string;
	payPeriod?: string;
	billRateValue?: number;
	billRateCurrency?: string;
	minimumBillingRate?: number;
	show_anonymous_bonus?: boolean;
	show_average_bonus?: boolean;
	show_average_expenses?: boolean;
	show_average_income?: boolean;
	show_billrate?: boolean;
	show_payperiod?: boolean;
	show_start_work_on?: boolean;
	isJobSearchActive?: boolean;
	isOnline?: boolean;
	isAway?: boolean;
	isTrackingTime?: boolean;
	totalWorkHours?: number;
	availableHours?: number;
}

/**
 * Relational employee interface
 */
export interface IRelationalEmployee {
	employee?: IEmployee;
	employeeId?: ID;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Employee schema for validation
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
	employee: z.lazy(() => employeeSchema).optional(),
	employeeId: z.string().optional()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TEmployee = z.infer<typeof employeeSchema>;
export type TRelationalEmployee = z.infer<typeof relationalEmployeeSchema>;
