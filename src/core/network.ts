/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file network.ts
 * @copyright SKALE Labs 2023-Present
 */

import debug from 'debug'
import { MainnetChain, SChain } from '@skalenetwork/ima-js'
import { JsonRpcProvider, Provider } from 'ethers'

import { WalletClient } from 'viem'
import { Chain } from '@wagmi/core'

import proxyEndpoints from '../metadata/proxy.json'
import { MAINNET_CHAIN_NAME } from './constants'
import { IMA_ADDRESSES, IMA_ABIS } from './contracts'
import { SkaleNetwork } from './interfaces'
import { constructWagmiChain } from './wagmi_network'

export { proxyEndpoints as PROXY_ENDPOINTS }

debug.enable('*')
const log = debug('metaport:core:network')

const PROTOCOL: { [protocol in 'http' | 'ws']: string } = {
  http: 'https://',
  ws: 'wss://'
}

export const CHAIN_IDS: { [network in SkaleNetwork]: number } = {
  staging: 5,
  legacy: 5,
  regression: 5,
  mainnet: 5
}

export function isMainnetChainId(chainId: number | BigInt, skaleNetwork: SkaleNetwork): boolean {
  return Number(chainId) === CHAIN_IDS[skaleNetwork]
}

export function getChainEndpoint(
  mainnetEndpoint: string,
  network: SkaleNetwork,
  chainName: string
): string {
  if (chainName === MAINNET_CHAIN_NAME) return mainnetEndpoint
  return getSChainEndpoint(network, chainName)
}

export function getSChainEndpoint(
  network: SkaleNetwork,
  sChainName: string,
  protocol: 'http' | 'ws' = 'http'
): string {
  return (
    PROTOCOL[protocol] +
    getProxyEndpoint(network) +
    '/v1/' +
    (protocol === 'ws' ? 'ws/' : '') +
    sChainName
  )
}

function getProxyEndpoint(network: SkaleNetwork) {
  return proxyEndpoints[network]
}

export function getMainnetAbi(network: string) {
  if (network === 'staging') {
    return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.staging }
  }
  if (network === 'legacy') {
    return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.legacy }
  }
  if (network === 'regression') {
    return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.regression }
  }
  return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.mainnet }
}

export function initIMA(
  mainnetEndpoint: string,
  network: SkaleNetwork,
  chainName: string
): MainnetChain | SChain {
  if (chainName === MAINNET_CHAIN_NAME) return initMainnet(mainnetEndpoint, network)
  return initSChain(network, chainName)
}

export function initMainnet(mainnetEndpoint: string, network: string): MainnetChain {
  const provider = new JsonRpcProvider(mainnetEndpoint)
  return new MainnetChain(provider, getMainnetAbi(network))
}

export function initSChain(network: SkaleNetwork, chainName: string): SChain {
  const endpoint = getChainEndpoint(null, network, chainName)
  const provider = new JsonRpcProvider(endpoint)
  return new SChain(provider, IMA_ABIS.schain)
}

export async function enforceNetwork(
  provider: Provider,
  walletClient: WalletClient,
  switchNetwork: (chainId: number | bigint) => Promise<Chain | undefined>,
  skaleNetwork: SkaleNetwork,
  chainName: string
): Promise<bigint> {
  const currentChainId = walletClient.chain.id
  const { chainId } = await provider.getNetwork()
  log(`Current chainId: ${currentChainId}, required chainId: ${chainId} `)
  if (currentChainId !== Number(chainId)) {
    log(`Switching network to ${chainId}...`)
    if (chainId !== 1n && chainId !== 5n) {
      await walletClient.addChain({ chain: constructWagmiChain(skaleNetwork, chainName) })
    } else {
      const chain = await switchNetwork(Number(chainId))
      if (!chain) {
        throw new Error(`Failed to switch from ${currentChainId} to ${chainId} `)
      }
    }
    log(`Network switched to ${chainId}...`)
  }
  return chainId
}
