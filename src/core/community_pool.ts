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
 * @file community_pool.ts
 * @copyright SKALE Labs 2023-Present
 */

import debug from 'debug'
import { ethers } from 'ethers'
import { MainnetChain, SChain } from '@skalenetwork/ima-js'

import { WalletClient } from 'viem'
import { Chain } from '@wagmi/core'

import { CommunityPoolData } from './interfaces'
import { fromWei } from './convertation'
import { walletClientToSigner } from './ethers'
import {
  MAINNET_CHAIN_NAME,
  DEFAULT_ERC20_DECIMALS,
  RECHARGE_MULTIPLIER,
  MINIMUM_RECHARGE_AMOUNT,
  COMMUNITY_POOL_WITHDRAW_GAS_LIMIT,
  DEFAULT_ERROR_MSG,
} from './constants'
import { CHAIN_IDS, isMainnetChainId, getMainnetAbi } from './network'
import MetaportCore from './metaport'

import * as dataclasses from '../core/dataclasses'

debug.enable('*')
const log = debug('metaport:core:community_pool')

export function getEmptyCommunityPoolData(): CommunityPoolData {
  return {
    exitGasOk: null,
    isActive: null,
    balance: null,
    accountBalance: null,
    recommendedRechargeAmount: null,
    originalRecommendedRechargeAmount: null,
  }
}

export async function getCommunityPoolData(
  address: string,
  chainName1: string,
  chainName2: string,
  mainnet: MainnetChain,
  sChain: SChain,
): Promise<CommunityPoolData> {
  if (chainName2 !== MAINNET_CHAIN_NAME) {
    log('not a S2M transfer, skipping community pool check')
    return {
      exitGasOk: true,
      isActive: null,
      balance: null,
      accountBalance: null,
      recommendedRechargeAmount: null,
      originalRecommendedRechargeAmount: null,
    }
  }

  log('Getting community pool data', address, chainName1)
  const balanceWei = await mainnet.communityPool.balance(address, chainName1)
  const accountBalanceWei = await mainnet.ethBalance(address)
  const activeS = await sChain.communityLocker.contract.activeUsers(address)
  const chainHash = ethers.id(chainName1)
  const activeM = await mainnet.communityPool.contract.activeUsers(address, chainHash)

  const rraWei = await mainnet.communityPool.contract.getRecommendedRechargeAmount(chainHash, address)
  const rraEther = fromWei(rraWei as string, DEFAULT_ERC20_DECIMALS)

  let recommendedAmount = parseFloat(rraEther as string) * RECHARGE_MULTIPLIER
  if (recommendedAmount < MINIMUM_RECHARGE_AMOUNT) recommendedAmount = MINIMUM_RECHARGE_AMOUNT

  const communityPoolData = {
    exitGasOk: activeM && activeS && rraWei === 0n,
    isActive: activeM && activeS,
    balance: balanceWei,
    accountBalance: accountBalanceWei,
    recommendedRechargeAmount: recommendedAmount,
    originalRecommendedRechargeAmount: rraWei,
  }
  log('communityPoolData:', communityPoolData)
  return communityPoolData
}

export async function connectedMainnetChain(
  mpc: MetaportCore,
  walletClient: WalletClient,
  switchNetwork: (chainId: number | bigint) => Promise<Chain | undefined>,
): Promise<MainnetChain> {
  const currentChainId = walletClient.chain.id
  const chainId = CHAIN_IDS[mpc.config.skaleNetwork]
  log(`Current chainId: ${currentChainId}, required chainId: ${chainId} `)
  if (currentChainId !== Number(chainId)) {
    log(`Switching network to ${chainId}...`)
    const chain = await switchNetwork(Number(chainId))
    if (!chain) {
      throw new Error(`Failed to switch from ${currentChainId} to ${chainId} `)
    }
    log(`Network switched to ${chainId}...`)
  }
  const signer = walletClientToSigner(walletClient)
  return new MainnetChain(signer.provider, getMainnetAbi(mpc.config.skaleNetwork))
}

export async function withdraw(
  mpc: MetaportCore,
  walletClient: WalletClient,
  chainName: string,
  amount: bigint,
  address: `0x${string}`,
  switchNetwork: (chainId: number | bigint) => Promise<Chain | undefined>,
  setLoading: (loading: string | false) => void,
  setErrorMessage: (errorMessage: dataclasses.ErrorMessage) => void,
  errorMessageClosedFallback: () => void,
) {
  setLoading('withdraw')
  try {
    log(`Withdrawing from community pool: ${chainName}, amount: ${amount}`)
    const mainnetMetamask = await connectedMainnetChain(mpc, walletClient, switchNetwork)
    await mainnetMetamask.communityPool.withdraw(chainName, amount, {
      address: address,
      customGasLimit: COMMUNITY_POOL_WITHDRAW_GAS_LIMIT,
    })
    setLoading(false)
  } catch (err) {
    console.error(err)
    const msg = err.message ? err.message : DEFAULT_ERROR_MSG
    setErrorMessage(new dataclasses.TransactionErrorMessage(msg, errorMessageClosedFallback))
  }
}

// async function rechargeCommunityPool() {
//     // todo: optimize
//     setLoadingCommunityPool('recharge');
//     try {
//         log('Recharging community pool...')
//         const sChain = initSChain(
//             props.config.skaleNetwork,
//             chainName1
//         );
//         const mainnetMetamask = await initMainnet1();
//         setChainId(getChainId(props.config.skaleNetwork, MAINNET_CHAIN_NAME));
//         await mainnetMetamask.communityPool.recharge(chainName1, address, {
//             address: address,
//             value: toWei(rechargeAmount, DEFAULT_ERC20_DECIMALS)
//         });
//         setLoadingCommunityPool('activate');
//         let active = false;
//         const chainHash = mainnet.web3.utils.soliditySha3(chainName1);
//         let counter = 0;
//         while (!active) {
//             log('Waiting for account activation...');
//             let activeM = await mainnet.communityPool.contract.methods.activeUsers(
//                 address,
//                 chainHash
//             ).call();
//             let activeS = await sChain.communityLocker.contract.methods.activeUsers(
//                 address
//             ).call();
//             active = activeS && activeM;
//             await delay(BALANCE_UPDATE_INTERVAL_SECONDS * 1000);
//             counter++;
//             if (counter >= 10) break;
//         }
//     } catch (err) {
//         console.error(err);
//         const msg = err.message ? err.message : DEFAULT_ERROR_MSG;
//         setErrorMessage(new TransactionErrorMessage(msg, errorMessageClosedFallback));
//     } finally {
//         await initSchain1();
//         setChainId(getChainId(props.config.skaleNetwork, chainName1));
//         setMainnet(initMainnet(props.config.skaleNetwork, props.config.mainnetEndpoint));
//         await updateCommunityPoolData();
//         setLoadingCommunityPool(false);
//     }
// }
