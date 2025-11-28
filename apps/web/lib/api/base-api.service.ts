import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.axios.interceptors.request.use(
			(config) => {
				const token = this.getAccessToken();
				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`;
				}

				const tenantId = this.getTenantId();
				if (tenantId && config.headers) {
					config.headers['Tenant-Id'] = tenantId;
				}

				const organizationId = this.getOrganizationId();
				if (organizationId && config.headers) {
					config.headers['Organization-Id'] = organizationId;
				}

				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		this.axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (error.response?.status === 401) {
					// Handle token refresh logic here if needed
					const refreshToken = this.getRefreshToken();
					if (refreshToken) {
						try {
							await this.refreshAccessToken(refreshToken);
							return this.axios.request(error.config);
						} catch (refreshError) {
							this.handleAuthError();
						}
					} else {
						this.handleAuthError();
					}
				}
				return Promise.reject(error);
			}
		);
	}

	protected getAccessToken(): string | null {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('access_token');
		}
		return null;
	}

	protected getRefreshToken(): string | null {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('refresh_token');
		}
		return null;
	}

	protected getTenantId(): string | null {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('tenant_id');
		}
		return null;
	}

	protected getOrganizationId(): string | null {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('organization_id');
		}
		return null;
	}

	protected setAccessToken(token: string): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem('access_token', token);
		}
	}

	protected setRefreshToken(token: string): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem('refresh_token', token);
		}
	}

	protected async refreshAccessToken(refreshToken: string): Promise<void> {
		try {
			const response = await axios.post(`${this.axios.defaults.baseURL}/auth/refresh-token`, {
				refresh_token: refreshToken
			});
			const { token } = response.data;
			this.setAccessToken(token);
		} catch (error) {
			throw error;
		}
	}

	protected handleAuthError(): void {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			window.location.href = '/login';
		}
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

	protected async patch<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
		schema?: z.ZodSchema<T>
	): Promise<T> {
		const response = await this.axios.patch<T>(url, data, config);
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
