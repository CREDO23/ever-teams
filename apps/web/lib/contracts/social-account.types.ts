/**
 * Social Account Types and Schemas
 * 
 * Zod schemas are the single source of truth.
 * Types are inferred from schemas, no duplicate interfaces.
 * 
 * @module lib/contracts/social-account.types
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema, providerEnumSchema } from './common.types';

// ============================================================================
// DATABASE SCHEMAS
// ============================================================================

/**
 * Social account database schema - represents the social_account table in DB
 */
export const socialAccountSchema = basePerTenantEntityModelSchema.extend({
	provider: providerEnumSchema,
	providerAccountId: z.string().min(1, 'Provider account ID is required'),
	accessToken: z.string().nullable().optional(),
	refreshToken: z.string().nullable().optional(),
	expiresAt: z.union([z.date(), z.string()]).nullable().optional(),
	scope: z.string().nullable().optional(),
	tokenType: z.string().nullable().optional(),
	idToken: z.string().nullable().optional(),
	sessionState: z.string().nullable().optional(),
	
	// Foreign keys (IDs only)
	userId: z.string()
});

// ============================================================================
// WITH RELATIONS SCHEMAS
// ============================================================================

/**
 * Social account with populated relations - for API responses
 */
export const socialAccountWithRelationsSchema = socialAccountSchema.extend({
	// Populated relations
	user: z.lazy(() => require('./user.types').userSchema).nullable().optional()
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Get social account request schema
 */
export const getSocialAccountRequestSchema = z.object({
	id: z.string().uuid().optional(),
	userId: z.string().uuid().optional(),
	provider: providerEnumSchema.optional(),
	providerAccountId: z.string().optional(),
	relations: z.array(z.string()).optional()
}).refine(
	data => data.id || (data.userId && data.provider) || (data.provider && data.providerAccountId),
	{ message: 'Either id, userId+provider, or provider+providerAccountId must be provided' }
);

/**
 * Get social accounts list request schema
 */
export const getSocialAccountsRequestSchema = z.object({
	userId: z.string().uuid(),
	relations: z.array(z.string()).optional()
});

/**
 * Link social account request schema (connect existing user to social provider)
 */
export const linkSocialAccountRequestSchema = z.object({
	userId: z.string().uuid(),
	provider: providerEnumSchema,
	code: z.string().optional(), // OAuth authorization code
	accessToken: z.string().optional(),
	idToken: z.string().optional(),
	profile: z.object({
		id: z.string(),
		email: z.string().email().optional(),
		name: z.string().optional(),
		picture: z.string().url().optional()
	}).optional()
}).refine(
	data => data.code || data.accessToken || data.idToken,
	{ message: 'Either code, accessToken, or idToken must be provided' }
);

/**
 * Unlink social account request schema (disconnect social provider from user)
 */
export const unlinkSocialAccountRequestSchema = z.object({
	userId: z.string().uuid(),
	provider: providerEnumSchema
});

/**
 * Social login/signup request schema
 */
export const socialAuthRequestSchema = z.object({
	provider: providerEnumSchema,
	code: z.string().optional(), // OAuth authorization code
	accessToken: z.string().optional(),
	idToken: z.string().optional(),
	profile: z.object({
		id: z.string(),
		email: z.string().email(),
		name: z.string().optional(),
		picture: z.string().url().optional(),
		emailVerified: z.boolean().optional()
	}).optional(),
	organizationId: z.string().uuid().optional(), // For signup with organization context
	inviteToken: z.string().optional() // For signup with invite
}).refine(
	data => data.code || data.accessToken || data.idToken,
	{ message: 'Either code, accessToken, or idToken must be provided' }
);

/**
 * Refresh social token request
 */
export const refreshSocialTokenRequestSchema = z.object({
	userId: z.string().uuid(),
	provider: providerEnumSchema
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Single social account response
 */
export const socialAccountResponseSchema = z.object({
	data: socialAccountWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Social accounts list response
 */
export const socialAccountsListResponseSchema = z.object({
	data: z.array(socialAccountWithRelationsSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Link social account response
 */
export const linkSocialAccountResponseSchema = z.object({
	data: socialAccountSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Unlink social account response
 */
export const unlinkSocialAccountResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

/**
 * Social auth response (login/signup)
 */
export const socialAuthResponseSchema = z.object({
	data: z.object({
		user: z.lazy(() => require('./user.types').userSchema),
		employee: z.lazy(() => require('./employee.types').employeeSchema).optional(),
		token: z.string(),
		refreshToken: z.string().optional(),
		isNewUser: z.boolean()
	}),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Refresh social token response
 */
export const refreshSocialTokenResponseSchema = z.object({
	data: z.object({
		accessToken: z.string(),
		refreshToken: z.string().optional(),
		expiresAt: z.union([z.date(), z.string()]).optional()
	}),
	message: z.string().optional(),
	success: z.boolean()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type SocialAccount = z.infer<typeof socialAccountSchema>;
export type SocialAccountWithRelations = z.infer<typeof socialAccountWithRelationsSchema>;

// Request types
export type GetSocialAccountRequest = z.infer<typeof getSocialAccountRequestSchema>;
export type GetSocialAccountsRequest = z.infer<typeof getSocialAccountsRequestSchema>;
export type LinkSocialAccountRequest = z.infer<typeof linkSocialAccountRequestSchema>;
export type UnlinkSocialAccountRequest = z.infer<typeof unlinkSocialAccountRequestSchema>;
export type SocialAuthRequest = z.infer<typeof socialAuthRequestSchema>;
export type RefreshSocialTokenRequest = z.infer<typeof refreshSocialTokenRequestSchema>;

// Response types
export type SocialAccountResponse = z.infer<typeof socialAccountResponseSchema>;
export type SocialAccountsListResponse = z.infer<typeof socialAccountsListResponseSchema>;
export type LinkSocialAccountResponse = z.infer<typeof linkSocialAccountResponseSchema>;
export type UnlinkSocialAccountResponse = z.infer<typeof unlinkSocialAccountResponseSchema>;
export type SocialAuthResponse = z.infer<typeof socialAuthResponseSchema>;
export type RefreshSocialTokenResponse = z.infer<typeof refreshSocialTokenResponseSchema>;
