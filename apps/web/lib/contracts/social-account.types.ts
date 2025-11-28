/**
 * Social Account Types and Schemas
 * 
 * Type definitions and schemas for OAuth social accounts.
 * 
 * @module lib/contracts/social-account.types
 */

import { z } from 'zod';
import { IBasePerTenantEntityModel, basePerTenantEntityModelSchema, ID, ProviderEnum, providerEnumSchema } from './common.types';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Social account interface for OAuth providers
 */
export interface ISocialAccount extends IBasePerTenantEntityModel {
	provider: ProviderEnum | string;
	providerAccountId: string;
	userId?: ID;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: Date | string;
	scope?: string;
	tokenType?: string;
}

/**
 * Social login input
 */
export interface ISocialLoginInput {
	provider: ProviderEnum;
	accessToken: string;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Social account schema for validation
 */
export const socialAccountSchema = basePerTenantEntityModelSchema.extend({
	provider: z.union([providerEnumSchema, z.string()]),
	providerAccountId: z.string().min(1, 'Provider account ID is required'),
	userId: z.string().optional(),
	accessToken: z.string().optional(),
	refreshToken: z.string().optional(),
	expiresAt: z.union([z.date(), z.string()]).optional(),
	scope: z.string().optional(),
	tokenType: z.string().optional()
});

/**
 * Social login input schema
 */
export const socialLoginInputSchema = z.object({
	provider: providerEnumSchema,
	accessToken: z.string().min(1, 'Access token is required')
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TSocialAccount = z.infer<typeof socialAccountSchema>;
export type TSocialLoginInput = z.infer<typeof socialLoginInputSchema>;
