"use client";

import * as React from 'react';
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface DialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Dialog({
  title,
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-3xl',
}: DialogProps) {
  return (
    <DialogPrimitive open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${maxWidth} overflow-y-auto max-h-[90vh] p-5`}>
        <DialogHeader className="pb-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogPrimitive>
  );
}
