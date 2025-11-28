import { z } from 'zod';
import {
	loginRequestSchema,
	registerRequestSchema,
	userWithRelationsSchema,
	type LoginRequest,
	type RegisterRequest,
	type UserWithRelations
} from '../contracts/user.types';

const authResponseSchema = z.object({
	user: userWithRelationsSchema,
	token: z.string(),
	refresh_token: z.string(),
	team: userWithRelationsSchema.optional()
});

const signInEmailConfirmResponseSchema = z.object({
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

const sendAuthCodeRequestSchema = z.object({
	email: z.string().email(),
	callbackUrl: z.string().url()
});

const sendAuthCodeResponseSchema = z.object({
	status: z.number(),
	message: z.string()
});

const signInEmailRequestSchema = z.object({
	email: z.string().email(),
	callbackUrl: z.string().url()
});

const signInEmailPasswordRequestSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

const signInEmailConfirmRequestSchema = z.object({
	code: z.string(),
	email: z.string().email()
});

const signInWorkspaceRequestSchema = z.object({
	email: z.string().email(),
	token: z.string(),
	defaultTeamId: z.string().nullish(),
	lastTeamId: z.string().nullish()
});

const verifyAuthCodeRequestSchema = z.object({
	email: z.string().email(),
	code: z.string()
});

const refreshTokenRequestSchema = z.object({
	refresh_token: z.string()
});

const refreshTokenResponseSchema = z.object({
	token: z.string()
});

const verifyEmailByCodeRequestSchema = z.object({
	code: z.string(),
	email: z.string().email(),
	tenantId: z.string()
});

const verifyEmailByTokenRequestSchema = z.object({
	token: z.string(),
	email: z.string().email()
});

const resendVerifyLinkRequestSchema = z.object({
	email: z.string().email(),
	tenantId: z.string(),
	appEmailConfirmationUrl: z.string().url()
});

const socialLoginRequestSchema = z.object({
	provider: z.enum(['GOOGLE', 'FACEBOOK', 'GITHUB', 'LINKEDIN', 'TWITTER']),
	token: z.string()
});

const switchWorkspaceRequestSchema = z.object({
	tenantId: z.string()
});

const registerRequestWithAppSchema = registerRequestSchema.extend({
	appEmailConfirmationUrl: z.string().url().optional(),
	appName: z.string().optional(),
	appLogo: z.string().optional(),
	appSignature: z.string().optional(),
	appLink: z.string().optional()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
export type SignInEmailConfirmResponse = z.infer<typeof signInEmailConfirmResponseSchema>;
export type SendAuthCodeRequest = z.infer<typeof sendAuthCodeRequestSchema>;
export type SendAuthCodeResponse = z.infer<typeof sendAuthCodeResponseSchema>;
export type SignInEmailRequest = z.infer<typeof signInEmailRequestSchema>;
export type SignInEmailPasswordRequest = z.infer<typeof signInEmailPasswordRequestSchema>;
export type SignInEmailConfirmRequest = z.infer<typeof signInEmailConfirmRequestSchema>;
export type SignInWorkspaceRequest = z.infer<typeof signInWorkspaceRequestSchema>;
export type VerifyAuthCodeRequest = z.infer<typeof verifyAuthCodeRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type VerifyEmailByCodeRequest = z.infer<typeof verifyEmailByCodeRequestSchema>;
export type VerifyEmailByTokenRequest = z.infer<typeof verifyEmailByTokenRequestSchema>;
export type ResendVerifyLinkRequest = z.infer<typeof resendVerifyLinkRequestSchema>;
export type SocialLoginRequest = z.infer<typeof socialLoginRequestSchema>;
export type SwitchWorkspaceRequest = z.infer<typeof switchWorkspaceRequestSchema>;
export type RegisterRequestWithApp = z.infer<typeof registerRequestWithAppSchema>;

export interface AuthServiceOptions {
	apiUrl?: string;
	fetch?: typeof fetch;
}

export class AuthService {
	private apiUrl: string;
	private fetchFn: typeof fetch;

	constructor(options: AuthServiceOptions = {}) {
		this.apiUrl = options.apiUrl || process.env.NEXT_PUBLIC_GAUZY_API_URL || '';
		this.fetchFn = options.fetch || fetch;
	}

	private async request<T>(path: string, options: RequestInit & { bearerToken?: string }): Promise<T> {
		const { bearerToken, ...fetchOptions } = options;
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...fetchOptions.headers
		};

		if (bearerToken) {
			headers['Authorization'] = `Bearer ${bearerToken}`;
		}

		const response = await this.fetchFn(`${this.apiUrl}${path}`, {
			...fetchOptions,
			headers
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ message: 'Request failed' }));
			throw new Error(error.message || `HTTP ${response.status}`);
		}

		return response.json();
	}

	async register(data: RegisterRequestWithApp): Promise<UserWithRelations> {
		const validatedData = registerRequestWithAppSchema.parse(data);
		const response = await this.request<UserWithRelations>('/auth/register', {
			method: 'POST',
			body: JSON.stringify(validatedData)
		});
		return userWithRelationsSchema.parse(response);
	}

	async sendAuthCode(data: SendAuthCodeRequest): Promise<SendAuthCodeResponse> {
		const validatedData = sendAuthCodeRequestSchema.parse(data);
		const response = await this.request<SendAuthCodeResponse>('/auth/send-code', {
			method: 'POST',
			body: JSON.stringify(validatedData)
		});
		return sendAuthCodeResponseSchema.parse(response);
	}

	async signInEmail(data: SignInEmailRequest & { appName?: string }): Promise<SendAuthCodeResponse> {
		const validatedData = signInEmailRequestSchema.parse(data);
		const response = await this.request<SendAuthCodeResponse>('/auth/signin.email', {
			method: 'POST',
			body: JSON.stringify({
				email: validatedData.email,
				appMagicSignUrl: validatedData.callbackUrl,
				appName: data.appName
			})
		});
		return sendAuthCodeResponseSchema.parse(response);
	}

	async signInEmailPassword(data: SignInEmailPasswordRequest): Promise<SignInEmailConfirmResponse> {
		const validatedData = signInEmailPasswordRequestSchema.parse(data);
		const response = await this.request<SignInEmailConfirmResponse>('/auth/signin.email.password', {
			method: 'POST',
			body: JSON.stringify({
				...validatedData,
				includeTeams: true
			})
		});
		return signInEmailConfirmResponseSchema.parse(response);
	}

	async signInEmailConfirm(data: SignInEmailConfirmRequest): Promise<SignInEmailConfirmResponse> {
		const validatedData = signInEmailConfirmRequestSchema.parse(data);
		const response = await this.request<SignInEmailConfirmResponse>('/auth/signin.email/confirm', {
			method: 'POST',
			body: JSON.stringify({
				...validatedData,
				includeTeams: true
			})
		});
		return signInEmailConfirmResponseSchema.parse(response);
	}

	async signInWorkspace(data: SignInWorkspaceRequest): Promise<AuthResponse> {
		const validatedData = signInWorkspaceRequestSchema.parse(data);
		const response = await this.request<AuthResponse>('/auth/signin.workspace', {
			method: 'POST',
			body: JSON.stringify(validatedData),
			bearerToken: validatedData.token
		});
		return authResponseSchema.parse(response);
	}

	async verifyAuthCode(data: VerifyAuthCodeRequest): Promise<AuthResponse> {
		const validatedData = verifyAuthCodeRequestSchema.parse(data);
		const response = await this.request<AuthResponse>('/auth/verify-code', {
			method: 'POST',
			body: JSON.stringify(validatedData)
		});
		return authResponseSchema.parse(response);
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		const validatedData = loginRequestSchema.parse(data);
		const response = await this.request<AuthResponse>('/auth/login', {
			method: 'POST',
			body: JSON.stringify(validatedData)
		});
		return authResponseSchema.parse(response);
	}

	async isAuthenticated(bearerToken: string): Promise<boolean> {
		const response = await this.request<boolean>('/user/authenticated', {
			method: 'GET',
			bearerToken
		});
		return z.boolean().parse(response);
	}

	async getCurrentUser(bearerToken: string, relations: string[] = ['role', 'tenant']): Promise<UserWithRelations> {
		const query = new URLSearchParams({
			relations: relations.join(','),
			includeEmployee: 'true'
		});
		const response = await this.request<UserWithRelations>(`/user/me?${query}`, {
			method: 'GET',
			bearerToken
		});
		return userWithRelationsSchema.parse(response);
	}

	async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
		const response = await this.request<RefreshTokenResponse>('/auth/refresh-token', {
			method: 'POST',
			body: JSON.stringify({ refresh_token: refreshToken })
		});
		return refreshTokenResponseSchema.parse(response);
	}

	async verifyEmailByCode(data: VerifyEmailByCodeRequest & { bearerToken: string }): Promise<{ success: boolean; message?: string }> {
		const { bearerToken, ...requestData } = data;
		const validatedData = verifyEmailByCodeRequestSchema.parse(requestData);
		const response = await this.request<{ success: boolean; message?: string }>('/auth/email/verify/code', {
			method: 'POST',
			body: JSON.stringify(validatedData),
			bearerToken
		});
		return z.object({ success: z.boolean(), message: z.string().optional() }).parse(response);
	}

	async verifyEmailByToken(data: VerifyEmailByTokenRequest): Promise<{ success: boolean; message?: string }> {
		const validatedData = verifyEmailByTokenRequestSchema.parse(data);
		const response = await this.request<{ success: boolean; message?: string }>('/auth/email/verify', {
			method: 'POST',
			body: JSON.stringify(validatedData)
		});
		return z.object({ success: z.boolean(), message: z.string().optional() }).parse(response);
	}

	async resendVerifyLink(data: ResendVerifyLinkRequest & { bearerToken: string }): Promise<{ success: boolean; message?: string }> {
		const { bearerToken, ...requestData } = data;
		const validatedData = resendVerifyLinkRequestSchema.parse(requestData);
		const response = await this.request<{ success: boolean; message?: string }>('/auth/email/verify/resend-link', {
			method: 'POST',
			body: JSON.stringify(validatedData),
			bearerToken
		});
		return z.object({ success: z.boolean(), message: z.string().optional() }).parse(response);
	}

	async signInWithSocialLogin(data: SocialLoginRequest): Promise<SignInEmailConfirmResponse> {
		const validatedData = socialLoginRequestSchema.parse(data);
		const response = await this.request<SignInEmailConfirmResponse>('/auth/signin.email.social', {
			method: 'POST',
			body: JSON.stringify({
				...validatedData,
				includeTeams: true
			})
		});
		return signInEmailConfirmResponseSchema.parse(response);
	}

	async switchWorkspace(data: SwitchWorkspaceRequest, bearerToken?: string): Promise<AuthResponse> {
		const validatedData = switchWorkspaceRequestSchema.parse(data);
		const response = await this.request<AuthResponse>('/auth/switch-workspace', {
			method: 'POST',
			body: JSON.stringify(validatedData),
			bearerToken
		});
		return authResponseSchema.parse(response);
	}
}

export const authService = new AuthService();
