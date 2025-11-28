import { z } from 'zod';
import { BaseAPIService } from './base-api.service';
import {
	signInEmailRequestSchema,
	signInPasscodeRequestSchema,
	signInEmailConfirmResponseSchema,
	registerWithAppRequestSchema,
	type SignInEmailRequest,
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

	async signInWithEmail(data: SignInEmailRequest): Promise<{ status: number; message: string }> {
		const validatedData = signInEmailRequestSchema.parse(data);
		const responseSchema = z.object({
			status: z.number(),
			message: z.string()
		});
		return this.post('/auth/signin.email', {
			body: validatedData,
			responseSchema
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
