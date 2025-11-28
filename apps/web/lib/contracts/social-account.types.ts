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
// SCHEMAS
// ============================================================================

/**
 * Social account schema - Single source of truth for social account entity
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
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type SocialAccount = z.infer<typeof socialAccountSchema>;
export type SocialLoginInput = z.infer<typeof socialLoginInputSchema>;
