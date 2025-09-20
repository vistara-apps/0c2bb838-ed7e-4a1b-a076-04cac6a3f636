import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { StreamerModel } from '@/lib/models'

// Validation schemas
const createStreamerSchema = z.object({
  farcasterUsername: z.string().min(1, 'Farcaster username is required'),
  baseWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  displayName: z.string().min(1, 'Display name is required'),
  profilePictureUrl: z.string().url().optional(),
  bio: z.string().optional(),
})

const updateStreamerSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').optional(),
  profilePictureUrl: z.string().url().optional(),
  bio: z.string().optional(),
})

// GET /api/streamers - Get streamer by ID, username, or wallet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const username = searchParams.get('username')
    const wallet = searchParams.get('wallet')
    const includeStats = searchParams.get('includeStats') === 'true'

    let streamer

    if (id) {
      streamer = includeStats
        ? await StreamerModel.getWithStats(id)
        : await StreamerModel.findByFarcasterUsername(id) || await StreamerModel.findByWalletAddress(id)
    } else if (username) {
      streamer = includeStats
        ? await StreamerModel.getWithStats(username)
        : await StreamerModel.findByFarcasterUsername(username)
    } else if (wallet) {
      streamer = includeStats
        ? await StreamerModel.getWithStats(wallet)
        : await StreamerModel.findByWalletAddress(wallet)
    } else {
      return NextResponse.json(
        { error: 'ID, username, or wallet address is required' },
        { status: 400 }
      )
    }

    if (!streamer) {
      return NextResponse.json(
        { error: 'Streamer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: streamer,
    })
  } catch (error) {
    console.error('Error fetching streamer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streamer' },
      { status: 500 }
    )
  }
}

// POST /api/streamers - Create a new streamer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = createStreamerSchema.parse(body)

    // Check if streamer already exists
    const existingStreamer = await StreamerModel.findByFarcasterUsername(validatedData.farcasterUsername) ||
                             await StreamerModel.findByWalletAddress(validatedData.baseWalletAddress)

    if (existingStreamer) {
      return NextResponse.json(
        { error: 'Streamer already exists' },
        { status: 409 }
      )
    }

    // Create streamer
    const streamer = await StreamerModel.create(validatedData)

    return NextResponse.json({
      success: true,
      data: streamer,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating streamer:', error)
    return NextResponse.json(
      { error: 'Failed to create streamer' },
      { status: 500 }
    )
  }
}

// PUT /api/streamers/[id] - Update streamer profile
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const streamerId = searchParams.get('id')

    if (!streamerId) {
      return NextResponse.json(
        { error: 'Streamer ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateStreamerSchema.parse(body)

    // Verify streamer exists
    const existingStreamer = await StreamerModel.findByFarcasterUsername(streamerId) ||
                             await StreamerModel.findByWalletAddress(streamerId)

    if (!existingStreamer) {
      return NextResponse.json(
        { error: 'Streamer not found' },
        { status: 404 }
      )
    }

    // Update streamer (using Prisma directly for this operation)
    const { prisma } = await import('@/lib/db')
    const updatedStreamer = await prisma.streamer.update({
      where: { id: existingStreamer.id },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      data: updatedStreamer,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating streamer:', error)
    return NextResponse.json(
      { error: 'Failed to update streamer' },
      { status: 500 }
    )
  }
}

