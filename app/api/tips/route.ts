import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TipModel, StreamerModel, ViewerModel } from '@/lib/models'
import { validateTipAmount } from '@/lib/utils'

// Validation schemas
const createTipSchema = z.object({
  streamerId: z.string().min(1, 'Streamer ID is required'),
  viewerId: z.string().min(1, 'Viewer ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('ETH'),
  message: z.string().optional(),
  transactionHash: z.string().optional(),
})

const updateTipSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'FAILED']),
  transactionHash: z.string().optional(),
})

// GET /api/tips - Get tips for a streamer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const streamerId = searchParams.get('streamerId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!streamerId) {
      return NextResponse.json(
        { error: 'Streamer ID is required' },
        { status: 400 }
      )
    }

    const tips = await TipModel.getRecentTips(streamerId, limit)

    return NextResponse.json({
      success: true,
      data: tips,
    })
  } catch (error) {
    console.error('Error fetching tips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tips' },
      { status: 500 }
    )
  }
}

// POST /api/tips - Create a new tip
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = createTipSchema.parse(body)

    // Validate tip amount
    if (!validateTipAmount(validatedData.amount.toString())) {
      return NextResponse.json(
        { error: 'Invalid tip amount' },
        { status: 400 }
      )
    }

    // Verify streamer exists
    const streamer = await StreamerModel.findByWalletAddress(validatedData.streamerId) ||
                     await StreamerModel.findByFarcasterUsername(validatedData.streamerId)

    if (!streamer) {
      return NextResponse.json(
        { error: 'Streamer not found' },
        { status: 404 }
      )
    }

    // Get or create viewer
    let viewer = await ViewerModel.findByWalletAddress(validatedData.viewerId)
    if (!viewer) {
      viewer = await ViewerModel.createOrUpdate({
        baseWalletAddress: validatedData.viewerId,
      })
    }

    // Create tip
    const tip = await TipModel.create({
      streamerId: streamer.id,
      viewerId: viewer.id,
      amount: validatedData.amount,
      currency: validatedData.currency,
      message: validatedData.message,
      transactionHash: validatedData.transactionHash,
    })

    // Update streamer stats
    await StreamerModel.updateTotalTips(streamer.id, validatedData.amount)

    return NextResponse.json({
      success: true,
      data: tip,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating tip:', error)
    return NextResponse.json(
      { error: 'Failed to create tip' },
      { status: 500 }
    )
  }
}

// PUT /api/tips/[id] - Update tip status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipId = searchParams.get('id')

    if (!tipId) {
      return NextResponse.json(
        { error: 'Tip ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateTipSchema.parse(body)

    const tip = await TipModel.updateStatus(
      tipId,
      validatedData.status,
      validatedData.transactionHash
    )

    return NextResponse.json({
      success: true,
      data: tip,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating tip:', error)
    return NextResponse.json(
      { error: 'Failed to update tip' },
      { status: 500 }
    )
  }
}

