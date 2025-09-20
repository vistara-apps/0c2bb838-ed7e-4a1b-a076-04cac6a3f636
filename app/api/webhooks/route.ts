import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TipModel, SubscriptionModel, NotificationModel, MilestoneModel } from '@/lib/models'
import { MILESTONES } from '@/lib/constants'

// Webhook validation schemas
const transactionWebhookSchema = z.object({
  eventType: z.enum(['transaction.confirmed', 'transaction.failed']),
  transactionHash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(), // In wei
  blockNumber: z.number(),
  timestamp: z.number(),
})

const subscriptionRenewalSchema = z.object({
  eventType: z.enum(['subscription.renewal.due', 'subscription.renewal.failed']),
  subscriptionId: z.string(),
  streamerId: z.string(),
  viewerId: z.string(),
  amount: z.number(),
  frequency: z.enum(['WEEKLY', 'MONTHLY']),
})

// POST /api/webhooks - Handle incoming webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType } = body

    // Verify webhook signature (in production, implement proper signature verification)
    const signature = request.headers.get('x-webhook-signature')
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      )
    }

    switch (eventType) {
      case 'transaction.confirmed':
        return await handleTransactionConfirmed(body)

      case 'transaction.failed':
        return await handleTransactionFailed(body)

      case 'subscription.renewal.due':
        return await handleSubscriptionRenewal(body)

      case 'subscription.renewal.failed':
        return await handleSubscriptionRenewalFailed(body)

      default:
        return NextResponse.json(
          { error: 'Unknown event type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle transaction confirmed webhook
async function handleTransactionConfirmed(body: any) {
  try {
    const validatedData = transactionWebhookSchema.parse(body)

    // Find tip by transaction hash
    const tip = await TipModel.updateStatus(
      validatedData.transactionHash,
      'CONFIRMED',
      validatedData.transactionHash
    )

    if (tip) {
      // Create notification for streamer
      await NotificationModel.create({
        type: 'NEW_TIP',
        title: 'New Tip Received!',
        message: `You received a ${tip.amount} ETH tip!`,
        streamerId: tip.streamerId,
      })

      // Check for milestones
      await checkMilestones(tip.streamerId)

      return NextResponse.json({
        success: true,
        message: 'Tip confirmed and notifications sent',
      })
    }

    // Check if it's a subscription payment
    const subscription = await SubscriptionModel.updateStatus(
      validatedData.transactionHash,
      'ACTIVE'
    )

    if (subscription) {
      // Create notification for streamer
      await NotificationModel.create({
        type: 'SUBSCRIPTION_STARTED',
        title: 'New Subscriber!',
        message: `You have a new subscriber paying ${subscription.amount} ETH ${subscription.frequency.toLowerCase()}!`,
        streamerId: subscription.streamerId,
      })

      return NextResponse.json({
        success: true,
        message: 'Subscription activated and notifications sent',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction processed (no matching tip or subscription found)',
    })
  } catch (error) {
    console.error('Transaction confirmation error:', error)
    throw error
  }
}

// Handle transaction failed webhook
async function handleTransactionFailed(body: any) {
  try {
    const validatedData = transactionWebhookSchema.parse(body)

    // Update tip status to failed
    await TipModel.updateStatus(
      validatedData.transactionHash,
      'FAILED',
      validatedData.transactionHash
    )

    return NextResponse.json({
      success: true,
      message: 'Transaction failure recorded',
    })
  } catch (error) {
    console.error('Transaction failure error:', error)
    throw error
  }
}

// Handle subscription renewal webhook
async function handleSubscriptionRenewal(body: any) {
  try {
    const validatedData = subscriptionRenewalSchema.parse(body)

    // Update subscription next payment date
    const { calculateNextPaymentDate } = await import('@/lib/utils')
    const nextPaymentDate = calculateNextPaymentDate(
      validatedData.frequency === 'WEEKLY' ? 'weekly' : 'monthly'
    )

    // Update subscription with new payment date
    const { prisma } = await import('@/lib/db')
    await prisma.subscription.update({
      where: { id: validatedData.subscriptionId },
      data: { nextPaymentDate },
    })

    // Create notification for streamer
    await NotificationModel.create({
      type: 'SUBSCRIPTION_RENEWED',
      title: 'Subscription Renewed!',
      message: `A subscription payment of ${validatedData.amount} ETH has been processed.`,
      streamerId: validatedData.streamerId,
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription renewed',
    })
  } catch (error) {
    console.error('Subscription renewal error:', error)
    throw error
  }
}

// Handle subscription renewal failed webhook
async function handleSubscriptionRenewalFailed(body: any) {
  try {
    const validatedData = subscriptionRenewalSchema.parse(body)

    // Update subscription status
    await SubscriptionModel.updateStatus(validatedData.subscriptionId, 'SUSPENDED')

    // Create notification for streamer
    await NotificationModel.create({
      type: 'SUBSCRIPTION_CANCELLED',
      title: 'Subscription Payment Failed',
      message: `A subscription payment of ${validatedData.amount} ETH failed. The subscription has been suspended.`,
      streamerId: validatedData.streamerId,
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription suspension recorded',
    })
  } catch (error) {
    console.error('Subscription renewal failure error:', error)
    throw error
  }
}

// Check for milestone achievements
async function checkMilestones(streamerId: string) {
  try {
    // Get current total tips
    const totalTips = await TipModel.getTotalTipsAmount(streamerId)

    // Check unachieved milestones
    const unachievedMilestones = await MilestoneModel.getUnachievedMilestones(streamerId, totalTips)

    for (const milestone of unachievedMilestones) {
      if (totalTips >= milestone.amount) {
        // Mark milestone as achieved
        await MilestoneModel.markAchieved(milestone.id)

        // Create notification
        await NotificationModel.create({
          type: 'MILESTONE_ACHIEVED',
          title: 'Milestone Achieved! 🎉',
          message: milestone.reward,
          streamerId,
        })
      }
    }
  } catch (error) {
    console.error('Milestone check error:', error)
  }
}

