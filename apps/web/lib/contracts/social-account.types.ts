/**
 * Social Account Types and Schemas
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema, providerEnumSchema } from './common.types';
import { employeeSchema } from './employee.types';
import { userSchema } from './user.types';

export const socialAccountSchema = basePerTenantEntityModelSchema.extend({
	provider: providerEnumSchema,
	providerAccountId: z.string().min(1, 'Provider account ID is required'),
	accessToken: z.string().nullish(),
	refreshToken: z.string().nullish(),
	expiresAt: z.union([z.date(), z.string()]).nullish(),
	scope: z.string().nullish(),
	tokenType: z.string().nullish(),
	idToken: z.string().nullish(),
	sessionState: z.string().nullish(),
	userId: z.string()
});

export const socialAccountWithRelationsSchema = socialAccountSchema.extend({
	user: z.lazy(() => userSchema).nullish()
});

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

export const getSocialAccountsRequestSchema = z.object({
	userId: z.string().uuid(),
	relations: z.array(z.string()).optional()
});

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

export const unlinkSocialAccountRequestSchema = z.object({
	userId: z.string().uuid(),
	provider: providerEnumSchema
});

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

export const refreshSocialTokenRequestSchema = z.object({
	userId: z.string().uuid(),
	provider: providerEnumSchema
});

export const socialAccountResponseSchema = z.object({
	data: socialAccountWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const socialAccountsListResponseSchema = z.object({
	data: z.array(socialAccountWithRelationsSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export const linkSocialAccountResponseSchema = z.object({
	data: socialAccountSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const unlinkSocialAccountResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

export const socialAuthResponseSchema = z.object({
	data: z.object({
	user: z.lazy(() => userSchema),
	employee: z.lazy(() => employeeSchema).optional(),
	token: z.string(),
	refreshToken: z.string().optional(),
	isNewUser: z.boolean()
	}),
	message: z.string().optional(),
	success: z.boolean()
});

export const refreshSocialTokenResponseSchema = z.object({
	data: z.object({
	accessToken: z.string(),
	refreshToken: z.string().optional(),
	expiresAt: z.union([z.date(), z.string()]).optional()
	}),
	message: z.string().optional(),
	success: z.boolean()
});

export type SocialAccount = z.infer<typeof socialAccountSchema>;
export type SocialAccountWithRelations = z.infer<typeof socialAccountWithRelationsSchema>;export type GetSocialAccountRequest = z.infer<typeof getSocialAccountRequestSchema>;
export type GetSocialAccountsRequest = z.infer<typeof getSocialAccountsRequestSchema>;
export type LinkSocialAccountRequest = z.infer<typeof linkSocialAccountRequestSchema>;
export type UnlinkSocialAccountRequest = z.infer<typeof unlinkSocialAccountRequestSchema>;
export type SocialAuthRequest = z.infer<typeof socialAuthRequestSchema>;
export type RefreshSocialTokenRequest = z.infer<typeof refreshSocialTokenRequestSchema>;export type SocialAccountResponse = z.infer<typeof socialAccountResponseSchema>;
export type SocialAccountsListResponse = z.infer<typeof socialAccountsListResponseSchema>;
export type LinkSocialAccountResponse = z.infer<typeof linkSocialAccountResponseSchema>;
export type UnlinkSocialAccountResponse = z.infer<typeof unlinkSocialAccountResponseSchema>;
export type SocialAuthResponse = z.infer<typeof socialAuthResponseSchema>;
export type RefreshSocialTokenResponse = z.infer<typeof refreshSocialTokenResponseSchema>;
