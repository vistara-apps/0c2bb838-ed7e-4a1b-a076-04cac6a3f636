import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendTip, sendSubscription, estimateGas, getGasPrice } from '@/lib/wallet'

// Validation schemas
const tipTransactionSchema = z.object({
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
  amount: z.number().positive('Amount must be positive'),
  message: z.string().optional(),
})

const subscriptionTransactionSchema = z.object({
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
  amount: z.number().positive('Amount must be positive'),
  frequency: z.enum(['weekly', 'monthly']),
})

const estimateSchema = z.object({
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
  amount: z.number().positive('Amount must be positive'),
})

// POST /api/transactions/tip - Send a tip transaction
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'tip') {
      const body = await request.json()
      const validatedData = tipTransactionSchema.parse(body)

      // Note: In a real implementation, you'd get the wallet client from the authenticated user
      // For now, we'll return a mock response
      return NextResponse.json({
        success: true,
        data: {
          type: 'tip',
          to: validatedData.to,
          amount: validatedData.amount,
          message: validatedData.message,
          status: 'pending',
          estimatedGas: '0.0001', // Mock gas estimate
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock hash
        },
      })
    } else if (type === 'subscription') {
      const body = await request.json()
      const validatedData = subscriptionTransactionSchema.parse(body)

      // Note: In a real implementation, you'd get the wallet client from the authenticated user
      // For now, we'll return a mock response
      return NextResponse.json({
        success: true,
        data: {
          type: 'subscription',
          to: validatedData.to,
          amount: validatedData.amount,
          frequency: validatedData.frequency,
          status: 'pending',
          estimatedGas: '0.0001', // Mock gas estimate
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock hash
        },
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid transaction type. Use ?type=tip or ?type=subscription' },
        { status: 400 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Transaction error:', error)
    return NextResponse.json(
      { error: 'Transaction failed' },
      { status: 500 }
    )
  }
}

// GET /api/transactions/estimate - Estimate gas for transaction
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const to = searchParams.get('to')
    const amount = searchParams.get('amount')

    if (!to || !amount) {
      return NextResponse.json(
        { error: 'Recipient address and amount are required' },
        { status: 400 }
      )
    }

    const validatedData = estimateSchema.parse({
      to,
      amount: parseFloat(amount),
    })

    // Note: In a real implementation, you'd estimate gas using the wallet client
    // For now, we'll return mock estimates
    const mockGasEstimate = '21000' // Standard ETH transfer gas
    const mockGasPrice = '0.000000001' // Mock gas price in ETH

    return NextResponse.json({
      success: true,
      data: {
        gasLimit: mockGasEstimate,
        gasPrice: mockGasPrice,
        estimatedFee: (parseInt(mockGasEstimate) * parseFloat(mockGasPrice)).toString(),
        totalCost: (validatedData.amount + parseInt(mockGasEstimate) * parseFloat(mockGasPrice)).toString(),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Gas estimation error:', error)
    return NextResponse.json(
      { error: 'Failed to estimate gas' },
      { status: 500 }
    )
  }
}

