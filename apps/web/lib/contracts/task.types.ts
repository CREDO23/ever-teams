import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

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

export const taskSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
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
  taskStatus: z.lazy(() => require('./task-status.types').taskStatusSchema).nullish(),
  taskSize: z.lazy(() => require('./task-size.types').taskSizeSchema).nullish(),
  taskPriority: z.lazy(() => require('./task-priority.types').taskPrioritySchema).nullish(),
  taskType: z.lazy(() => require('./issue-type.types').issueTypeSchema).nullish(),
  project: z.lazy(() => require('./project.types').projectSchema).nullish(),
  members: z.lazy(() => z.array(require('./employee.types').employeeSchema)).optional(),
  teams: z.lazy(() => z.array(require('./team.types').teamSchema)).optional(),
  tags: z.lazy(() => z.array(require('./tag.types').tagSchema)).optional(),
  linkedIssues: z.lazy(() => z.array(require('./task-linked-issue.types').taskLinkedIssueSchema)).optional(),
  selectedTeam: z.lazy(() => require('./team.types').teamSchema).nullish(),
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
