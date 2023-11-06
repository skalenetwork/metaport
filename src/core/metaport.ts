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
 * @file metaport.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Provider, JsonRpcProvider, Contract } from 'ethers'

import {
  MetaportConfig,
  TokenDataTypesMap,
  Token,
  TokenContractsMap,
  TokenBalancesMap
} from './interfaces'
import { TokenType, TokenData, CustomAbiTokenType } from './dataclasses'

import { getEmptyTokenDataMap } from './tokens/helper'
import { getStepsMetadata } from '../core/transfer_steps'
import { getChainEndpoint, initIMA, initMainnet, initSChain } from './network'
import { MetaportState } from '../store/MetaportState'
import { ERC_ABIS } from './contracts'

import debug from 'debug'
import { MainnetChain, SChain } from '@skalenetwork/ima-js'
import { MAINNET_CHAIN_NAME } from './constants'

const log = debug('ima:test:MainnetChain')

export const createTokenData = (
  tokenKeyname: string,
  chainName: string,
  tokenType: TokenType,
  config: MetaportConfig
): TokenData => {
  const configToken: Token = config.connections[chainName][tokenType][tokenKeyname]
  return new TokenData(
    configToken.address,
    tokenType,
    tokenKeyname,
    config.tokens[tokenKeyname],
    configToken.chains,
    chainName
  )
}

export const addTokenData = (
  tokenKeyname: string,
  chainName: string,
  tokenType: TokenType,
  config: MetaportConfig,
  tokens: TokenDataTypesMap
) => {
  tokens[tokenType][tokenKeyname] = createTokenData(tokenKeyname, chainName, tokenType, config)
}

export const createTokensMap = (
  chainName1: string,
  chainName2: string | null,
  config: MetaportConfig
): TokenDataTypesMap => {
  const tokens = getEmptyTokenDataMap()
  log(`updating tokens map for ${chainName1} -> ${chainName2}`)
  if (chainName1) {
    Object.values(TokenType).forEach((tokenType) => {
      if (config.connections[chainName1][tokenType]) {
        Object.keys(config.connections[chainName1][tokenType]).forEach((tokenKeyname) => {
          const tokenInfo = config.connections[chainName1][tokenType][tokenKeyname]
          if (!chainName2 || (chainName2 && tokenInfo.chains.hasOwnProperty(chainName2))) {
            addTokenData(tokenKeyname, chainName1, tokenType as TokenType, config, tokens)
          }
        })
      }
    })
  }
  return tokens
}

export function createWrappedTokensMap(
  chainName1: string,
  config: MetaportConfig
): TokenDataTypesMap {
  const wrappedTokens: TokenDataTypesMap = getEmptyTokenDataMap()
  const tokenType = TokenType.erc20
  if (!chainName1 || !config.connections[chainName1][tokenType]) return wrappedTokens
  Object.keys(config.connections[chainName1][tokenType]).forEach((tokenKeyname) => {
    const token = config.connections[chainName1][tokenType][tokenKeyname]
    const wrapperAddress = findFirstWrapperAddress(token)
    if (wrapperAddress) {
      addTokenData(tokenKeyname, chainName1, tokenType as TokenType, config, wrappedTokens)
    }
  })
  const ethToken = config.connections[chainName1].eth?.eth
  if (ethToken) {
    const wrapperAddress = findFirstWrapperAddress(ethToken)
    if (wrapperAddress) {
      addTokenData('eth', chainName1, TokenType.eth, config, wrappedTokens)
    }
  }
  return wrappedTokens
}

const findFirstWrapperAddress = (token: Token): `0x${string}` | null =>
  Object.values(token.chains).find((chain) => 'wrapper' in chain)?.wrapper || null

export const findFirstWrapperChainName = (token: TokenData): string | null => {
  for (const [chainName, chain] of Object.entries(token.connections)) {
    if (chain.wrapper) {
      return chainName
    }
  }
  return null
}

export default class MetaportCore {
  private _config: MetaportConfig

  constructor(config: MetaportConfig) {
    this._config = config
  }

  get config(): MetaportConfig {
    return this._config
  }

  /**
   * Generates available tokens for a given chain or a pair of the chains.
   *
   * @param {string} from - Source chain name.
   * @param {string | null} [to] - Destination chain name.
   *
   * @returns {TokenDataTypesMap} - Returns a map of token data types for the given chains.
   *
   * @example
   *
   * // To get tokens for 'a' -> 'b'
   * const tokens = mpc.tokens('a', 'b');
   *
   * // To get all tokens from 'a'
   * const tokens = mpc.tokens('a');
   */
  tokens(from: string, to?: string | null): TokenDataTypesMap {
    if (from === undefined || from === null || from === '') return getEmptyTokenDataMap()
    return createTokensMap(from, to, this._config)
  }

  wrappedTokens(chainName: string): TokenDataTypesMap {
    return createWrappedTokensMap(chainName, this._config)
  }

  async tokenBalance(tokenContract: Contract, address: string): Promise<bigint> {
    return await tokenContract.balanceOf(address)
  }

  async tokenBalances(
    tokenContracts: TokenContractsMap,
    address: string
  ): Promise<TokenBalancesMap> {
    const balances: TokenBalancesMap = {}
    const tokenKeynames = Object.keys(tokenContracts)
    for (const tokenKeyname of tokenKeynames) {
      balances[tokenKeyname] = await tokenContracts[tokenKeyname].balanceOf(address)
    }
    return balances
  }

  tokenContracts(
    tokens: TokenDataTypesMap,
    tokenType: TokenType,
    chainName: string,
    provider: Provider,
    customAbiTokenType?: CustomAbiTokenType
  ): TokenContractsMap {
    const contracts: TokenContractsMap = {}
    if (tokens[tokenType]) {
      Object.keys(tokens[tokenType]).forEach((tokenKeyname) => {
        let destChainName
        if (customAbiTokenType === CustomAbiTokenType.erc20wrap) {
          destChainName = findFirstWrapperChainName(tokens[tokenType][tokenKeyname])
          if (!destChainName) return
        }
        contracts[tokenKeyname] = this.tokenContract(
          chainName,
          tokenKeyname,
          tokenType,
          provider,
          customAbiTokenType,
          destChainName
        )
      })
    }
    return contracts
  }

  tokenContract(
    chainName: string,
    tokenKeyname: string,
    tokenType: TokenType,
    provider: Provider,
    customAbiTokenType?: CustomAbiTokenType,
    destChainName?: string
  ): Contract | undefined {
    const token = this._config.connections[chainName][tokenType][tokenKeyname]
    if (!token.address) return
    const abi = customAbiTokenType ? ERC_ABIS[customAbiTokenType].abi : ERC_ABIS[tokenType].abi
    const address = customAbiTokenType ? token.chains[destChainName].wrapper : token.address
    // TODO: add sFUEL address support!
    return new Contract(address, abi, provider)
  }

  originAddress(
    chainName1: string,
    chainName2: string,
    tokenKeyname: string,
    tokenType: TokenType
  ) {
    let token = this._config.connections[chainName1][tokenType][tokenKeyname]
    const isClone = token.chains[chainName2].clone
    if (isClone) {
      token = this._config.connections[chainName2][tokenType][tokenKeyname]
    }
    return token.chains[isClone ? chainName1 : chainName2].wrapper ?? token.address
  }

  endpoint(chainName: string): string {
    return getChainEndpoint(this._config.mainnetEndpoint, this._config.skaleNetwork, chainName)
  }

  ima(chainName: string): MainnetChain | SChain {
    return initIMA(this._config.mainnetEndpoint, this._config.skaleNetwork, chainName)
  }

  mainnet(): MainnetChain {
    return initMainnet(this._config.mainnetEndpoint, this._config.skaleNetwork)
  }

  schain(chainName: string): SChain {
    return initSChain(this._config.skaleNetwork, chainName)
  }

  provider(chainName: string): Provider {
    return new JsonRpcProvider(this.endpoint(chainName))
  }

  tokenChanged(
    chainName1: string,
    ima2: MainnetChain | SChain,
    token: TokenData | null | undefined,
    destChainName?: string
  ): Partial<MetaportState> {
    if (token === undefined || token === null)
      return {
        token: null,
        destTokenContract: null,
        destTokenBalance: null,
        stepsMetadata: [],
        amount: '',
        currentStep: 0
      }
    let destTokenContract
    if (destChainName) {
      destTokenContract = this.tokenContract(
        destChainName,
        token.keyname,
        token.type,
        ima2.provider,
        null,
        chainName1
      )
    }
    return {
      token,
      stepsMetadata: getStepsMetadata(this.config, token, destChainName),
      destTokenContract,
      destTokenBalance: null,
      destChains: Object.keys(token.connections),
      amount: '',
      currentStep: 0
    }
  }

  chainChanged(
    chainName1: string,
    chainName2: string,
    prevToken: TokenData
  ): Partial<MetaportState> {
    const ima1 = this.ima(chainName1)
    const ima2 = this.ima(chainName2)
    const tokens = this.tokens(chainName1, chainName2)
    const tokenContracts = this.tokenContracts(tokens, TokenType.erc20, chainName1, ima1.provider)

    const wrappedTokenContracts = this.tokenContracts(
      tokens,
      TokenType.erc20,
      chainName1,
      ima1.provider,
      CustomAbiTokenType.erc20wrap
    )

    if (tokens.eth?.eth && chainName1 !== MAINNET_CHAIN_NAME) {
      tokenContracts.eth = this.tokenContract(chainName1, 'eth', TokenType.eth, ima1.provider)

      const destChainName = findFirstWrapperChainName(tokens.eth.eth)
      if (destChainName) {
        wrappedTokenContracts.eth = this.tokenContract(
          chainName1,
          'eth',
          TokenType.eth,
          ima1.provider,
          CustomAbiTokenType.erc20wrap,
          destChainName
        )
      }
    }

    const prevTokenKeyname = prevToken?.keyname
    const prevTokenType = prevToken?.type
    const token =
      prevTokenKeyname && tokens[prevTokenType][prevTokenKeyname]
        ? tokens[prevTokenType][prevTokenKeyname]
        : null

    return {
      ima1,
      ima2,
      chainName1,
      chainName2,

      destChains: this.config.chains,
      destTokenContract: null,
      destTokenBalance: null,

      ...this.tokenChanged(chainName1, ima2, token, chainName2),
      tokens,
      tokenContracts,
      tokenBalances: {},

      wrappedTokens: this.wrappedTokens(chainName1),
      wrappedTokenContracts,
      wrappedTokenBalances: {},

      currentStep: 0
    }
  }
}
