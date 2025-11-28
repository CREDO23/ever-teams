import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

export enum FileStorageProviderEnum {
  LOCAL = 'LOCAL',
  S3 = 'S3',
  WASABI = 'WASABI',
  CLOUDINARY = 'CLOUDINARY',
  DIGITALOCEAN = 'DIGITALOCEAN'
}

export const screenshotSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  file: z.string(),
  thumb: z.string().nullable().optional(),
  fileUrl: z.string().url().nullable().optional(),
  thumbUrl: z.string().url().nullable().optional(),
  fullUrl: z.string().url().nullable().optional(),
  recordedAt: z.string().datetime().optional(),
  storageProvider: z.nativeEnum(FileStorageProviderEnum).optional(),
  isWorkRelated: z.boolean().nullable().optional(),
  description: z.string().nullable().optional(),
  apps: z.union([z.string(), z.array(z.string())]).nullable().optional(),
  timeSlotId: z.string().nullable().optional(),
  userId: z.string().nullable().optional(),
});

export const screenshotWithRelationsSchema = screenshotSchema.extend({
  timeSlot: z.lazy(() => require('./time-slot.types').timeSlotSchema).nullable().optional(),
  user: z.lazy(() => require('./user.types').userSchema).nullable().optional(),
});

export const screenshotPerHourSchema = z.object({
  startTime: z.union([z.string().datetime(), z.date()]),
  endTime: z.union([z.string().datetime(), z.date()]),
});

export const screenShotItemSchema = z.object({
  idSlot: z.string(),
  startTime: z.union([z.string().datetime(), z.date()]),
  endTime: z.union([z.string().datetime(), z.date()]),
  imageUrl: z.string(),
  percent: z.union([z.number(), z.string()]),
  showProgress: z.boolean().optional(),
  isTeamPage: z.boolean().optional(),
  onShow: z.function().args().returns(z.any()),
  viewMode: z.enum(['default', 'screenShot-only']).optional(),
});

export const createScreenshotRequestSchema = z.object({
  file: z.string(),
  thumb: z.string().optional(),
  recordedAt: z.string().datetime().optional(),
  isWorkRelated: z.boolean().optional(),
  description: z.string().optional(),
  apps: z.union([z.string(), z.array(z.string())]).optional(),
  timeSlotId: z.string().optional(),
  organizationId: z.string(),
  tenantId: z.string(),
});

export const getScreenshotsRequestSchema = z.object({
  employeeId: z.string().optional(),
  timeSlotId: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const screenshotResponseSchema = z.object({
  data: screenshotWithRelationsSchema,
  message: z.string().optional(),
});

export const screenshotListResponseSchema = z.object({
  items: z.array(screenshotWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type Screenshot = z.infer<typeof screenshotSchema>;
export type ScreenshotWithRelations = z.infer<typeof screenshotWithRelationsSchema>;
export type ScreenshotPerHour = z.infer<typeof screenshotPerHourSchema>;
export type ScreenShotItem = z.infer<typeof screenShotItemSchema>;
export type CreateScreenshotRequest = z.infer<typeof createScreenshotRequestSchema>;
export type GetScreenshotsRequest = z.infer<typeof getScreenshotsRequestSchema>;
export type ScreenshotResponse = z.infer<typeof screenshotResponseSchema>;
export type ScreenshotListResponse = z.infer<typeof screenshotListResponseSchema>;
