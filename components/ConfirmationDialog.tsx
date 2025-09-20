'use client';

import { useEffect, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info, Heart } from 'lucide-react';
import { clsx } from 'clsx';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'tip' | 'subscribe' | 'warning' | 'info';
  amount?: number;
  currency?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  amount,
  currency = 'ETH'
}: ConfirmationDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'tip':
        return <Heart className="w-8 h-8 text-red-500" />;
      case 'subscribe':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'tip':
        return 'btn-accent';
      case 'subscribe':
        return 'btn-primary';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200';
      default:
        return 'btn-primary';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Backdrop */}
      <div 
        className={clsx(
          'absolute inset-0 bg-black transition-opacity duration-300',
          isVisible ? 'opacity-50' : 'opacity-0'
        )}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div 
        className={clsx(
          'relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transition-all duration-300 transform',
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-text-secondary leading-relaxed">{message}</p>
          
          {/* Amount Display for Tips/Subscriptions */}
          {(type === 'tip' || type === 'subscribe') && amount && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {amount} {currency}
              </div>
              <div className="text-sm text-text-secondary">
                {type === 'tip' ? 'Tip Amount' : 'Subscription Amount'}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleClose}
            className="flex-1 btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={clsx('flex-1', getButtonStyle())}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}