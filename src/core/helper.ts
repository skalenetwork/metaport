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
 * @file helper.ts
 * @copyright SKALE Labs 2022-Present
 */


import { MAINNET_CHAIN_NAME } from './constants';
import utils from 'web3-utils';
import { TransferRequestStatus } from './dataclasses';

import mainnetMeta from '../meta/mainnet/chains.json';
import stagingMeta from '../meta/staging/chains.json';
import legacyMeta from '../meta/legacy/chains.json';


export const CHAINS_META = {
    'mainnet': mainnetMeta,
    'staging3': stagingMeta,
    'legacy': legacyMeta
}


export function clsNames(...args: any): string {
    const filteredArgs = args.map((clsName: any) => {
        if (typeof clsName === 'string') return clsName;
        if (Array.isArray(clsName) && clsName.length === 2 && clsName[1]) return clsName[0];
    });
    return filteredArgs.join(' ');
}


export function eqArrays(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}


export function isMainnet(chainName: string): boolean {
    return chainName === MAINNET_CHAIN_NAME;
}


export function addressesEqual(address1: string, address2: string): boolean {
    return utils.toChecksumAddress(address1) === utils.toChecksumAddress(address2);
}


export function isTransferRequestActive(transferRequestStatus: TransferRequestStatus) {
    return transferRequestStatus === TransferRequestStatus.IN_PROGRESS ||
        transferRequestStatus === TransferRequestStatus.IN_PROGRESS_HUB;
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getChainName(
    chainsMetadata: any,
    chainName: string,
    skaleNetwork: string,
    app?: string
): string {
    if (chainName === MAINNET_CHAIN_NAME) {
        return 'Mainnet';
    }
    if (chainsMetadata && chainsMetadata[chainName]) {
        if (app && chainsMetadata[chainName].apps[app]) {
            return chainsMetadata[chainName].apps[app].alias;
        }
        return chainsMetadata[chainName].alias;
    } else {
        return getChainNameMeta(chainName, skaleNetwork);
    }
}


function getChainNameMeta(chainName: string, skaleNetwork: string, app?: string): string {
    if (CHAINS_META[skaleNetwork] && CHAINS_META[skaleNetwork][chainName]) {
        if (app && CHAINS_META[skaleNetwork][chainName].apps &&
            CHAINS_META[skaleNetwork][chainName].apps[app]) {
            return CHAINS_META[skaleNetwork][chainName].apps[app].alias;
        }
        return CHAINS_META[skaleNetwork][chainName].alias;
    }
    return chainName;
}