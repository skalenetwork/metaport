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
 * @file eth.ts
 * @copyright SKALE Labs 2022-Present
 */


import debug from 'debug';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import { isMainnet } from '../helper';
import { externalEvents } from '../events';

import EthTokenData from '../dataclasses/EthTokenData';
import { TokenType } from '../dataclasses/TokenType';
import * as interfaces from '../interfaces/index';
import { MAINNET_CHAIN_NAME } from '../constants';


debug.enable('*');
const log = debug('metaport:tokens:eth');


function ethInConfig(configTokens: interfaces.TokensMap): boolean {
    return configTokens[MAINNET_CHAIN_NAME] !== undefined &&
        configTokens[MAINNET_CHAIN_NAME].eth !== undefined;
}


export async function addETHToken(
    chainName1: string,
    chainName2: string,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap
): Promise<void> {
    log('Checking ETH in the configTokens');
    if (!ethInConfig(configTokens)) return;
    log('Adding ETH to token list');
    if (chainName1 === MAINNET_CHAIN_NAME) {
        availableTokens[TokenType.eth][TokenType.eth] = new EthTokenData(false);
    }
    if (chainName2 === MAINNET_CHAIN_NAME) {
        availableTokens[TokenType.eth][TokenType.eth] = new EthTokenData(true);
    }
}


export async function getEthBalance(
    mainnet: MainnetChain,
    sChain: SChain,
    chainName: string,
    address: string
) {
    const ethBalance = isMainnet(chainName) ? await mainnet.ethBalance(address) :
        await sChain.ethBalance(address);
    log('ETH balance for ' + address + ': ' + ethBalance + ' wei');
    externalEvents.balance('eth', chainName, ethBalance);
    return mainnet ? mainnet.web3.utils.fromWei(ethBalance) : sChain.web3.utils.fromWei(ethBalance);
}