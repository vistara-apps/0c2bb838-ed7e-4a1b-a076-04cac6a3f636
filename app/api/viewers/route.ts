import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ViewerModel } from '@/lib/models'

// Validation schemas
const createViewerSchema = z.object({
  farcasterUsername: z.string().optional(),
  baseWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  displayName: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
})

const updateViewerSchema = z.object({
  farcasterUsername: z.string().optional(),
  displayName: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
})

// GET /api/viewers - Get viewer by ID, username, or wallet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const username = searchParams.get('username')
    const wallet = searchParams.get('wallet')

    let viewer

    if (id) {
      // For now, assume ID is wallet address
      viewer = await ViewerModel.findByWalletAddress(id)
    } else if (username) {
      viewer = await ViewerModel.findByFarcasterUsername(username)
    } else if (wallet) {
      viewer = await ViewerModel.findByWalletAddress(wallet)
    } else {
      return NextResponse.json(
        { error: 'ID, username, or wallet address is required' },
        { status: 400 }
      )
    }

    if (!viewer) {
      return NextResponse.json(
        { error: 'Viewer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: viewer,
    })
  } catch (error) {
    console.error('Error fetching viewer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch viewer' },
      { status: 500 }
    )
  }
}

// POST /api/viewers - Create or update a viewer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = createViewerSchema.parse(body)

    // Create or update viewer
    const viewer = await ViewerModel.createOrUpdate(validatedData)

    return NextResponse.json({
      success: true,
      data: viewer,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating/updating viewer:', error)
    return NextResponse.json(
      { error: 'Failed to create/update viewer' },
      { status: 500 }
    )
  }
}

// PUT /api/viewers/[id] - Update viewer profile
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const viewerId = searchParams.get('id')

    if (!viewerId) {
      return NextResponse.json(
        { error: 'Viewer ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateViewerSchema.parse(body)

    // Verify viewer exists
    const existingViewer = await ViewerModel.findByWalletAddress(viewerId)

    if (!existingViewer) {
      return NextResponse.json(
        { error: 'Viewer not found' },
        { status: 404 }
      )
    }

    // Update viewer (using Prisma directly for this operation)
    const { prisma } = await import('@/lib/db')
    const updatedViewer = await prisma.viewer.update({
      where: { id: existingViewer.id },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      data: updatedViewer,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating viewer:', error)
    return NextResponse.json(
      { error: 'Failed to update viewer' },
      { status: 500 }
    )
  }
}

