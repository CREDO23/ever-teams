import { BaseAPIService } from './base-api.service';
import {
	userSchema,
	userWithRelationsSchema,
	updateUserRequestSchema,
	getUserRequestSchema,
	type UpdateUserRequest,
	type GetUserRequest
} from '../contracts/user.types';

export class UserService extends BaseAPIService {
	async getMe(options?: GetUserRequest, bearerToken?: string) {
		const params = options ? getUserRequestSchema.parse(options) : {};
		return this.get('/user/me', {
			config: {
				params,
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			},
			responseSchema: userWithRelationsSchema
		});
	}

	async getUserById(id: string, options?: { relations?: string[] }, bearerToken?: string) {
		const params = options?.relations ? { data: JSON.stringify({ relations: options.relations }) } : {};
		return this.get(`/user/${id}`, {
			config: {
				params,
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			},
			responseSchema: userWithRelationsSchema
		});
	}

	async getUserByEmail(email: string, bearerToken?: string) {
		return this.get(`/user/email/${email}`, {
			config: {
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			},
			responseSchema: userWithRelationsSchema
		});
	}

	async updateUser(id: string, data: UpdateUserRequest, bearerToken?: string) {
		const validatedData = updateUserRequestSchema.parse(data);
		return this.put(`/user/${id}`, {
			body: validatedData,
			config: {
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			},
			responseSchema: userWithRelationsSchema
		});
	}

	async deleteUser(id: string, bearerToken?: string) {
		return this.delete(`/user/${id}`, {
			config: {
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			}
		});
	}

	async resetUser(bearerToken?: string) {
		return this.delete('/user/reset', {
			config: {
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			}
		});
	}
}

export const userService = new UserService();
