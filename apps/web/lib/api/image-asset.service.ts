import { z } from 'zod';
import { BaseAPIService } from './base-api.service';
import {
	imageAssetSchema,
	imageAssetWithRelationsSchema,
	uploadImageAssetRequestSchema,
	updateImageAssetRequestSchema,
	deleteImageAssetRequestSchema,
	imageAssetListResponseSchema,
	type UploadImageAssetRequest,
	type UpdateImageAssetRequest,
	type DeleteImageAssetRequest,
	type ImageAsset
} from '../contracts/image-asset.types';

export class ImageAssetService extends BaseAPIService {
	/**
	 * Upload an image asset to a specific folder
	 * POST /image-assets/upload/:folder
	 * Returns: IImageAsset with name, url, thumb, size, storageProvider
	 */
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

	/**
	 * Get image asset by ID
	 * GET /image-assets/:id
	 * Returns: IImageAsset with fullUrl and thumbUrl
	 */
	async getImageAsset(request: { id: string }) {
		return this.get(`/image-assets/${request.id}`, {
			responseSchema: imageAssetWithRelationsSchema
		});
	}

	/**
	 * Get all image assets with pagination
	 * GET /image-assets
	 * Returns: IPagination<IImageAsset>
	 */
	async getImageAssets(request?: { 
		page?: number; 
		limit?: number; 
		organizationId?: string;
		tenantId?: string;
		isFeatured?: boolean;
	}) {
		return this.get('/image-assets', {
			params: request,
			responseSchema: imageAssetListResponseSchema
		});
	}

	/**
	 * Get image assets count
	 * GET /image-assets/count
	 * Returns: number
	 */
	async getImageAssetsCount(request?: {
		organizationId?: string;
		tenantId?: string;
		isFeatured?: boolean;
	}) {
		return this.get('/image-assets/count', {
			params: request,
			responseSchema: z.number()
		});
	}

	/**
	 * Create a new image asset (without file upload)
	 * POST /image-assets
	 * Returns: IImageAsset
	 */
	async createImageAsset(request: Partial<ImageAsset>) {
		return this.post('/image-assets', {
			body: request,
			responseSchema: imageAssetSchema
		});
	}

	/**
	 * Update image asset metadata (cannot update file)
	 * PUT /image-assets/:id  
	 * Note: Backend doesn't have PUT endpoint, only POST and DELETE
	 */
	async updateImageAsset(request: UpdateImageAssetRequest) {
		const { id, ...data } = updateImageAssetRequestSchema.parse(request);
		return this.put(`/image-assets/${id}`, {
			body: data,
			responseSchema: imageAssetWithRelationsSchema
		});
	}

	/**
	 * Delete image asset and its files from storage
	 * DELETE /image-assets/:id
	 * Returns: success response or deleted object
	 */
	async deleteImageAsset(request: DeleteImageAssetRequest) {
		const { id } = deleteImageAssetRequestSchema.parse(request);
		return this.delete(`/image-assets/${id}`);
	}
}

export const imageAssetService = new ImageAssetService();
