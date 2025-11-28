import { BaseAPIService } from './base-api.service';
import {
	userWithRelationsSchema,
	updateUserRequestSchema,
	getUserRequestSchema,
	type UpdateUserRequest,
	type GetUserRequest
} from '../contracts/user.types';

export class UserService extends BaseAPIService {
	async getMe(request?: GetUserRequest) {
		const params = request ? getUserRequestSchema.parse(request) : {};
		return this.get('/user/me', {
			params,
			responseSchema: userWithRelationsSchema
		});
	}

	async getUserById(id: string, request?: { relations?: string[] }) {
		const params = request?.relations ? { data: JSON.stringify({ relations: request.relations }) } : {};
		return this.get(`/user/${id}`, {
			params,
			responseSchema: userWithRelationsSchema
		});
	}

	async getUserByEmail(email: string) {
		return this.get(`/user/email/${email}`, {
			responseSchema: userWithRelationsSchema
		});
	}

	async updateUser(id: string, request: UpdateUserRequest) {
		const validatedData = updateUserRequestSchema.parse(request);
		return this.put(`/user/${id}`, {
			body: validatedData,
			responseSchema: userWithRelationsSchema
		});
	}

	async deleteUser(id: string) {
		return this.delete(`/user/${id}`);
	}

	async resetUser() {
		return this.delete('/user/reset');
	}
}

export const userService = new UserService();
