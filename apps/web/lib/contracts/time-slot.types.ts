import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { TimeLogSourceEnum, TimeLogTypeEnum } from './timer.types';
import { activitySchema } from './activity.types';
import { employeeSchema } from './employee.types';
import { projectSchema } from './project.types';
import { screenshotSchema } from './screenshot.types';
import { tagSchema } from './tag.types';
import { timeLogSchema } from './time-log.types';
import { timeSlotMinuteSchema } from './time-slot-minutes.types';

export const timeSlotSchema = basePerTenantEntityModelSchema.extend({
	employeeId: z.string(),
	projectId: z.string().nullish(),
	duration: z.number().optional(),
	keyboard: z.number().optional(),
	mouse: z.number().optional(),
	overall: z.number().optional(),
	startedAt: z.string().datetime(),
	stoppedAt: z.string().datetime().nullish(),
	percentage: z.number().optional(),
	keyboardPercentage: z.number().optional(),
	mousePercentage: z.number().optional(),
	isAllowDelete: z.boolean().default(true),
});

export const timeSlotWithRelationsSchema = timeSlotSchema.extend({
	employee: z.lazy(() => employeeSchema).optional(),
	project: z.lazy(() => projectSchema).nullish(),
	activities: z.lazy(() => z.array(activitySchema)).optional(),
	screenshots: z.lazy(() => z.array(screenshotSchema)).optional(),
	timeLogs: z.lazy(() => z.array(timeLogSchema)).optional(),
	timeSlotMinutes: z.lazy(() => z.array(timeSlotMinuteSchema)).optional(),
	tags: z.lazy(() => z.array(tagSchema)).optional(),
});

export const addManualTimeRequestSchema = z.object({
	employeeId: z.string(),
	projectId: z.string().optional(),
	taskId: z.string().optional(),
	organizationContactId: z.string().optional(),
	description: z.string().optional(),
	reason: z.string().optional(),
	startedAt: z.string().datetime(),
	stoppedAt: z.string().datetime(),
	editedAt: z.string().datetime().optional(),
	tags: z.array(z.string()).optional(),
	isBillable: z.boolean().optional(),
	organizationId: z.string().nullish(),
	tenantId: z.string().optional(),
	logType: z.nativeEnum(TimeLogTypeEnum),
	source: z.literal(TimeLogSourceEnum.WEB),
});

export const getTimeSlotsRequestSchema = z.object({
	employeeId: z.string().optional(),
	organizationId: z.string().optional(),
	tenantId: z.string().optional(),
	projectId: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
});

export const timeSlotResponseSchema = z.object({
	data: timeSlotWithRelationsSchema,
	message: z.string().optional(),
});

export const timeSlotListResponseSchema = z.object({
	items: z.array(timeSlotWithRelationsSchema),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
});

export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type TimeSlotWithRelations = z.infer<typeof timeSlotWithRelationsSchema>;
export type AddManualTimeRequest = z.infer<typeof addManualTimeRequestSchema>;
export type GetTimeSlotsRequest = z.infer<typeof getTimeSlotsRequestSchema>;
export type TimeSlotResponse = z.infer<typeof timeSlotResponseSchema>;
export type TimeSlotListResponse = z.infer<typeof timeSlotListResponseSchema>;
