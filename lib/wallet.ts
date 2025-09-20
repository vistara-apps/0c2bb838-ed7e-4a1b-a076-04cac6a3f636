import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import { createWalletClient, custom, http, parseEther, formatEther } from 'viem'
import { base } from 'viem/chains'

// Coinbase Wallet SDK configuration
const coinbaseWallet = new CoinbaseWalletSDK({
  appName: 'StreamSpark',
  appLogoUrl: 'https://streamspark.app/logo.png',
  darkMode: false,
  overrideIsMetaMask: false,
})

// Get wallet provider
export function getWalletProvider() {
  return coinbaseWallet.makeWeb3Provider({
    options: 'all',
  })
}

// Create wallet client for Base network
export function createBaseWalletClient(provider: any) {
  return createWalletClient({
    chain: base,
    transport: custom(provider),
  })
}

// Transaction types
export interface TipTransaction {
  to: `0x${string}`
  value: bigint
  data?: `0x${string}`
}

export interface SubscriptionTransaction extends TipTransaction {
  recurring: boolean
  frequency: 'weekly' | 'monthly'
}

// Send tip transaction
export async function sendTip(
  walletClient: any,
  to: string,
  amount: number,
  message?: string
): Promise<{ hash: string }> {
  try {
    // Convert amount to wei
    const value = parseEther(amount.toString())

    // Prepare transaction
    const tx: TipTransaction = {
      to: to as `0x${string}`,
      value,
    }

    // Send transaction
    const hash = await walletClient.sendTransaction(tx)

    return { hash }
  } catch (error) {
    console.error('Error sending tip:', error)
    throw new Error('Failed to send tip transaction')
  }
}

// Send subscription transaction
export async function sendSubscription(
  walletClient: any,
  to: string,
  amount: number,
  frequency: 'weekly' | 'monthly'
): Promise<{ hash: string }> {
  try {
    // For subscriptions, we send the first payment
    // Future payments would be handled by a smart contract or backend service
    const value = parseEther(amount.toString())

    const tx: SubscriptionTransaction = {
      to: to as `0x${string}`,
      value,
      recurring: true,
      frequency,
    }

    const hash = await walletClient.sendTransaction(tx)

    return { hash }
  } catch (error) {
    console.error('Error sending subscription:', error)
    throw new Error('Failed to send subscription transaction')
  }
}

// Get wallet balance
export async function getWalletBalance(walletClient: any, address: string): Promise<string> {
  try {
    const balance = await walletClient.getBalance({
      address: address as `0x${string}`,
    })

    return formatEther(balance)
  } catch (error) {
    console.error('Error getting balance:', error)
    throw new Error('Failed to get wallet balance')
  }
}

// Estimate gas for transaction
export async function estimateGas(
  walletClient: any,
  to: string,
  amount: number
): Promise<bigint> {
  try {
    const value = parseEther(amount.toString())

    const gasEstimate = await walletClient.estimateGas({
      to: to as `0x${string}`,
      value,
    })

    return gasEstimate
  } catch (error) {
    console.error('Error estimating gas:', error)
    throw new Error('Failed to estimate gas')
  }
}

// Get current gas price
export async function getGasPrice(walletClient: any): Promise<string> {
  try {
    const gasPrice = await walletClient.getGasPrice()
    return formatEther(gasPrice)
  } catch (error) {
    console.error('Error getting gas price:', error)
    throw new Error('Failed to get gas price')
  }
}

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Format address for display
export function formatAddress(address: string): string {
  if (!isValidAddress(address)) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Get transaction URL on Base explorer
export function getTransactionUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`
}

// Get address URL on Base explorer
export function getAddressUrl(address: string): string {
  return `https://basescan.org/address/${address}`
}

