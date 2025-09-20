import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticateFromFarcaster, authenticateFromWallet, generateToken } from '@/lib/auth'

// Validation schemas
const farcasterAuthSchema = z.object({
  context: z.object({
    user: z.object({
      fid: z.number(),
      username: z.string(),
      displayName: z.string().optional(),
      pfpUrl: z.string().optional(),
    }),
  }),
})

const walletAuthSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  signature: z.string().optional(), // For future signature verification
})

// POST /api/auth - Authenticate user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    let user

    if (type === 'farcaster') {
      // Validate Farcaster auth
      const validatedData = farcasterAuthSchema.parse(body)
      user = await authenticateFromFarcaster(validatedData.context)
    } else if (type === 'wallet') {
      // Validate wallet auth
      const validatedData = walletAuthSchema.parse(body)
      user = await authenticateFromWallet(validatedData.walletAddress)
    } else {
      return NextResponse.json(
        { error: 'Invalid authentication type. Use "farcaster" or "wallet"' },
        { status: 400 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      type: user.type,
      walletAddress: user.walletAddress,
      farcasterUsername: user.farcasterUsername,
    })

    return NextResponse.json({
      success: true,
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// GET /api/auth/verify - Verify token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header missing or invalid' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Import verifyToken function
    const { verifyToken } = await import('@/lib/auth')
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: payload.userId,
        type: payload.type,
        walletAddress: payload.walletAddress,
        farcasterUsername: payload.farcasterUsername,
      },
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    )
  }
}

