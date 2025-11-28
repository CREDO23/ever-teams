import { BaseAPIService } from './base-api.service';
import {
	getTaskPrioritiesRequestSchema,
	getTaskPriorityRequestSchema,
	createTaskPriorityRequestSchema,
	updateTaskPriorityRequestSchema,
	deleteTaskPriorityRequestSchema,
	taskPriorityListResponseSchema,
	taskPriorityResponseSchema,
	taskPriorityWithRelationsSchema
} from '../contracts/task-priority.types';
import { z } from 'zod';

export class TaskPriorityService extends BaseAPIService {
	private readonly baseUrl = '/task-priorities';

	async getAll(request?: z.infer<typeof getTaskPrioritiesRequestSchema>) {
		const parsedRequest = request ? getTaskPrioritiesRequestSchema.parse(request) : {};
		
		return this.get(this.baseUrl, {
			params: parsedRequest,
			headers: {
				'tenant-id': parsedRequest.tenantId || '',
				'organization-id': parsedRequest.organizationId || ''
			},
			responseSchema: taskPriorityListResponseSchema
		});
	}

	async getById(request: z.infer<typeof getTaskPriorityRequestSchema>) {
		const parsedRequest = getTaskPriorityRequestSchema.parse(request);
		
		if (!parsedRequest.id) {
			throw new Error('Task priority ID is required');
		}
		
		return this.get(`${this.baseUrl}/${parsedRequest.id}`, {
			headers: {
				'tenant-id': parsedRequest.tenantId || '',
				'organization-id': parsedRequest.organizationId || ''
			},
			responseSchema: taskPriorityResponseSchema
		});
	}

	async create(request: z.infer<typeof createTaskPriorityRequestSchema>) {
		const parsedRequest = createTaskPriorityRequestSchema.parse(request);
		
		return this.post(this.baseUrl, {
			body: parsedRequest,
			headers: {
				'tenant-id': parsedRequest.tenantId || '',
				'organization-id': parsedRequest.organizationId
			},
			responseSchema: taskPriorityWithRelationsSchema
		});
	}

	async update(request: z.infer<typeof updateTaskPriorityRequestSchema>) {
		const parsedRequest = updateTaskPriorityRequestSchema.parse(request);
		const { id, ...updateData } = parsedRequest;
		
		return this.put(`${this.baseUrl}/${id}`, {
			body: updateData,
			headers: {
				'tenant-id': parsedRequest.tenantId || '',
				'organization-id': parsedRequest.organizationId || ''
			},
			responseSchema: taskPriorityWithRelationsSchema
		});
	}

	async remove(request: z.infer<typeof deleteTaskPriorityRequestSchema>) {
		const parsedRequest = deleteTaskPriorityRequestSchema.parse(request);
		
		return this.delete(`${this.baseUrl}/${parsedRequest.id}`, {
			headers: {
				'tenant-id': parsedRequest.tenantId || ''
			}
		});
	}
}

export const taskPriorityService = new TaskPriorityService();
