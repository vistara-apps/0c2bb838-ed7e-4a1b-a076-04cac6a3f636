import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SubscriptionModel, StreamerModel, ViewerModel } from '@/lib/models'
import { calculateNextPaymentDate } from '@/lib/utils'

// Validation schemas
const createSubscriptionSchema = z.object({
  streamerId: z.string().min(1, 'Streamer ID is required'),
  viewerId: z.string().min(1, 'Viewer ID is required'),
  tierName: z.string().min(1, 'Tier name is required'),
  amount: z.number().positive('Amount must be positive'),
  frequency: z.enum(['WEEKLY', 'MONTHLY']),
  transactionHash: z.string().optional(),
})

const updateSubscriptionSchema = z.object({
  status: z.enum(['ACTIVE', 'CANCELLED', 'EXPIRED', 'SUSPENDED']),
})

// GET /api/subscriptions - Get subscriptions for a streamer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const streamerId = searchParams.get('streamerId')
    const viewerId = searchParams.get('viewerId')

    if (!streamerId && !viewerId) {
      return NextResponse.json(
        { error: 'Streamer ID or Viewer ID is required' },
        { status: 400 }
      )
    }

    let subscriptions

    if (streamerId) {
      subscriptions = await SubscriptionModel.getActiveSubscriptions(streamerId)
    } else {
      // Get subscriptions for a viewer
      const viewerSubscriptions = await SubscriptionModel.getActiveSubscriptions(viewerId!)
      subscriptions = viewerSubscriptions
    }

    return NextResponse.json({
      success: true,
      data: subscriptions,
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

// POST /api/subscriptions - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = createSubscriptionSchema.parse(body)

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

    // Calculate next payment date
    const nextPaymentDate = calculateNextPaymentDate(
      validatedData.frequency === 'WEEKLY' ? 'weekly' : 'monthly'
    )

    // Create subscription
    const subscription = await SubscriptionModel.create({
      streamerId: streamer.id,
      viewerId: viewer.id,
      tierName: validatedData.tierName,
      amount: validatedData.amount,
      frequency: validatedData.frequency,
      nextPaymentDate,
      transactionHash: validatedData.transactionHash,
    })

    // Update streamer subscriber count
    await StreamerModel.updateSubscriberCount(streamer.id, 1)

    return NextResponse.json({
      success: true,
      data: subscription,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

// PUT /api/subscriptions/[id] - Update subscription status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('id')

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateSubscriptionSchema.parse(body)

    const subscription = await SubscriptionModel.updateStatus(
      subscriptionId,
      validatedData.status
    )

    // If cancelled, update streamer subscriber count
    if (validatedData.status === 'CANCELLED') {
      await StreamerModel.updateSubscriberCount(subscription.streamerId, -1)
    }

    return NextResponse.json({
      success: true,
      data: subscription,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

