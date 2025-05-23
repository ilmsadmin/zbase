"use client";

import { useToast } from '@/hooks/useToast';
import { UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Global error handler type
export type ApiError = AxiosError<{
  message: string;
  error?: string;
  statusCode: number;
}>;

/**
 * Enhanced version of useQuery with error handling
 */
export function useQueryWithErrorHandling<TData, TError = ApiError>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  const toast = useToast();

  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
    onError: (error) => {
      // Handle default error display
      const axiosError = error as unknown as ApiError;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.message || 
        'Đã xảy ra lỗi khi tải dữ liệu';
      
      // Display toast error notification
      toast?.error(errorMessage);
      
      // Call the original onError if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}

/**
 * Enhanced version of useMutation with error handling
 */
export function useMutationWithErrorHandling<TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Parameters<typeof useMutation<TData, TError, TVariables>>[1]
) {
  const toast = useToast();

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
    onError: (error, variables, context) => {
      // Handle default error display
      const axiosError = error as unknown as ApiError;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.message || 
        'Đã xảy ra lỗi khi thực hiện thao tác';
      
      // Display toast error notification
      toast?.error(errorMessage);
      
      // Call the original onError if provided
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
  });
}

/**
 * Generic loading state component props
 */
export interface LoadingStateProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

/**
 * Generic loading state component
 */
export function LoadingState({
  isLoading,
  isError,
  error,
  children,
  loadingComponent,
  errorComponent,
}: LoadingStateProps) {
  if (isLoading) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  if (isError) {
    return errorComponent || <DefaultErrorComponent error={error} />;
  }

  return <>{children}</>;
}

function DefaultLoadingComponent() {
  return (
    <div className="flex items-center justify-center w-full min-h-[200px]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
}

function DefaultErrorComponent({ error }: { error: unknown }) {
  const axiosError = error as ApiError;
  const errorMessage = 
    axiosError.response?.data?.message || 
    axiosError.message || 
    'Đã xảy ra lỗi không xác định';

  return (
    <div className="w-full min-h-[200px] flex items-center justify-center text-center p-4">
      <div className="text-destructive flex flex-col items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 mb-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h3 className="text-lg font-medium">Lỗi tải dữ liệu</h3>
        <p className="mt-1">{errorMessage}</p>
      </div>
    </div>
  );
}

/**
 * Hook to handle infinite query loading states
 */
export function useInfiniteQueryState<T>(
  data: T[] | undefined,
  isLoading: boolean,
  isFetchingNextPage: boolean,
  hasNextPage: boolean | undefined
) {
  return {
    items: data || [],
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
  };
}
