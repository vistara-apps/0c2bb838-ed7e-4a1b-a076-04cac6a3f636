// Core data models for StreamSpark

export interface Streamer {
  streamerId: string;
  farcasterUsername: string;
  baseWalletAddress: string;
  displayName: string;
  profilePictureUrl?: string;
}

export interface Viewer {
  viewerId: string;
  farcasterUsername: string;
  baseWalletAddress: string;
}

export interface Tip {
  tipId: string;
  streamerId: string;
  viewerId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  message?: string;
}

export interface Subscription {
  subscriptionId: string;
  streamerId: string;
  viewerId: string;
  tierName: string;
  amount: number;
  frequency: 'weekly' | 'monthly';
  startDate: Date;
  endDate?: Date;
}

// Component prop types
export interface TipButtonVariant {
  variant: 'default' | 'processing' | 'disabled';
}

export interface SubscriptionCardVariant {
  variant: 'active' | 'expired';
}

export interface NotificationVariant {
  variant: 'newTip' | 'milestoneReached';
}

export interface StreamerProfileVariant {
  variant: 'basic';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface TipResponse {
  tipId: string;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface SubscriptionResponse {
  subscriptionId: string;
  status: 'active' | 'pending' | 'cancelled';
  nextPaymentDate: Date;
}
