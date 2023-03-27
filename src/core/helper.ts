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


export function clsNames(...args) {
    return args.join(' ');
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