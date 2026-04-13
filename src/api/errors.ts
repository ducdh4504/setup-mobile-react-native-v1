import type { AxiosError } from 'axios';

/**
 * Standard error codes returned by the API.
 * UI components use these codes to show context-specific messages.
 */
export enum ApiErrorCode {
  // Auth errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  REFRESH_FAILED = 'REFRESH_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  FIELD_ERROR = 'FIELD_ERROR',

  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Generic/unknown
  UNKNOWN = 'UNKNOWN',
}

/**
 * Field-level validation error details.
 * Used when the backend returns form validation errors.
 */
export type FieldError = {
  field: string;
  message: string;
};

/**
 * Normalized API error structure.
 * All API errors are converted to this format for consistent handling.
 */
export type ApiErrorPayload = {
  code: ApiErrorCode;
  message: string;
  statusCode: number;
  fieldErrors?: FieldError[];
  timestamp?: string;
};

/**
 * Custom Error class for API-related errors.
 * Extends Error to be catchable in try/catch, but carries structured data.
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly statusCode: number;
  readonly fieldErrors?: FieldError[];
  readonly timestamp?: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.code = payload.code;
    this.message = payload.message;
    this.statusCode = payload.statusCode;
    this.fieldErrors = payload.fieldErrors;
    this.timestamp = payload.timestamp;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Normalizes Axios errors into a consistent ApiError.
 *
 * Handles:
 * - Backend API errors (structured response with error object)
 * - Network errors (no response received)
 * - Timeout errors
 * - Generic JS errors
 *
 * If your backend returns a different error format, adjust the response.data parsing here.
 */
export function normalizeError(error: unknown): ApiError {
  // Already normalized
  if (error instanceof ApiError) {
    return error;
  }

  // Axios error
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status ?? 500;
    const data = axiosError.response?.data;

    // Try to extract backend error structure
    if (data && typeof data === 'object') {
      const backendError = data as Record<string, unknown>;

      // Map known backend error responses to ApiError
      // Adjust these fields to match your backend's actual response structure
      const message = (backendError.message ?? backendError.error ?? 'An error occurred') as string;
      const code = mapStatusCodeToError(status, backendError.code as string | undefined);
      const fieldErrors = (backendError.fieldErrors ?? backendError.errors) as FieldError[] | undefined;

      return new ApiError({
        code,
        message,
        statusCode: status,
        fieldErrors,
        timestamp: backendError.timestamp as string | undefined,
      });
    }

    // No structured response, create from status code
    return new ApiError({
      code: mapStatusCodeToError(status),
      message: axiosError.message ?? 'API request failed',
      statusCode: status,
    });
  }

  // Network error (axios threw before reaching server)
  if (error && typeof error === 'object' && 'message' in error) {
    const err = error as Error;
    const isTimeout = err.message.includes('timeout') || err.message.includes('Timeout');
    const isNetwork = err.message.includes('Network') || err.message.includes('ECONNREFUSED');

    return new ApiError({
      code: isTimeout ? ApiErrorCode.TIMEOUT : isNetwork ? ApiErrorCode.NETWORK_ERROR : ApiErrorCode.UNKNOWN,
      message: err.message,
      statusCode: isTimeout ? 408 : isNetwork ? 0 : 500,
    });
  }

  // Fallback for unknown errors
  return new ApiError({
    code: ApiErrorCode.UNKNOWN,
    message: 'An unexpected error occurred',
    statusCode: 500,
  });
}

/**
 * Maps HTTP status codes to error codes.
 * Optionally checks backend error code if available.
 */
function mapStatusCodeToError(statusCode: number, backendCode?: string): ApiErrorCode {
  // Check backend code first if available
  if (backendCode) {
    const code = backendCode.toUpperCase();
    if (code in ApiErrorCode) {
      return code as ApiErrorCode;
    }
  }

  // Fall back to status code mapping
  switch (statusCode) {
    case 400:
      return ApiErrorCode.VALIDATION_ERROR;
    case 401:
      return ApiErrorCode.UNAUTHORIZED;
    case 403:
      return ApiErrorCode.SESSION_EXPIRED;
    case 408:
      return ApiErrorCode.TIMEOUT;
    case 503:
      return ApiErrorCode.SERVICE_UNAVAILABLE;
    case 0:
      // Status 0 = network error
      return ApiErrorCode.NETWORK_ERROR;
    default:
      return statusCode >= 500 ? ApiErrorCode.SERVER_ERROR : ApiErrorCode.UNKNOWN;
  }
}

/**
 * Type guard to check if an error is an ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Extract user-friendly message from error.
 * Use this in UI to display to users.
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Extract field errors from error (for form validation).
 * Returns object keyed by field name for easy mapping to form fields.
 */
export function getFieldErrors(error: unknown): Record<string, string> | null {
  if (isApiError(error) && error.fieldErrors?.length) {
    return error.fieldErrors.reduce(
      (acc, field) => {
        acc[field.field] = field.message;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
  return null;
}
