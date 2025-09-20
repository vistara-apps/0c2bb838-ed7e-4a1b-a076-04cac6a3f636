'use client';

import { useState } from 'react';
import { Check, Crown, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SubscriptionCardProps {
  tierName: string;
  amount: number;
  frequency: 'weekly' | 'monthly';
  benefits: string[];
  variant: 'active' | 'expired';
  onSubscribe: (tierName: string, amount: number, frequency: 'weekly' | 'monthly') => Promise<void>;
}

export function SubscriptionCard({
  tierName,
  amount,
  frequency,
  benefits,
  variant = 'active',
  onSubscribe
}: SubscriptionCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (variant === 'expired') return;

    setIsProcessing(true);
    try {
      await onSubscribe(tierName, amount, frequency);
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isPopular = tierName === 'Super Fan';

  return (
    <div className={clsx(
      'card relative overflow-hidden transition-all duration-200',
      {
        'ring-2 ring-accent scale-105': isPopular,
        'opacity-60': variant === 'expired',
        'hover:scale-102': variant === 'active' && !isProcessing,
      }
    )}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-accent text-text-primary px-3 py-1 text-xs font-bold rounded-bl-lg">
          POPULAR
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="flex items-center justify-center gap-2">
          <Crown className={clsx(
            'w-6 h-6',
            isPopular ? 'text-accent' : 'text-primary'
          )} />
          <h3 className="text-xl font-bold text-text-primary">{tierName}</h3>
        </div>
        
        <div className="space-y-1">
          <div className="text-3xl font-bold text-primary">
            {amount} ETH
          </div>
          <div className="text-sm text-text-secondary">
            per {frequency}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3 mb-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={clsx(
              'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
              isPopular ? 'bg-accent' : 'bg-primary'
            )}>
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-text-primary">{benefit}</span>
          </div>
        ))}
      </div>

      {/* Subscribe Button */}
      <button
        onClick={handleSubscribe}
        disabled={variant === 'expired' || isProcessing}
        className={clsx(
          'w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2',
          {
            'btn-accent hover:scale-105': isPopular && variant === 'active' && !isProcessing,
            'btn-primary': !isPopular && variant === 'active' && !isProcessing,
            'bg-gray-300 text-gray-500 cursor-not-allowed': variant === 'expired' || isProcessing,
          }
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : variant === 'expired' ? (
          'Expired'
        ) : (
          `Subscribe ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}`
        )}
      </button>

      {/* Fine Print */}
      <p className="text-xs text-text-secondary text-center mt-3">
        Cancel anytime. Payments processed via Base Wallet.
      </p>
    </div>
  );
}
