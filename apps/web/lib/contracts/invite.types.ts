/**
 * Invite Types and Schemas
 * 
 * Type definitions and schemas for invitations.
 * 
 * @module lib/contracts/invite.types
 */

import { z } from 'zod';
import { IBasePerTenantEntityModel, basePerTenantEntityModelSchema, ID } from './common.types';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Invitation status enum
 */
export enum InviteStatusEnum {
	PENDING = 'PENDING',
	ACCEPTED = 'ACCEPTED',
	EXPIRED = 'EXPIRED',
	REJECTED = 'REJECTED'
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Invite interface
 */
export interface IInvite extends IBasePerTenantEntityModel {
	token: string;
	email: string;
	roleId?: ID;
	invitedById?: ID;
	status?: InviteStatusEnum | string;
	expireDate?: Date | string;
	actionDate?: Date | string;
	code?: number;
	fullName?: string;
	userId?: ID;
	teamIds?: ID[];
	projectIds?: ID[];
}

/**
 * Invite accept input
 */
export interface IInviteAcceptInput {
	inviteId: string;
	token: string;
	email: string;
	fullName?: string;
	password?: string;
}

/**
 * Invite resend input
 */
export interface IInviteResendInput {
	inviteId: string;
	invitedById: string;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Invite status enum schema
 */
export const inviteStatusEnumSchema = z.enum(['PENDING', 'ACCEPTED', 'EXPIRED', 'REJECTED']);

/**
 * Invite schema for validation
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
// TYPE EXPORTS
// ============================================================================

export type TInvite = z.infer<typeof inviteSchema>;
export type TInviteAcceptInput = z.infer<typeof inviteAcceptInputSchema>;
export type TInviteResendInput = z.infer<typeof inviteResendInputSchema>;
export type TInviteStatusEnum = z.infer<typeof inviteStatusEnumSchema>;
