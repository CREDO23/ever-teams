import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { imageAssetSchema } from './image-asset.types';
import { projectSchema } from './project.types';
import { teamSchema } from './team.types';

// ============ Enums ============
export const issueTypeEnum = z.enum([
	'BUG',
	'TASK',
	'STORY',
	'EPIC',
	'CUSTOM'
	]);

// ============ Database Schema ============
export const issueTypeSchema = basePerTenantEntityModelSchema.extend({
	name: z.string(),
	value: z.string(),
	description: z.string().nullish(),
	icon: z.string().nullish(),
	color: z.string().nullish(),
	isDefault: z.boolean().default(false).optional(),
	isSystem: z.boolean().default(false).optional(),
	organizationTeamId: z.string().nullish(),
	projectId: z.string().nullish(),
	imageId: z.string().nullish(),
});

// ============ With Relations ============
export const issueTypeWithRelationsSchema = issueTypeSchema.extend({
	fullIconUrl: z.string().url().optional(),
	organizationTeam: z.lazy(() =>
	teamSchema
	).optional(),
	project: z.lazy(() =>
	projectSchema
	).optional(),
	image: z.lazy(() =>
	imageAssetSchema
	).optional(),
});

// ============ Request Schemas ============
export const getIssueTypeRequestSchema = z.object({
	id: z.string().optional(),
	organizationId: z.string().optional(),
	organizationTeamId: z.string().optional(),
	projectId: z.string().optional(),
	tenantId: z.string().optional(),
});

export const getIssueTypesRequestSchema = z.object({
	organizationId: z.string().optional(),
	organizationTeamId: z.string().optional(),
	projectId: z.string().optional(),
	tenantId: z.string().optional(),
	page: z.number().positive().optional(),
	limit: z.number().positive().optional(),
});

export const createIssueTypeRequestSchema = z.object({
	name: z.string().min(1),
	value: z.string().optional(),
	description: z.string().optional(),
	icon: z.string().optional(),
	color: z.string().optional(),
	isDefault: z.boolean().optional(),
	projectId: z.string().optional(),
	organizationId: z.string().nullish(),
	tenantId: z.string().nullish(),
	organizationTeamId: z.string().nullish(),
});

export const updateIssueTypeRequestSchema = createIssueTypeRequestSchema.partial();

// ============ Response Schemas ============
export const issueTypeResponseSchema = z.object({
	data: issueTypeWithRelationsSchema,
	success: z.boolean(),
	message: z.string().optional(),
});

export const issueTypeListResponseSchema = z.object({
	data: z.array(issueTypeWithRelationsSchema),
	total: z.number(),
	success: z.boolean(),
});

// ============ Type Exports ============
export type IssueTypeName = z.infer<typeof issueTypeEnum>;
export type IssueType = z.infer<typeof issueTypeSchema>;
export type IssueTypeWithRelations = z.infer<typeof issueTypeWithRelationsSchema>;
export type GetIssueTypeRequest = z.infer<typeof getIssueTypeRequestSchema>;
export type GetIssueTypesRequest = z.infer<typeof getIssueTypesRequestSchema>;
export type CreateIssueTypeRequest = z.infer<typeof createIssueTypeRequestSchema>;
export type UpdateIssueTypeRequest = z.infer<typeof updateIssueTypeRequestSchema>;
export type IssueTypeResponse = z.infer<typeof issueTypeResponseSchema>;
export type IssueTypeListResponse = z.infer<typeof issueTypeListResponseSchema>;
