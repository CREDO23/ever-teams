import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

export const timeSlotMinuteSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  timeSlotId: z.string().nullable().optional(),
  keyboard: z.number().optional(),
  mouse: z.number().optional(),
  datetime: z.string().datetime().optional(),
});

export const timeSlotMinuteWithRelationsSchema = timeSlotMinuteSchema.extend({
  timeSlot: z.lazy(() => require('./time-slot.types').timeSlotSchema).nullable().optional(),
});

export const createTimeSlotMinuteRequestSchema = z.object({
  timeSlotId: z.string(),
  keyboard: z.number().optional(),
  mouse: z.number().optional(),
  datetime: z.string().datetime().optional(),
  organizationId: z.string(),
  tenantId: z.string(),
});

export const getTimeSlotMinutesRequestSchema = z.object({
  timeSlotId: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const timeSlotMinuteResponseSchema = z.object({
  data: timeSlotMinuteWithRelationsSchema,
  message: z.string().optional(),
});

export const timeSlotMinuteListResponseSchema = z.object({
  items: z.array(timeSlotMinuteWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type TimeSlotMinute = z.infer<typeof timeSlotMinuteSchema>;
export type TimeSlotMinuteWithRelations = z.infer<typeof timeSlotMinuteWithRelationsSchema>;
export type CreateTimeSlotMinuteRequest = z.infer<typeof createTimeSlotMinuteRequestSchema>;
export type GetTimeSlotMinutesRequest = z.infer<typeof getTimeSlotMinutesRequestSchema>;
export type TimeSlotMinuteResponse = z.infer<typeof timeSlotMinuteResponseSchema>;
export type TimeSlotMinuteListResponse = z.infer<typeof timeSlotMinuteListResponseSchema>;
