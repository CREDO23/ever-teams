/**
 * Common Types and Schemas
 */

import { z } from 'zod';

export const languagesEnumSchema = z.enum([
	'en', 'bg', 'he', 'ru', 'fr', 'es', 'zh', 'de', 'pt', 'it', 'nl', 'pl', 'ar'
	]);

export const componentLayoutStyleEnumSchema = z.enum(['CARDS_GRID', 'TABLE']);

	export const timeFormatEnumSchema = z.union([
	z.literal(12),
	z.literal(24)
	]);

export const providerEnumSchema = z.enum(['github', 'google', 'facebook', 'twitter']);

export const baseTenantSchema = z.object({
	tenant: z.object({
	id: z.string()
	}).optional(),
	tenant_id: z.string().optional()
});

export const baseEntityModelSchema = z.object({
	id: z.string().optional(),
	createdAt: z.union([z.date(), z.string()]).optional(),
	updatedAt: z.union([z.date(), z.string()]).optional(),
	isActive: z.boolean().optional(),
	isArchived: z.boolean().optional(),
	archivedAt: z.union([z.date(), z.string()]).optional()
});

export const basePerTenantEntityModelSchema = baseEntityModelSchema.merge(baseTenantSchema).extend({
	tenantId: z.string().optional(),
	organizationId: z.string().optional()
});

export const baseRelationsEntityModelSchema = z.object({
	relations: z.array(z.string()).optional()
});

export const imageAssetSchema = basePerTenantEntityModelSchema.extend({
	url: z.string().url().optional(),
	thumb: z.string().url().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	size: z.number().optional(),
	fullUrl: z.string().url().optional(),
	thumbUrl: z.string().url().optional()
});

export const relationalImageAssetSchema = z.object({
	image: imageAssetSchema.optional(),
	imageId: z.string().optional(),
	imageUrl: z.string().url().optional(),
	avatarUrl: z.string().url().optional()
});

export const softDeleteSchema = z.object({
	deletedAt: z.union([z.date(), z.string()]).nullish()
});

export const timestampedSchema = z.object({
	createdAt: z.union([z.date(), z.string()]).optional(),
	updatedAt: z.union([z.date(), z.string()]).optional()
});

export const entityWithOwnerSchema = z.object({
	ownerId: z.string().optional(),
	ownerType: z.string().optional()
});

// Basic types
export type ID = string;

// Enum types
export type LanguagesEnum = z.infer<typeof languagesEnumSchema>;
export type ComponentLayoutStyleEnum = z.infer<typeof componentLayoutStyleEnumSchema>;
export type TimeFormatEnum = z.infer<typeof timeFormatEnumSchema>;
export type ProviderEnum = z.infer<typeof providerEnumSchema>;

// Entity types
export type BaseEntityModel = z.infer<typeof baseEntityModelSchema>;
export type BasePerTenantEntityModel = z.infer<typeof basePerTenantEntityModelSchema>;
export type BaseRelationsEntityModel = z.infer<typeof baseRelationsEntityModelSchema>;
export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type RelationalImageAsset = z.infer<typeof relationalImageAssetSchema>;
export type SoftDelete = z.infer<typeof softDeleteSchema>;
export type Timestamped = z.infer<typeof timestampedSchema>;
export type EntityWithOwner = z.infer<typeof entityWithOwnerSchema>;

// For backwards compatibility (will be removed in future)
export type IBasePerTenantEntityModel = BasePerTenantEntityModel;
export type IImageAsset = ImageAsset;
export type IRelationalImageAsset = RelationalImageAsset;
