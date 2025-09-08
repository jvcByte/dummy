import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { celoAlfajores } from 'viem/chains'

export const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http()
})

export const walletClient = createWalletClient({
    chain: celoAlfajores,
    transport: custom((window as any).ethereum),
})  