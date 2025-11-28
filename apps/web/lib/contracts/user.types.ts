/**
 * User Types and Schemas
 * 
 * Type definitions and schemas for user entities and authentication.
 * 
 * @module lib/contracts/user.types
 */

import { z } from 'zod';
import { 
	IBasePerTenantEntityModel, 
	IRelationalImageAsset,
	basePerTenantEntityModelSchema,
	relationalImageAssetSchema,
	ID,
	LanguagesEnum,
	ComponentLayoutStyleEnum,
	TimeFormatEnum,
	languagesEnumSchema,
	componentLayoutStyleEnumSchema,
	timeFormatEnumSchema
} from './common.types';
import { IRole, roleSchema } from './role.types';
import { ITag, tagSchema } from './tag.types';
import { IOrganization, organizationSchema } from './organization.types';
import { IOrganizationTeam, organizationTeamSchema } from './team.types';
import { IEmployee, employeeSchema, relationalEmployeeSchema } from './employee.types';
import { IInvite, inviteSchema } from './invite.types';
import { ISocialAccount, socialAccountSchema } from './social-account.types';

// ============================================================================
// USER INTERFACES
// ============================================================================

/**
 * Main User interface
 */
export interface IUser extends IBasePerTenantEntityModel, IRelationalImageAsset {
	thirdPartyId?: string;
	name?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	username?: string;
	timeZone?: string;
	timeFormat?: TimeFormatEnum;
	role?: IRole;
	roleId?: ID;
	hash?: string;
	refreshToken?: string;
	employee?: IEmployee;
	employeeId?: ID;
	defaultTeam?: IOrganizationTeam;
	defaultTeamId?: ID;
	lastTeam?: IOrganizationTeam;
	lastTeamId?: ID;
	defaultOrganization?: IOrganization;
	defaultOrganizationId?: ID;
	lastOrganization?: IOrganization;
	lastOrganizationId?: ID;
	tags?: ITag[];
	preferredLanguage?: string;
	preferredComponentLayout?: ComponentLayoutStyleEnum;
	fullName?: string;
	organizations?: IUserOrganization[];
	isImporting?: boolean;
	sourceId?: string;
	code?: string;
	codeExpireAt?: Date | string;
	emailVerifiedAt?: Date | string;
	lastLoginAt?: Date | string;
	isEmailVerified?: boolean;
	emailToken?: string;
	invites?: IInvite[];
	socialAccounts?: ISocialAccount[];
}

/**
 * User-Organization relationship interface
 */
export interface IUserOrganization extends IBasePerTenantEntityModel {
	userId: ID;
	user?: IUser;
	organizationId: ID;
	organization?: IOrganization;
	isDefault?: boolean;
	isActive?: boolean;
}

/**
 * Relational user interface
 */
export interface IRelationalUser {
	user?: IUser;
	userId?: ID;
}

/**
 * User view model for display purposes
 */
export interface IUserViewModel extends IBasePerTenantEntityModel {
	fullName: string;
	email: string;
	employeeId?: ID;
	bonus?: number;
	endWork?: any;
	id: string;
	roleName?: string;
	role?: string;
	tags?: ITag[];
	userOrganizationId?: string;
}

/**
 * User statistics
 */
export interface IUserStats {
	count: number;
	lastMonthActiveUsers: number;
}

// ============================================================================
// INPUT INTERFACES
// ============================================================================

/**
 * User find input
 */
export interface IUserFindInput extends IBasePerTenantEntityModel {
	thirdPartyId?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	username?: string;
	role?: IRole;
	roleId?: string;
	imageUrl?: string;
	preferredLanguage?: LanguagesEnum;
}

/**
 * User create input
 */
export interface IUserCreateInput extends IRelationalImageAsset {
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	username?: string;
	role?: IRole;
	roleId?: string;
	hash?: string;
	imageUrl?: string;
	tags?: ITag[];
	preferredLanguage?: LanguagesEnum;
	preferredComponentLayout?: ComponentLayoutStyleEnum;
	timeZone?: string;
	timeFormat?: TimeFormatEnum;
	defaultTeamId?: ID;
	lastTeamId?: ID;
	defaultOrganizationId?: ID;
	lastOrganizationId?: ID;
}

/**
 * User update input
 */
export interface IUserUpdateInput extends IUserCreateInput {
	id?: string;
}

/**
 * User registration input
 */
export interface IUserRegistrationInput {
	user: IUser;
	password?: string;
	confirmPassword?: string;
	originalUrl?: string;
	organizationId?: string;
	createdByUserId?: string;
	isImporting?: boolean;
	sourceId?: string;
	inviteId?: string;
	featureAsEmployee?: boolean;
}

/**
 * User email input
 */
export interface IUserEmailInput {
	email: string;
}

/**
 * User password input
 */
export interface IUserPasswordInput {
	password: string;
}

/**
 * User token input
 */
export interface IUserTokenInput {
	token: string;
}

/**
 * User code input
 */
export interface IUserCodeInput {
	code: string;
}

/**
 * User login input
 */
export interface IUserLoginInput extends IUserEmailInput, IUserPasswordInput {}

/**
 * Email verification token payload
 */
export interface IVerificationTokenPayload extends IUserEmailInput {
	id: string;
}

/**
 * Find me user options
 */
export interface IFindMeUser {
	includeEmployee?: boolean;
	includeOrganization?: boolean;
	relations?: string[];
}

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

/**
 * Authentication response
 */
export interface IAuthResponse {
	user: IUser;
	token: string;
	refresh_token?: string;
}

/**
 * Workspace response
 */
export interface IWorkspaceResponse extends IUserTokenInput {
	user: IUser;
}

/**
 * Workspace interface
 */
export interface IWorkSpace {
	id: string;
	name: string;
	imgUrl: string;
	isOnline: boolean;
	isSelected?: boolean;
}

/**
 * Sign-in workspace response
 */
export interface IUserSigninWorkspaceResponse {
	workspaces: IWorkspaceResponse[];
	confirmed_email: string;
	show_popup: boolean;
	total_workspaces: number;
	defaultTeamId?: ID;
	defaultOrganizationId?: ID;
	lastTeamId?: ID;
	lastOrganizationId?: ID;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * User-Organization schema
 */
export const userOrganizationSchema = basePerTenantEntityModelSchema.extend({
	userId: z.string(),
	user: z.lazy(() => userSchema).optional(),
	organizationId: z.string(),
	organization: organizationSchema.optional(),
	isDefault: z.boolean().optional(),
	isActive: z.boolean().optional()
});

/**
 * Main User schema
 */
export const userSchema = basePerTenantEntityModelSchema
	.merge(relationalImageAssetSchema)
	.merge(relationalEmployeeSchema)
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
		role: roleSchema.optional(),
		roleId: z.string().optional(),
		hash: z.string().optional(),
		refreshToken: z.string().optional(),
		defaultTeam: organizationTeamSchema.optional(),
		defaultTeamId: z.string().optional(),
		lastTeam: organizationTeamSchema.optional(),
		lastTeamId: z.string().optional(),
		defaultOrganization: organizationSchema.optional(),
		defaultOrganizationId: z.string().optional(),
		lastOrganization: organizationSchema.optional(),
		lastOrganizationId: z.string().optional(),
		tags: z.array(tagSchema).optional(),
		preferredLanguage: z.string().optional(),
		preferredComponentLayout: componentLayoutStyleEnumSchema.optional(),
		fullName: z.string().optional(),
		organizations: z.array(z.lazy(() => userOrganizationSchema)).optional(),
		isImporting: z.boolean().optional(),
		sourceId: z.string().optional(),
		code: z.string().optional(),
		codeExpireAt: z.union([z.date(), z.string()]).optional(),
		emailVerifiedAt: z.union([z.date(), z.string()]).optional(),
		lastLoginAt: z.union([z.date(), z.string()]).optional(),
		isEmailVerified: z.boolean().optional(),
		emailToken: z.string().optional(),
		invites: z.array(inviteSchema).optional(),
		socialAccounts: z.array(socialAccountSchema).optional()
	});

/**
 * Relational user schema
 */
export const relationalUserSchema = z.object({
	user: z.lazy(() => userSchema).optional(),
	userId: z.string().optional()
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
	tags: z.array(tagSchema).optional(),
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
	show_popup: z.boolean(),
	total_workspaces: z.number(),
	defaultTeamId: z.string().optional(),
	defaultOrganizationId: z.string().optional(),
	lastTeamId: z.string().optional(),
	lastOrganizationId: z.string().optional()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TUser = z.infer<typeof userSchema>;
export type TUserOrganization = z.infer<typeof userOrganizationSchema>;
export type TRelationalUser = z.infer<typeof relationalUserSchema>;
export type TUserEmailInput = z.infer<typeof userEmailInputSchema>;
export type TUserPasswordInput = z.infer<typeof userPasswordInputSchema>;
export type TUserLoginInput = z.infer<typeof userLoginInputSchema>;
export type TUserCreateInput = z.infer<typeof userCreateInputSchema>;
export type TUserUpdateInput = z.infer<typeof userUpdateInputSchema>;
export type TUserRegistrationInput = z.infer<typeof userRegistrationInputSchema>;
export type TAuthResponse = z.infer<typeof authResponseSchema>;
export type TWorkspaceResponse = z.infer<typeof workspaceResponseSchema>;
export type TUserSigninWorkspaceResponse = z.infer<typeof userSigninWorkspaceResponseSchema>;
