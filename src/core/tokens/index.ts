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
 * @file index.ts
 * @copyright SKALE Labs 2022-Present
 */

import debug from 'debug';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import { addETHToken, getEthBalance } from './eth';
import { updateERC20TokenBalances } from './erc20';
import { addM2STokens } from './m2s';
import { addS2STokens } from './s2s';

import { isMainnet } from '../helper';
import { getEmptyTokenDataMap } from './helper';

import * as interfaces from '../interfaces/index';


debug.enable('*');
const log = debug('metaport:tokens');


export async function getAvailableTokens(
    mainnet: MainnetChain,
    sChain1: SChain,
    sChain2: SChain,
    chainName1: string,
    chainName2: string,
    configTokens: interfaces.TokensMap,
    autoLookup: boolean
): Promise<interfaces.TokenDataTypesMap> {
    log('Collecting available tokens for ' + chainName1 + ' → ' + chainName2);
    const availableTokens = getEmptyTokenDataMap();
    try {
        log('Adding ETH to availableTokens');
        await addETHToken(
            chainName1,
            chainName2,
            configTokens,
            availableTokens
        );
        if (isMainnet(chainName1) || isMainnet(chainName2)) {
            log('Going to add M2S ERC20 tokens')
            const sChain = isMainnet(chainName1) ? sChain2 : sChain1;
            const schainName = isMainnet(chainName1) ? chainName2 : chainName1;
            await addM2STokens(
                mainnet,
                sChain,
                schainName,
                configTokens,
                availableTokens,
                autoLookup
            );
        } else {
            await addS2STokens(
                sChain1,
                sChain2,
                chainName1,
                chainName2,
                configTokens,
                availableTokens
            );
        }
        log('availableTokens');
        log(availableTokens);
    } catch (e: unknown) {
        log('ERROR: Something went wrong during getAvailableTokens procedure');
        if (typeof e === "string") {
            log(e.toUpperCase());
        } else if (e instanceof Error) {
            log(e.message);
        }
    }
    return availableTokens;
}


export async function getTokenBalances(
    availableTokens: interfaces.TokenDataTypesMap,
    chainName: string,
    mainnet: MainnetChain,
    sChain1: SChain,
    address: string
) {
    log('Getting token balances...');
    if (availableTokens.eth && availableTokens.eth.eth) {
        availableTokens.eth.eth.balance = await getEthBalance(
            mainnet,
            sChain1,
            chainName,
            address
        );
    };
    await updateERC20TokenBalances(
        availableTokens,
        chainName,
        mainnet,
        sChain1,
        address
    );
}