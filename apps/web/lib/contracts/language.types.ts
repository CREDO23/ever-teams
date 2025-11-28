import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

// ============ Database Schema ============
export const languageSchema = basePerTenantEntityModelSchema.extend({
	name: z.string().nullish(),
	code: z.string().nullish(),
	is_system: z.boolean().default(false).optional(),
	description: z.string().nullish(),
	color: z.string().nullish(),
});

// ============ With Relations ============
export const languageWithRelationsSchema = languageSchema.extend({
	isSelected: z.boolean().optional(),
	items: z.array(z.unknown()).optional(),
});

// ============ Request Schemas ============
export const getLanguageRequestSchema = z.object({
	code: z.string().optional(),
	organizationId: z.string().optional(),
	tenantId: z.string().optional(),
});

export const getLanguagesRequestSchema = z.object({
	organizationId: z.string().optional(),
	tenantId: z.string().optional(),
	page: z.number().positive().optional(),
	limit: z.number().positive().optional(),
});

export const createLanguageRequestSchema = z.object({
	name: z.string().min(1),
	code: z.string().min(2).max(5),
  });

export const updateLanguageRequestSchema = createLanguageRequestSchema.partial();

// ============ Response Schemas ============
export const languageResponseSchema = z.object({
	data: languageWithRelationsSchema,
	success: z.boolean(),
	message: z.string().optional(),
});

export const languageListResponseSchema = z.object({
	data: z.array(languageWithRelationsSchema),
	total: z.number(),
	success: z.boolean(),
});

// ============ Type Exports ============
export type Language = z.infer<typeof languageSchema>;
export type LanguageWithRelations = z.infer<typeof languageWithRelationsSchema>;
export type GetLanguageRequest = z.infer<typeof getLanguageRequestSchema>;
export type GetLanguagesRequest = z.infer<typeof getLanguagesRequestSchema>;
export type CreateLanguageRequest = z.infer<typeof createLanguageRequestSchema>;
export type UpdateLanguageRequest = z.infer<typeof updateLanguageRequestSchema>;
export type LanguageResponse = z.infer<typeof languageResponseSchema>;
export type LanguageListResponse = z.infer<typeof languageListResponseSchema>;
