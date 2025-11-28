import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { z } from 'zod';

export interface BaseAPIConfig {
	baseURL?: string;
	timeout?: number;
}

export interface RequestOptions<T = any> {
	responseSchema?: z.ZodSchema<T>;
	config?: AxiosRequestConfig;
	body?: any;
}

export class BaseAPIService {
	protected axios: AxiosInstance;

	constructor(config: BaseAPIConfig = {}) {
		this.axios = axios.create({
			baseURL: config.baseURL || process.env.NEXT_PUBLIC_GAUZY_API_URL || 'http://localhost:3000/api',
			timeout: config.timeout || 30000,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	protected async get<T>(url: string, options?: RequestOptions<T>): Promise<T> {
		const response = await this.axios.get<T>(url, options?.config);
		return options?.responseSchema ? options.responseSchema.parse(response.data) : response.data;
	}

	protected async post<T>(url: string, options?: RequestOptions<T>): Promise<T> {
		const response = await this.axios.post<T>(url, options?.body, options?.config);
		return options?.responseSchema ? options.responseSchema.parse(response.data) : response.data;
	}

	protected async put<T>(url: string, options?: RequestOptions<T>): Promise<T> {
		const response = await this.axios.put<T>(url, options?.body, options?.config);
		return options?.responseSchema ? options.responseSchema.parse(response.data) : response.data;
	}

	protected async delete<T>(url: string, options?: RequestOptions<T>): Promise<T> {
		const response = await this.axios.delete<T>(url, options?.config);
		return options?.responseSchema ? options.responseSchema.parse(response.data) : response.data;
	}
}
