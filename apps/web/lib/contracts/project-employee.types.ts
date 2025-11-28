import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

export const projectEmployeeSchema = basePerTenantEntityModelSchema.extend({
  projectId: z.string(),
  employeeId: z.string(),
  role: z.string().nullable().optional(),
  isManager: z.boolean().default(false),
  assignedAt: z.string().datetime().optional(),
});

export const projectEmployeeWithRelationsSchema = projectEmployeeSchema.extend({
  project: z.lazy(() => require('./project.types').projectSchema),
  employee: z.lazy(() => require('./employee.types').employeeSchema),
});

export const assignEmployeeToProjectSchema = z.object({
  projectId: z.string(),
  employeeId: z.string(),
  role: z.string().optional(),
  isManager: z.boolean().optional(),
});

export const updateProjectEmployeeSchema = z.object({
  role: z.string().optional(),
  isManager: z.boolean().optional(),
});

export const projectEmployeeResponseSchema = z.object({
  data: projectEmployeeWithRelationsSchema,
  message: z.string().optional(),
});

export const projectEmployeeListResponseSchema = z.object({
  items: z.array(projectEmployeeWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type ProjectEmployee = z.infer<typeof projectEmployeeSchema>;
export type ProjectEmployeeWithRelations = z.infer<typeof projectEmployeeWithRelationsSchema>;
export type AssignEmployeeToProject = z.infer<typeof assignEmployeeToProjectSchema>;
export type UpdateProjectEmployee = z.infer<typeof updateProjectEmployeeSchema>;
export type ProjectEmployeeResponse = z.infer<typeof projectEmployeeResponseSchema>;
export type ProjectEmployeeListResponse = z.infer<typeof projectEmployeeListResponseSchema>;
