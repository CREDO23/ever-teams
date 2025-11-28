import { BaseAPIService } from './base-api.service';
import {
	authResponseSchema,
	registerWithAppRequestSchema,
	signInEmailRequestSchema,
	signInEmailResponseSchema,
	signInPasscodeRequestSchema,
	signInEmailConfirmResponseSchema,
	type AuthResponse,
	type RegisterWithAppRequest,
	type SignInEmailRequest,
	type SignInEmailResponse,
	type SignInPasscodeRequest,
	type SignInEmailConfirmResponse
} from '../contracts/auth.types';
import { userWithRelationsSchema, type UserWithRelations } from '../contracts/user.types';

export class AuthService extends BaseAPIService {
	/**
	 * Register a new user
	 * Backend returns IUser object
	 */
	async register(data: RegisterWithAppRequest): Promise<UserWithRelations> {
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
	async signInWithEmail(data: SignInEmailRequest): Promise<SignInEmailResponse> {
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
	async signInWithPasscode(data: SignInPasscodeRequest): Promise<SignInEmailConfirmResponse> {
		const validatedData = signInPasscodeRequestSchema.parse(data);
		return this.post('/auth/signin.email/confirm', {
			body: validatedData,
			responseSchema: signInEmailConfirmResponseSchema
		});
	}
}

export const authService = new AuthService();
