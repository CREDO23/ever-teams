import { z } from 'zod';
import { basePerTenantEntityModelSchema } from './common.types';

export const requestToJoinStatusEnum = z.enum([
  'pending',
  'accepted',
  'rejected',
  'expired'
]);

export const requestToJoinSchema = basePerTenantEntityModelSchema.extend({
  email: z.string().email(),
  fullName: z.string(),
  position: z.string().nullable().optional(),
  linkAddress: z.string().url().nullable().optional(),
  status: requestToJoinStatusEnum,
  code: z.string().nullable().optional(),
  organizationTeamId: z.string().uuid(),
  organizationId: z.string().uuid().nullable().optional(),
  userId: z.string().uuid().nullable().optional(),
  expiredAt: z.date().nullable().optional()
});

export const requestToJoinWithRelationsSchema = requestToJoinSchema.extend({
  organizationTeam: z.lazy(() => require('./team.types').teamSchema).optional(),
  organization: z.lazy(() => require('./organization.types').organizationSchema).optional(),
  user: z.lazy(() => require('./user.types').userSchema).optional()
});

export const joinTeamRequestSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  linkAddress: z.string().url(),
  position: z.string(),
  organizationTeamId: z.string().uuid()
});

export const validateRequestToJoinSchema = z.object({
  email: z.string().email(),
  organizationTeamId: z.string().uuid(),
  code: z.string()
});

export const getRequestToJoinRequestSchema = z.object({
  email: z.string().email().optional(),
  organizationTeamId: z.string().uuid().optional(),
  status: requestToJoinStatusEnum.optional(),
  relations: z.array(z.string()).optional()
});

export const acceptRejectRequestSchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(['accept', 'reject']),
  organizationId: z.string().uuid().optional()
});

export const resendCodeRequestSchema = z.object({
  email: z.string().email(),
  organizationTeamId: z.string().uuid()
});

export const joinTeamResponseSchema = z.object({
  data: requestToJoinWithRelationsSchema.extend({
    id: z.string().uuid(),
    createdAt: z.string(),
    updatedAt: z.string(),
    status: z.string()
  }),
  message: z.string().optional()
});

export const requestsToJoinListResponseSchema = z.object({
  data: z.array(requestToJoinWithRelationsSchema),
  total: z.number(),
  message: z.string().optional()
});

export type RequestToJoinStatus = z.infer<typeof requestToJoinStatusEnum>;
export type RequestToJoin = z.infer<typeof requestToJoinSchema>;
export type RequestToJoinWithRelations = z.infer<typeof requestToJoinWithRelationsSchema>;
export type JoinTeamRequest = z.infer<typeof joinTeamRequestSchema>;
export type ValidateRequestToJoin = z.infer<typeof validateRequestToJoinSchema>;
export type GetRequestToJoinRequest = z.infer<typeof getRequestToJoinRequestSchema>;
export type AcceptRejectRequest = z.infer<typeof acceptRejectRequestSchema>;
export type ResendCodeRequest = z.infer<typeof resendCodeRequestSchema>;
export type JoinTeamResponse = z.infer<typeof joinTeamResponseSchema>;
export type RequestsToJoinListResponse = z.infer<typeof requestsToJoinListResponseSchema>;
