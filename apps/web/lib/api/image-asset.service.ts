import { z } from 'zod';
import { BaseAPIService } from './base-api.service';
import {
	imageAssetSchema,
	imageAssetWithRelationsSchema,
	uploadImageAssetRequestSchema,
	updateImageAssetRequestSchema,
	deleteImageAssetRequestSchema,
	getImageAssetByIdRequestSchema,
	getImageAssetsRequestSchema,
	getImageAssetsCountRequestSchema,
	createImageAssetMetadataRequestSchema,
	imageAssetListResponseSchema,
	type UploadImageAssetRequest,
	type UpdateImageAssetRequest,
	type DeleteImageAssetRequest,
	type GetImageAssetByIdRequest,
	type GetImageAssetsRequest,
	type GetImageAssetsCountRequest,
	type CreateImageAssetMetadataRequest
} from '../contracts/image-asset.types';

export class ImageAssetService extends BaseAPIService {
	async uploadImage(request: UploadImageAssetRequest & { file: FormData }) {
		const { folder, tenantId, organizationId, isFeatured, file } = request;
		const validatedRequest = uploadImageAssetRequestSchema.parse({ folder, tenantId, organizationId, isFeatured });
		
		const headers: Record<string, string> = {};
		if (validatedRequest.tenantId) headers['tenant-id'] = validatedRequest.tenantId;
		if (validatedRequest.organizationId) headers['organization-id'] = validatedRequest.organizationId;
		
		return this.post(`/image-assets/upload/${validatedRequest.folder}`, {
			body: file,
			headers,
			responseSchema: imageAssetSchema
		});
	}

	async getImageAsset(request: GetImageAssetByIdRequest) {
		const { id } = getImageAssetByIdRequestSchema.parse(request);
		return this.get(`/image-assets/${id}`, {
			responseSchema: imageAssetWithRelationsSchema
		});
	}

	async getImageAssets(request?: GetImageAssetsRequest) {
		const params = request ? getImageAssetsRequestSchema.parse(request) : undefined;
		return this.get('/image-assets', {
			params,
			responseSchema: imageAssetListResponseSchema
		});
	}

	async getImageAssetsCount(request?: GetImageAssetsCountRequest) {
		const params = request ? getImageAssetsCountRequestSchema.parse(request) : undefined;
		return this.get('/image-assets/count', {
			params,
			responseSchema: z.number()
		});
	}

	async createImageAsset(request: CreateImageAssetMetadataRequest) {
		const validatedRequest = createImageAssetMetadataRequestSchema.parse(request);
		return this.post('/image-assets', {
			body: validatedRequest,
			responseSchema: imageAssetSchema
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
		return this.delete(`/image-assets/${id}`);
	}
}

export const imageAssetService = new ImageAssetService();
