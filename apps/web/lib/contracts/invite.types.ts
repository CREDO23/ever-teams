/**
 * Invite Types and Schemas
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { employeeSchema } from './employee.types';
import { organizationSchema } from './organization.types';
import { roleSchema } from './role.types';
import { teamSchema } from './team.types';
import { userSchema } from './user.types';

export const inviteStatusEnumSchema = z.enum(['PENDING', 'ACCEPTED', 'EXPIRED', 'REJECTED']);

export const inviteTypeEnumSchema = z.enum(['TEAM', 'USER', 'EMPLOYEE', 'CANDIDATE', 'ADMIN']);

export const inviteSchema = basePerTenantEntityModelSchema.extend({
	token: z.string().min(1, 'Token is required'),
	email: z.string().email('Invalid email address'),
	status: inviteStatusEnumSchema.default('PENDING'),
	expireDate: z.union([z.date(), z.string()]).nullish(),
	actionDate: z.union([z.date(), z.string()]).nullish(),
	fullName: z.string().nullish(),
	code: z.number().nullish(),
	inviteType: inviteTypeEnumSchema.nullish(),
	
	organizationId: z.string(),
	invitedById: z.string().nullish(),
	roleId: z.string().nullish(),
	userId: z.string().nullish(), // User created from this invite
	employeeId: z.string().nullish() // Employee created from this invite
});

export const inviteTeamSchema = basePerTenantEntityModelSchema.extend({
	inviteId: z.string(),
	teamId: z.string()
});

export const inviteProjectSchema = basePerTenantEntityModelSchema.extend({
	inviteId: z.string(),
	projectId: z.string()
});

export const inviteWithRelationsSchema = inviteSchema.extend({
	organization: z.lazy(() => organizationSchema).nullish(),
	invitedBy: z.lazy(() => userSchema).nullish(),
	role: z.lazy(() => roleSchema).nullish(),
	user: z.lazy(() => userSchema).nullish(),
	employee: z.lazy(() => employeeSchema).nullish(),
	teams: z.array(z.lazy(() => teamSchema)).optional(),
	projects: z.array(z.object({
		id: z.string(),
		name: z.string()
	})).optional() // Project type not yet defined
});

export const getInviteRequestSchema = z.object({
	id: z.string().uuid().optional(),
	token: z.string().optional(),
	email: z.string().email().optional(),
	relations: z.array(z.string()).optional()
}).refine(
	data => data.id || data.token || data.email,
	{ message: 'Either id, token, or email must be provided' }
);

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

export const acceptInviteRequestSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	code: z.number().optional(),
	fullName: z.string().optional(),
	password: z.string().min(8, 'Password must be at least 8 characters').optional()
});

export const resendInviteRequestSchema = z.object({
	id: z.string().uuid(),
	invitedById: z.string().uuid()
});

export const deleteInviteRequestSchema = z.object({
	id: z.string().uuid()
});

export const validateInviteTokenRequestSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	email: z.string().email('Invalid email address')
});

export const inviteResponseSchema = z.object({
	data: inviteWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const invitesListResponseSchema = z.object({
	data: z.array(inviteWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export const createInviteResponseSchema = z.object({
	data: inviteSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const bulkCreateInvitesResponseSchema = z.object({
	data: z.array(inviteSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export const acceptInviteResponseSchema = z.object({
	data: z.object({
		user: z.lazy(() => userSchema),
		employee: z.lazy(() => employeeSchema).optional(),
		token: z.string().optional() // Auth token if new user
	}),
	message: z.string().optional(),
	success: z.boolean()
});

export const resendInviteResponseSchema = z.object({
	data: inviteSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const deleteInviteResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

export const validateInviteTokenResponseSchema = z.object({
	valid: z.boolean(),
	invite: inviteWithRelationsSchema.optional(),
	message: z.string().optional(),
	success: z.boolean()
});

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
