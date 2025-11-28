/**
 * Team Types and Schemas
 * 
 * Type definitions and schemas for teams and team members.
 * 
 * @module lib/contracts/team.types
 */

import { z } from 'zod';
import { IBasePerTenantEntityModel, basePerTenantEntityModelSchema, ID } from './common.types';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Organization Team interface
 */
export interface IOrganizationTeam extends IBasePerTenantEntityModel {
	name: string;
	prefix?: string;
	logo?: string;
	profile_link?: string;
	memberCount?: number;
	public?: boolean;
	color?: string;
	emoji?: string;
	taskPrivacy?: boolean;
	description?: string;
}

/**
 * Default team interface
 */
export interface IDefaultTeam {
	defaultTeamId?: ID;
}

/**
 * Last team interface
 */
export interface ILastTeam {
	lastTeamId?: ID;
}

/**
 * Team member interface
 */
export interface ITeamMember {
	id?: string;
	teamId: string;
	userId: string;
	roleId?: string;
	joinedAt?: Date | string;
	isActive?: boolean;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Organization team schema for validation
 */
export const organizationTeamSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Team name is required'),
	prefix: z.string().max(10).optional(),
	logo: z.string().url().optional(),
	profile_link: z.string().optional(),
	memberCount: z.number().min(0).optional(),
	public: z.boolean().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
	emoji: z.string().emoji().optional(),
	taskPrivacy: z.boolean().optional(),
	description: z.string().optional()
});

/**
 * Default team schema
 */
export const defaultTeamSchema = z.object({
	defaultTeamId: z.string().optional()
});

/**
 * Last team schema
 */
export const lastTeamSchema = z.object({
	lastTeamId: z.string().optional()
});

/**
 * Team member schema
 */
export const teamMemberSchema = z.object({
	id: z.string().optional(),
	teamId: z.string(),
	userId: z.string(),
	roleId: z.string().optional(),
	joinedAt: z.union([z.date(), z.string()]).optional(),
	isActive: z.boolean().optional()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TOrganizationTeam = z.infer<typeof organizationTeamSchema>;
export type TDefaultTeam = z.infer<typeof defaultTeamSchema>;
export type TLastTeam = z.infer<typeof lastTeamSchema>;
export type TTeamMember = z.infer<typeof teamMemberSchema>;
