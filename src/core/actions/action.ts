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
 * @file action.ts
 * @copyright SKALE Labs 2022-Present
 */

import debug from 'debug'

import { Chain } from '@wagmi/core'
import { WalletClient } from 'viem'
import { Contract, Provider } from 'ethers'

import { MainnetChain, SChain } from '@skalenetwork/ima-js'
import { TokenData, CustomAbiTokenType } from '../dataclasses'
import MetaportCore, { createTokenData } from '../metaport'
import { externalEvents } from '../events'
import { toWei } from '../convertation'
import { ActionState, LOADING_BUTTON_TEXT } from './actionState'
import { isMainnet } from '../helper'

import { IMA_ABIS } from '../contracts'
import { isMainnetChainId, getMainnetAbi } from '../network'

import { walletClientToSigner } from '../ethers'

debug.enable('*')
const log = debug('metaport:actions')

export type ActionType = typeof Action

export class Action {
  execute(): void {
    return
  }
  preAction(): void {
    return
  }

  mpc: MetaportCore

  mainnet: MainnetChain
  sChain1: SChain
  sChain2: SChain

  chainName1: string
  chainName2: string
  address: string
  amount: string
  amountWei: bigint
  tokenId: number
  token: TokenData

  walletClient: WalletClient

  sourceToken: Contract
  destToken: Contract
  unwrappedToken: Contract | undefined

  originAddress: string

  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>

  setAmountErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setBtnText: (btnText: string) => void

  _switchNetwork: (chainId: number | bigint) => Chain | undefined

  constructor(
    mpc: MetaportCore,
    // mainnet: MainnetChain,
    // sChain1: SChain,
    // sChain2: SChain,
    chainName1: string,
    chainName2: string,
    address: string,
    amount: string,
    tokenId: number,
    token: TokenData,
    setAmountErrorMessage: (amountErrorMessage: string) => void,
    setBtnText: (btnText: string) => void,
    switchNetwork: (chainId: number | bigint) => Chain | undefined,
    walletClient: WalletClient,
  ) {
    this.mpc = mpc
    // this.mainnet = mainnet;
    // this.sChain1 = sChain1;
    // this.sChain2 = sChain2;
    this.chainName1 = chainName1
    this.chainName2 = chainName2
    this.address = address
    this.amount = amount
    if (amount) this.amountWei = toWei(amount, token.meta.decimals)
    this.tokenId = Number(tokenId)

    this.token = createTokenData(token.keyname, chainName1, token.type, this.mpc.config)
    //! todo: init token here!!!!!, do not pass !!!

    // todo: init token contracts!

    if (isMainnet(chainName1)) {
      this.mainnet = this.mpc.mainnet()
    } else {
      this.sChain1 = this.mpc.schain(this.chainName1)
    }
    if (isMainnet(chainName2)) {
      this.mainnet = this.mpc.mainnet()
    } else {
      this.sChain2 = this.mpc.schain(this.chainName2)
    }

    const provider1 = isMainnet(chainName1) ? this.mainnet.provider : this.sChain1.provider
    const provider2 = isMainnet(chainName2) ? this.mainnet.provider : this.sChain2.provider

    this.sourceToken = mpc.tokenContract(
      chainName1,
      token.keyname,
      token.type,
      provider1,
      this.token.wrapper(this.chainName2) ? CustomAbiTokenType.erc20wrap : null,
      this.token.wrapper(this.chainName2) ? this.chainName2 : null,
    )

    this.originAddress = this.mpc.originAddress(chainName1, chainName2, token.keyname, token.type)

    if (this.token.wrapper(this.chainName2)) {
      this.unwrappedToken = mpc.tokenContract(chainName1, token.keyname, token.type, provider1)
    }

    // todo: use wrapper address!
    const destWrapperAddress =
      this.mpc.config.connections[this.chainName2][this.token.type][this.token.keyname].chains[this.chainName1].wrapper
    if (this.token.isClone(this.chainName2) && destWrapperAddress) {
      this.destToken = mpc.tokenContract(
        chainName2,
        token.keyname,
        token.type,
        provider2,
        CustomAbiTokenType.erc20wrap,
        this.chainName1,
      )
    } else {
      this.destToken = mpc.tokenContract(chainName2, token.keyname, token.type, provider2)
    }

    // this.switchMetamaskChain = switchMetamaskChain;

    // this.setActiveStep = setActiveStep;
    // this.activeStep = activeStep;

    this.setAmountErrorMessage = setAmountErrorMessage
    this.setBtnText = setBtnText
    this._switchNetwork = switchNetwork
    this.walletClient = walletClient

    // if (this.tokenData) this.wrap = !!this.token.unwrappedSymbol && !this.token.clone;
  }

  // tokenContract(
  //     provider: Provider,
  //     source: boolean = true
  // ): Contract {
  //     return this.mpc.tokenContract(
  //         source ? this.chainName1 : this.chainName2,
  //         this.token.keyname,
  //         this.token.type,
  //         provider
  //     )
  // }

  updateState(currentState: ActionState, transactionHash?: string, timestamp?: string | number) {
    log(`actionStateUpd: ${this.constructor.name} - ${currentState} - ${this.token.keyname} \
- ${this.chainName1} -> ${this.chainName2}`)
    externalEvents.actionStateUpdated(
      this.constructor.name,
      currentState,
      {
        chainName1: this.chainName1,
        chainName2: this.chainName2,
        address: this.address,
        amount: this.amount,
        amountWei: this.amountWei,
        tokenId: this.tokenId,
      },
      transactionHash,
      timestamp,
    )
    this.setBtnText(LOADING_BUTTON_TEXT[currentState])
  }

  async getConnectedChain(
    provider: Provider,
    customAbiTokenType?: CustomAbiTokenType,
    destChainName?: string,
  ): Promise<MainnetChain | SChain> {
    let chain: MainnetChain | SChain
    this.updateState('switch')
    const currentChainId = this.walletClient.chain.id
    const { chainId } = await provider.getNetwork()
    log(`Current chainId: ${currentChainId}, required chainId: ${chainId} `)
    if (currentChainId !== Number(chainId)) {
      log(`Switching network to ${chainId}...`)
      const chain = await this._switchNetwork(Number(chainId))
      if (!chain) {
        throw new Error(`Failed to switch from ${currentChainId} to ${chainId} `)
      }
      log(`Network switched to ${chainId}...`)
    }
    const signer = walletClientToSigner(this.walletClient)
    if (isMainnetChainId(chainId, this.mpc.config.skaleNetwork)) {
      chain = new MainnetChain(signer.provider, getMainnetAbi(this.mpc.config.skaleNetwork))
    } else {
      chain = new SChain(signer.provider, IMA_ABIS.schain)
    }
    const token = this.mpc.tokenContract(
      destChainName === this.chainName1 ? this.chainName2 : this.chainName1,
      this.token.keyname,
      this.token.type,
      chain.provider,
      customAbiTokenType,
      destChainName,
    )
    chain.erc20.addToken(this.token.keyname, token)
    return chain
  }
}

export abstract class TransferAction extends Action {
  transferComplete(tx): void {
    externalEvents.transferComplete(tx, this.chainName1, this.chainName2, this.token.keyname, false)
  }
}
