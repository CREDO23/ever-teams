import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============ Enums ============
export const fileStorageProviderEnum = z.enum([
	'LOCAL',
	'S3',
	'WASABI',
	'CLOUDINARY',
	'DIGITALOCEAN',
	'DEBUG'
	]);

// ============ Database Schema ============
export const imageAssetSchema = basePerTenantEntityModelSchema.extend({
	name: z.string(),
	url: z.string().url(),
	thumb: z.string().nullish(),
	width: z.number().positive().nullish(),
	height: z.number().positive().nullish(),
	size: z.number().positive().nullish(),
	isFeatured: z.boolean().default(false).optional(),
	externalProviderId: z.string().nullish(),
	storageProvider: fileStorageProviderEnum.nullish(),
});

// ============ With Relations ============
export const imageAssetWithRelationsSchema = imageAssetSchema.extend({
	fullUrl: z.string().url().optional(),
	thumbUrl: z.string().url().optional(),
});

// ============ Request Schemas ============
export const getImageAssetRequestSchema = z.object({
	id: z.string().optional(),
	organizationId: z.string().optional(),
	tenantId: z.string().optional(),
});

export const createImageAssetRequestSchema = z.object({
	organizationId: z.string(),
	tenantId: z.string(),
	file: z.union([z.instanceof(File), z.instanceof(Blob), z.instanceof(ArrayBuffer)]).optional(),
	name: z.string().optional(),
	isFeatured: z.boolean().optional(),
});

export const uploadImageAssetRequestSchema = z.object({
	folder: z.string(),
	tenantId: z.string().optional(),
});

export const updateImageAssetRequestSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	isFeatured: z.boolean().optional(),
});

export const deleteImageAssetRequestSchema = z.object({
	id: z.string(),
});

// ============ Response Schemas ============
export const imageAssetResponseSchema = z.object({
	data: imageAssetWithRelationsSchema,
	success: z.boolean(),
	message: z.string().optional(),
});

export const imageAssetListResponseSchema = z.object({
	data: z.array(imageAssetWithRelationsSchema),
	total: z.number(),
	success: z.boolean(),
});

// ============ Type Exports ============
export type FileStorageProvider = z.infer<typeof fileStorageProviderEnum>;
export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type ImageAssetWithRelations = z.infer<typeof imageAssetWithRelationsSchema>;
export type GetImageAssetRequest = z.infer<typeof getImageAssetRequestSchema>;
export type CreateImageAssetRequest = z.infer<typeof createImageAssetRequestSchema>;
export type UploadImageAssetRequest = z.infer<typeof uploadImageAssetRequestSchema>;
export type UpdateImageAssetRequest = z.infer<typeof updateImageAssetRequestSchema>;
export type DeleteImageAssetRequest = z.infer<typeof deleteImageAssetRequestSchema>;
export type ImageAssetResponse = z.infer<typeof imageAssetResponseSchema>;
export type ImageAssetListResponse = z.infer<typeof imageAssetListResponseSchema>;
