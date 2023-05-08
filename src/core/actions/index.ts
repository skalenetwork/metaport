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
    TransferERC20S2S,
    WrapERC20S,
    UnWrapERC20S,
    UnWrapERC20S2S,
    TransferERC20M2S,
    TransferERC20S2M,
    WrapSFuelERC20S
} from './erc20';
import {
    TransferERC721M2S,
    TransferERC721S2M,
    TransferERC721S2S
} from './erc721';
import {
    TransferERC1155M2S,
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

import { View } from '../../core/dataclasses/View';
import { TokenType } from 'core/dataclasses';


debug.enable('*');
const log = debug('metaport:actions');


export function getActionName(
    chainName1: string,
    chainName2: string,
    tokenType: TokenType,
    view: View
): string {
    if (chainName1 && view === View.UNWRAP) return 'erc20_unwrap';
    if (!chainName1 || !chainName2 || !tokenType) return;
    log(`Getting action name: ${chainName1} ${chainName2} ${tokenType}`);
    let postfix = S2S_POSTFIX;
    if (isMainnet(chainName1)) { postfix = M2S_POSTFIX; };
    if (isMainnet(chainName2)) { postfix = S2M_POSTFIX; };
    const actionName = tokenType + '_' + postfix;
    log('Action name: ' + actionName);
    return actionName;
}


const wrapActions = [WrapERC20S];
const unwrapActions = [UnWrapERC20S2S];
const sFuelWrapActions = [WrapSFuelERC20S];


export const ACTIONS = {
    eth_m2s: [TransferEthM2S],
    eth_s2m: [TransferEthS2M, UnlockEthM],
    eth_s2s: [],

    erc20_m2s: [TransferERC20M2S],
    erc20_s2m: [TransferERC20S2M],
    erc20_s2s: [TransferERC20S2S],

    erc20_unwrap: [UnWrapERC20S],

    erc721_m2s: [TransferERC721M2S],
    erc721_s2m: [TransferERC721S2M],
    erc721_s2s: [TransferERC721S2S],

    erc721meta_m2s: [TransferERC721M2S],
    erc721meta_s2m: [TransferERC721S2M],
    erc721meta_s2s: [TransferERC721S2S],

    erc1155_m2s: [TransferERC1155M2S],
    erc1155_s2m: [TransferERC1155S2M],
    erc1155_s2s: [TransferERC1155S2S]
}


export function getActionSteps(
    actionName: string,
    tokenData: TokenData
) {
    log(`Getting action steps ${actionName}, ${tokenData.keyname}`);
    const actionsList = [];
    // TODO: tmp fix
    if (tokenData.unwrappedSymbol && !tokenData.clone && actionName !== 'erc20_unwrap') {
        actionsList.push(...wrapActions);
    }
    if (tokenData.wrapsSFuel && !tokenData.clone && actionName !== 'erc20_unwrap') {
        actionsList.push(...sFuelWrapActions);
    }
    actionsList.push(...ACTIONS[actionName]);
    if (tokenData.unwrappedSymbol && tokenData.clone) {
        actionsList.push(...unwrapActions);
    }
    log('actionsList');
    log(actionsList);
    return actionsList;
}
