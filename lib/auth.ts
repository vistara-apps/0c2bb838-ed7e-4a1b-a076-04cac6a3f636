import jwt from 'jsonwebtoken'
import { ViewerModel, StreamerModel } from './models'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Types
export interface JWTPayload {
  userId: string
  type: 'viewer' | 'streamer'
  walletAddress: string
  farcasterUsername?: string
  iat?: number
  exp?: number
}

export interface AuthenticatedUser {
  id: string
  type: 'viewer' | 'streamer'
  walletAddress: string
  farcasterUsername?: string
  displayName?: string
  profilePictureUrl?: string
}

// Generate JWT token
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Authenticate user from Farcaster context
export async function authenticateFromFarcaster(context: any): Promise<AuthenticatedUser | null> {
  if (!context?.user) {
    return null
  }

  const { fid, username, displayName, pfpUrl } = context.user

  // Try to find as streamer first
  let user = await StreamerModel.findByFarcasterUsername(username)

  if (user) {
    return {
      id: user.id,
      type: 'streamer',
      walletAddress: user.baseWalletAddress,
      farcasterUsername: user.farcasterUsername,
      displayName: user.displayName,
      profilePictureUrl: user.profilePictureUrl || undefined,
    }
  }

  // Try to find as viewer
  user = await ViewerModel.findByFarcasterUsername(username)

  if (user) {
    return {
      id: user.id,
      type: 'viewer',
      walletAddress: user.baseWalletAddress,
      farcasterUsername: user.farcasterUsername || undefined,
      displayName: user.displayName || undefined,
      profilePictureUrl: user.profilePictureUrl || undefined,
    }
  }

  // Create new viewer if not found
  const newViewer = await ViewerModel.createOrUpdate({
    farcasterUsername: username,
    baseWalletAddress: `0x${fid.toString(16).padStart(40, '0')}`, // Generate wallet from FID for demo
    displayName,
    profilePictureUrl: pfpUrl,
  })

  return {
    id: newViewer.id,
    type: 'viewer',
    walletAddress: newViewer.baseWalletAddress,
    farcasterUsername: newViewer.farcasterUsername || undefined,
    displayName: newViewer.displayName || undefined,
    profilePictureUrl: newViewer.profilePictureUrl || undefined,
  }
}

// Authenticate user from wallet address
export async function authenticateFromWallet(walletAddress: string): Promise<AuthenticatedUser | null> {
  // Try to find as streamer first
  let user = await StreamerModel.findByWalletAddress(walletAddress)

  if (user) {
    return {
      id: user.id,
      type: 'streamer',
      walletAddress: user.baseWalletAddress,
      farcasterUsername: user.farcasterUsername,
      displayName: user.displayName,
      profilePictureUrl: user.profilePictureUrl || undefined,
    }
  }

  // Try to find as viewer
  user = await ViewerModel.findByWalletAddress(walletAddress)

  if (user) {
    return {
      id: user.id,
      type: 'viewer',
      walletAddress: user.baseWalletAddress,
      farcasterUsername: user.farcasterUsername || undefined,
      displayName: user.displayName || undefined,
      profilePictureUrl: user.profilePictureUrl || undefined,
    }
  }

  // Create new viewer if not found
  const newViewer = await ViewerModel.createOrUpdate({
    baseWalletAddress: walletAddress,
  })

  return {
    id: newViewer.id,
    type: 'viewer',
    walletAddress: newViewer.baseWalletAddress,
    farcasterUsername: newViewer.farcasterUsername || undefined,
    displayName: newViewer.displayName || undefined,
    profilePictureUrl: newViewer.profilePictureUrl || undefined,
  }
}

// Middleware helper to get authenticated user from request
export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  const payload = verifyToken(token)

  if (!payload) {
    return null
  }

  // Verify user still exists
  if (payload.type === 'streamer') {
    const user = await StreamerModel.findByWalletAddress(payload.walletAddress)
    if (!user) return null

    return {
      id: user.id,
      type: 'streamer',
      walletAddress: user.baseWalletAddress,
      farcasterUsername: user.farcasterUsername,
      displayName: user.displayName,
      profilePictureUrl: user.profilePictureUrl || undefined,
    }
  } else {
    const user = await ViewerModel.findByWalletAddress(payload.walletAddress)
    if (!user) return null

    return {
      id: user.id,
      type: 'viewer',
      walletAddress: user.baseWalletAddress,
      farcasterUsername: user.farcasterUsername || undefined,
      displayName: user.displayName || undefined,
      profilePictureUrl: user.profilePictureUrl || undefined,
    }
  }
}

// Check if user has permission for an action
export function hasPermission(user: AuthenticatedUser, requiredType: 'viewer' | 'streamer' | 'both'): boolean {
  if (requiredType === 'both') return true
  return user.type === requiredType
}

