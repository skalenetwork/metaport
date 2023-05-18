
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
 * @file sfuel.ts
 * @copyright SKALE Labs 2022-Present
 */

import Web3 from 'web3';
import debug from 'debug';
import { AnonymousPoW } from "@skaleproject/pow-ethers";

import { getChainEndpoint, initWeb3 } from '../core/core';
import { getFuncData, isFaucetAvailable } from '../core/faucet';
import { DEFAULT_MIN_SFUEL_WEI, DEFAULT_FAUCET_URL, MAINNET_CHAIN_NAME } from '../core/constants';


debug.enable('*');
const log = debug('metaport:Widget');


function getFaucetUrl(chainsMetadata: object, chainName: string): string {
    if (chainsMetadata && chainsMetadata[chainName]) return chainsMetadata[chainName].faucetUrl;
    return DEFAULT_FAUCET_URL;
}


function getMinSfuelWei(chainName: string, chainsMetadata?: object): string {
    if (chainsMetadata && chainsMetadata[chainName] && chainsMetadata[chainName].minSfuelWei) {
        return chainsMetadata[chainName].minSfuelWei;
    } else {
        return DEFAULT_MIN_SFUEL_WEI;
    }
}


async function getSfuelBalance(web3: Web3, address: string): Promise<string> {
    return await web3.eth.getBalance(address);
}


export interface StationData {
    faucetUrl: string;
    minSfuelWei: string;
    balance: string;
    ok: boolean;
}


export interface StationPowRes {
    message: string;
    ok: boolean;
}


export class Station {

    endpoint: string;
    web3: Web3;

    constructor(
        public chainName: string,
        public skaleNetwork: string,
        public mainnetEndpoint?: string,
        public chainsMetadata?: object
    ) {
        this.chainName = chainName;
        this.skaleNetwork = skaleNetwork;

        this.endpoint = getChainEndpoint(chainName, mainnetEndpoint, skaleNetwork);

        this.web3 = initWeb3(this.endpoint);
        this.chainsMetadata = chainsMetadata;
    }

    async getData(address: string): Promise<StationData> {
        try {
            const minSfuelWei = getMinSfuelWei(this.chainName, this.chainsMetadata);
            const balance = await getSfuelBalance(this.web3, address);
            return {
                faucetUrl: getFaucetUrl(this.chainsMetadata, this.chainName),
                minSfuelWei,
                balance,
                ok: Number(balance) >= Number(minSfuelWei)
            }
        } catch (e) {
            log(`ERROR: getSFuelData for ${this.chainName} failed!`);
            log(e);
            return {
                faucetUrl: undefined, minSfuelWei: undefined, balance: undefined, ok: undefined
            };
        }
    }

    async doPoW(address: string): Promise<StationPowRes> {
        if (!this.chainName || !isFaucetAvailable(this.chainName, this.skaleNetwork)) {
            log('WARNING: PoW is not available for this chain');
            if (this.chainName === MAINNET_CHAIN_NAME) {
                return { ok: true, message: 'PoW is not available for Ethereum Mainnet' };
            }
            return { ok: false, message: 'PoW is not available for this chain' };
        }
        log('Mining sFUEL for ' + address + ' on ' + this.chainName + '...');
        try {
            const endpoint = getChainEndpoint(this.chainName, undefined, this.skaleNetwork);
            const web3 = initWeb3(endpoint);
            const anon = new AnonymousPoW({ rpcUrl: endpoint });
            await (await anon.send(getFuncData(
                web3,
                this.chainName,
                address,
                this.skaleNetwork
            ))).wait();
            return { ok: true, message: 'PoW finished successfully' }
        } catch (e) {
            log('ERROR: PoW failed!');
            log(e);
            return { ok: false, message: e.message };
        }
    }
}
