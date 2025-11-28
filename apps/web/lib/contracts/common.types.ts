/**
 * Common Types and Schemas
 * 
 * Shared base types, enums, and schemas used across multiple entities.
 * 
 * @module lib/contracts/common.types
 */

import { z } from 'zod';

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Base identifier type used throughout the application
 */
export type ID = string;

/**
 * Base entity model with common fields for all tenant-based entities
 */
export interface IBasePerTenantEntityModel {
	id?: ID;
	createdAt?: Date | string;
	updatedAt?: Date | string;
	isActive?: boolean;
	isArchived?: boolean;
	archivedAt?: Date | string;
	tenantId?: ID;
	organizationId?: ID;
}

/**
 * Base relations model for including related entities
 */
export interface IBaseRelationsEntityModel {
	relations?: string[];
}

// ============================================================================
// COMMON ENUMS
// ============================================================================

/**
 * Supported languages for the application
 */
export enum LanguagesEnum {
	ENGLISH = 'en',
	BULGARIAN = 'bg',
	HEBREW = 'he',
	RUSSIAN = 'ru',
	FRENCH = 'fr',
	SPANISH = 'es',
	CHINESE = 'zh',
	GERMAN = 'de',
	PORTUGUESE = 'pt',
	ITALIAN = 'it',
	DUTCH = 'nl',
	POLISH = 'pl',
	ARABIC = 'ar'
}

/**
 * Component layout styles for UI preferences
 */
export enum ComponentLayoutStyleEnum {
	CARDS_GRID = 'CARDS_GRID',
	TABLE = 'TABLE'
}

/**
 * Time format preferences
 */
export enum TimeFormatEnum {
	FORMAT_12_HOURS = 12,
	FORMAT_24_HOURS = 24
}

/**
 * OAuth provider types
 */
export enum ProviderEnum {
	GITHUB = 'github',
	GOOGLE = 'google',
	FACEBOOK = 'facebook',
	TWITTER = 'twitter'
}

// ============================================================================
// COMMON INTERFACES
// ============================================================================

/**
 * Image asset interface for avatars and media
 */
export interface IImageAsset extends IBasePerTenantEntityModel {
	url?: string;
	thumb?: string;
	width?: number;
	height?: number;
	size?: number;
	isFeatured?: boolean;
}

/**
 * Relational image asset for entities with images
 */
export interface IRelationalImageAsset {
	image?: IImageAsset;
	imageId?: ID;
	imageUrl?: string;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Zod schema for LanguagesEnum
 */
export const languagesEnumSchema = z.enum([
	'en', 'bg', 'he', 'ru', 'fr', 'es', 'zh', 'de', 'pt', 'it', 'nl', 'pl', 'ar'
]);

/**
 * Zod schema for ComponentLayoutStyleEnum
 */
export const componentLayoutStyleEnumSchema = z.enum(['CARDS_GRID', 'TABLE']);

/**
 * Zod schema for TimeFormatEnum
 */
export const timeFormatEnumSchema = z.union([z.literal(12), z.literal(24)]);

/**
 * Zod schema for ProviderEnum
 */
export const providerEnumSchema = z.enum(['github', 'google', 'facebook', 'twitter']);

/**
 * Base entity schema with common fields
 */
export const basePerTenantEntityModelSchema = z.object({
	id: z.string().optional(),
	createdAt: z.union([z.date(), z.string()]).optional(),
	updatedAt: z.union([z.date(), z.string()]).optional(),
	isActive: z.boolean().optional(),
	isArchived: z.boolean().optional(),
	archivedAt: z.union([z.date(), z.string()]).optional(),
	tenantId: z.string().optional(),
	organizationId: z.string().optional()
});

/**
 * Image asset schema
 */
export const imageAssetSchema = basePerTenantEntityModelSchema.extend({
	url: z.string().optional(),
	thumb: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	size: z.number().optional(),
	isFeatured: z.boolean().optional()
});

/**
 * Relational image asset schema
 */
export const relationalImageAssetSchema = z.object({
	image: imageAssetSchema.optional(),
	imageId: z.string().optional(),
	imageUrl: z.string().optional()
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TImageAsset = z.infer<typeof imageAssetSchema>;
export type TRelationalImageAsset = z.infer<typeof relationalImageAssetSchema>;
export type TLanguagesEnum = z.infer<typeof languagesEnumSchema>;
export type TComponentLayoutStyleEnum = z.infer<typeof componentLayoutStyleEnumSchema>;
export type TTimeFormatEnum = z.infer<typeof timeFormatEnumSchema>;
export type TProviderEnum = z.infer<typeof providerEnumSchema>;
