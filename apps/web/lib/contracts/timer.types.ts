import { z } from 'zod';
import { taskSchema } from './task.types';
import { timeLogSchema } from './time-log.types';

export enum TimerStatusEnum {
  RUNNING = 'running',
  STOPPED = 'stopped',
  PAUSED = 'paused',
  IDLE = 'idle'
}

export enum TimeLogSourceEnum {
  MOBILE = 'MOBILE',
  WEB = 'WEB_TIMER',
  DESKTOP = 'DESKTOP'
}

export enum TimeLogTypeEnum {
  TRACKED = 'TRACKED',
  MANUAL = 'MANUAL',
  IDLE = 'IDLE',
  RESUMED = 'RESUMED'
}

export const timerStatusSchema = z.object({
	duration: z.number().optional(),
	running: z.boolean().optional(),
	lastLog: z.lazy(() => timeLogSchema).nullish(),
	lastWorkedTask: z.lazy(() => taskSchema).nullish(),
	timerStatus: z.nativeEnum(TimerStatusEnum).optional(),
});

export const localTimerStatusSchema = z.object({
	lastTaskId: z.string().nullable(),
	runnedDateTime: z.number(),
	running: z.boolean(),
});

export const getTimerStatusRequestSchema = z.object({
	source: z.nativeEnum(TimeLogSourceEnum).optional(),
	tenantId: z.string(),
	organizationId: z.string(),
});

export const updateTimerStatusRequestSchema = z.object({
	organizationId: z.string(),
	tenantId: z.string(),
	taskId: z.string().optional(),
	logType: z.literal('TRACKED'),
	source: z.nativeEnum(TimeLogSourceEnum),
	tags: z.array(z.any()),
	organizationTeamId: z.string().optional(),
});

export const toggleTimerStatusRequestSchema = getTimerStatusRequestSchema.extend({
	logType: z.literal('TRACKED').optional(),
	taskId: z.string(),
});

export const timerStatusResponseSchema = z.object({
	data: timerStatusSchema,
	message: z.string().optional(),
});

export type TimerStatus = z.infer<typeof timerStatusSchema>;
export type LocalTimerStatus = z.infer<typeof localTimerStatusSchema>;
export type GetTimerStatusRequest = z.infer<typeof getTimerStatusRequestSchema>;
export type UpdateTimerStatusRequest = z.infer<typeof updateTimerStatusRequestSchema>;
export type ToggleTimerStatusRequest = z.infer<typeof toggleTimerStatusRequestSchema>;
export type TimerStatusResponse = z.infer<typeof timerStatusResponseSchema>;
