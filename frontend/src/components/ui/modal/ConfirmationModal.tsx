import { ReactNode } from 'react';
import Modal, { ModalProps } from './Modal';
import Button from '../form/Button';
import { ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export type ConfirmationType = 'info' | 'warning' | 'danger' | 'success';

export interface ConfirmationModalProps extends Omit<ModalProps, 'footer' | 'children'> {
  message: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: ConfirmationType;
  isSubmitting?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  type = 'warning',
  isSubmitting = false,
  ...rest
}: ConfirmationModalProps) {
  // Icon and colors based on confirmation type
  const typeConfig = {
    info: {
      icon: <InformationCircleIcon className="h-8 w-8 text-blue-500" />,
      confirmButtonVariant: 'primary',
    },
    warning: {
      icon: <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />,
      confirmButtonVariant: 'primary',
    },
    danger: {
      icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500" />,
      confirmButtonVariant: 'danger',
    },
    success: {
      icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
      confirmButtonVariant: 'success',
    },
  };
  
  const config = typeConfig[type];
  
  const handleCancel = () => {
    onCancel?.();
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmButtonVariant as any}
            onClick={onConfirm}
            isLoading={isSubmitting}
            loadingText={confirmText}
          >
            {confirmText}
          </Button>
        </>
      }
      {...rest}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">{config.icon}</div>
        <div>
          <div className="text-sm font-medium text-gray-900">{message}</div>
          {description && <div className="mt-2 text-sm text-gray-500">{description}</div>}
        </div>
      </div>
    </Modal>
  );
}
