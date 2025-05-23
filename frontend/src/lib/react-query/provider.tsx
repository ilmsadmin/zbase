"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Thời gian dữ liệu được coi là mới trước khi cần refetch
            staleTime: 1000 * 60 * 5, // 5 phút
            
            // Thời gian tối đa dữ liệu được giữ trong cache
            gcTime: 1000 * 60 * 30, // 30 phút
            
            // Số lần retry khi request thất bại
            retry: 1,
            
            // Tốc độ retry (ms): 1000, 3000
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
              // Tự động refetch khi cửa sổ lấy lại focus
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
              // Mặc định sẽ hiện thị error
            throwOnError: false,
          },
          mutations: {
            // Số lần retry khi mutation thất bại
            retry: 0,
              // Default sẽ không throw error
            throwOnError: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
