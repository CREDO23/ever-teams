import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { employeeSchema } from './employee.types';
import { issueTypeSchema } from './issue-type.types';
import { projectSchema } from './project.types';
import { tagSchema } from './tag.types';
import { taskLinkedIssueSchema } from './task-linked-issue.types';
import { taskPrioritySchema } from './task-priority.types';
import { taskSizeSchema } from './task-size.types';
import { taskStatusSchema } from './task-status.types';
import { teamSchema } from './team.types';

export enum TaskStatusEnum {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  READY = 'ready',
  IN_REVIEW = 'in-review',
  BLOCKED = 'blocked',
  COMPLETED = 'completed'
}

export enum TaskPriorityEnum {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskSizeEnum {
  TINY = 'tiny',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  X_LARGE = 'x-large'
}

export const taskSchema = basePerTenantEntityModelSchema.extend({
  title: z.string().min(1),
  number: z.number().optional(),
  public: z.boolean().default(true),
  prefix: z.string().optional(),
  description: z.string().nullish(),
  status: z.nativeEnum(TaskStatusEnum).optional(),
  priority: z.nativeEnum(TaskPriorityEnum).optional(),
  size: z.nativeEnum(TaskSizeEnum).optional(),
  issueType: z.string().optional(),
  startDate: z.string().datetime().nullish(),
  resolvedAt: z.string().datetime().nullish(),
  dueDate: z.string().datetime().nullish(),
  estimate: z.number().nullish(),
  isDraft: z.boolean().default(false),
  isScreeningTask: z.boolean().default(false),
  version: z.string().nullish(),
  parentId: z.string().nullish(),
  taskStatusId: z.string().nullish(),
  taskSizeId: z.string().nullish(),
  taskPriorityId: z.string().nullish(),
  taskTypeId: z.string().nullish(),
  projectId: z.string().nullish(),
  taskNumber: z.string().nullish(),
  totalWorkedTime: z.number().nullish(),
  label: z.string().nullish(),
  estimateHours: z.number().nullish(),
  estimateMinutes: z.number().nullish(),
  estimateDays: z.number().nullish(),
});

export const taskWithRelationsSchema = taskSchema.extend({
  parent: z.lazy(() => taskSchema).nullish(),
  children: z.lazy(() => z.array(taskSchema)).optional(),
  rootEpic: z.lazy(() => taskSchema).nullish(),
  taskStatus: z.lazy(() => taskStatusSchema).nullish(),
  taskSize: z.lazy(() => taskSizeSchema).nullish(),
  taskPriority: z.lazy(() => taskPrioritySchema).nullish(),
  taskType: z.lazy(() => issueTypeSchema).nullish(),
  project: z.lazy(() => projectSchema).nullish(),
  members: z.lazy(() => z.array(employeeSchema)).optional(),
  teams: z.lazy(() => z.array(teamSchema)).optional(),
  tags: z.lazy(() => z.array(tagSchema)).optional(),
  linkedIssues: z.lazy(() => z.array(taskLinkedIssueSchema)).optional(),
  selectedTeam: z.lazy(() => teamSchema).nullish(),
});

export const createTaskRequestSchema = z.object({
  title: z.string().min(1),
  status: z.nativeEnum(TaskStatusEnum).optional(),
  size: z.nativeEnum(TaskSizeEnum).optional(),
  priority: z.nativeEnum(TaskPriorityEnum).optional(),
  taskStatusId: z.string().optional(),
  issueType: z.string().optional(),
  members: z.array(z.object({ id: z.string() })).optional(),
  estimateDays: z.number().optional(),
  estimateHours: z.number().optional(),
  estimateMinutes: z.number().optional(),
  dueDate: z.string().datetime().optional(),
  description: z.string().optional(),
  tags: z.array(z.object({ id: z.string() })).optional(),
  teams: z.array(z.object({ id: z.string() })).optional(),
  estimate: z.number().optional(),
  organizationId: z.string(),
  tenantId: z.string(),
  projectId: z.string().nullish(),
});

export const updateTaskRequestSchema = createTaskRequestSchema.partial().omit({
  organizationId: true,
  tenantId: true,
});

export const getTaskRequestSchema = z.object({
  id: z.string().optional(),
  includeRelations: z.array(z.string()).optional(),
});

export const getTasksRequestSchema = z.object({
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  projectId: z.string().optional(),
  teamId: z.string().optional(),
  employeeId: z.string().optional(),
  status: z.nativeEnum(TaskStatusEnum).optional(),
  priority: z.nativeEnum(TaskPriorityEnum).optional(),
  size: z.nativeEnum(TaskSizeEnum).optional(),
  isDraft: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  includeRelations: z.array(z.string()).optional(),
});

export const taskResponseSchema = z.object({
  data: taskWithRelationsSchema,
  message: z.string().optional(),
});

export const taskListResponseSchema = z.object({
  items: z.array(taskWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const taskStatisticsSchema = taskWithRelationsSchema.extend({
  duration: z.number().optional(),
  durationPercentage: z.number().optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskWithRelations = z.infer<typeof taskWithRelationsSchema>;
export type CreateTaskRequest = z.infer<typeof createTaskRequestSchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskRequestSchema>;
export type GetTaskRequest = z.infer<typeof getTaskRequestSchema>;
export type GetTasksRequest = z.infer<typeof getTasksRequestSchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;
export type TaskListResponse = z.infer<typeof taskListResponseSchema>;
export type TaskStatistics = z.infer<typeof taskStatisticsSchema>;
