import { BaseAPIService } from './base-api.service';
import {
	signInEmailRequestSchema,
	signInEmailResponseSchema,
	signInPasscodeRequestSchema,
	signInEmailConfirmResponseSchema,
	registerWithAppRequestSchema,
	type SignInEmailRequest,
	type SignInEmailResponse,
	type SignInPasscodeRequest,
	type SignInEmailConfirmResponse,
	type RegisterWithAppRequest
} from '../contracts/auth.types';
import { userWithRelationsSchema, type UserWithRelations } from '../contracts/user.types';

export class AuthService extends BaseAPIService {
	async register(data: RegisterWithAppRequest): Promise<UserWithRelations> {
		const validatedData = registerWithAppRequestSchema.parse(data);
		return this.post('/auth/register', {
			body: validatedData,
			responseSchema: userWithRelationsSchema
		});
	}

	async signInWithEmail(data: SignInEmailRequest): Promise<SignInEmailResponse> {
		const validatedData = signInEmailRequestSchema.parse(data);
		return this.post('/auth/signin.email', {
			body: validatedData,
			responseSchema: signInEmailResponseSchema
		});
	}

	async signInWithPasscode(data: SignInPasscodeRequest): Promise<SignInEmailConfirmResponse> {
		const validatedData = signInPasscodeRequestSchema.parse(data);
		return this.post('/auth/signin.email/confirm', {
			body: validatedData,
			responseSchema: signInEmailConfirmResponseSchema
		});
	}
}

export const authService = new AuthService();
