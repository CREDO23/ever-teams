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
	async register(request: RegisterWithAppRequest) {
		const validatedData = registerWithAppRequestSchema.parse(request);
		return this.post('/auth/register', {
			body: validatedData,
			responseSchema: userWithRelationsSchema
		});
	}

	async signInWithEmail(request: SignInEmailRequest) {
		const validatedData = signInEmailRequestSchema.parse(request);
		return this.post('/auth/signin.email', {
			body: validatedData,
			responseSchema: signInEmailResponseSchema
		});
	}

	async signInWithPasscode(request: SignInPasscodeRequest) {
		const validatedData = signInPasscodeRequestSchema.parse(request);
		return this.post('/auth/signin.email/confirm', {
			body: validatedData,
			responseSchema: signInEmailConfirmResponseSchema
		});
	}

	async refreshToken(request: RefreshTokenRequest) {
		const validatedData = refreshTokenRequestSchema.parse(request);
		return this.post('/auth/refresh-token', {
			body: validatedData,
			responseSchema: refreshTokenResponseSchema
		});
	}

	async signInWorkspace(request: SignInWorkspaceRequest) {
		const validatedData = signInWorkspaceRequestSchema.parse(request);
		return this.post('/auth/signin.workspace', {
			body: validatedData,
			responseSchema: authResponseSchema
		});
	}
}

export const authService = new AuthService();
