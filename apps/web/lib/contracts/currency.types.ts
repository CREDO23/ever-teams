import { z } from 'zod';
import { baseEntitySchema } from './common.types';

// ============ Database Schema ============
export const currencySchema = baseEntitySchema.extend({
  isoCode: z.string().length(3),
  currency: z.string(),
});

// ============ Request Schemas ============
export const getCurrencyRequestSchema = z.object({
  isoCode: z.string().length(3).optional(),
  search: z.string().optional(),
});

export const getCurrenciesRequestSchema = z.object({
  page: z.number().positive().optional(),
  limit: z.number().positive().optional(),
  search: z.string().optional(),
});

// ============ Response Schemas ============
export const currencyResponseSchema = z.object({
  data: currencySchema,
  success: z.boolean(),
  message: z.string().optional(),
});

export const currencyListResponseSchema = z.object({
  data: z.array(currencySchema),
  total: z.number(),
  success: z.boolean(),
});

// ============ Type Exports ============
export type Currency = z.infer<typeof currencySchema>;
export type GetCurrencyRequest = z.infer<typeof getCurrencyRequestSchema>;
export type GetCurrenciesRequest = z.infer<typeof getCurrenciesRequestSchema>;
export type CurrencyResponse = z.infer<typeof currencyResponseSchema>;
export type CurrencyListResponse = z.infer<typeof currencyListResponseSchema>;
