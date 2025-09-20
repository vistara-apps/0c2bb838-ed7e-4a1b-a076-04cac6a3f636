import { NotificationModel } from './models'

// Notification types and their configurations
export const NOTIFICATION_CONFIGS = {
  NEW_TIP: {
    title: 'New Tip Received! 🎉',
    priority: 'high',
    sound: true,
  },
  MILESTONE_ACHIEVED: {
    title: 'Milestone Achieved! 🏆',
    priority: 'high',
    sound: true,
  },
  SUBSCRIPTION_STARTED: {
    title: 'New Subscriber! 💎',
    priority: 'medium',
    sound: true,
  },
  SUBSCRIPTION_RENEWED: {
    title: 'Subscription Renewed! 🔄',
    priority: 'low',
    sound: false,
  },
  SUBSCRIPTION_CANCELLED: {
    title: 'Subscription Ended 😢',
    priority: 'medium',
    sound: false,
  },
} as const

// Create a notification for a new tip
export async function createTipNotification(streamerId: string, tipAmount: number, tipperName?: string) {
  try {
    const message = tipperName
      ? `${tipperName} tipped you ${tipAmount} ETH!`
      : `You received a ${tipAmount} ETH tip!`

    return await NotificationModel.create({
      type: 'NEW_TIP',
      title: NOTIFICATION_CONFIGS.NEW_TIP.title,
      message,
      streamerId,
    })
  } catch (error) {
    console.error('Error creating tip notification:', error)
    throw error
  }
}

// Create a notification for milestone achievement
export async function createMilestoneNotification(streamerId: string, milestoneReward: string) {
  try {
    return await NotificationModel.create({
      type: 'MILESTONE_ACHIEVED',
      title: NOTIFICATION_CONFIGS.MILESTONE_ACHIEVED.title,
      message: milestoneReward,
      streamerId,
    })
  } catch (error) {
    console.error('Error creating milestone notification:', error)
    throw error
  }
}

// Create a notification for new subscription
export async function createSubscriptionNotification(
  streamerId: string,
  subscriberName: string,
  amount: number,
  frequency: string
) {
  try {
    const message = `${subscriberName} subscribed for ${amount} ETH ${frequency.toLowerCase()}!`

    return await NotificationModel.create({
      type: 'SUBSCRIPTION_STARTED',
      title: NOTIFICATION_CONFIGS.SUBSCRIPTION_STARTED.title,
      message,
      streamerId,
    })
  } catch (error) {
    console.error('Error creating subscription notification:', error)
    throw error
  }
}

// Create a notification for subscription renewal
export async function createRenewalNotification(streamerId: string, amount: number, frequency: string) {
  try {
    const message = `Subscription payment of ${amount} ETH processed (${frequency.toLowerCase()}).`

    return await NotificationModel.create({
      type: 'SUBSCRIPTION_RENEWED',
      title: NOTIFICATION_CONFIGS.SUBSCRIPTION_RENEWED.title,
      message,
      streamerId,
    })
  } catch (error) {
    console.error('Error creating renewal notification:', error)
    throw error
  }
}

// Create a notification for subscription cancellation
export async function createCancellationNotification(streamerId: string, amount: number, frequency: string) {
  try {
    const message = `Subscription payment of ${amount} ETH failed. Subscription suspended.`

    return await NotificationModel.create({
      type: 'SUBSCRIPTION_CANCELLED',
      title: NOTIFICATION_CONFIGS.SUBSCRIPTION_CANCELLED.title,
      message,
      streamerId,
    })
  } catch (error) {
    console.error('Error creating cancellation notification:', error)
    throw error
  }
}

// Get unread notifications for a user
export async function getUnreadNotifications(userId: string, userType: 'streamer' | 'viewer' = 'streamer') {
  try {
    return await NotificationModel.getUnreadNotifications(userId, userType)
  } catch (error) {
    console.error('Error getting unread notifications:', error)
    throw error
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    return await NotificationModel.markAsRead(notificationId)
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

// Get notification statistics
export async function getNotificationStats(userId: string, userType: 'streamer' | 'viewer' = 'streamer') {
  try {
    const { prisma } = await import('./db')

    const whereClause = userType === 'streamer'
      ? { streamerId: userId }
      : { viewerId: userId }

    const [total, unread, recent] = await Promise.all([
      prisma.notification.count({ where: whereClause }),
      prisma.notification.count({
        where: {
          ...whereClause,
          isRead: false,
        },
      }),
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    return {
      total,
      unread,
      recent,
    }
  } catch (error) {
    console.error('Error getting notification stats:', error)
    throw error
  }
}

// Clean up old notifications (older than 30 days)
export async function cleanupOldNotifications() {
  try {
    const { prisma } = await import('./db')
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
        isRead: true,
      },
    })

    return result.count
  } catch (error) {
    console.error('Error cleaning up old notifications:', error)
    throw error
  }
}

