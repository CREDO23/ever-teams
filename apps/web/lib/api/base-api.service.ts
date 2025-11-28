import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { z } from 'zod';

export interface BaseAPIConfig {
	baseURL?: string;
	timeout?: number;
	getAccessToken?: () => string | null | Promise<string | null>;
}

export interface APIRequest<TBody = any, TResponse = any> {
	body?: TBody;
	params?: Record<string, any>;
	headers?: Record<string, string>;
	responseSchema?: z.ZodSchema<TResponse>;
}

export class BaseAPIService {
	protected axios: AxiosInstance;
	private getAccessToken?: () => string | null | Promise<string | null>;

	constructor(config: BaseAPIConfig = {}) {
		this.getAccessToken = config.getAccessToken;
		this.axios = axios.create({
			baseURL: config.baseURL || process.env.NEXT_PUBLIC_GAUZY_API_URL || 'http://localhost:3000/api',
			timeout: config.timeout || 30000,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		this.axios.interceptors.request.use(async (config) => {
			if (this.getAccessToken) {
				const token = await this.getAccessToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			}
			// If body is FormData, let browser set Content-Type with boundary
			if (config.data instanceof FormData) {
				delete config.headers['Content-Type'];
			}
			return config;
		});
	}

	private validateResponse<T>(data: any, schema?: z.ZodSchema<T>): T {
		if (!schema) {
			return data;
		}

		try {
			return schema.parse(data);
		} catch (error) {
			if (error instanceof z.ZodError) {
				console.error('API Response Validation Error:', {
					errors: error.errors,
					receivedData: data
				});
			}
			return data;
		}
	}

	protected async get<TResponse = any>(url: string, request?: APIRequest<never, TResponse>): Promise<TResponse> {
		const config: AxiosRequestConfig = {
			params: request?.params,
			headers: request?.headers
		};
		const response = await this.axios.get<TResponse>(url, config);
		return this.validateResponse(response.data, request?.responseSchema);
	}

	protected async post<TBody = any, TResponse = any>(
		url: string,
		request?: APIRequest<TBody, TResponse>
	): Promise<TResponse> {
		const config: AxiosRequestConfig = {
			headers: request?.headers
		};
		const response = await this.axios.post<TResponse>(url, request?.body, config);
		return this.validateResponse(response.data, request?.responseSchema);
	}

	protected async put<TBody = any, TResponse = any>(
		url: string,
		request?: APIRequest<TBody, TResponse>
	): Promise<TResponse> {
		const config: AxiosRequestConfig = {
			headers: request?.headers
		};
		const response = await this.axios.put<TResponse>(url, request?.body, config);
		return this.validateResponse(response.data, request?.responseSchema);
	}

	protected async delete<TResponse = any>(url: string, request?: APIRequest<never, TResponse>): Promise<TResponse> {
		const config: AxiosRequestConfig = {
			params: request?.params,
			headers: request?.headers
		};
		const response = await this.axios.delete<TResponse>(url, config);
		return this.validateResponse(response.data, request?.responseSchema);
	}
}
