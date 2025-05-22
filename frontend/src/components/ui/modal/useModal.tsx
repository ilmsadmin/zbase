import { useState, useCallback } from 'react';

export interface UseModalResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Custom hook for controlling modal state
 * @returns {UseModalResult} Object with modal state and control functions
 */
export default function useModal(initialState: boolean = false): UseModalResult {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
}
