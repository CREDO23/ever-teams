/**
 * User Types and Schemas
 * 
 * Zod schemas are the single source of truth.
 * Types are inferred from schemas, no duplicate interfaces.
 * 
 * @module lib/contracts/user.types
 */

import { z } from 'zod';
import { 
	basePerTenantEntityModelSchema,
	relationalImageAssetSchema,
	languagesEnumSchema,
	componentLayoutStyleEnumSchema,
	timeFormatEnumSchema
} from './common.types';

// ============================================================================
// BASE SCHEMAS (without relations to avoid circular deps)
// ============================================================================

/**
 * Base user schema - Single source of truth for user entity
 */
export const userSchema = basePerTenantEntityModelSchema.merge(relationalImageAssetSchema)
	.extend({
		thirdPartyId: z.string().optional(),
		name: z.string().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		email: z.string().email().optional(),
		phoneNumber: z.string().optional(),
		username: z.string().optional(),
		timeZone: z.string().optional(),
		timeFormat: timeFormatEnumSchema.optional(),
		roleId: z.string().optional(),
		hash: z.string().optional(),
		refreshToken: z.string().optional(),
		employeeId: z.string().optional(),
		defaultTeamId: z.string().optional(),
		lastTeamId: z.string().optional(),
		defaultOrganizationId: z.string().optional(),
		lastOrganizationId: z.string().optional(),
		preferredLanguage: z.string().optional(),
		preferredComponentLayout: componentLayoutStyleEnumSchema.optional(),
		fullName: z.string().optional(),
		isImporting: z.boolean().optional(),
		sourceId: z.string().optional(),
		code: z.string().optional(),
		codeExpireAt: z.union([z.date(), z.string()]).optional(),
		emailVerifiedAt: z.union([z.date(), z.string()]).optional(),
		lastLoginAt: z.union([z.date(), z.string()]).optional(),
		isEmailVerified: z.boolean().optional(),
		emailToken: z.string().optional()
	});

/**
 * User-Organization relationship schema
 */
export const userOrganizationSchema = basePerTenantEntityModelSchema.extend({
	userId: z.string(),
	organizationId: z.string(),
	isDefault: z.boolean().optional(),
	isActive: z.boolean().optional()
});

/**
 * Relational user schema
 */
export const relationalUserSchema = z.object({
	userId: z.string().optional()
});

/**
 * User view model schema for display purposes
 */
export const userViewModelSchema = basePerTenantEntityModelSchema.extend({
	fullName: z.string(),
	email: z.string().email(),
	employeeId: z.string().optional(),
	bonus: z.number().optional(),
	endWork: z.any().optional(),
	id: z.string(),
	roleName: z.string().optional(),
	role: z.string().optional(),
	userOrganizationId: z.string().optional()
});

/**
 * User statistics schema
 */
export const userStatsSchema = z.object({
	count: z.number(),
	lastMonthActiveUsers: z.number()
});

// ============================================================================
// INPUT SCHEMAS
// ============================================================================

/**
 * User find input schema
 */
export const userFindInputSchema = basePerTenantEntityModelSchema.extend({
	thirdPartyId: z.string().optional(),
	email: z.string().email().optional()
});

/**
 * User email input schema
 */
export const userEmailInputSchema = z.object({
	email: z.string().email('Invalid email address')
});

/**
 * User password input schema
 */
export const userPasswordInputSchema = z.object({
	password: z.string().min(8, 'Password must be at least 8 characters')
});

/**
 * User login input schema
 */
export const userLoginInputSchema = userEmailInputSchema.merge(userPasswordInputSchema);

/**
 * User token input schema
 */
export const userTokenInputSchema = z.object({
	token: z.string()
});

/**
 * User create input schema
 */
export const userCreateInputSchema = relationalImageAssetSchema.extend({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().email().optional(),
	phoneNumber: z.string().optional(),
	username: z.string().optional(),
	roleId: z.string().optional(),
	hash: z.string().optional(),
	preferredLanguage: languagesEnumSchema.optional(),
	preferredComponentLayout: componentLayoutStyleEnumSchema.optional(),
	timeZone: z.string().optional(),
	timeFormat: timeFormatEnumSchema.optional(),
	defaultTeamId: z.string().optional(),
	lastTeamId: z.string().optional(),
	defaultOrganizationId: z.string().optional(),
	lastOrganizationId: z.string().optional()
});

/**
 * User update input schema
 */
export const userUpdateInputSchema = userCreateInputSchema.extend({
	id: z.string().optional()
});

/**
 * User registration input schema
 */
export const userRegistrationInputSchema = z.object({
	user: userSchema,
	password: z.string().min(8).optional(),
	confirmPassword: z.string().min(8).optional(),
	originalUrl: z.string().optional(),
	organizationId: z.string().optional(),
	createdByUserId: z.string().optional(),
	isImporting: z.boolean().optional(),
	sourceId: z.string().optional(),
	inviteId: z.string().optional(),
	featureAsEmployee: z.boolean().optional()
}).refine(
	(data) => !data.password || data.password === data.confirmPassword,
	{
		message: "Passwords don't match",
		path: ['confirmPassword']
	}
);

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Auth response schema
 */
export const authResponseSchema = z.object({
	user: userSchema,
	token: z.string(),
	refresh_token: z.string().optional()
});

/**
 * Workspace response schema
 */
export const workspaceResponseSchema = z.object({
	token: z.string(),
	user: userSchema
});

/**
 * Sign-in workspace response schema
 */
export const userSigninWorkspaceResponseSchema = z.object({
	workspaces: z.array(workspaceResponseSchema),
	confirmed_email: z.string(),
	show_popup: z.boolean().optional(),
	total_workspaces: z.number().optional(),
	defaultTeamId: z.string().optional(),
	defaultOrganizationId: z.string().optional(),
	lastTeamId: z.string().optional(),
	lastOrganizationId: z.string().optional()
});

// ============================================================================
// SCHEMAS WITH RELATIONS (use carefully to avoid circular deps)
// ============================================================================

/**
 * User schema with all relations
 * Use this only when you need the full related data
 */
export const userWithRelationsSchema = userSchema.extend({
	role: z.lazy(() => {
		const { roleSchema } = require('./role.types');
		return roleSchema.optional();
	}),
	employee: z.lazy(() => {
		const { employeeSchema } = require('./employee.types');
		return employeeSchema.optional();
	}),
	defaultTeam: z.lazy(() => {
		const { organizationTeamSchema } = require('./team.types');
		return organizationTeamSchema.optional();
	}),
	lastTeam: z.lazy(() => {
		const { organizationTeamSchema } = require('./team.types');
		return organizationTeamSchema.optional();
	}),
	defaultOrganization: z.lazy(() => {
		const { organizationSchema } = require('./organization.types');
		return organizationSchema.optional();
	}),
	lastOrganization: z.lazy(() => {
		const { organizationSchema } = require('./organization.types');
		return organizationSchema.optional();
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

/**
 * User view model with relations schema
 */
export const userViewModelWithRelationsSchema = userViewModelSchema.extend({
	tags: z.lazy(() => {
		const { tagSchema } = require('./tag.types');
		return z.array(tagSchema).optional();
	})
});

/**
 * User-organization schema with relations
 */
export const userOrganizationWithRelationsSchema = userOrganizationSchema.extend({
	user: z.lazy(() => userSchema).optional(),
	organization: z.lazy(() => {
		const { organizationSchema } = require('./organization.types');
		return organizationSchema.optional();
	})
});

/**
 * Relational user schema with full user object
 */
export const relationalUserWithRelationsSchema = z.object({
	user: z.lazy(() => userWithRelationsSchema).optional(),
	userId: z.string().optional()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

// Entity types
export type User = z.infer<typeof userSchema>;
export type UserWithRelations = z.infer<typeof userWithRelationsSchema>;
export type UserOrganization = z.infer<typeof userOrganizationSchema>;
export type UserOrganizationWithRelations = z.infer<typeof userOrganizationWithRelationsSchema>;
export type RelationalUser = z.infer<typeof relationalUserSchema>;
export type RelationalUserWithRelations = z.infer<typeof relationalUserWithRelationsSchema>;
export type UserViewModel = z.infer<typeof userViewModelSchema>;
export type UserViewModelWithRelations = z.infer<typeof userViewModelWithRelationsSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;

// Input types
export type UserFindInput = z.infer<typeof userFindInputSchema>;
export type UserEmailInput = z.infer<typeof userEmailInputSchema>;
export type UserPasswordInput = z.infer<typeof userPasswordInputSchema>;
export type UserLoginInput = z.infer<typeof userLoginInputSchema>;
export type UserTokenInput = z.infer<typeof userTokenInputSchema>;
export type UserCreateInput = z.infer<typeof userCreateInputSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateInputSchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationInputSchema>;

// Response types
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type WorkspaceResponse = z.infer<typeof workspaceResponseSchema>;
export type UserSigninWorkspaceResponse = z.infer<typeof userSigninWorkspaceResponseSchema>;
