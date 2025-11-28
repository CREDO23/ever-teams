/**
 * Organization Types and Schemas
 * 
 * Type definitions and schemas for organizations.
 * 
 * @module lib/contracts/organization.types
 */

import { z } from 'zod';
import { IBasePerTenantEntityModel, basePerTenantEntityModelSchema, ID } from './common.types';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Organization interface
 */
export interface IOrganization extends IBasePerTenantEntityModel {
	name: string;
	isDefault?: boolean;
	profile_link?: string;
	banner?: string;
	totalEmployees?: number;
	short_description?: string;
	client_focus?: string;
	overview?: string;
	imageUrl?: string;
	currency?: string;
	timeZone?: string;
	defaultValueDateType?: string;
	regionCode?: string;
	website?: string;
	contact?: string;
}

/**
 * Default organization interface
 */
export interface IDefaultOrganization {
	defaultOrganizationId?: ID;
}

/**
 * Last organization interface
 */
export interface ILastOrganization {
	lastOrganizationId?: ID;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Organization schema for validation
 */
export const organizationSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Organization name is required'),
	isDefault: z.boolean().optional(),
	profile_link: z.string().optional(),
	banner: z.string().optional(),
	totalEmployees: z.number().min(0).optional(),
	short_description: z.string().max(200).optional(),
	client_focus: z.string().optional(),
	overview: z.string().optional(),
	imageUrl: z.string().url().optional(),
	currency: z.string().length(3).optional(), // ISO 4217 currency code
	timeZone: z.string().optional(),
	defaultValueDateType: z.string().optional(),
	regionCode: z.string().optional(),
	website: z.string().url().optional(),
	contact: z.string().optional()
});

/**
 * Default organization schema
 */
export const defaultOrganizationSchema = z.object({
	defaultOrganizationId: z.string().optional()
});

/**
 * Last organization schema
 */
export const lastOrganizationSchema = z.object({
	lastOrganizationId: z.string().optional()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TOrganization = z.infer<typeof organizationSchema>;
export type TDefaultOrganization = z.infer<typeof defaultOrganizationSchema>;
export type TLastOrganization = z.infer<typeof lastOrganizationSchema>;
