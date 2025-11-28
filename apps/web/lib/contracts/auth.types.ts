import { z } from 'zod';
import { userWithRelationsSchema } from './user.types';

export const authTokenSchema = z.object({
	token: z.string(),
	refresh_token: z.string()
});

export const authResponseSchema = authTokenSchema.extend({
	user: userWithRelationsSchema
});

export const signInEmailRequestSchema = z.object({
	email: z.string().email(),
	appMagicSignUrl: z.string().url(),
	appName: z.string().optional()
});

export const signInEmailResponseSchema = z.object({
	status: z.number(),
	message: z.string()
});

export const signInPasscodeRequestSchema = z.object({
	email: z.string().email(),
	code: z.string(),
	includeTeams: z.boolean().optional()
});

export const signInEmailConfirmResponseSchema = z.object({
	user: userWithRelationsSchema,
	confirmed_email: z.string(),
	show_popup: z.boolean(),
	defaultTeamId: z.string().nullish(),
	workspaces: z.array(z.object({
		token: z.string(),
		user: z.object({
			email: z.string().email(),
			imageUrl: z.string().nullish(),
			lastTeamId: z.string().nullish(),
			lastLoginAt: z.string().nullish(),
			name: z.string(),
			tenant: z.object({
				name: z.string(),
				logo: z.string().nullish()
			})
		}),
		current_teams: z.array(z.object({
			team_id: z.string(),
			team_name: z.string(),
			team_logo: z.string().nullish(),
			team_member_count: z.string(),
			profile_link: z.string(),
			prefix: z.string().nullish()
		}))
	})),
	status: z.number().optional()
});

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

export type AuthToken = z.infer<typeof authTokenSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type SignInEmailRequest = z.infer<typeof signInEmailRequestSchema>;
export type SignInEmailResponse = z.infer<typeof signInEmailResponseSchema>;
export type SignInPasscodeRequest = z.infer<typeof signInPasscodeRequestSchema>;
export type SignInEmailConfirmResponse = z.infer<typeof signInEmailConfirmResponseSchema>;
export type RegisterWithAppRequest = z.infer<typeof registerWithAppRequestSchema>;
