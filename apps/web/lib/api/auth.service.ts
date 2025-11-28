import { BaseAPIService } from './base-api.service';
import {
	registerWithAppRequestSchema,
	signInEmailRequestSchema,
	signInEmailResponseSchema,
	signInPasscodeRequestSchema,
	signInEmailConfirmResponseSchema,
	refreshTokenRequestSchema,
	refreshTokenResponseSchema,
	signInWorkspaceRequestSchema,
	authResponseSchema,
	type RegisterWithAppRequest,
	type SignInEmailRequest,
	type SignInPasscodeRequest,
	type RefreshTokenRequest,
	type SignInWorkspaceRequest
} from '../contracts/auth.types';
import { userWithRelationsSchema } from '../contracts/user.types';

export class AuthService extends BaseAPIService {
	/**
	 * Register a new user
	 * Backend returns IUser object
	 */
	async register(data: RegisterWithAppRequest) {
		const validatedData = registerWithAppRequestSchema.parse(data);
		return this.post('/auth/register', {
			body: validatedData,
			responseSchema: userWithRelationsSchema
		});
	}

	/**
	 * Send magic link email for workspace signin
	 * Backend returns { status: HttpStatus.OK, message: 'OK' }
	 */
	async signInWithEmail(data: SignInEmailRequest) {
		const validatedData = signInEmailRequestSchema.parse(data);
		return this.post('/auth/signin.email', {
			body: validatedData,
			responseSchema: signInEmailResponseSchema
		});
	}

	/**
	 * Confirm workspace signin with code
	 * Backend returns IUserSigninWorkspaceResponse
	 */
	async signInWithPasscode(data: SignInPasscodeRequest) {
		const validatedData = signInPasscodeRequestSchema.parse(data);
		return this.post('/auth/signin.email/confirm', {
			body: validatedData,
			responseSchema: signInEmailConfirmResponseSchema
		});
	}

	/**
	 * Refresh access token using refresh token
	 * Backend returns { token: string }
	 */
	async refreshToken(data: RefreshTokenRequest) {
		const validatedData = refreshTokenRequestSchema.parse(data);
		return this.post('/auth/refresh-token', {
			body: validatedData,
			responseSchema: refreshTokenResponseSchema
		});
	}

	/**
	 * Sign in to a specific workspace
	 * Backend returns IAuthResponse with user, token, and refresh_token
	 */
	async signInWorkspace(data: SignInWorkspaceRequest) {
		const validatedData = signInWorkspaceRequestSchema.parse(data);
		return this.post('/auth/signin.workspace', {
			body: validatedData,
			responseSchema: authResponseSchema
		});
	}
}

export const authService = new AuthService();
