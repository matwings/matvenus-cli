// Auto-generated types from OpenAPI specification
// This file contains type definitions for API responses and requests

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  data?: any;
}

// Placeholder for generated types from schemas
// In future versions, this will include types extracted from components.schemas
