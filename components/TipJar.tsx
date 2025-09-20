'use client';

import { useState, useEffect } from 'react';
import { Heart, Coins, Sparkles } from 'lucide-react';

interface Tip {
  tipId: string;
  streamerId: string;
  viewerId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  message?: string;
}

interface TipJarProps {
  totalAmount: number;
  recentTips: Tip[];
}

export function TipJar({ totalAmount, recentTips }: TipJarProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Animate when new tips come in
  useEffect(() => {
    if (recentTips.length > 0) {
      setIsAnimating(true);
      setShowSparkles(true);
      
      const timer1 = setTimeout(() => setIsAnimating(false), 1000);
      const timer2 = setTimeout(() => setShowSparkles(false), 2000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [recentTips.length]);

  // Calculate fill percentage (max at 200 ETH for visual purposes)
  const fillPercentage = Math.min((totalAmount / 200) * 100, 100);

  return (
    <div className="relative">
      {/* Sparkle Effects */}
      {showSparkles && (
        <>
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-accent rounded-full sparkle"></div>
          <div className="absolute -top-6 right-8 w-2 h-2 bg-yellow-400 rounded-full sparkle" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-4 -right-6 w-2.5 h-2.5 bg-pink-400 rounded-full sparkle" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute -bottom-2 -left-6 w-2 h-2 bg-blue-400 rounded-full sparkle" style={{ animationDelay: '0.9s' }}></div>
        </>
      )}

      {/* Tip Jar Container */}
      <div className={`relative transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'} ${showSparkles ? 'animate-bounce-gentle' : ''}`}>
        {/* Jar Body */}
        <div className="tip-jar w-32 h-40 mx-auto relative overflow-hidden">
          {/* Jar Fill */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent to-yellow-300 transition-all duration-1000 ease-out rounded-b-full"
            style={{ height: `${fillPercentage}%` }}
          >
            {/* Liquid Animation */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>

          {/* Jar Rim */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg border-t-2 border-gray-400"></div>

          {/* Heart Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
          </div>

          {/* Dollar Sign */}
          <div className="absolute top-1/4 right-2 text-green-600 font-bold text-xl opacity-80">
            $
          </div>

          {/* Coins floating */}
          {totalAmount > 0 && (
            <>
              <div className="absolute top-1/3 left-2 w-3 h-3 bg-yellow-400 rounded-full opacity-60 float-animation"></div>
              <div className="absolute bottom-1/3 right-3 w-2 h-2 bg-yellow-500 rounded-full opacity-70 float-animation" style={{ animationDelay: '1s' }}></div>
            </>
          )}
        </div>

        {/* Amount Display */}
        <div className="text-center mt-4 space-y-2">
          <div className="text-2xl font-bold text-white">
            {totalAmount.toFixed(2)} ETH
          </div>
          <div className="text-sm text-purple-200 flex items-center justify-center gap-1">
            <Coins className="w-4 h-4" />
            Total Tips Collected
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-48 mx-auto">
          <div className="flex justify-between text-xs text-purple-200 mb-1">
            <span>0 ETH</span>
            <span>200 ETH Goal</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent to-yellow-400 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${fillPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Recent Tip Indicator */}
        {recentTips.length > 0 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              +{recentTips[0].amount} ETH
            </div>
          </div>
        )}
      </div>

      {/* Milestone Indicators */}
      <div className="flex justify-center mt-6 space-x-4">
        <div className={`flex items-center gap-1 text-xs ${totalAmount >= 50 ? 'text-accent' : 'text-purple-300'}`}>
          <Sparkles className="w-3 h-3" />
          50 ETH
        </div>
        <div className={`flex items-center gap-1 text-xs ${totalAmount >= 100 ? 'text-accent' : 'text-purple-300'}`}>
          <Sparkles className="w-3 h-3" />
          100 ETH
        </div>
        <div className={`flex items-center gap-1 text-xs ${totalAmount >= 150 ? 'text-accent' : 'text-purple-300'}`}>
          <Sparkles className="w-3 h-3" />
          150 ETH
        </div>
      </div>
    </div>
  );
}
