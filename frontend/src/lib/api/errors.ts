export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export class HttpError extends Error implements ApiError {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

export function isApiError(error: any): error is ApiError {
  return error && typeof error === 'object' && 'status' in error;
}

export function handleApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return {
      ...error,
      status: 500,
      message: error.message || 'Unexpected error occurred'
    };
  }
  
  return {
    name: 'UnknownError',
    message: 'An unknown error occurred',
    status: 500
  };
}
