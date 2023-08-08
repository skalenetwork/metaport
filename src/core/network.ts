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
 * @file network.ts
 * @copyright SKALE Labs 2023-Present
 */

import { MainnetChain, SChain } from '@skalenetwork/ima-js';
import { JsonRpcProvider } from "ethers";


import proxyEndpoints from '../metadata/proxy.json';
import { MAINNET_CHAIN_NAME } from './constants';
import { IMA_ADDRESSES, IMA_ABIS } from './contracts';
import { SkaleNetwork } from './interfaces';


const PROTOCOL: { [protocol in 'http' | 'ws']: string } = {
    'http': 'https://',
    'ws': 'wss://'
}

export const CHAIN_IDS: { [network in SkaleNetwork]: number } = {
    'staging': 5,
    'legacy': 5,
    'regression': 5,
    'mainnet': 5
}

export function isMainnetChainId(chainId: number | BigInt, skaleNetwork: SkaleNetwork): boolean {
    return Number(chainId) === CHAIN_IDS[skaleNetwork];
}

export function getChainEndpoint(
    mainnetEndpoint: string,
    network: SkaleNetwork,
    chainName: string
): string {
    if (chainName === MAINNET_CHAIN_NAME) return mainnetEndpoint;
    return getSChainEndpoint(network, chainName);
}

export function getSChainEndpoint(
    network: SkaleNetwork,
    sChainName: string,
    protocol: 'http' | 'ws' = 'http'
): string {
    return PROTOCOL[protocol] + getProxyEndpoint(network) + '/v1/' + (protocol === 'ws' ? 'ws/' : '') + sChainName;
}

function getProxyEndpoint(network: SkaleNetwork) {
    return proxyEndpoints[network];
}

export function getMainnetAbi(network: string) {
    if (network === 'staging') {
        return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.staging }
    }
    if (network === 'legacy') {
        return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.legacy }
    }
    if (network === 'regression') {
        return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.regression }
    }
    return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.mainnet }
}


export function initIMA(
    mainnetEndpoint: string,
    network: SkaleNetwork,
    chainName: string
): MainnetChain | SChain {
    if (chainName === MAINNET_CHAIN_NAME) return initMainnet(mainnetEndpoint, network);
    return initSChain(network, chainName);
}

export function initMainnet(mainnetEndpoint: string, network: string): MainnetChain {
    const provider = new JsonRpcProvider(mainnetEndpoint);
    return new MainnetChain(provider, getMainnetAbi(network));
}

export function initSChain(network: SkaleNetwork, chainName: string): SChain {
    const endpoint = getChainEndpoint(
        null,
        network,
        chainName
    );
    const provider = new JsonRpcProvider(endpoint);
    return new SChain(provider, IMA_ABIS.schain);
}
