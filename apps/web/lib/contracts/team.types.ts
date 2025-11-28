/**
 * Team Types and Schemas
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { employeeSchema } from './employee.types';
import { organizationSchema } from './organization.types';
import { roleSchema } from './role.types';
import { tagSchema } from './tag.types';
import { teamSchema } from './team.types';
import { userSchema } from './user.types';

export const teamSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Team name is required'),
	prefix: z.string().max(10).nullish(),
	logo: z.string().nullish(),
	profile_link: z.string().nullish(),
	memberCount: z.number().min(0).nullish(),
	public: z.boolean().nullish(),
	color: z.string().nullish(),
	emoji: z.string().nullish(),
	taskPrivacy: z.boolean().nullish(),
	description: z.string().nullish(),
	
	organizationId: z.string(),
	creatorId: z.string().nullish(),
	imageId: z.string().nullish()
});

export const teamMemberSchema = basePerTenantEntityModelSchema.extend({
	teamId: z.string(),
	employeeId: z.string(),
	roleId: z.string().nullish(),
	
	isManager: z.boolean().nullish(),
	assignedAt: z.union([z.date(), z.string()]).optional()
});

export const teamWithRelationsSchema = teamSchema.extend({
	organization: z.lazy(() => organizationSchema).nullish(),
	creator: z.lazy(() => userSchema).nullish(),
	members: z.array(z.lazy(() => employeeSchema)).optional(),
	tags: z.array(z.lazy(() => tagSchema)).optional()
});

export const teamMemberWithRelationsSchema = teamMemberSchema.extend({
	team: z.lazy(() => teamSchema).nullish(),
	employee: z.lazy(() => employeeSchema).nullish(),
	role: z.lazy(() => roleSchema).nullish()
});

export const getTeamRequestSchema = z.object({
	id: z.string().uuid(),
	relations: z.array(z.string()).optional() // ['organization', 'members', 'creator']
});

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

export const updateTeamRequestSchema = createTeamRequestSchema.omit({ organizationId: true }).partial().extend({
	id: z.string().uuid()
});

export const deleteTeamRequestSchema = z.object({
	id: z.string().uuid()
});

export const addTeamMemberRequestSchema = z.object({
	teamId: z.string().uuid(),
	employeeId: z.string().uuid(),
	roleId: z.string().uuid().optional(),
	isManager: z.boolean().optional()
});

export const removeTeamMemberRequestSchema = z.object({
	teamId: z.string().uuid(),
	employeeId: z.string().uuid()
});

export const updateTeamMemberRoleRequestSchema = z.object({
	teamId: z.string().uuid(),
	employeeId: z.string().uuid(),
	roleId: z.string().uuid().nullish(),
	isManager: z.boolean().optional()
});

export const teamResponseSchema = z.object({
	data: teamWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const teamsListResponseSchema = z.object({
	data: z.array(teamWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export const createTeamResponseSchema = z.object({
	data: teamSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const updateTeamResponseSchema = z.object({
	data: teamSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const deleteTeamResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

export const teamMemberResponseSchema = z.object({
	data: teamMemberWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const teamMembersListResponseSchema = z.object({
	data: z.array(teamMemberWithRelationsSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

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
