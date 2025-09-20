import { prisma } from './db'
import { Streamer, Viewer, Tip, Subscription, Milestone, Notification } from '@prisma/client'

// Streamer operations
export const StreamerModel = {
  async findByFarcasterUsername(username: string) {
    return prisma.streamer.findUnique({
      where: { farcasterUsername: username },
    })
  },

  async findByWalletAddress(walletAddress: string) {
    return prisma.streamer.findUnique({
      where: { baseWalletAddress: walletAddress },
    })
  },

  async create(data: {
    farcasterUsername: string
    baseWalletAddress: string
    displayName: string
    profilePictureUrl?: string
    bio?: string
  }) {
    return prisma.streamer.create({
      data,
    })
  },

  async updateTotalTips(streamerId: string, amount: number) {
    return prisma.streamer.update({
      where: { id: streamerId },
      data: {
        totalTips: {
          increment: amount,
        },
      },
    })
  },

  async updateSubscriberCount(streamerId: string, increment: number = 1) {
    return prisma.streamer.update({
      where: { id: streamerId },
      data: {
        subscriberCount: {
          increment,
        },
      },
    })
  },

  async getWithStats(streamerId: string) {
    return prisma.streamer.findUnique({
      where: { id: streamerId },
      include: {
        _count: {
          select: {
            tips: true,
            subscriptions: true,
          },
        },
        tips: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: {
            viewer: true,
          },
        },
      },
    })
  },
}

// Viewer operations
export const ViewerModel = {
  async findByFarcasterUsername(username: string) {
    return prisma.viewer.findUnique({
      where: { farcasterUsername: username },
    })
  },

  async findByWalletAddress(walletAddress: string) {
    return prisma.viewer.findUnique({
      where: { baseWalletAddress: walletAddress },
    })
  },

  async createOrUpdate(data: {
    farcasterUsername?: string
    baseWalletAddress: string
    displayName?: string
    profilePictureUrl?: string
  }) {
    return prisma.viewer.upsert({
      where: { baseWalletAddress: data.baseWalletAddress },
      update: data,
      create: data,
    })
  },
}

// Tip operations
export const TipModel = {
  async create(data: {
    streamerId: string
    viewerId: string
    amount: number
    currency?: string
    message?: string
    transactionHash?: string
  }) {
    return prisma.tip.create({
      data,
      include: {
        streamer: true,
        viewer: true,
      },
    })
  },

  async updateStatus(tipId: string, status: 'PENDING' | 'CONFIRMED' | 'FAILED', transactionHash?: string) {
    return prisma.tip.update({
      where: { id: tipId },
      data: {
        status,
        transactionHash,
      },
    })
  },

  async getRecentTips(streamerId: string, limit: number = 10) {
    return prisma.tip.findMany({
      where: { streamerId },
      include: {
        viewer: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  async getTotalTipsAmount(streamerId: string) {
    const result = await prisma.tip.aggregate({
      where: {
        streamerId,
        status: 'CONFIRMED',
      },
      _sum: {
        amount: true,
      },
    })
    return result._sum.amount || 0
  },
}

// Subscription operations
export const SubscriptionModel = {
  async create(data: {
    streamerId: string
    viewerId: string
    tierName: string
    amount: number
    frequency: 'WEEKLY' | 'MONTHLY'
    nextPaymentDate: Date
    transactionHash?: string
  }) {
    return prisma.subscription.create({
      data,
      include: {
        streamer: true,
        viewer: true,
      },
    })
  },

  async updateStatus(subscriptionId: string, status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED') {
    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status },
    })
  },

  async getActiveSubscriptions(streamerId: string) {
    return prisma.subscription.findMany({
      where: {
        streamerId,
        status: 'ACTIVE',
      },
      include: {
        viewer: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getDueSubscriptions() {
    const now = new Date()
    return prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        nextPaymentDate: {
          lte: now,
        },
      },
      include: {
        streamer: true,
        viewer: true,
      },
    })
  },
}

// Milestone operations
export const MilestoneModel = {
  async create(data: {
    streamerId: string
    amount: number
    reward: string
  }) {
    return prisma.milestone.create({
      data,
    })
  },

  async markAchieved(milestoneId: string) {
    return prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        achievedAt: new Date(),
      },
    })
  },

  async getUnachievedMilestones(streamerId: string, currentAmount: number) {
    return prisma.milestone.findMany({
      where: {
        streamerId,
        achievedAt: null,
        amount: {
          lte: currentAmount,
        },
      },
      orderBy: { amount: 'asc' },
    })
  },
}

// Notification operations
export const NotificationModel = {
  async create(data: {
    type: 'NEW_TIP' | 'MILESTONE_ACHIEVED' | 'SUBSCRIPTION_STARTED' | 'SUBSCRIPTION_RENEWED' | 'SUBSCRIPTION_CANCELLED'
    title: string
    message: string
    streamerId?: string
    viewerId?: string
  }) {
    return prisma.notification.create({
      data,
    })
  },

  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })
  },

  async getUnreadNotifications(userId: string, userType: 'streamer' | 'viewer') {
    const whereClause = userType === 'streamer'
      ? { streamerId: userId }
      : { viewerId: userId }

    return prisma.notification.findMany({
      where: {
        ...whereClause,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    })
  },
}

