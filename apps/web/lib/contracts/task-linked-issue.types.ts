import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

export enum TaskLinkedIssueTypeEnum {
  GITHUB = 'Github',
  JIRA = 'Jira',
  GITLAB = 'GitLab',
  BITBUCKET = 'Bitbucket',
  CUSTOM = 'Custom'
}

export const taskLinkedIssueSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  taskId: z.string(),
  action: z.number().optional(),
  issueType: z.nativeEnum(TaskLinkedIssueTypeEnum),
  issueNumber: z.string(),
  issueId: z.string().nullable().optional(),
  issueTitle: z.string().nullable().optional(),
  issueUrl: z.string().url().nullable().optional(),
  issueStatus: z.string().nullable().optional(),
  issueBody: z.string().nullable().optional(),
});

export const taskLinkedIssueWithRelationsSchema = taskLinkedIssueSchema.extend({
  task: z.lazy(() => require('./task.types').taskSchema),
});

export const createTaskLinkedIssueRequestSchema = z.object({
  taskId: z.string(),
  action: z.number().optional(),
  issueType: z.nativeEnum(TaskLinkedIssueTypeEnum),
  issueNumber: z.string(),
  issueId: z.string().optional(),
  issueTitle: z.string().optional(),
  issueUrl: z.string().url().optional(),
  issueStatus: z.string().optional(),
  issueBody: z.string().optional(),
  organizationId: z.string(),
  tenantId: z.string(),
});

export const updateTaskLinkedIssueRequestSchema = createTaskLinkedIssueRequestSchema.partial().omit({
  taskId: true,
  organizationId: true,
  tenantId: true,
});

export const taskLinkedIssueResponseSchema = z.object({
  data: taskLinkedIssueWithRelationsSchema,
  message: z.string().optional(),
});

export const taskLinkedIssueListResponseSchema = z.object({
  items: z.array(taskLinkedIssueWithRelationsSchema),
  total: z.number(),
});

export type TaskLinkedIssue = z.infer<typeof taskLinkedIssueSchema>;
export type TaskLinkedIssueWithRelations = z.infer<typeof taskLinkedIssueWithRelationsSchema>;
export type CreateTaskLinkedIssueRequest = z.infer<typeof createTaskLinkedIssueRequestSchema>;
export type UpdateTaskLinkedIssueRequest = z.infer<typeof updateTaskLinkedIssueRequestSchema>;
export type TaskLinkedIssueResponse = z.infer<typeof taskLinkedIssueResponseSchema>;
export type TaskLinkedIssueListResponse = z.infer<typeof taskLinkedIssueListResponseSchema>;
