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


import debug from 'debug';
import { MainnetChain, SChain } from '@skalenetwork/ima-js';

import { CommunityPoolData } from './interfaces';
import { fromWei } from './convertation';
import {
    MAINNET_CHAIN_NAME,
    DEFAULT_ERC20_DECIMALS,
    RECHARGE_MULTIPLIER,
    MINIMUM_RECHARGE_AMOUNT
} from './constants';


debug.enable('*');
const log = debug('metaport:core:community_pool');


export function getEmptyCommunityPoolData(): CommunityPoolData {
    return {
        exitGasOk: null,
        isActive: null,
        balance: null,
        accountBalance: null,
        recommendedRechargeAmount: null,
        originalRecommendedRechargeAmount: null
    };
}


export async function getCommunityPoolData(
    address: string,
    chainName1: string,
    chainName2: string,
    mainnet: MainnetChain,
    sChain: SChain
): Promise<CommunityPoolData> {

    if (chainName2 !== MAINNET_CHAIN_NAME) {
        log('not a S2M transfer, skipping community pool check');
        return {
            exitGasOk: true,
            isActive: null,
            balance: null,
            accountBalance: null,
            recommendedRechargeAmount: null,
            originalRecommendedRechargeAmount: null
        }
    }

    log('Getting community pool data', address, chainName1);
    const balanceWei = await mainnet.communityPool.balance(address, chainName1);
    const accountBalanceWei = await mainnet.ethBalance(address);
    const activeS = await sChain.communityLocker.contract.methods.activeUsers(
        address
    ).call();
    const chainHash = mainnet.web3.utils.soliditySha3(chainName1);
    const activeM = await mainnet.communityPool.contract.methods.activeUsers(
        address,
        chainHash
    ).call();

    const rraWei = await mainnet.communityPool.contract.methods.getRecommendedRechargeAmount(
        mainnet.web3.utils.soliditySha3(chainName1),
        address
    ).call();
    const rraEther = fromWei(rraWei as string, DEFAULT_ERC20_DECIMALS);

    let recommendedAmount = parseFloat(rraEther as string) * RECHARGE_MULTIPLIER;
    if (recommendedAmount < MINIMUM_RECHARGE_AMOUNT) recommendedAmount = MINIMUM_RECHARGE_AMOUNT;

    const communityPoolData = {
        exitGasOk: activeM && activeS && rraWei === '0',
        isActive: activeM && activeS,
        balance: balanceWei,
        accountBalance: accountBalanceWei,
        recommendedRechargeAmount: recommendedAmount.toString(),
        originalRecommendedRechargeAmount: rraWei
    }
    log('communityPoolData:', communityPoolData);
    return communityPoolData;
}