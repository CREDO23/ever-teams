/**
 * Tag Types and Schemas
 * 
 * Type definitions and schemas for tags and labels.
 * 
 * @module lib/contracts/tag.types
 */

import { z } from 'zod';
import { IBasePerTenantEntityModel, basePerTenantEntityModelSchema } from './common.types';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Tag interface for labeling and categorization
 */
export interface ITag extends IBasePerTenantEntityModel {
	name: string;
	color?: string;
	description?: string;
	isSystem?: boolean;
	icon?: string;
}

/**
 * Relational tag interface
 */
export interface IRelationalTag {
	tags?: ITag[];
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Tag schema for validation
 */
export const tagSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().min(1, 'Tag name is required'),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
	description: z.string().optional(),
	isSystem: z.boolean().optional(),
	icon: z.string().optional()
});

/**
 * Relational tag schema
 */
export const relationalTagSchema = z.object({
	tags: z.array(tagSchema).optional()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TTag = z.infer<typeof tagSchema>;
export type TRelationalTag = z.infer<typeof relationalTagSchema>;
