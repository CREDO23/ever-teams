/**
 * Organization Types and Schemas
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

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
	
	ownerId: z.string().nullable().optional(),
	contactId: z.string().nullable().optional(),
	imageId: z.string().nullable().optional()
});

export const organizationWithRelationsSchema = organizationSchema.extend({
	owner: z.lazy(() => require('./user.types').userSchema).nullable().optional(),
	employees: z.array(z.lazy(() => require('./employee.types').employeeSchema)).optional(),
	teams: z.array(z.lazy(() => require('./team.types').teamSchema)).optional(),
	tags: z.array(z.lazy(() => require('./tag.types').tagSchema)).optional(),
	invites: z.array(z.lazy(() => require('./invite.types').inviteSchema)).optional()
});

export const getOrganizationRequestSchema = z.object({
	id: z.string().uuid(),
	relations: z.array(z.string()).optional() // ['owner', 'employees', 'teams']
});

export const getOrganizationsRequestSchema = z.object({
	relations: z.array(z.string()).optional(),
	take: z.number().min(1).max(100).optional(),
	skip: z.number().min(0).optional(),
	where: z.object({
		isDefault: z.boolean().optional(),
		name: z.string().optional()
	}).optional()
});

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

export const updateOrganizationRequestSchema = createOrganizationRequestSchema.partial().extend({
	id: z.string().uuid()
});

export const deleteOrganizationRequestSchema = z.object({
	id: z.string().uuid()
});

export const setDefaultOrganizationRequestSchema = z.object({
	organizationId: z.string().uuid()
});

export const organizationResponseSchema = z.object({
	data: organizationWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const organizationsListResponseSchema = z.object({
	data: z.array(organizationWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export const createOrganizationResponseSchema = z.object({
	data: organizationSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const updateOrganizationResponseSchema = z.object({
	data: organizationSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const deleteOrganizationResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

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
