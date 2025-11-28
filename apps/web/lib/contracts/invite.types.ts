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

// ============================================================================
// SCHEMAS
// ============================================================================

/**
 * Invite schema - Single source of truth for invite entity
 */
export const inviteSchema = basePerTenantEntityModelSchema.extend({
	token: z.string().min(1, 'Token is required'),
	email: z.string().email('Invalid email address'),
	roleId: z.string().optional(),
	invitedById: z.string().optional(),
	status: z.union([inviteStatusEnumSchema, z.string()]).optional(),
	expireDate: z.union([z.date(), z.string()]).optional(),
	actionDate: z.union([z.date(), z.string()]).optional(),
	code: z.number().optional(),
	fullName: z.string().optional(),
	userId: z.string().optional(),
	teamIds: z.array(z.string()).optional(),
	projectIds: z.array(z.string()).optional()
});

/**
 * Invite accept input schema
 */
export const inviteAcceptInputSchema = z.object({
	inviteId: z.string().min(1, 'Invite ID is required'),
	token: z.string().min(1, 'Token is required'),
	email: z.string().email('Invalid email address'),
	fullName: z.string().optional(),
	password: z.string().min(8, 'Password must be at least 8 characters').optional()
});

/**
 * Invite resend input schema
 */
export const inviteResendInputSchema = z.object({
	inviteId: z.string().min(1, 'Invite ID is required'),
	invitedById: z.string().min(1, 'Inviter ID is required')
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type InviteStatusEnum = z.infer<typeof inviteStatusEnumSchema>;
export type Invite = z.infer<typeof inviteSchema>;
export type InviteAcceptInput = z.infer<typeof inviteAcceptInputSchema>;
export type InviteResendInput = z.infer<typeof inviteResendInputSchema>;
