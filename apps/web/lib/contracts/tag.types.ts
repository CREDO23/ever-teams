/**
 * Tag Types and Schemas
 * 
 * Zod schemas are the single source of truth.
 * Types are inferred from schemas, no duplicate interfaces.
 * 
 * @module lib/contracts/tag.types
 */

import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// DATABASE SCHEMAS
// ============================================================================

/**
 * Tag database schema - represents the tag table in DB
 */
export const tagSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Tag name is required'),
	description: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	isSystem: z.boolean().nullable().optional(),
	icon: z.string().nullable().optional(),
	
	// Foreign keys (IDs only)
	organizationId: z.string().nullable().optional(),
	organizationTeamId: z.string().nullable().optional()
});

/**
 * Entity-tag join table schema (polymorphic relation)
 */
export const entityTagSchema = basePerTenantEntityModelSchema.extend({
	tagId: z.string(),
	entityId: z.string(),
	entityType: z.string() // 'Employee', 'Organization', 'Team', 'Task', etc.
});

// ============================================================================
// WITH RELATIONS SCHEMAS
// ============================================================================

/**
 * Tag with populated relations - for API responses
 */
export const tagWithRelationsSchema = tagSchema.extend({
	// Populated relations
	organization: z.lazy(() => require('./organization.types').organizationSchema).nullable().optional(),
	organizationTeam: z.lazy(() => require('./team.types').teamSchema).nullable().optional(),
	// Polymorphic relations (entities tagged with this tag)
	entities: z.array(z.object({
		id: z.string(),
		type: z.string(),
		name: z.string().optional()
	})).optional()
});

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Get tag request schema
 */
export const getTagRequestSchema = z.object({
	id: z.string().uuid(),
	relations: z.array(z.string()).optional() // ['organization', 'organizationTeam', 'entities']
});

/**
 * Get tags list request schema
 */
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

/**
 * Create tag request schema
 */
export const createTagRequestSchema = z.object({
	name: z.string().min(1, 'Tag name is required'),
	description: z.string().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
	icon: z.string().optional(),
	organizationId: z.string().uuid().optional(),
	organizationTeamId: z.string().uuid().optional()
});

/**
 * Update tag request schema
 */
export const updateTagRequestSchema = createTagRequestSchema.partial().extend({
	id: z.string().uuid()
});

/**
 * Delete tag request schema
 */
export const deleteTagRequestSchema = z.object({
	id: z.string().uuid()
});

/**
 * Tag entity request (attach tag to entity)
 */
export const tagEntityRequestSchema = z.object({
	tagId: z.string().uuid(),
	entityId: z.string().uuid(),
	entityType: z.enum(['Employee', 'Organization', 'Team', 'Task', 'Project', 'Candidate'])
});

/**
 * Untag entity request (remove tag from entity)
 */
export const untagEntityRequestSchema = z.object({
	tagId: z.string().uuid(),
	entityId: z.string().uuid(),
	entityType: z.enum(['Employee', 'Organization', 'Team', 'Task', 'Project', 'Candidate'])
});

/**
 * Get entity tags request
 */
export const getEntityTagsRequestSchema = z.object({
	entityId: z.string().uuid(),
	entityType: z.enum(['Employee', 'Organization', 'Team', 'Task', 'Project', 'Candidate'])
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Single tag response
 */
export const tagResponseSchema = z.object({
	data: tagWithRelationsSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Tags list response
 */
export const tagsListResponseSchema = z.object({
	data: z.array(tagWithRelationsSchema),
	total: z.number(),
	take: z.number(),
	skip: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Tag creation response
 */
export const createTagResponseSchema = z.object({
	data: tagSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Tag update response
 */
export const updateTagResponseSchema = z.object({
	data: tagSchema,
	message: z.string().optional(),
	success: z.boolean()
});

/**
 * Tag deletion response
 */
export const deleteTagResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

/**
 * Tag/untag entity response
 */
export const tagEntityResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

/**
 * Entity tags response
 */
export const entityTagsResponseSchema = z.object({
	data: z.array(tagSchema),
	total: z.number(),
	message: z.string().optional(),
	success: z.boolean()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

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
