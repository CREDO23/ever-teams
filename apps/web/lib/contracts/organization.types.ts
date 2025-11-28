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
// DATABASE SCHEMAS
// ============================================================================

/**
 * Organization database schema - represents the organization table in DB
 */
export const organizationSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Organization name is required'),
	isDefault: z.boolean().nullable().optional(),
	profile_link: z.string().nullable().optional(),
	banner: z.string().nullable().optional(),
	totalEmployees: z.number().min(0).nullable().optional(),
	short_description: z.string().max(200).nullable().optional(),
	client_focus: z.string().nullable().optional(),
	overview: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	currency: z.string().length(3).nullable().optional(), // ISO 4217 currency code
	timeZone: z.string().nullable().optional(),
	defaultValueDateType: z.string().nullable().optional(),
	regionCode: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
	contact: z.string().nullable().optional(),
	
	// Foreign keys (IDs only)
	ownerId: z.string().nullable().optional(),
	contactId: z.string().nullable().optional(),
	imageId: z.string().nullable().optional()
});

// ============================================================================
// WITH RELATIONS SCHEMAS
// ============================================================================

/**
 * Organization with populated relations - for API responses
 */
export const organizationWithRelationsSchema = organizationSchema.extend({
	// Populated relations
	owner: z.lazy(() => require('./user.types').userSchema).nullable().optional(),
	employees: z.array(z.lazy(() => require('./employee.types').employeeSchema)).optional(),
	teams: z.array(z.lazy(() => require('./team.types').teamSchema)).optional(),
	tags: z.array(z.lazy(() => require('./tag.types').tagSchema)).optional(),
	invites: z.array(z.lazy(() => require('./invite.types').inviteSchema)).optional()
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Get organization request schema
 */
export const getOrganizationRequestSchema = z.object({
	id: z.string().uuid(),
	relations: z.array(z.string()).optional() // ['owner', 'employees', 'teams']
});

/**
 * Get organizations list request schema
 */
export const getOrganizationsRequestSchema = z.object({
	relations: z.array(z.string()).optional(),
	take: z.number().min(1).max(100).optional(),
	skip: z.number().min(0).optional(),
	where: z.object({
		isDefault: z.boolean().optional(),
		name: z.string().optional()
	}).optional()
});

/**
 * Create organization request schema
 */
export const createOrganizationRequestSchema = z.object({
	name: z.string().min(1, 'Organization name is required'),
	currency: z.string().length(3).optional(),
	timeZone: z.string().optional(),
	regionCode: z.string().optional(),
	website: z.string().url().optional(),
	contact: z.string().email().optional(),
	short_description: z.string().max(200).optional(),
	client_focus: z.string().optional(),
	overview: z.string().optional(),
	imageUrl: z.string().url().optional(),
	banner: z.string().url().optional()
});

/**
 * Update organization request schema
 */
export const updateOrganizationRequestSchema = createOrganizationRequestSchema.partial().extend({
	id: z.string().uuid()
});

/**
 * Delete organization request schema
 */
export const deleteOrganizationRequestSchema = z.object({
	id: z.string().uuid()
});

/**
 * Set default organization request
 */
export const setDefaultOrganizationRequestSchema = z.object({
	organizationId: z.string().uuid()
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Single organization response
 */
export const organizationResponseSchema = z.object({
	data: organizationWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Organizations list response
 */
export const organizationsListResponseSchema = z.object({
	data: z.array(organizationWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Organization creation response
 */
export const createOrganizationResponseSchema = z.object({
	data: organizationSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Organization update response
 */
export const updateOrganizationResponseSchema = z.object({
	data: organizationSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Organization deletion response
 */
export const deleteOrganizationResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type Organization = z.infer<typeof organizationSchema>;
export type OrganizationWithRelations = z.infer<typeof organizationWithRelationsSchema>;

// Request types
export type GetOrganizationRequest = z.infer<typeof getOrganizationRequestSchema>;
export type GetOrganizationsRequest = z.infer<typeof getOrganizationsRequestSchema>;
export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequestSchema>;
export type UpdateOrganizationRequest = z.infer<typeof updateOrganizationRequestSchema>;
export type DeleteOrganizationRequest = z.infer<typeof deleteOrganizationRequestSchema>;
export type SetDefaultOrganizationRequest = z.infer<typeof setDefaultOrganizationRequestSchema>;

// Response types
export type OrganizationResponse = z.infer<typeof organizationResponseSchema>;
export type OrganizationsListResponse = z.infer<typeof organizationsListResponseSchema>;
export type CreateOrganizationResponse = z.infer<typeof createOrganizationResponseSchema>;
export type UpdateOrganizationResponse = z.infer<typeof updateOrganizationResponseSchema>;
export type DeleteOrganizationResponse = z.infer<typeof deleteOrganizationResponseSchema>;
