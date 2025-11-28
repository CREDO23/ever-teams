import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { employeeSchema } from './employee.types';
import { taskSchema } from './task.types';
import { teamSchema } from './team.types';

export enum DailyPlanStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export const dailyPlanSchema = basePerTenantEntityModelSchema.extend({
	date: z.string().datetime(),
	workTimePlanned: z.number().min(0),
	status: z.nativeEnum(DailyPlanStatusEnum),
	employeeId: z.string(),
	organizationTeamId: z.string().nullish(),
});

export const dailyPlanWithRelationsSchema = dailyPlanSchema.extend({
	tasks: z.lazy(() => z.array(taskSchema)).optional(),
	employee: z.lazy(() => employeeSchema).optional(),
	organizationTeam: z.lazy(() => teamSchema).nullish(),
});

export const createDailyPlanRequestSchema = z.object({
	date: z.string().datetime(),
	workTimePlanned: z.number().min(0),
	status: z.nativeEnum(DailyPlanStatusEnum).optional(),
	employeeId: z.string(),
	organizationTeamId: z.string().optional(),
	taskId: z.string().optional(),
	organizationId: z.string(),
	tenantId: z.string(),
});

export const updateDailyPlanRequestSchema = z.object({
	date: z.string().datetime().optional(),
	workTimePlanned: z.number().min(0).optional(),
	status: z.nativeEnum(DailyPlanStatusEnum).optional(),
	organizationTeamId: z.string().nullish(),
});

export const dailyPlanTasksUpdateRequestSchema = z.object({
	taskId: z.string(),
	employeeId: z.string(),
	organizationId: z.string(),
	tenantId: z.string(),
});

export const removeTaskFromManyPlansRequestSchema = z.object({
	employeeId: z.string().optional(),
	plansIds: z.array(z.string()).optional(),
	organizationId: z.string().optional(),
});

export const getDailyPlansRequestSchema = z.object({
	employeeId: z.string().optional(),
	organizationId: z.string().optional(),
	tenantId: z.string().optional(),
	teamId: z.string().optional(),
	date: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	status: z.nativeEnum(DailyPlanStatusEnum).optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
});

export const dailyPlanResponseSchema = z.object({
	data: dailyPlanWithRelationsSchema,
	message: z.string().optional(),
});

export const dailyPlanListResponseSchema = z.object({
	items: z.array(dailyPlanWithRelationsSchema),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
});

export type DailyPlan = z.infer<typeof dailyPlanSchema>;
export type DailyPlanWithRelations = z.infer<typeof dailyPlanWithRelationsSchema>;
export type CreateDailyPlanRequest = z.infer<typeof createDailyPlanRequestSchema>;
export type UpdateDailyPlanRequest = z.infer<typeof updateDailyPlanRequestSchema>;
export type DailyPlanTasksUpdateRequest = z.infer<typeof dailyPlanTasksUpdateRequestSchema>;
export type RemoveTaskFromManyPlansRequest = z.infer<typeof removeTaskFromManyPlansRequestSchema>;
export type GetDailyPlansRequest = z.infer<typeof getDailyPlansRequestSchema>;
export type DailyPlanResponse = z.infer<typeof dailyPlanResponseSchema>;
export type DailyPlanListResponse = z.infer<typeof dailyPlanListResponseSchema>;
