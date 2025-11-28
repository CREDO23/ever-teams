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
// SCHEMAS
// ============================================================================

/**
 * Tag schema - Single source of truth for tag entity
 */
export const tagSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Tag name is required'),
	description: z.string().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
	isSystem: z.boolean().optional(),
	icon: z.string().optional()
});

/**
 * Relational tag schema
 */
export const relationalTagSchema = z.object({
	tag: tagSchema.optional(),
	tagId: z.string().optional()
});

// ============================================================================
// INFERRED TYPES (Generated from schemas - Single source of truth)
// ============================================================================

export type Tag = z.infer<typeof tagSchema>;
export type RelationalTag = z.infer<typeof relationalTagSchema>;
