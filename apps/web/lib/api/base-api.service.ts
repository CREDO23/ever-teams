import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { z } from 'zod';

export interface BaseAPIConfig {
	baseURL?: string;
	timeout?: number;
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

	protected async get<T>(
		url: string,
		config?: AxiosRequestConfig,
		schema?: z.ZodSchema<T>
	): Promise<T> {
		const response = await this.axios.get<T>(url, config);
		return schema ? schema.parse(response.data) : response.data;
	}

	protected async post<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
		schema?: z.ZodSchema<T>
	): Promise<T> {
		const response = await this.axios.post<T>(url, data, config);
		return schema ? schema.parse(response.data) : response.data;
	}

	protected async put<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
		schema?: z.ZodSchema<T>
	): Promise<T> {
		const response = await this.axios.put<T>(url, data, config);
		return schema ? schema.parse(response.data) : response.data;
	}

	protected async delete<T>(
		url: string,
		config?: AxiosRequestConfig,
		schema?: z.ZodSchema<T>
	): Promise<T> {
		const response = await this.axios.delete<T>(url, config);
		return schema ? schema.parse(response.data) : response.data;
	}
}
