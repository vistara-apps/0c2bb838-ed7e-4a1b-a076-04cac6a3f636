// Configuration for StreamSpark application

// Environment variables with defaults
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/streamspark',
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },

  // Base Network
  base: {
    chainId: 8453, // Base mainnet
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
  },

  // Coinbase Wallet
  coinbaseWallet: {
    appName: 'StreamSpark',
    appLogoUrl: process.env.APP_LOGO_URL || 'https://streamspark.app/logo.png',
    appChainIds: [8453], // Base mainnet
  },

  // Farcaster
  farcaster: {
    apiKey: process.env.FARCASTER_API_KEY,
    baseUrl: process.env.FARCASTER_BASE_URL || 'https://api.farcaster.xyz',
  },

  // Application
  app: {
    name: 'StreamSpark',
    version: '1.0.0',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    port: parseInt(process.env.PORT || '3000'),
    environment: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  },

  // API Rate Limits
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  },

  // Webhook Security
  webhooks: {
    secret: process.env.WEBHOOK_SECRET || 'your-webhook-secret',
    tolerance: parseInt(process.env.WEBHOOK_TOLERANCE || '300000'), // 5 minutes in milliseconds
  },

  // Email (for notifications)
  email: {
    from: process.env.EMAIL_FROM || 'noreply@streamspark.app',
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },

  // Cache
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300'), // 5 minutes
    redis: {
      url: process.env.REDIS_URL,
      ttl: parseInt(process.env.REDIS_TTL || '3600'), // 1 hour
    },
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    },
    logLevel: process.env.LOG_LEVEL || 'info',
  },

  // Business Logic
  business: {
    tipAmounts: [1, 5, 10, 25, 50, 100],
    subscriptionTiers: {
      fan: { amount: 10, frequency: 'MONTHLY' },
      superFan: { amount: 25, frequency: 'MONTHLY' },
      vip: { amount: 50, frequency: 'MONTHLY' },
    },
    platformFee: parseFloat(process.env.PLATFORM_FEE || '0.05'), // 5%
    minTipAmount: 0.01,
    maxTipAmount: 1000,
  },

  // Feature Flags
  features: {
    subscriptions: process.env.FEATURE_SUBSCRIPTIONS !== 'false',
    milestones: process.env.FEATURE_MILESTONES !== 'false',
    notifications: process.env.FEATURE_NOTIFICATIONS !== 'false',
    analytics: process.env.FEATURE_ANALYTICS !== 'false',
  },
} as const

// Validation function to ensure required config is present
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXT_PUBLIC_BASE_URL',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  // Validate URLs
  if (config.app.baseUrl && !config.app.baseUrl.startsWith('http')) {
    throw new Error('NEXT_PUBLIC_BASE_URL must be a valid URL starting with http or https')
  }

  // Validate database URL
  if (!config.database.url.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string')
  }
}

// Export individual config sections for convenience
export const {
  database,
  auth,
  base,
  coinbaseWallet,
  farcaster,
  app,
  rateLimit,
  webhooks,
  email,
  upload,
  cache,
  monitoring,
  business,
  features,
} = config

