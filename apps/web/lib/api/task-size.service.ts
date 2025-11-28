import { BaseAPIService } from './base-api.service';
import {
	getTaskSizesRequestSchema,
	getTaskSizeRequestSchema,
	createTaskSizeRequestSchema,
	updateTaskSizeRequestSchema,
	deleteTaskSizeRequestSchema,
	taskSizeListResponseSchema,
	taskSizeResponseSchema,
	taskSizeWithRelationsSchema
} from '../contracts/task-size.types';
import { z } from 'zod';

export class TaskSizeService extends BaseAPIService {
	private readonly baseUrl = '/task-sizes';

	async getAll(request?: z.infer<typeof getTaskSizesRequestSchema>) {
		const parsedRequest = request ? getTaskSizesRequestSchema.parse(request) : {};
		
		return this.get(this.baseUrl, {
			requestOptions: {
				params: parsedRequest,
				headers: {
					'tenant-id': parsedRequest.tenantId || '',
					'organization-id': parsedRequest.organizationId || ''
				}
			},
			responseDataSchema: taskSizeListResponseSchema
		});
	}

	async getById(request: z.infer<typeof getTaskSizeRequestSchema>) {
		const parsedRequest = getTaskSizeRequestSchema.parse(request);
		
		if (!parsedRequest.id) {
			throw new Error('Task size ID is required');
		}
		
		return this.get(`${this.baseUrl}/${parsedRequest.id}`, {
			requestOptions: {
				headers: {
					'tenant-id': parsedRequest.tenantId || '',
					'organization-id': parsedRequest.organizationId || ''
				}
			},
			responseDataSchema: taskSizeResponseSchema
		});
	}

	async create(request: z.infer<typeof createTaskSizeRequestSchema>) {
		const parsedRequest = createTaskSizeRequestSchema.parse(request);
		
		return this.post(this.baseUrl, {
			requestBody: parsedRequest,
			requestOptions: {
				headers: {
					'tenant-id': parsedRequest.tenantId || '',
					'organization-id': parsedRequest.organizationId
				}
			},
			responseDataSchema: taskSizeWithRelationsSchema
		});
	}

	async update(request: z.infer<typeof updateTaskSizeRequestSchema>) {
		const parsedRequest = updateTaskSizeRequestSchema.parse(request);
		const { id, ...updateData } = parsedRequest;
		
		return this.put(`${this.baseUrl}/${id}`, {
			requestBody: updateData,
			requestOptions: {
				headers: {
					'tenant-id': parsedRequest.tenantId || '',
					'organization-id': parsedRequest.organizationId || ''
				}
			},
			responseDataSchema: taskSizeWithRelationsSchema
		});
	}

	async remove(request: z.infer<typeof deleteTaskSizeRequestSchema>) {
		const parsedRequest = deleteTaskSizeRequestSchema.parse(request);
		
		return this.delete(`${this.baseUrl}/${parsedRequest.id}`, {
			requestOptions: {
				headers: {
					'tenant-id': parsedRequest.tenantId || ''
				}
			}
		});
	}
}

export const taskSizeService = new TaskSizeService();
