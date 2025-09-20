import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample streamers
  const streamer1 = await prisma.streamer.upsert({
    where: { farcasterUsername: 'alice_streamer' },
    update: {},
    create: {
      farcasterUsername: 'alice_streamer',
      baseWalletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      displayName: 'Alice Streamer',
      profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      bio: 'Gaming streamer and content creator. Love making people smile! 🎮✨',
      totalTips: 125.5,
      subscriberCount: 15,
    },
  })

  const streamer2 = await prisma.streamer.upsert({
    where: { farcasterUsername: 'bob_gamer' },
    update: {},
    create: {
      farcasterUsername: 'bob_gamer',
      baseWalletAddress: '0x847d35Cc6634C0532925a3b844Bc454e4438f44f',
      displayName: 'Bob Gamer',
      profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      bio: 'Professional esports player and streamer. Pushing boundaries every day! 🏆',
      totalTips: 89.25,
      subscriberCount: 8,
    },
  })

  // Create sample viewers
  const viewer1 = await prisma.viewer.upsert({
    where: { baseWalletAddress: '0x123d35Cc6634C0532925a3b844Bc454e4438f123' },
    update: {},
    create: {
      farcasterUsername: 'fan_alice',
      baseWalletAddress: '0x123d35Cc6634C0532925a3b844Bc454e4438f123',
      displayName: 'Alice Fan',
      profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan_alice',
    },
  })

  const viewer2 = await prisma.viewer.upsert({
    where: { baseWalletAddress: '0x456d35Cc6634C0532925a3b844Bc454e4438f456' },
    update: {},
    create: {
      farcasterUsername: 'supporter_bob',
      baseWalletAddress: '0x456d35Cc6634C0532925a3b844Bc454e4438f456',
      displayName: 'Bob Supporter',
      profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supporter_bob',
    },
  })

  // Create sample tips
  await prisma.tip.createMany({
    data: [
      {
        streamerId: streamer1.id,
        viewerId: viewer1.id,
        amount: 5.0,
        currency: 'ETH',
        message: 'Amazing stream! Keep it up! 🚀',
        status: 'CONFIRMED',
        timestamp: new Date('2024-01-15T10:30:00Z'),
      },
      {
        streamerId: streamer1.id,
        viewerId: viewer2.id,
        amount: 10.0,
        currency: 'ETH',
        message: 'Love your content! 💜',
        status: 'CONFIRMED',
        timestamp: new Date('2024-01-16T14:20:00Z'),
      },
      {
        streamerId: streamer2.id,
        viewerId: viewer1.id,
        amount: 2.5,
        currency: 'ETH',
        message: 'Great game! 🎮',
        status: 'CONFIRMED',
        timestamp: new Date('2024-01-17T16:45:00Z'),
      },
    ],
    skipDuplicates: true,
  })

  // Create sample subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        streamerId: streamer1.id,
        viewerId: viewer1.id,
        tierName: 'Fan',
        amount: 10.0,
        frequency: 'MONTHLY',
        startDate: new Date('2024-01-01T00:00:00Z'),
        nextPaymentDate: new Date('2024-02-01T00:00:00Z'),
        status: 'ACTIVE',
      },
      {
        streamerId: streamer1.id,
        viewerId: viewer2.id,
        tierName: 'Super Fan',
        amount: 25.0,
        frequency: 'MONTHLY',
        startDate: new Date('2024-01-05T00:00:00Z'),
        nextPaymentDate: new Date('2024-02-05T00:00:00Z'),
        status: 'ACTIVE',
      },
    ],
    skipDuplicates: true,
  })

  // Create sample milestones
  await prisma.milestone.createMany({
    data: [
      {
        streamerId: streamer1.id,
        amount: 100.0,
        reward: '🎉 First 100 ETH! Special shoutout stream',
      },
      {
        streamerId: streamer1.id,
        amount: 250.0,
        reward: '🏆 Quarter Century! Custom emote for top supporters',
      },
      {
        streamerId: streamer1.id,
        amount: 500.0,
        reward: '💎 Halfway to 1K! Exclusive Discord role',
      },
      {
        streamerId: streamer2.id,
        amount: 50.0,
        reward: '🚀 First 50 ETH! Community game night',
      },
      {
        streamerId: streamer2.id,
        amount: 100.0,
        reward: '🎯 Century Club! Name in stream title',
      },
    ],
    skipDuplicates: true,
  })

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        streamerId: streamer1.id,
        type: 'NEW_TIP',
        title: 'New Tip Received!',
        message: 'Alice Fan tipped you 5.0 ETH!',
        isRead: false,
      },
      {
        streamerId: streamer1.id,
        type: 'SUBSCRIPTION_STARTED',
        title: 'New Subscriber!',
        message: 'Bob Supporter subscribed for 25.0 ETH/month!',
        isRead: false,
      },
      {
        streamerId: streamer1.id,
        type: 'MILESTONE_ACHIEVED',
        title: 'Milestone Achieved!',
        message: 'Congratulations! You reached 100 ETH in tips!',
        isRead: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Database seeded successfully!')
  console.log('📊 Created sample data:')
  console.log(`   - ${2} streamers`)
  console.log(`   - ${2} viewers`)
  console.log(`   - ${3} tips`)
  console.log(`   - ${2} subscriptions`)
  console.log(`   - ${5} milestones`)
  console.log(`   - ${3} notifications`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

