"use client";

import { ToastType, useToastContext } from '@/components/ui/Toast';
import { useCallback } from 'react';

/**
 * Custom hook for displaying toast notifications
 */
export function useToast() {
  const { addToast } = useToastContext();

  // Success toast
  const success = useCallback((message: string) => {
    addToast(message, 'success');
  }, [addToast]);

  // Error toast
  const error = useCallback((message: string) => {
    addToast(message, 'error');
  }, [addToast]);

  // Info toast
  const info = useCallback((message: string) => {
    addToast(message, 'info');
  }, [addToast]);

  // Warning toast
  const warning = useCallback((message: string) => {
    addToast(message, 'warning');
  }, [addToast]);

  return {
    success,
    error,
    info,
    warning,
  };
}
