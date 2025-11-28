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
	/**
	 * Get current authenticated user
	 * Backend returns IUser object with relations
	 */
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

	/**
	 * Get user by ID
	 * Backend returns IUser object
	 */
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

	/**
	 * Get user by email
	 * Backend returns IUser object
	 */
	async getUserByEmail(email: string, bearerToken?: string) {
		return this.get(`/user/email/${email}`, {
			config: {
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			},
			responseSchema: userWithRelationsSchema
		});
	}

	/**
	 * Update user profile
	 * Backend returns updated IUser object
	 */
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

	/**
	 * Delete user by ID
	 * Backend returns success response
	 */
	async deleteUser(id: string, bearerToken?: string) {
		return this.delete(`/user/${id}`, {
			config: {
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			}
		});
	}

	/**
	 * Reset user data
	 * Backend returns success response
	 */
	async resetUser(bearerToken?: string) {
		return this.delete('/user/reset', {
			config: {
				headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined
			}
		});
	}
}

export const userService = new UserService();
