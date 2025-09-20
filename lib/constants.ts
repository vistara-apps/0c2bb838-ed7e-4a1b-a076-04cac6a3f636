// StreamSpark App Constants

export const APP_CONFIG = {
  name: 'StreamSpark',
  tagline: 'Ignite your live stream with instant fan support',
  description: 'A Base Mini App for live streamers to easily receive instant and recurring tips from their viewers, fostering community engagement.',
  version: '1.0.0',
} as const;

export const SUPPORTED_CURRENCIES = ['ETH'] as const;

export const TIP_AMOUNTS = {
  QUICK: [1, 5, 10, 25],
  MIN: 0.001,
  MAX: 1000,
} as const;

export const SUBSCRIPTION_TIERS = {
  FAN: {
    name: 'Fan',
    amount: 10,
    frequency: 'monthly' as const,
    benefits: [
      'Supporter badge',
      'Priority chat',
      'Monthly shoutout'
    ],
  },
  SUPER_FAN: {
    name: 'Super Fan',
    amount: 25,
    frequency: 'monthly' as const,
    benefits: [
      'All Fan benefits',
      'Custom emotes',
      'Discord access',
      'Weekly 1-on-1'
    ],
  },
} as const;

export const MILESTONES = [
  { amount: 50, reward: 'First milestone! 🎉' },
  { amount: 100, reward: 'Century club! 💯' },
  { amount: 150, reward: 'Streaming superstar! ⭐' },
  { amount: 200, reward: 'Tip jar master! 🏆' },
  { amount: 500, reward: 'Legend status! 👑' },
] as const;

export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
} as const;

export const ANIMATION_DURATION = {
  FAST: 100,
  BASE: 200,
  SLOW: 300,
} as const;

export const DESIGN_TOKENS = {
  colors: {
    bg: 'hsl(210, 30%, 98%)',
    accent: 'hsl(40, 95%, 55%)',
    primary: 'hsl(204, 85%, 45%)',
    surface: 'hsl(210, 30%, 100%)',
    textPrimary: 'hsl(210, 20%, 15%)',
    textSecondary: 'hsl(210, 15%, 45%)',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  spacing: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
} as const;

export const FRAME_CONFIG = {
  maxWidth: 340,
  aspectRatio: '1.91:1',
  imageFormat: 'png',
} as const;

export const API_ENDPOINTS = {
  TIPS: '/api/tips',
  SUBSCRIPTIONS: '/api/subscriptions',
  STREAMERS: '/api/streamers',
  FRAME: '/api/frame',
  WEBHOOK: '/api/webhook',
} as const;

export const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Please enter a valid tip amount',
  INSUFFICIENT_FUNDS: 'Insufficient funds in wallet',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  SUBSCRIPTION_FAILED: 'Failed to create subscription',
  INVALID_ADDRESS: 'Invalid Ethereum address',
} as const;

export const SUCCESS_MESSAGES = {
  TIP_SENT: 'Tip sent successfully! 🎉',
  SUBSCRIPTION_CREATED: 'Subscription created! Thank you for your support! 💖',
  PROFILE_UPDATED: 'Profile updated successfully',
  MILESTONE_REACHED: 'Congratulations! You reached a new milestone! 🏆',
} as const;

export const SOCIAL_LINKS = {
  FARCASTER: 'https://farcaster.xyz',
  BASE: 'https://base.org',
  GITHUB: 'https://github.com/streamspark',
} as const;
