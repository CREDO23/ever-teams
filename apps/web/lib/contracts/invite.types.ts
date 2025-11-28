/**
 * Invite Types and Schemas
 * 
 * Zod schemas are the single source of truth.
 * Types are inferred from schemas, no duplicate interfaces.
 * 
 * @module lib/contracts/invite.types
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Invitation status enum schema
 */
export const inviteStatusEnumSchema = z.enum(['PENDING', 'ACCEPTED', 'EXPIRED', 'REJECTED']);

/**
 * Invitation type enum schema
 */
export const inviteTypeEnumSchema = z.enum(['TEAM', 'USER', 'EMPLOYEE', 'CANDIDATE', 'ADMIN']);

// ============================================================================
// DATABASE SCHEMAS
// ============================================================================

/**
 * Invite database schema - represents the invite table in DB
 */
export const inviteSchema = basePerTenantEntityModelSchema.extend({
	token: z.string().min(1, 'Token is required'),
	email: z.string().email('Invalid email address'),
	status: inviteStatusEnumSchema.default('PENDING'),
	expireDate: z.union([z.date(), z.string()]).nullable().optional(),
	actionDate: z.union([z.date(), z.string()]).nullable().optional(),
	fullName: z.string().nullable().optional(),
	code: z.number().nullable().optional(),
	inviteType: inviteTypeEnumSchema.nullable().optional(),
	
	// Foreign keys (IDs only)
	organizationId: z.string(),
	invitedById: z.string().nullable().optional(),
	roleId: z.string().nullable().optional(),
	userId: z.string().nullable().optional(), // User created from this invite
	employeeId: z.string().nullable().optional() // Employee created from this invite
});

/**
 * Invite-team join table schema
 */
export const inviteTeamSchema = basePerTenantEntityModelSchema.extend({
	inviteId: z.string(),
	teamId: z.string()
});

/**
 * Invite-project join table schema
 */
export const inviteProjectSchema = basePerTenantEntityModelSchema.extend({
	inviteId: z.string(),
	projectId: z.string()
});

// ============================================================================
// WITH RELATIONS SCHEMAS
// ============================================================================

/**
 * Invite with populated relations - for API responses
 */
export const inviteWithRelationsSchema = inviteSchema.extend({
	// Populated relations
	organization: z.lazy(() => require('./organization.types').organizationSchema).nullable().optional(),
	invitedBy: z.lazy(() => require('./user.types').userSchema).nullable().optional(),
	role: z.lazy(() => require('./role.types').roleSchema).nullable().optional(),
	user: z.lazy(() => require('./user.types').userSchema).nullable().optional(),
	employee: z.lazy(() => require('./employee.types').employeeSchema).nullable().optional(),
	teams: z.array(z.lazy(() => require('./team.types').teamSchema)).optional(),
	projects: z.array(z.object({
		id: z.string(),
		name: z.string()
	})).optional() // Project type not yet defined
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Get invite request schema
 */
export const getInviteRequestSchema = z.object({
	id: z.string().uuid().optional(),
	token: z.string().optional(),
	email: z.string().email().optional(),
	relations: z.array(z.string()).optional()
}).refine(
	data => data.id || data.token || data.email,
	{ message: 'Either id, token, or email must be provided' }
);

/**
 * Get invites list request schema
 */
export const getInvitesRequestSchema = z.object({
	organizationId: z.string().uuid(),
	relations: z.array(z.string()).optional(),
	take: z.number().min(1).max(100).optional(),
	skip: z.number().min(0).optional(),
	where: z.object({
		status: inviteStatusEnumSchema.optional(),
		inviteType: inviteTypeEnumSchema.optional(),
		invitedById: z.string().optional(),
		email: z.string().optional()
	}).optional()
});

/**
 * Create invite request schema
 */
export const createInviteRequestSchema = z.object({
	email: z.string().email('Invalid email address'),
	fullName: z.string().optional(),
	organizationId: z.string().uuid(),
	invitedById: z.string().uuid(),
	roleId: z.string().uuid().optional(),
	inviteType: inviteTypeEnumSchema.optional(),
	teamIds: z.array(z.string().uuid()).optional(),
	projectIds: z.array(z.string().uuid()).optional(),
	expireDate: z.union([z.date(), z.string()]).optional()
});

/**
 * Bulk create invites request schema
 */
export const bulkCreateInvitesRequestSchema = z.object({
	emails: z.array(z.object({
		email: z.string().email(),
		fullName: z.string().optional()
	})),
	organizationId: z.string().uuid(),
	invitedById: z.string().uuid(),
	roleId: z.string().uuid().optional(),
	inviteType: inviteTypeEnumSchema.optional(),
	teamIds: z.array(z.string().uuid()).optional(),
	projectIds: z.array(z.string().uuid()).optional(),
	expireDate: z.union([z.date(), z.string()]).optional()
});

/**
 * Accept invite request schema
 */
export const acceptInviteRequestSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	code: z.number().optional(),
	// For new user registration
	fullName: z.string().optional(),
	password: z.string().min(8, 'Password must be at least 8 characters').optional()
});

/**
 * Resend invite request schema
 */
export const resendInviteRequestSchema = z.object({
	id: z.string().uuid(),
	invitedById: z.string().uuid()
});

/**
 * Delete invite request schema
 */
export const deleteInviteRequestSchema = z.object({
	id: z.string().uuid()
});

/**
 * Validate invite token request
 */
export const validateInviteTokenRequestSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	email: z.string().email('Invalid email address')
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Single invite response
 */
export const inviteResponseSchema = z.object({
	data: inviteWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Invites list response
 */
export const invitesListResponseSchema = z.object({
	data: z.array(inviteWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Invite creation response
 */
export const createInviteResponseSchema = z.object({
	data: inviteSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Bulk invite creation response
 */
export const bulkCreateInvitesResponseSchema = z.object({
	data: z.array(inviteSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Accept invite response
 */
export const acceptInviteResponseSchema = z.object({
	data: z.object({
		user: z.lazy(() => require('./user.types').userSchema),
		employee: z.lazy(() => require('./employee.types').employeeSchema).optional(),
		token: z.string().optional() // Auth token if new user
	}),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Resend invite response
 */
export const resendInviteResponseSchema = z.object({
	data: inviteSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Delete invite response
 */
export const deleteInviteResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

/**
 * Validate invite token response
 */
export const validateInviteTokenResponseSchema = z.object({
	valid: z.boolean(),
	invite: inviteWithRelationsSchema.optional(),
	message: z.string().optional(),
	success: z.boolean()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type InviteStatusEnum = z.infer<typeof inviteStatusEnumSchema>;
export type InviteTypeEnum = z.infer<typeof inviteTypeEnumSchema>;
export type Invite = z.infer<typeof inviteSchema>;
export type InviteTeam = z.infer<typeof inviteTeamSchema>;
export type InviteProject = z.infer<typeof inviteProjectSchema>;
export type InviteWithRelations = z.infer<typeof inviteWithRelationsSchema>;

// Request types
export type GetInviteRequest = z.infer<typeof getInviteRequestSchema>;
export type GetInvitesRequest = z.infer<typeof getInvitesRequestSchema>;
export type CreateInviteRequest = z.infer<typeof createInviteRequestSchema>;
export type BulkCreateInvitesRequest = z.infer<typeof bulkCreateInvitesRequestSchema>;
export type AcceptInviteRequest = z.infer<typeof acceptInviteRequestSchema>;
export type ResendInviteRequest = z.infer<typeof resendInviteRequestSchema>;
export type DeleteInviteRequest = z.infer<typeof deleteInviteRequestSchema>;
export type ValidateInviteTokenRequest = z.infer<typeof validateInviteTokenRequestSchema>;

// Response types
export type InviteResponse = z.infer<typeof inviteResponseSchema>;
export type InvitesListResponse = z.infer<typeof invitesListResponseSchema>;
export type CreateInviteResponse = z.infer<typeof createInviteResponseSchema>;
export type BulkCreateInvitesResponse = z.infer<typeof bulkCreateInvitesResponseSchema>;
export type AcceptInviteResponse = z.infer<typeof acceptInviteResponseSchema>;
export type ResendInviteResponse = z.infer<typeof resendInviteResponseSchema>;
export type DeleteInviteResponse = z.infer<typeof deleteInviteResponseSchema>;
export type ValidateInviteTokenResponse = z.infer<typeof validateInviteTokenResponseSchema>;
