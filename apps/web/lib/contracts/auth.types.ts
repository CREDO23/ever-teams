import { z } from 'zod';
import { userWithRelationsSchema } from './user.types';

// Token schemas
export const authTokenSchema = z.object({
	token: z.string(),
	refresh_token: z.string().optional()
});

// Auth response for login/register
export const authResponseSchema = z.object({
	user: userWithRelationsSchema,
	token: z.string(),
	refresh_token: z.string().optional()
});

// Register request
export const registerWithAppRequestSchema = z.object({
	user: z.object({
		firstName: z.string().min(1),
		lastName: z.string().min(1),
		email: z.string().email(),
		timeZone: z.string().optional()
	}),
	password: z.string().min(8),
	confirmPassword: z.string(),
	appName: z.string().optional(),
	appLogo: z.string().optional(),
	appSignature: z.string().optional(),
	appLink: z.string().optional(),
	appEmailConfirmationUrl: z.string().optional()
}).refine(
	(data) => data.password === data.confirmPassword,
	{
		message: "Passwords don't match",
		path: ["confirmPassword"]
	}
);

// Sign in with email (send magic link)
export const signInEmailRequestSchema = z.object({
	email: z.string().email(),
	appMagicSignUrl: z.string().url(),
	appName: z.string().optional()
});

// Response from signin.email endpoint (sends code)
export const signInEmailResponseSchema = z.object({
	status: z.number(),
	message: z.string()
});

// Sign in with passcode
export const signInPasscodeRequestSchema = z.object({
	email: z.string().email(),
	code: z.string(),
	includeTeams: z.boolean().optional()
});

// Workspace response structure
export const workspaceResponseSchema = z.object({
	token: z.string(),
	user: userWithRelationsSchema
});

// Response from signin.email/confirm endpoint
export const signInEmailConfirmResponseSchema = z.object({
	workspaces: z.array(workspaceResponseSchema),
	confirmed_email: z.string(),
	show_popup: z.boolean(),
	total_workspaces: z.number(),
	defaultTeamId: z.string().nullish(),
	defaultOrganizationId: z.string().nullish(),
	lastTeamId: z.string().nullish(),
	lastOrganizationId: z.string().nullish()
});

// Refresh token request
export const refreshTokenRequestSchema = z.object({
	refresh_token: z.string()
});

// Refresh token response
export const refreshTokenResponseSchema = z.object({
	token: z.string()
});

// Sign in workspace request
export const signInWorkspaceRequestSchema = z.object({
	email: z.string().email(),
	token: z.string(),
	lastOrganizationId: z.string().optional(),
	lastTeamId: z.string().optional()
});

// Type exports
export type AuthToken = z.infer<typeof authTokenSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RegisterWithAppRequest = z.infer<typeof registerWithAppRequestSchema>;
export type SignInEmailRequest = z.infer<typeof signInEmailRequestSchema>;
export type SignInEmailResponse = z.infer<typeof signInEmailResponseSchema>;
export type SignInPasscodeRequest = z.infer<typeof signInPasscodeRequestSchema>;
export type WorkspaceResponse = z.infer<typeof workspaceResponseSchema>;
export type SignInEmailConfirmResponse = z.infer<typeof signInEmailConfirmResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type SignInWorkspaceRequest = z.infer<typeof signInWorkspaceRequestSchema>;
