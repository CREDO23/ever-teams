import { z } from 'zod';
import { basePerTenantAndOrganizationEntityModelSchema } from './common.types';

export enum ContactTypeEnum {
  CLIENT = 'CLIENT',
  CUSTOMER = 'CUSTOMER',
  LEAD = 'LEAD',
  PARTNER = 'PARTNER',
  OTHER = 'OTHER'
}

export const organizationContactSchema = basePerTenantAndOrganizationEntityModelSchema.extend({
  name: z.string(),
  primaryEmail: z.string().email().nullable().optional(),
  primaryPhone: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  image: z.string().nullable().optional(),
  contactType: z.nativeEnum(ContactTypeEnum).default(ContactTypeEnum.CLIENT),
  notes: z.string().nullable().optional(),
  employeeId: z.string().nullable().optional(),
});

export const organizationContactWithRelationsSchema = organizationContactSchema.extend({
  employee: z.lazy(() => require('./employee.types').employeeSchema).nullable().optional(),
  projects: z.lazy(() => z.array(require('./project.types').projectSchema)).optional(),
  members: z.lazy(() => z.array(require('./employee.types').employeeSchema)).optional(),
});

export const createOrganizationContactRequestSchema = z.object({
  name: z.string(),
  primaryEmail: z.string().email().optional(),
  primaryPhone: z.string().optional(),
  imageUrl: z.string().url().optional(),
  image: z.string().optional(),
  contactType: z.nativeEnum(ContactTypeEnum).optional(),
  notes: z.string().optional(),
  employeeId: z.string().optional(),
  organizationId: z.string(),
  tenantId: z.string(),
});

export const updateOrganizationContactRequestSchema = createOrganizationContactRequestSchema.partial().omit({
  organizationId: true,
  tenantId: true,
});

export const getOrganizationContactsRequestSchema = z.object({
  organizationId: z.string().optional(),
  tenantId: z.string().optional(),
  employeeId: z.string().optional(),
  contactType: z.nativeEnum(ContactTypeEnum).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const organizationContactResponseSchema = z.object({
  data: organizationContactWithRelationsSchema,
  message: z.string().optional(),
});

export const organizationContactListResponseSchema = z.object({
  items: z.array(organizationContactWithRelationsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type OrganizationContact = z.infer<typeof organizationContactSchema>;
export type OrganizationContactWithRelations = z.infer<typeof organizationContactWithRelationsSchema>;
export type CreateOrganizationContactRequest = z.infer<typeof createOrganizationContactRequestSchema>;
export type UpdateOrganizationContactRequest = z.infer<typeof updateOrganizationContactRequestSchema>;
export type GetOrganizationContactsRequest = z.infer<typeof getOrganizationContactsRequestSchema>;
export type OrganizationContactResponse = z.infer<typeof organizationContactResponseSchema>;
export type OrganizationContactListResponse = z.infer<typeof organizationContactListResponseSchema>;
