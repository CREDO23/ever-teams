/**
 * Team Types and Schemas
 * 
 * Zod schemas are the single source of truth.
 * Types are inferred from schemas, no duplicate interfaces.
 * 
 * @module lib/contracts/team.types
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// SCHEMAS
// ============================================================================

/**
 * Organization team schema - Single source of truth for team entity
 */
export const organizationTeamSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Team name is required'),
	prefix: z.string().max(10).optional(),
	logo: z.string().url().optional(),
	profile_link: z.string().optional(),
	memberCount: z.number().min(0).optional(),
	public: z.boolean().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
	emoji: z.string().optional(), // Note: .emoji() validator may not be available in all Zod versions
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
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type OrganizationTeam = z.infer<typeof organizationTeamSchema>;
export type DefaultTeam = z.infer<typeof defaultTeamSchema>;
export type LastTeam = z.infer<typeof lastTeamSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
