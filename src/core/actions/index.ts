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
import {
    TransferEthM2S,
    TransferEthS2M,
    UnlockEthM
} from './eth';
import {
    ApproveERC20S,
    TransferERC20S2S,
    ApproveWrapERC20S,
    WrapERC20S,
    UnWrapERC20S,
    ApproveERC20M,
    TransferERC20M2S,
    TransferERC20S2M
} from './erc20';
import {
    ApproveERC721M,
    TransferERC721M2S,
    ApproveERC721S,
    TransferERC721S2M,
    TransferERC721S2S
} from './erc721';
import {
    ApproveERC1155M,
    TransferERC1155M2S,
    ApproveERC1155S,
    TransferERC1155S2M,
    TransferERC1155S2S
} from './erc1155';

import { isMainnet } from '../helper';
import TokenData from '../dataclasses/TokenData';
import {
    S2S_POSTFIX,
    M2S_POSTFIX,
    S2M_POSTFIX,
} from '../constants';


debug.enable('*');
const log = debug('metaport:actions');


export function getActionName(
    chainName1: string,
    chainName2: string,
    tokenData: TokenData
): string {
    if (!chainName1 || !chainName2 || !tokenData) return;
    log(`Getting action name: ${chainName1} ${chainName2} ${tokenData.symbol} ${tokenData.type}`);
    let postfix = S2S_POSTFIX;
    if (isMainnet(chainName1)) { postfix = M2S_POSTFIX; };
    if (isMainnet(chainName2)) { postfix = S2M_POSTFIX; };
    const actionName = tokenData.type + '_' + postfix;
    log('Action name: ' + actionName);
    return actionName;
}


const wrapActions = [ApproveWrapERC20S, WrapERC20S];
const unwrapActions = [UnWrapERC20S];


export const ACTIONS = {
    eth_m2s: [TransferEthM2S],
    eth_s2m: [TransferEthS2M, UnlockEthM],
    eth_s2s: [],

    erc20_m2s: [ApproveERC20M, TransferERC20M2S],
    erc20_s2m: [ApproveERC20S, TransferERC20S2M],
    erc20_s2s: [ApproveERC20S, TransferERC20S2S],

    erc721_m2s: [ApproveERC721M, TransferERC721M2S],
    erc721_s2m: [ApproveERC721S, TransferERC721S2M],
    erc721_s2s: [ApproveERC721S, TransferERC721S2S],

    erc721meta_m2s: [ApproveERC721M, TransferERC721M2S],
    erc721meta_s2m: [ApproveERC721S, TransferERC721S2M],
    erc721meta_s2s: [ApproveERC721S, TransferERC721S2S],

    erc1155_m2s: [ApproveERC1155M, TransferERC1155M2S],
    erc1155_s2m: [ApproveERC1155S, TransferERC1155S2M],
    erc1155_s2s: [ApproveERC1155S, TransferERC1155S2S]
}


export function getActionSteps(
    actionName: string,
    tokenData: TokenData
) {
    log(`Getting action steps ${actionName}, ${tokenData.keyname}`);
    const actionsList = [];
    if (tokenData.unwrappedSymbol && !tokenData.clone) {
        actionsList.push(...wrapActions);
    }
    actionsList.push(...ACTIONS[actionName]);
    if (tokenData.unwrappedSymbol && tokenData.clone) {
        actionsList.push(...unwrapActions);
    }
    return actionsList;
}
