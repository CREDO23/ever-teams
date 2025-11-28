import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

// ============ Enums ============
export const projectBillingEnum = z.enum([
  'RATE',
  'FLAT_FEE',
  'MILESTONES'
]);

export const projectBudgetTypeEnum = z.enum([
  'HOURS',
  'COST'
]);

export const projectOwnerEnum = z.enum([
  'CLIENT',
  'INTERNAL'
]);

export const projectRelationEnum = z.enum([
  'BLOCKS',
  'IS_BLOCKED_BY',
  'RELATES_TO'
]);

export const taskListTypeEnum = z.enum([
  'GRID',
  'SPRINT',
  'KANBAN'
]);

// ============ Database Schema ============
export const projectSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  name: z.string(),
  startDate: z.date().nullish(),
  endDate: z.date().nullish(),
  billing: projectBillingEnum.nullish(),
  currency: z.string().nullish(),
  public: z.boolean().default(false).optional(),
  owner: projectOwnerEnum.nullish(),
  taskListType: taskListTypeEnum.nullish(),
  code: z.string().nullish(),
  description: z.string().nullish(),
  color: z.string().nullish(),
  billable: z.boolean().nullish(),
  billingFlat: z.boolean().nullish(),
  openSource: z.boolean().nullish(),
  projectUrl: z.string().nullish(),
  openSourceProjectUrl: z.string().nullish(),
  budget: z.number().nullish(),
  budgetType: projectBudgetTypeEnum.nullish(),
  membersCount: z.number().nullish(),
  imageUrl: z.string().nullish(),
  status: z.string().nullish(),
  icon: z.string().nullish(),
  archiveTasksIn: z.number().nullish(),
  closeTasksIn: z.number().nullish(),
  // Settings
  customFields: z.record(z.any()).nullish(),
  isTasksAutoSync: z.boolean().default(false).optional(),
  isTasksAutoSyncOnLabel: z.boolean().default(false).optional(),
  syncTag: z.string().nullish(),
  // Foreign keys
  imageId: z.string().nullish(),
  defaultAssigneeId: z.string().nullish(),
  organizationContactId: z.string().nullish(),
});

// ============ With Relations ============
export const projectWithRelationsSchema = projectSchema.extend({
  image: z.lazy(() =>
    require('./image-asset.types').imageAssetSchema
  ).optional(),
  defaultAssignee: z.lazy(() =>
    require('./employee.types').employeeSchema
  ).optional(),
  tags: z.lazy(() =>
    z.array(require('./tag.types').tagSchema)
  ).optional(),
  members: z.lazy(() =>
    z.array(require('./project-employee.types').projectEmployeeSchema)
  ).optional(),
  teams: z.lazy(() =>
    z.array(require('./team.types').teamSchema)
  ).optional(),
  tasks: z.lazy(() =>
    z.array(require('./task.types').taskSchema)
  ).optional(),
  repository: z.lazy(() =>
    require('./project-repository.types').projectRepositorySchema
  ).optional(),
});

// ============ Project Repository Schema ============
export const projectRepositorySchema = z.object({
  id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isActive: z.boolean(),
  isArchived: z.boolean(),
  tenantId: z.string(),
  organizationId: z.string(),
  repositoryId: z.number(),
  name: z.string(),
  fullName: z.string(),
  owner: z.string().nullable(),
  integrationId: z.string(),
});

// ============ Request Schemas ============
export const getProjectRequestSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  includeMembers: z.boolean().optional(),
  includeTasks: z.boolean().optional(),
});

export const getProjectsRequestSchema = z.object({
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().optional(),
});

export const createProjectRequestSchema = z.object({
  name: z.string().min(1),
  organizationId: z.string(),
  tenantId: z.string(),
  projectUrl: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.any()).optional(),
  imageUrl: z.string().nullish(),
  imageId: z.string().optional(),
  budget: z.number().optional(),
  budgetType: projectBudgetTypeEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  archivedAt: z.string().nullish(),
  billing: projectBillingEnum.optional(),
  currency: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  managerIds: z.array(z.string()).optional(),
  teams: z.array(z.any()).optional(),
  status: z.string().optional(),
  isActive: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isTasksAutoSync: z.boolean().optional(),
  isTasksAutoSyncOnLabel: z.boolean().optional(),
  owner: projectOwnerEnum.optional(),
});

export const updateProjectRequestSchema = createProjectRequestSchema.partial();

// ============ Response Schemas ============
export const projectResponseSchema = z.object({
  data: projectWithRelationsSchema,
  success: z.boolean(),
  message: z.string().optional(),
});

export const projectListResponseSchema = z.object({
  data: z.array(projectWithRelationsSchema),
  total: z.number(),
  success: z.boolean(),
});

// ============ Type Exports ============
export type ProjectBilling = z.infer<typeof projectBillingEnum>;
export type ProjectBudgetType = z.infer<typeof projectBudgetTypeEnum>;
export type ProjectOwner = z.infer<typeof projectOwnerEnum>;
export type ProjectRelation = z.infer<typeof projectRelationEnum>;
export type TaskListType = z.infer<typeof taskListTypeEnum>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectWithRelations = z.infer<typeof projectWithRelationsSchema>;
export type ProjectRepository = z.infer<typeof projectRepositorySchema>;
export type GetProjectRequest = z.infer<typeof getProjectRequestSchema>;
export type GetProjectsRequest = z.infer<typeof getProjectsRequestSchema>;
export type CreateProjectRequest = z.infer<typeof createProjectRequestSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectRequestSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
