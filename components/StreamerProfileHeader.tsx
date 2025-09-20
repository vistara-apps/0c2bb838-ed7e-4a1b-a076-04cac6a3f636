'use client';

import { useState } from 'react';
import { Users, TrendingUp, Star, Settings } from 'lucide-react';

interface Streamer {
  streamerId: string;
  farcasterUsername: string;
  baseWalletAddress: string;
  displayName: string;
  profilePictureUrl?: string;
}

interface StreamerProfileHeaderProps {
  streamer: Streamer;
  totalTips: number;
  subscriberCount: number;
  variant: 'basic';
}

export function StreamerProfileHeader({
  streamer,
  totalTips,
  subscriberCount,
  variant = 'basic'
}: StreamerProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="text-center space-y-4">
      {/* Profile Picture */}
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent shadow-lg mx-auto">
          {streamer.profilePictureUrl && !imageError ? (
            <img
              src={streamer.profilePictureUrl}
              alt={`${streamer.displayName}'s profile picture`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold"
              aria-label={`${streamer.displayName}'s avatar`}
              role="img"
            >
              {streamer.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Online Status Indicator */}
        <div 
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center"
          aria-label="Online status: Live streaming"
          role="status"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Streamer Info */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">
          {streamer.displayName}
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-purple-200">
          <span>@{streamer.farcasterUsername}</span>
          <span>•</span>
          <span className="font-mono text-sm">
            {formatAddress(streamer.baseWalletAddress)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 text-white" role="group" aria-label="Streamer statistics">
        <div className="flex items-center gap-2" aria-label={`Total tips: ${totalTips.toFixed(2)} ETH`}>
          <TrendingUp className="w-5 h-5 text-accent" aria-hidden="true" />
          <span className="font-semibold">{totalTips.toFixed(2)} ETH</span>
        </div>
        
        <div className="flex items-center gap-2" aria-label={`${subscriberCount} supporters`}>
          <Users className="w-5 h-5 text-accent" aria-hidden="true" />
          <span className="font-semibold">{subscriberCount} Supporters</span>
        </div>
        
        <div className="flex items-center gap-2" aria-label="Currently live streaming">
          <Star className="w-5 h-5 text-accent" aria-hidden="true" />
          <span className="font-semibold">Live</span>
        </div>
      </div>

      {/* Streaming Status */}
      <div 
        className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium"
        role="status"
        aria-live="polite"
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" aria-hidden="true"></div>
        LIVE STREAMING
      </div>
    </div>
  );
}
