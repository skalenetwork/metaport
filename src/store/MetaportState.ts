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
 * @file MetaportState.ts
 * @copyright SKALE Labs 2023-Present
 */

import debug from 'debug'

import { Contract } from 'ethers';

import { MainnetChain, SChain } from '@skalenetwork/ima-js'
import { create } from 'zustand'

import MetaportCore from '../core/metaport'
import * as interfaces from '../core/interfaces'
import * as dataclasses from '../core/dataclasses'
import { getEmptyTokenDataMap } from '../core/tokens/helper'
import { MAINNET_CHAIN_NAME, DEFAULT_ERROR_MSG } from '../core/constants'
import { getStepsMetadata } from '../core/transfer_steps'
import { ACTIONS } from '../core/actions'
import { WalletClient } from 'viem'

debug.enable('*')
const log = debug('metaport:state')

interface MetaportState {
  mainnetChain: MainnetChain
  setMainnetChain: (mainnet: MainnetChain) => void
  sChain1: SChain
  setSChain1: (schain: SChain) => void
  sChain2: SChain
  setSChain2: (schain: SChain) => void

  mpc: MetaportCore
  setMpc: (mpc: MetaportCore) => void

  amount: string
  setAmount: (amount: string, address: `0x${string}`) => void

  tokenId: number
  setTokenId: (tokenId: number) => void

  execute: (address: string, switchNetwork: (chainId: number) => void, walletClient: WalletClient) => void
  check: (amount: string, address: `0x${string}`) => void

  currentStep: number
  setCurrentStep: (currentStep: number) => void

  stepsMetadata: dataclasses.StepMetadata[]
  setStepsMetadata: (steps: dataclasses.StepMetadata[]) => void

  chainName1: string
  chainName2: string

  setChainName1: (name: string) => void
  setChainName2: (name: string) => void

  tokens: interfaces.TokenDataTypesMap

  token: dataclasses.TokenData
  setToken: (token: dataclasses.TokenData) => void

  tokenContracts: interfaces.TokenContractsMap
  tokenBalances: interfaces.TokenBalancesMap
  updateTokenBalances: (address: string) => Promise<void>

  destTokenContract: Contract
  destTokenBalance: bigint
  updateDestTokenBalance: (address: string) => Promise<void>

  amountErrorMessage: string
  setAmountErrorMessage: (amountErrorMessage: string) => void

  errorMessage: dataclasses.ErrorMessage
  setErrorMessage: (amountErrorMessage: dataclasses.ErrorMessage) => void

  actionBtnDisabled: boolean
  setActionBtnDisabled: (actionBtnDisabled: boolean) => void

  loading: boolean
  setLoading: (loading: boolean) => void

  transferInProgress: boolean
  setTransferInProgress: (loading: boolean) => void

  btnText: string
  setBtnText: (btnText: string) => void

  errorMessageClosedFallback: () => void
  startOver: () => void
}

export const useMetaportStore = create<MetaportState>()((set, get) => ({
  mainnetChain: null,
  setMainnetChain: (mainnet: MainnetChain) => set(() => ({ mainnetChain: mainnet })),

  sChain1: null,
  setSChain1: (schain: SChain) => set(() => ({ sChain1: schain })),

  sChain2: null,
  setSChain2: (schain: SChain) => set(() => ({ sChain2: schain })),

  mpc: null,
  setMpc: (mpc: MetaportCore) => set(() => ({ mpc: mpc })),

  tokenId: null,
  setTokenId: (tokenId: number) =>
    set(() => {
      return {
        tokenId: tokenId,
      }
    }),

  amount: '',
  setAmount: (amount: string, address: `0x${string}`) =>
    set((state) => {
      state.check(amount, address)
      return {
        amount: amount,
      }
    }),

  execute: async (address: string, switchNetwork: any, walletClient: WalletClient) => {
    log('Running execute')
    if (get().stepsMetadata[get().currentStep]) {
      set({
        loading: true,
        transferInProgress: true,
      })
      try {
        const stepMetadata = get().stepsMetadata[get().currentStep]
        const actionClass = ACTIONS[stepMetadata.type]
        await new actionClass(
          get().mpc,
          stepMetadata.from,
          stepMetadata.to,
          address,
          get().amount,
          get().tokenId,
          get().token,
          get().setAmountErrorMessage,
          get().setBtnText,
          switchNetwork,
          walletClient,
        ).execute()
      } catch (err) {
        console.error(err)
        const msg = err.message ? err.message : DEFAULT_ERROR_MSG
        set({
          errorMessage: new dataclasses.TransactionErrorMessage(msg, get().errorMessageClosedFallback),
        })
        return
      } finally {
        set({ loading: false })
      }
      set({
        transferInProgress: get().currentStep + 1 !== get().stepsMetadata.length,
        currentStep: get().currentStep + 1,
      })
    }
  },

  errorMessageClosedFallback() {
    set({
      loading: false,
      errorMessage: undefined,
      transferInProgress: get().currentStep !== 0,
    })
  },

  startOver() {
    set({
      loading: false,
      errorMessage: undefined,
      amount: '',
      tokenId: null,
      currentStep: 0,
      transferInProgress: false,
    })
  },

  check: async (amount: string, address: string) => {
    if (get().stepsMetadata[get().currentStep]) {
      set({
        loading: true,
        btnText: 'Checking balance...',
      })
      const stepMetadata = get().stepsMetadata[get().currentStep]
      const actionClass = ACTIONS[stepMetadata.type]
      await new actionClass(
        get().mpc,
        stepMetadata.from,
        stepMetadata.to,
        address,
        amount,
        get().tokenId,
        get().token,
        get().setAmountErrorMessage,
        get().setBtnText,
        null,
        null,
      ).preAction()
      // console.log();
      // console.log('going to check amount!!!');
    }
    set({ loading: false })
  },

  currentStep: 0,
  setCurrentStep: (currentStep: number) => set(() => ({ currentStep: currentStep })),

  stepsMetadata: [],
  setStepsMetadata: (steps: dataclasses.StepMetadata[]) => set(() => ({ stepsMetadata: steps })),

  chainName1: '',
  chainName2: '',

  setChainName1: (name: string) =>
    set((state) => {
      // updateState(
      //     name,
      //     state.chainName2
      // )

      const updState = {}
      if (name === MAINNET_CHAIN_NAME) {
        updState['mainnetChain'] = state.mpc.mainnet()
      } else {
        updState['sChain1'] = state.mpc.schain(name)
      }
      const provider = updState['mainnetChain'] ? updState['mainnetChain'].provider : updState['sChain1'].provider
      const tokens = state.mpc.tokens(name)
      const tokenContracts = state.mpc.tokenContracts(tokens, dataclasses.TokenType.erc20, name, provider)
      return {
        currentStep: 0,
        token: null,
        chainName1: name,
        tokens: tokens,
        tokenContracts: tokenContracts,
        ...updState,
      }
    }),
  setChainName2: (name: string) =>
    set((state) => {
      const updState = {}
      if (name === MAINNET_CHAIN_NAME) {
        updState['mainnetChain'] = state.mpc.mainnet()
      } else {
        updState['sChain2'] = state.mpc.schain(name)
      }
      return {
        currentStep: 0,
        token: null,
        chainName2: name,
        tokens: state.mpc.tokens(state.chainName1, name),
        stepsMetadata: getStepsMetadata(get().mpc.config, get().token, name),
        ...updState,
      }
    }),

  tokens: getEmptyTokenDataMap(),

  token: null,

  setToken: async (token: dataclasses.TokenData) => {
    const provider = get().chainName2 === MAINNET_CHAIN_NAME ? get().mainnetChain.provider : get().sChain2.provider
    const destTokenContract = get().mpc.tokenContract(
      get().chainName2,
      token.keyname,
      token.type,
      provider
    )
    set({
      token: token,
      stepsMetadata: getStepsMetadata(get().mpc.config, token, get().chainName2),
      destTokenContract: destTokenContract
    })
  },

  tokenContracts: {},
  tokenBalances: {},

  destTokenContract: null,
  destTokenBalance: null,
  updateDestTokenBalance: async (address: string) => {
    const balance = await get().mpc.tokenBalance(get().destTokenContract, address)
    set({ destTokenBalance: balance })
  },

  updateTokenBalances: async (address: string) => {
    const tokenBalances = await get().mpc.tokenBalances(get().tokenContracts, address)
    set({ tokenBalances: tokenBalances })
  },

  amountErrorMessage: null,
  setAmountErrorMessage: (em: string) => set(() => ({ amountErrorMessage: em })),

  errorMessage: null,
  setErrorMessage: (em: dataclasses.ErrorMessage) => set(() => ({ errorMessage: em })),

  actionBtnDisabled: false,
  setActionBtnDisabled: (disabled: boolean) => set(() => ({ actionBtnDisabled: disabled })),

  loading: false,
  setLoading: (loading: boolean) => set(() => ({ loading: loading })),

  transferInProgress: false,
  setTransferInProgress: (inProgress: boolean) => set(() => ({ transferInProgress: inProgress })),

  btnText: null,
  setBtnText: (btnText: string) => set(() => ({ btnText: btnText })),
}))
