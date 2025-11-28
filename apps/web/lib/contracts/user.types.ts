/**
 * User Types and Schemas
 */

import { z } from 'zod';
import { 
	basePerTenantEntityModelSchema,
	relationalImageAssetSchema,
	languagesEnumSchema,
	componentLayoutStyleEnumSchema,
	timeFormatEnumSchema
} from './common.types';

export const userSchema = basePerTenantEntityModelSchema
	.merge(relationalImageAssetSchema)
	.extend({
		thirdPartyId: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		email: z.string().email().nullable().optional(),
		phoneNumber: z.string().nullable().optional(),
		username: z.string().nullable().optional(),
		timeZone: z.string().nullable().optional(),
		timeFormat: timeFormatEnumSchema.nullable().optional(),
		
		hash: z.string().nullable().optional(),
		refreshToken: z.string().nullable().optional(),
		
		roleId: z.string().nullable().optional(),
		employeeId: z.string().nullable().optional(),
		defaultTeamId: z.string().nullable().optional(),
		lastTeamId: z.string().nullable().optional(),
		defaultOrganizationId: z.string().nullable().optional(),
		lastOrganizationId: z.string().nullable().optional(),
		
		preferredLanguage: z.string().nullable().optional(),
		preferredComponentLayout: componentLayoutStyleEnumSchema.nullable().optional(),
		
		fullName: z.string().nullable().optional(),
		
		isImporting: z.boolean().default(false).optional(),
		sourceId: z.string().nullable().optional(),
		
		code: z.string().nullable().optional(),
		codeExpireAt: z.union([z.date(), z.string()]).nullable().optional(),
		emailVerifiedAt: z.union([z.date(), z.string()]).nullable().optional(),
		emailToken: z.string().nullable().optional(),
		isEmailVerified: z.boolean().default(false).optional(),
		
		lastLoginAt: z.union([z.date(), z.string()]).nullable().optional()
	});

export const userOrganizationSchema = basePerTenantEntityModelSchema.extend({
	userId: z.string(),
	organizationId: z.string(),
	isDefault: z.boolean().default(false).optional(),
	isActive: z.boolean().default(true).optional()
});

export const userWithRelationsSchema = userSchema.extend({
	role: z.lazy(() => {
		const { roleSchema } = require('./role.types');
		return roleSchema.nullable().optional();
	}),
	employee: z.lazy(() => {
		const { employeeSchema } = require('./employee.types');
		return employeeSchema.nullable().optional();
	}),
	defaultTeam: z.lazy(() => {
		const { organizationTeamSchema } = require('./team.types');
		return organizationTeamSchema.nullable().optional();
	}),
	lastTeam: z.lazy(() => {
		const { organizationTeamSchema } = require('./team.types');
		return organizationTeamSchema.nullable().optional();
	}),
	defaultOrganization: z.lazy(() => {
		const { organizationSchema } = require('./organization.types');
		return organizationSchema.nullable().optional();
	}),
	lastOrganization: z.lazy(() => {
		const { organizationSchema } = require('./organization.types');
		return organizationSchema.nullable().optional();
	}),
	tags: z.lazy(() => {
		const { tagSchema } = require('./tag.types');
		return z.array(tagSchema).optional();
	}),
	organizations: z.lazy(() => {
		return z.array(userOrganizationWithRelationsSchema).optional();
	}),
	invites: z.lazy(() => {
		const { inviteSchema } = require('./invite.types');
		return z.array(inviteSchema).optional();
	}),
	socialAccounts: z.lazy(() => {
		const { socialAccountSchema } = require('./social-account.types');
		return z.array(socialAccountSchema).optional();
	})
});

export const userOrganizationWithRelationsSchema = userOrganizationSchema.extend({
	user: z.lazy(() => userSchema).nullable().optional(),
	organization: z.lazy(() => {
		const { organizationSchema } = require('./organization.types');
		return organizationSchema.nullable().optional();
	})
});

// Authentication Requests
export const loginRequestSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
	rememberMe: z.boolean().optional(),
	includeTeams: z.boolean().optional()
});

export const registerRequestSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	confirmPassword: z.string(),
	agreeToTerms: z.boolean().optional(),
	recaptcha: z.string().optional(),
	inviteCode: z.string().optional(),
	organizationId: z.string().optional(),
	featureAsEmployee: z.boolean().optional()
}).refine(
	(data) => data.password === data.confirmPassword,
	{
		message: "Passwords don't match",
		path: ['confirmPassword']
	}
);

export const forgotPasswordRequestSchema = z.object({
	email: z.string().email('Invalid email address')
});

export const resetPasswordRequestSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	confirmPassword: z.string()
}).refine(
	(data) => data.password === data.confirmPassword,
	{
		message: "Passwords don't match",
		path: ['confirmPassword']
	}
);

export const changePasswordRequestSchema = z.object({
	currentPassword: z.string().min(1, 'Current password is required'),
	newPassword: z.string().min(8, 'Password must be at least 8 characters'),
	confirmPassword: z.string()
}).refine(
	(data) => data.newPassword === data.confirmPassword,
	{
		message: "Passwords don't match",
		path: ['confirmPassword']
	}
);

export const verifyEmailRequestSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	code: z.string().optional()
});

// User Management Requests
export const getUserRequestSchema = z.object({
	id: z.string().optional(),
	email: z.string().email().optional(),
	includeEmployee: z.boolean().optional(),
	includeRole: z.boolean().optional(),
	includeOrganization: z.boolean().optional(),
	includeTeams: z.boolean().optional(),
	relations: z.array(z.string()).optional() // ['employee', 'role', 'teams']
});

export const getUsersRequestSchema = z.object({
	page: z.number().min(1).optional(),
	limit: z.number().min(1).max(100).optional(),
	
	search: z.string().optional(),
	organizationId: z.string().optional(),
	tenantId: z.string().optional(),
	roleId: z.string().optional(),
	isActive: z.boolean().optional(),
	isEmailVerified: z.boolean().optional(),
	
	sortBy: z.enum(['createdAt', 'email', 'firstName', 'lastName', 'lastLoginAt']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	
	relations: z.array(z.string()).optional()
});

export const createUserRequestSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	email: z.string().email(),
	username: z.string().optional(),
	password: z.string().min(8).optional(),
	roleId: z.string().optional(),
	organizationId: z.string().optional(),
	startedWorkOn: z.string().optional(),
	tags: z.array(z.string()).optional(),
	featureAsEmployee: z.boolean().optional(),
	preferredLanguage: languagesEnumSchema.optional(),
	preferredComponentLayout: componentLayoutStyleEnumSchema.optional()
});

export const updateUserRequestSchema = createUserRequestSchema.partial().extend({
	id: z.string(),
	isActive: z.boolean().optional(),
	isEmailVerified: z.boolean().optional()
});

export const deleteUserRequestSchema = z.object({
	id: z.string(),
	permanent: z.boolean().optional() // soft delete vs hard delete
});

export const authResponseSchema = z.object({
	user: userWithRelationsSchema,
	token: z.string(),
	refresh_token: z.string().optional(),
	expiresIn: z.number().optional()
});

export const userResponseSchema = z.object({
	data: userWithRelationsSchema,
	message: z.string().optional()
});

export const usersListResponseSchema = z.object({
	data: z.array(userWithRelationsSchema),
	total: z.number(),
	page: z.number().optional(),
	limit: z.number().optional(),
	message: z.string().optional()
});

export const workspaceResponseSchema = z.object({
	token: z.string(),
	user: userWithRelationsSchema,
	workspace: z.object({
		id: z.string(),
		name: z.string(),
		logo: z.string().optional()
	})
});

export const userWorkspacesResponseSchema = z.object({
	workspaces: z.array(workspaceResponseSchema),
	confirmed_email: z.string(),
	show_popup: z.boolean().optional(),
	total_workspaces: z.number(),
	defaultTeamId: z.string().optional(),
	defaultOrganizationId: z.string().optional()
});

// Database entity types
export type User = z.infer<typeof userSchema>;
export type UserOrganization = z.infer<typeof userOrganizationSchema>;

// Response types (with relations)
export type UserWithRelations = z.infer<typeof userWithRelationsSchema>;
export type UserOrganizationWithRelations = z.infer<typeof userOrganizationWithRelationsSchema>;

// Request types
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;
export type GetUserRequest = z.infer<typeof getUserRequestSchema>;
export type GetUsersRequest = z.infer<typeof getUsersRequestSchema>;
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
export type DeleteUserRequest = z.infer<typeof deleteUserRequestSchema>;

// Response types
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UsersListResponse = z.infer<typeof usersListResponseSchema>;
export type WorkspaceResponse = z.infer<typeof workspaceResponseSchema>;
export type UserWorkspacesResponse = z.infer<typeof userWorkspacesResponseSchema>;
