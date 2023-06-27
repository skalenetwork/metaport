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
 * @file explorer.ts
 * @copyright SKALE Labs 2023-Present
 */

import {
    HTTPS_PREFIX,
    MAINNET_CHAIN_NAME,
    MAINNET_EXPLORER_URLS,
    BASE_EXPLORER_URLS
} from './constants';


function getMainnetExplorerUrl(skaleNetwork: string) {
    return MAINNET_EXPLORER_URLS[skaleNetwork];
}

function getSChainExplorerUrl(skaleNetwork: string) {
    return BASE_EXPLORER_URLS[skaleNetwork];
}

export function getExplorerUrl(chainName: string, skaleNetwork: string): string {
    if (chainName === MAINNET_CHAIN_NAME) return getMainnetExplorerUrl(skaleNetwork);
    return HTTPS_PREFIX + chainName + '.' + getSChainExplorerUrl(skaleNetwork);
}


export function getTxUrl(chainName: string, skaleNetwork: string, txHash: string): string {
    const explorerUrl = getExplorerUrl(chainName, skaleNetwork);
    return `${explorerUrl}/tx/${txHash}`;
}
