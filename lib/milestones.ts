import { MilestoneModel, TipModel } from './models'
import { MILESTONES } from './constants'

// Initialize default milestones for a streamer
export async function initializeMilestones(streamerId: string) {
  try {
    const milestones = MILESTONES.map(milestone => ({
      streamerId,
      amount: milestone.amount,
      reward: milestone.reward,
    }))

    // Create milestones in batch
    for (const milestone of milestones) {
      await MilestoneModel.create(milestone)
    }

    return milestones
  } catch (error) {
    console.error('Error initializing milestones:', error)
    throw error
  }
}

// Check and trigger milestone achievements
export async function checkMilestoneAchievements(streamerId: string) {
  try {
    // Get current total tips
    const totalTips = await TipModel.getTotalTipsAmount(streamerId)

    // Get unachieved milestones
    const unachievedMilestones = await MilestoneModel.getUnachievedMilestones(streamerId, totalTips)

    const achievedMilestones = []

    for (const milestone of unachievedMilestones) {
      if (totalTips >= milestone.amount) {
        // Mark as achieved
        await MilestoneModel.markAchieved(milestone.id)
        achievedMilestones.push(milestone)
      }
    }

    return achievedMilestones
  } catch (error) {
    console.error('Error checking milestone achievements:', error)
    throw error
  }
}

// Get milestone progress for a streamer
export async function getMilestoneProgress(streamerId: string) {
  try {
    const totalTips = await TipModel.getTotalTipsAmount(streamerId)

    // Get all milestones for the streamer
    const { prisma } = await import('./db')
    const milestones = await prisma.milestone.findMany({
      where: { streamerId },
      orderBy: { amount: 'asc' },
    })

    return milestones.map(milestone => ({
      id: milestone.id,
      amount: milestone.amount,
      reward: milestone.reward,
      achieved: milestone.achievedAt !== null,
      achievedAt: milestone.achievedAt,
      progress: Math.min((totalTips / milestone.amount) * 100, 100),
      currentAmount: totalTips,
    }))
  } catch (error) {
    console.error('Error getting milestone progress:', error)
    throw error
  }
}

// Get next milestone for a streamer
export async function getNextMilestone(streamerId: string) {
  try {
    const totalTips = await TipModel.getTotalTipsAmount(streamerId)

    const unachievedMilestones = await MilestoneModel.getUnachievedMilestones(streamerId, totalTips)

    if (unachievedMilestones.length === 0) {
      return null // All milestones achieved
    }

    // Return the next achievable milestone
    const nextMilestone = unachievedMilestones[0]

    return {
      id: nextMilestone.id,
      amount: nextMilestone.amount,
      reward: nextMilestone.reward,
      progress: (totalTips / nextMilestone.amount) * 100,
      remaining: nextMilestone.amount - totalTips,
    }
  } catch (error) {
    console.error('Error getting next milestone:', error)
    throw error
  }
}

