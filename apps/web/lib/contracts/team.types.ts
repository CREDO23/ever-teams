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
// DATABASE SCHEMAS
// ============================================================================

/**
 * Team database schema - represents the team table in DB
 */
export const teamSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Team name is required'),
	prefix: z.string().max(10).nullable().optional(),
	logo: z.string().nullable().optional(),
	profile_link: z.string().nullable().optional(),
	memberCount: z.number().min(0).nullable().optional(),
	public: z.boolean().nullable().optional(),
	color: z.string().nullable().optional(),
	emoji: z.string().nullable().optional(),
	taskPrivacy: z.boolean().nullable().optional(),
	description: z.string().nullable().optional(),
	
	// Foreign keys (IDs only)
	organizationId: z.string(),
	creatorId: z.string().nullable().optional(),
	imageId: z.string().nullable().optional()
});

/**
 * Team member database schema - represents team_member join table
 */
export const teamMemberSchema = basePerTenantEntityModelSchema.extend({
	// Foreign keys
	teamId: z.string(),
	employeeId: z.string(),
	roleId: z.string().nullable().optional(),
	
	// Fields
	isManager: z.boolean().nullable().optional(),
	assignedAt: z.union([z.date(), z.string()]).optional()
});

// ============================================================================
// WITH RELATIONS SCHEMAS
// ============================================================================

/**
 * Team with populated relations - for API responses
 */
export const teamWithRelationsSchema = teamSchema.extend({
	// Populated relations
	organization: z.lazy(() => require('./organization.types').organizationSchema).nullable().optional(),
	creator: z.lazy(() => require('./user.types').userSchema).nullable().optional(),
	members: z.array(z.lazy(() => require('./employee.types').employeeSchema)).optional(),
	tags: z.array(z.lazy(() => require('./tag.types').tagSchema)).optional()
});

/**
 * Team member with populated relations
 */
export const teamMemberWithRelationsSchema = teamMemberSchema.extend({
	team: z.lazy(() => require('./team.types').teamSchema).nullable().optional(),
	employee: z.lazy(() => require('./employee.types').employeeSchema).nullable().optional(),
	role: z.lazy(() => require('./role.types').roleSchema).nullable().optional()
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Get team request schema
 */
export const getTeamRequestSchema = z.object({
	id: z.string().uuid(),
	relations: z.array(z.string()).optional() // ['organization', 'members', 'creator']
});

/**
 * Get teams list request schema
 */
export const getTeamsRequestSchema = z.object({
	organizationId: z.string().uuid(),
	relations: z.array(z.string()).optional(),
	take: z.number().min(1).max(100).optional(),
	skip: z.number().min(0).optional(),
	where: z.object({
		public: z.boolean().optional(),
		name: z.string().optional(),
		creatorId: z.string().optional()
	}).optional()
});

/**
 * Create team request schema
 */
export const createTeamRequestSchema = z.object({
	name: z.string().min(1, 'Team name is required'),
	organizationId: z.string().uuid(),
	prefix: z.string().max(10).optional(),
	description: z.string().optional(),
	logo: z.string().url().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
	emoji: z.string().optional(),
	public: z.boolean().optional(),
	taskPrivacy: z.boolean().optional(),
	memberIds: z.array(z.string().uuid()).optional()
});

/**
 * Update team request schema
 */
export const updateTeamRequestSchema = createTeamRequestSchema.omit({ organizationId: true }).partial().extend({
	id: z.string().uuid()
});

/**
 * Delete team request schema
 */
export const deleteTeamRequestSchema = z.object({
	id: z.string().uuid()
});

/**
 * Add team member request
 */
export const addTeamMemberRequestSchema = z.object({
	teamId: z.string().uuid(),
	employeeId: z.string().uuid(),
	roleId: z.string().uuid().optional(),
	isManager: z.boolean().optional()
});

/**
 * Remove team member request
 */
export const removeTeamMemberRequestSchema = z.object({
	teamId: z.string().uuid(),
	employeeId: z.string().uuid()
});

/**
 * Update team member role request
 */
export const updateTeamMemberRoleRequestSchema = z.object({
	teamId: z.string().uuid(),
	employeeId: z.string().uuid(),
	roleId: z.string().uuid().nullable().optional(),
	isManager: z.boolean().optional()
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Single team response
 */
export const teamResponseSchema = z.object({
	data: teamWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Teams list response
 */
export const teamsListResponseSchema = z.object({
	data: z.array(teamWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Team creation response
 */
export const createTeamResponseSchema = z.object({
	data: teamSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Team update response
 */
export const updateTeamResponseSchema = z.object({
	data: teamSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Team deletion response
 */
export const deleteTeamResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

/**
 * Team member response
 */
export const teamMemberResponseSchema = z.object({
	data: teamMemberWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Team members list response
 */
export const teamMembersListResponseSchema = z.object({
	data: z.array(teamMemberWithRelationsSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type Team = z.infer<typeof teamSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamWithRelations = z.infer<typeof teamWithRelationsSchema>;
export type TeamMemberWithRelations = z.infer<typeof teamMemberWithRelationsSchema>;

// Request types
export type GetTeamRequest = z.infer<typeof getTeamRequestSchema>;
export type GetTeamsRequest = z.infer<typeof getTeamsRequestSchema>;
export type CreateTeamRequest = z.infer<typeof createTeamRequestSchema>;
export type UpdateTeamRequest = z.infer<typeof updateTeamRequestSchema>;
export type DeleteTeamRequest = z.infer<typeof deleteTeamRequestSchema>;
export type AddTeamMemberRequest = z.infer<typeof addTeamMemberRequestSchema>;
export type RemoveTeamMemberRequest = z.infer<typeof removeTeamMemberRequestSchema>;
export type UpdateTeamMemberRoleRequest = z.infer<typeof updateTeamMemberRoleRequestSchema>;

// Response types
export type TeamResponse = z.infer<typeof teamResponseSchema>;
export type TeamsListResponse = z.infer<typeof teamsListResponseSchema>;
export type CreateTeamResponse = z.infer<typeof createTeamResponseSchema>;
export type UpdateTeamResponse = z.infer<typeof updateTeamResponseSchema>;
export type DeleteTeamResponse = z.infer<typeof deleteTeamResponseSchema>;
export type TeamMemberResponse = z.infer<typeof teamMemberResponseSchema>;
export type TeamMembersListResponse = z.infer<typeof teamMembersListResponseSchema>;
