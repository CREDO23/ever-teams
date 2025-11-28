import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';
import { organizationSchema } from './organization.types';
import { tenantSchema } from './tenant.types';

export const integrationTypeEnum = z.enum([
	'GitHub',
	'GitLab',
	'Bitbucket',
	'Jira',
	'Slack',
	'Discord',
	'Linear',
	'Custom'
	]);

export const integrationStatusEnum = z.enum([
	'connected',
	'disconnected',
	'error',
	'pending'
	]);

export const integrationSchema = basePerTenantEntityModelSchema.extend({
	name: z.string(),
	type: integrationTypeEnum,
	status: integrationStatusEnum,
	config: z.record(z.any()).optional(),
	accessToken: z.string().nullish(),
	refreshToken: z.string().nullish(),
	webhookUrl: z.string().nullish(),
	webhookSecret: z.string().nullish(),
	metadata: z.record(z.any()).optional()
});

export const integrationWithRelationsSchema = integrationSchema.extend({
	organization: z.lazy(() => organizationSchema).optional(),
	tenant: z.lazy(() => tenantSchema).optional()
});

export const getIntegrationRequestSchema = z.object({
	integrationId: z.string().uuid(),
	relations: z.array(z.string()).optional()
});

export const listIntegrationsRequestSchema = z.object({
	type: integrationTypeEnum.optional(),
	status: integrationStatusEnum.optional(),
	organizationId: z.string().uuid().optional()
});

export const createIntegrationRequestSchema = z.object({
	name: z.string(),
	type: integrationTypeEnum,
	config: z.record(z.any()).optional(),
	accessToken: z.string().optional(),
	refreshToken: z.string().optional(),
	webhookUrl: z.string().optional(),
	webhookSecret: z.string().optional()
});

export const updateIntegrationRequestSchema = createIntegrationRequestSchema.partial();

export const integrationResponseSchema = z.object({
	data: integrationWithRelationsSchema,
	message: z.string().optional()
});

export const integrationsListResponseSchema = z.object({
	data: z.array(integrationWithRelationsSchema),
	total: z.number(),
	message: z.string().optional()
});

export type IntegrationType = z.infer<typeof integrationTypeEnum>;
export type IntegrationStatus = z.infer<typeof integrationStatusEnum>;
export type Integration = z.infer<typeof integrationSchema>;
export type IntegrationWithRelations = z.infer<typeof integrationWithRelationsSchema>;
export type GetIntegrationRequest = z.infer<typeof getIntegrationRequestSchema>;
export type ListIntegrationsRequest = z.infer<typeof listIntegrationsRequestSchema>;
export type CreateIntegrationRequest = z.infer<typeof createIntegrationRequestSchema>;
export type UpdateIntegrationRequest = z.infer<typeof updateIntegrationRequestSchema>;
export type IntegrationResponse = z.infer<typeof integrationResponseSchema>;
export type IntegrationsListResponse = z.infer<typeof integrationsListResponseSchema>;
