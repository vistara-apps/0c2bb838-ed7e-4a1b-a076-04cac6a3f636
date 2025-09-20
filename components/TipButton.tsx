'use client';

import { useState } from 'react';
import { Loader2, DollarSign, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { ConfirmationDialog } from './ConfirmationDialog';

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTip, setPendingTip] = useState<{ amount: number; message?: string } | null>(null);
  const [justTipped, setJustTipped] = useState(false);

  const handleTipClick = () => {
    if (variant === 'disabled' || isProcessing) return;

    const tipAmount = customAmount ? parseFloat(customValue) || 0 : amount;
    if (tipAmount <= 0) return;

    // Show confirmation dialog
    setPendingTip({ amount: tipAmount, message: message || undefined });
    setShowConfirmation(true);
  };

  const handleConfirmTip = async () => {
    if (!pendingTip) return;

    setIsProcessing(true);
    try {
      await onTip(pendingTip.amount, pendingTip.message);
      
      // Show success state
      setJustTipped(true);
      setTimeout(() => setJustTipped(false), 2000);
      
      if (customAmount) {
        setCustomValue('');
        setMessage('');
        setShowCustomForm(false);
      }
    } catch (error) {
      console.error('Tip failed:', error);
    } finally {
      setIsProcessing(false);
      setPendingTip(null);
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
                className="input-field"
                aria-describedby="amount-help"
              />
              <p id="amount-help" className="text-xs text-text-tertiary mt-1">
                Minimum tip: 0.01 ETH
              </p>
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
                className="input-field"
                aria-describedby="message-help"
              />
              <p id="message-help" className="text-xs text-text-tertiary mt-1">
                {message.length}/100 characters
              </p>
            </div>

            <button
              onClick={handleTipClick}
              disabled={isProcessing || !customValue || parseFloat(customValue) <= 0}
              className={clsx(
                'w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2',
                justTipped
                  ? 'bg-green-500 text-white'
                  : isProcessing || !customValue || parseFloat(customValue) <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-accent hover:scale-105 animate-pulse-glow'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : justTipped ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Tip Sent!
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
    <>
      <button
        onClick={handleTipClick}
        disabled={variant === 'disabled' || isProcessing}
        className={clsx(
          'px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 min-h-[60px] group',
          {
            'btn-accent hover:scale-105 animate-pulse-glow': variant === 'default' && !isProcessing && !justTipped,
            'bg-primary text-white': variant === 'processing' && !isProcessing && !justTipped,
            'bg-green-500 text-white animate-tip-celebration': justTipped,
            'bg-gray-300 text-gray-500 cursor-not-allowed': variant === 'disabled' || isProcessing,
          }
        )}
        aria-label={`Tip ${amount} ETH`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : justTipped ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <div className="text-center">
              <div className="font-bold">Sent!</div>
              <div className="text-xs opacity-75">Thank you!</div>
            </div>
          </>
        ) : (
          <>
            <div className="transition-transform duration-200 group-hover:scale-110">
              {icon}
            </div>
            <div className="text-center">
              <div className="font-bold">{amount} ETH</div>
              <div className="text-xs opacity-75">Quick Tip</div>
            </div>
          </>
        )}
      </button>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTip}
        title="Confirm Tip"
        message={`Are you sure you want to tip ${pendingTip?.amount} ETH to this streamer?${pendingTip?.message ? ` Your message: "${pendingTip.message}"` : ''}`}
        confirmText="Send Tip"
        cancelText="Cancel"
        type="tip"
        amount={pendingTip?.amount}
        currency="ETH"
      />
    </>
  );
}
