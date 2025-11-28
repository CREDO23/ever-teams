/**
 * Tag Types and Schemas
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

export const tagSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Tag name is required'),
	description: z.string().nullish(),
	color: z.string().nullish(),
	isSystem: z.boolean().nullish(),
	icon: z.string().nullish(),
	
	organizationId: z.string().nullish(),
	organizationTeamId: z.string().nullish()
});

export const entityTagSchema = basePerTenantEntityModelSchema.extend({
	tagId: z.string(),
	entityId: z.string(),
	entityType: z.string() // 'Employee', 'Organization', 'Team', 'Task', etc.
});

export const tagWithRelationsSchema = tagSchema.extend({
	organization: z.lazy(() => require('./organization.types').organizationSchema).nullish(),
	organizationTeam: z.lazy(() => require('./team.types').teamSchema).nullish(),
	entities: z.array(z.object({
		id: z.string(),
		type: z.string(),
		name: z.string().optional()
	})).optional()
});

export const getTagRequestSchema = z.object({
	id: z.string().uuid(),
	relations: z.array(z.string()).optional() // ['organization', 'organizationTeam', 'entities']
});

export const getTagsRequestSchema = z.object({
	organizationId: z.string().uuid().optional(),
	organizationTeamId: z.string().uuid().optional(),
	relations: z.array(z.string()).optional(),
	take: z.number().min(1).max(100).optional(),
	skip: z.number().min(0).optional(),
	where: z.object({
		isSystem: z.boolean().optional(),
		name: z.string().optional(),
		color: z.string().optional()
	}).optional()
});

export const createTagRequestSchema = z.object({
	name: z.string().min(1, 'Tag name is required'),
	description: z.string().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
	icon: z.string().optional(),
	organizationId: z.string().uuid().optional(),
	organizationTeamId: z.string().uuid().optional()
});

export const updateTagRequestSchema = createTagRequestSchema.partial().extend({
	id: z.string().uuid()
});

export const deleteTagRequestSchema = z.object({
	id: z.string().uuid()
});

export const tagEntityRequestSchema = z.object({
	tagId: z.string().uuid(),
	entityId: z.string().uuid(),
	entityType: z.enum(['Employee', 'Organization', 'Team', 'Task', 'Project', 'Candidate'])
});

export const untagEntityRequestSchema = z.object({
	tagId: z.string().uuid(),
	entityId: z.string().uuid(),
	entityType: z.enum(['Employee', 'Organization', 'Team', 'Task', 'Project', 'Candidate'])
});

export const getEntityTagsRequestSchema = z.object({
	entityId: z.string().uuid(),
	entityType: z.enum(['Employee', 'Organization', 'Team', 'Task', 'Project', 'Candidate'])
});

export const tagResponseSchema = z.object({
	data: tagWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const tagsListResponseSchema = z.object({
	data: z.array(tagWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export const createTagResponseSchema = z.object({
	data: tagSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const updateTagResponseSchema = z.object({
	data: tagSchema,
	message: z.string().optional(),
	success: z.boolean()
});

export const deleteTagResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

export const tagEntityResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

export const entityTagsResponseSchema = z.object({
	data: z.array(tagSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

export type Tag = z.infer<typeof tagSchema>;
export type EntityTag = z.infer<typeof entityTagSchema>;
export type TagWithRelations = z.infer<typeof tagWithRelationsSchema>;

// Request types
export type GetTagRequest = z.infer<typeof getTagRequestSchema>;
export type GetTagsRequest = z.infer<typeof getTagsRequestSchema>;
export type CreateTagRequest = z.infer<typeof createTagRequestSchema>;
export type UpdateTagRequest = z.infer<typeof updateTagRequestSchema>;
export type DeleteTagRequest = z.infer<typeof deleteTagRequestSchema>;
export type TagEntityRequest = z.infer<typeof tagEntityRequestSchema>;
export type UntagEntityRequest = z.infer<typeof untagEntityRequestSchema>;
export type GetEntityTagsRequest = z.infer<typeof getEntityTagsRequestSchema>;

// Response types
export type TagResponse = z.infer<typeof tagResponseSchema>;
export type TagsListResponse = z.infer<typeof tagsListResponseSchema>;
export type CreateTagResponse = z.infer<typeof createTagResponseSchema>;
export type UpdateTagResponse = z.infer<typeof updateTagResponseSchema>;
export type DeleteTagResponse = z.infer<typeof deleteTagResponseSchema>;
export type TagEntityResponse = z.infer<typeof tagEntityResponseSchema>;
export type EntityTagsResponse = z.infer<typeof entityTagsResponseSchema>;
