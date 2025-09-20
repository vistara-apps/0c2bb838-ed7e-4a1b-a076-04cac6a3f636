// Error types and handling utilities for StreamSpark

export class StreamSparkError extends Error {
  public code: string
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, code: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.name = 'StreamSparkError'
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, StreamSparkError)
  }
}

// Specific error classes
export class ValidationError extends StreamSparkError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends StreamSparkError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends StreamSparkError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends StreamSparkError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404)
    this.name = 'NotFoundError'
  }
}

export class WalletError extends StreamSparkError {
  constructor(message: string, code: string = 'WALLET_ERROR') {
    super(message, code, 400)
    this.name = 'WalletError'
  }
}

export class TransactionError extends StreamSparkError {
  constructor(message: string, transactionHash?: string) {
    super(message, 'TRANSACTION_ERROR', 400)
    this.name = 'TransactionError'
    if (transactionHash) {
      this.message += ` (Tx: ${transactionHash})`
    }
  }
}

// Error response formatter
export function formatErrorResponse(error: Error): {
  success: false
  error: string
  code?: string
  details?: any
} {
  if (error instanceof StreamSparkError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.isOperational ? undefined : { stack: error.stack },
    }
  }

  // Generic error
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined,
  }
}

// Error logging utility
export function logError(error: Error, context?: any) {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
  }

  // In production, you might want to send this to a logging service
  console.error('[StreamSpark Error]', JSON.stringify(errorInfo, null, 2))

  // Here you could integrate with services like Sentry, LogRocket, etc.
}

// Async error wrapper for API routes
export function asyncHandler(fn: Function) {
  return (req: Request, ...args: any[]) => {
    const result = fn(req, ...args)
    return Promise.resolve(result).catch((error: Error) => {
      logError(error, { url: req.url, method: req.method })
      return new Response(
        JSON.stringify(formatErrorResponse(error)),
        {
          status: error instanceof StreamSparkError ? error.statusCode : 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    })
  }
}

// Validation error formatter for Zod
export function formatZodError(error: any): string {
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ')
  }
  return error.message || 'Validation failed'
}

// Rate limiting error
export class RateLimitError extends StreamSparkError {
  constructor(message: string = 'Too many requests') {
    super(message, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}

// Database connection error
export class DatabaseError extends StreamSparkError {
  constructor(message: string = 'Database operation failed') {
    super(message, 'DATABASE_ERROR', 500, false) // Not operational
    this.name = 'DatabaseError'
  }
}

// External service error
export class ExternalServiceError extends StreamSparkError {
  constructor(service: string, message: string) {
    super(`${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502, false)
    this.name = 'ExternalServiceError'
  }
}

