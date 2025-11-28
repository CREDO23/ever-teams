import { BaseAPIService } from './base-api.service';
import {
	userWithRelationsSchema,
	updateUserRequestSchema,
	getUserRequestSchema,
	getUserByIdRequestSchema,
	getUserByEmailRequestSchema,
	deleteUserRequestSchema,
	type UpdateUserRequest,
	type GetUserRequest,
	type GetUserByIdRequest,
	type GetUserByEmailRequest,
	type DeleteUserRequest
} from '../contracts/user.types';

export class UserService extends BaseAPIService {
	async getMe(request?: GetUserRequest) {
		const params = request ? getUserRequestSchema.parse(request) : {};
		return this.get('/user/me', {
			params,
			responseSchema: userWithRelationsSchema
		});
	}

	async getUserById(request: GetUserByIdRequest) {
		const { id, relations } = getUserByIdRequestSchema.parse(request);
		const params = relations ? { data: JSON.stringify({ relations }) } : {};
		return this.get(`/user/${id}`, {
			params,
			responseSchema: userWithRelationsSchema
		});
	}

	async getUserByEmail(request: GetUserByEmailRequest) {
		const { email } = getUserByEmailRequestSchema.parse(request);
		return this.get(`/user/email/${email}`, {
			responseSchema: userWithRelationsSchema
		});
	}

	async updateUser(request: UpdateUserRequest) {
		const { id, ...data } = updateUserRequestSchema.parse(request);
		return this.put(`/user/${id}`, {
			body: data,
			responseSchema: userWithRelationsSchema
		});
	}

	async deleteUser(request: DeleteUserRequest) {
		const { id } = deleteUserRequestSchema.parse(request);
		return this.delete(`/user/${id}`);
	}

	async resetUser() {
		return this.delete('/user/reset');
	}
}

export const userService = new UserService();
