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

import { MetaportConfig, TokenDataTypesMap, Token, TokenContractsMap, TokenBalancesMap } from './interfaces'
import { TokenType, TokenData, CustomAbiTokenType } from './dataclasses'

import { getEmptyTokenDataMap } from './tokens/helper'
import { getChainEndpoint, initIMA, initMainnet, initSChain } from './network'
import { ERC_ABIS } from './contracts'

import debug from 'debug'
import { MainnetChain, SChain } from '@skalenetwork/ima-js'

const log = debug('ima:test:MainnetChain')

export const createTokenData = (
  tokenKeyname: string,
  chainName: string,
  tokenType: TokenType,
  config: MetaportConfig,
): TokenData => {
  const configToken: Token = config.connections[chainName][tokenType][tokenKeyname]
  return new TokenData(
    configToken.address,
    tokenType,
    tokenKeyname,
    config.tokens[tokenKeyname],
    configToken.chains,
    chainName,
  )
}

export const addTokenData = (
  tokenKeyname: string,
  chainName: string,
  tokenType: TokenType,
  config: MetaportConfig,
  tokens: TokenDataTypesMap,
) => {
  tokens[tokenType][tokenKeyname] = createTokenData(tokenKeyname, chainName, tokenType, config)
}

export const createTokensMap = (
  chainName1: string,
  chainName2: string | null | undefined,
  config: MetaportConfig,
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

  async tokenBalance(tokenContract: Contract, address: string): Promise<bigint> {
    return await tokenContract.balanceOf(address)
  }

  async tokenBalances(tokenContracts: TokenContractsMap, address: string): Promise<TokenBalancesMap> {
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
  ): TokenContractsMap {
    const contracts: TokenContractsMap = {}
    if (tokens[tokenType]) {
      Object.keys(tokens[tokenType]).forEach((tokenKeyname) => {
        contracts[tokenKeyname] = this.tokenContract(chainName, tokenKeyname, tokenType, provider)
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
    destChainName?: string,
  ): Contract {
    const token = this._config.connections[chainName][tokenType][tokenKeyname]
    const abi = customAbiTokenType ? ERC_ABIS[customAbiTokenType].abi : ERC_ABIS[tokenType].abi
    const address = customAbiTokenType ? token.chains[destChainName].wrapper : token.address
    // TODO: add sFUEL address support!
    return new Contract(address, abi, provider)
  }

  originAddress(chainName1: string, chainName2: string, tokenKeyname: string, tokenType: TokenType) {
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
}
