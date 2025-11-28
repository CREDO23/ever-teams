/**
 * Organization Types and Schemas
 * 
 * Zod schemas are the single source of truth.
 * Types are inferred from schemas, no duplicate interfaces.
 * 
 * @module lib/contracts/organization.types
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// SCHEMAS
// ============================================================================

/**
 * Organization schema - Single source of truth for organization entity
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
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type Organization = z.infer<typeof organizationSchema>;
export type DefaultOrganization = z.infer<typeof defaultOrganizationSchema>;
export type LastOrganization = z.infer<typeof lastOrganizationSchema>;
