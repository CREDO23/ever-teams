import { BaseAPIService } from './base-api.service';
import {
	imageAssetWithRelationsSchema,
	uploadImageAssetRequestSchema,
	updateImageAssetRequestSchema,
	deleteImageAssetRequestSchema,
	imageAssetResponseSchema,
	type UploadImageAssetRequest,
	type UpdateImageAssetRequest,
	type DeleteImageAssetRequest
} from '../contracts/image-asset.types';

export class ImageAssetService extends BaseAPIService {
	async uploadImage(request: UploadImageAssetRequest & { file: FormData }) {
		const { folder, tenantId, file } = request;
		const validatedRequest = uploadImageAssetRequestSchema.parse({ folder, tenantId });
		
		return this.post(`/image-assets/upload/${validatedRequest.folder}`, {
			body: file,
			headers: {
				...(validatedRequest.tenantId && { 'tenant-id': validatedRequest.tenantId })
			},
			responseSchema: imageAssetWithRelationsSchema
		});
	}

	async getImageAsset(request: { id: string }) {
		return this.get(`/image-assets/${request.id}`, {
			responseSchema: imageAssetWithRelationsSchema
		});
	}

	async updateImageAsset(request: UpdateImageAssetRequest) {
		const { id, ...data } = updateImageAssetRequestSchema.parse(request);
		return this.put(`/image-assets/${id}`, {
			body: data,
			responseSchema: imageAssetWithRelationsSchema
		});
	}

	async deleteImageAsset(request: DeleteImageAssetRequest) {
		const { id } = deleteImageAssetRequestSchema.parse(request);
		return this.delete(`/image-assets/${id}`, {
			responseSchema: imageAssetResponseSchema
		});
	}
}

export const imageAssetService = new ImageAssetService();
