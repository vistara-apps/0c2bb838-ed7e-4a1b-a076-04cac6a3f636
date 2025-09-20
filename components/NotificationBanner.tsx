'use client';

import { useEffect, useState } from 'react';
import { X, Zap, Trophy, Heart } from 'lucide-react';
import { clsx } from 'clsx';

interface NotificationBannerProps {
  variant: 'newTip' | 'milestoneReached';
  onClose: () => void;
}

export function NotificationBanner({ variant, onClose }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const config = {
    newTip: {
      icon: <Heart className="w-5 h-5" />,
      title: 'New Tip Received!',
      message: 'Thank you for the support! 🎉',
      bgColor: 'bg-green-500',
      textColor: 'text-white',
    },
    milestoneReached: {
      icon: <Trophy className="w-5 h-5" />,
      title: 'Milestone Reached!',
      message: 'You hit 150 ETH in tips! Amazing! 🏆',
      bgColor: 'bg-accent',
      textColor: 'text-text-primary',
    },
  };

  const currentConfig = config[variant];

  return (
    <div className={clsx(
      'fixed top-4 left-4 right-4 z-50 transition-all duration-300 transform',
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    )}>
      <div className={clsx(
        'rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md mx-auto',
        currentConfig.bgColor,
        currentConfig.textColor
      )}>
        {/* Icon */}
        <div className="flex-shrink-0">
          {currentConfig.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">
            {currentConfig.title}
          </h4>
          <p className="text-sm opacity-90">
            {currentConfig.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sparkle Effects for Milestone */}
        {variant === 'milestoneReached' && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full sparkle"></div>
            <div className="absolute -top-2 right-8 w-1 h-1 bg-yellow-300 rounded-full sparkle" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-1 right-4 w-1.5 h-1.5 bg-yellow-300 rounded-full sparkle" style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>
    </div>
  );
}
