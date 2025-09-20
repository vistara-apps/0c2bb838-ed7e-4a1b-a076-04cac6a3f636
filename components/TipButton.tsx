'use client';

import { useState } from 'react';
import { Loader2, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

interface TipButtonProps {
  amount: number;
  variant: 'default' | 'processing' | 'disabled';
  onTip: (amount: number, message?: string) => Promise<void>;
  icon?: React.ReactNode;
  customAmount?: boolean;
}

export function TipButton({
  amount,
  variant = 'default',
  onTip,
  icon,
  customAmount = false
}: TipButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [message, setMessage] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleTip = async () => {
    if (variant === 'disabled') return;

    const tipAmount = customAmount ? parseFloat(customValue) || 0 : amount;
    if (tipAmount <= 0) return;

    setIsProcessing(true);
    try {
      await onTip(tipAmount, message || undefined);
      if (customAmount) {
        setCustomValue('');
        setMessage('');
        setShowCustomForm(false);
      }
    } catch (error) {
      console.error('Tip failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (customAmount) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowCustomForm(!showCustomForm)}
          className={clsx(
            'w-full px-6 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2',
            showCustomForm
              ? 'bg-accent text-text-primary'
              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
          )}
        >
          <DollarSign className="w-5 h-5" />
          Custom Amount
        </button>

        {showCustomForm && (
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Message (optional)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something nice..."
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              onClick={handleTip}
              disabled={isProcessing || !customValue || parseFloat(customValue) <= 0}
              className={clsx(
                'w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2',
                isProcessing || !customValue || parseFloat(customValue) <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-accent hover:scale-105'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {icon}
                  Tip {customValue} ETH
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleTip}
      disabled={variant === 'disabled' || isProcessing}
      className={clsx(
        'px-6 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 min-h-[60px]',
        {
          'btn-accent hover:scale-105 shadow-lg': variant === 'default' && !isProcessing,
          'bg-primary text-white': variant === 'processing' && !isProcessing,
          'bg-gray-300 text-gray-500 cursor-not-allowed': variant === 'disabled' || isProcessing,
        }
      )}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {icon}
          <div className="text-center">
            <div className="font-bold">{amount} ETH</div>
            <div className="text-xs opacity-75">Quick Tip</div>
          </div>
        </>
      )}
    </button>
  );
}
