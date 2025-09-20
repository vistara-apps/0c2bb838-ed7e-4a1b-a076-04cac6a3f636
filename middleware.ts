import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// Routes that require authentication
const protectedRoutes = [
  '/api/tips',
  '/api/subscriptions',
  '/api/streamers',
  '/api/viewers',
]

// Routes that require streamer permissions
const streamerRoutes = [
  '/api/streamers',
]

// Public routes that don't need authentication
const publicRoutes = [
  '/api/frame',
  '/api/og',
  '/api/webhooks',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const requiresAuth = protectedRoutes.some(route => pathname.startsWith(route))

  if (!requiresAuth) {
    return NextResponse.next()
  }

  // Check for authorization header
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header missing or invalid' },
      { status: 401 }
    )
  }

  // Verify token
  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  // Check streamer permissions for streamer routes
  const requiresStreamer = streamerRoutes.some(route => pathname.startsWith(route))

  if (requiresStreamer && payload.type !== 'streamer') {
    return NextResponse.json(
      { error: 'Streamer permissions required' },
      { status: 403 }
    )
  }

  // Add user info to headers for use in API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId)
  requestHeaders.set('x-user-type', payload.type)
  requestHeaders.set('x-wallet-address', payload.walletAddress)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}

