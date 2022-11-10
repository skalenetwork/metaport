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
 * @file erc20.ts
 * @copyright SKALE Labs 2022-Present
 */

import debug from 'debug';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import { initContract } from '../core';
import { getEmptyTokenDataMap } from './helper';
import { externalEvents } from '../events';
import { MAINNET_CHAIN_NAME } from '../constants';
import TokenData, { getTokenKeyname } from '../dataclasses/TokenData';
import { TokenType } from '../dataclasses/TokenType';
import * as interfaces from '../interfaces/index';
import { fromWei } from '../convertation';


debug.enable('*');
const log = debug('metaport:tokens:erc20');


export async function updateERC20TokenBalances(
    availableTokens: interfaces.TokenDataTypesMap,
    chainName: string,
    mainnet: MainnetChain,
    sChain1: SChain,
    address: string
): Promise<void> {
    log('Getting ERC20 token balances...');
    for (const [symbol, tokenData] of Object.entries(availableTokens.erc20)) {
        if (chainName === MAINNET_CHAIN_NAME) {
            const balance = await getTokenBalance(
                chainName,
                mainnet,
                symbol,
                tokenData.decimals,
                address
            );
            availableTokens.erc20[symbol].balance = balance;
        } else {
            const balance = await getTokenBalance(
                chainName,
                sChain1,
                symbol,
                tokenData.decimals,
                address
            );
            availableTokens.erc20[symbol].balance = balance;
            if (availableTokens.erc20[symbol].unwrappedSymbol &&
                !availableTokens.erc20[symbol].clone) {
                const wBalance = await getTokenBalance(
                    chainName,
                    sChain1,
                    availableTokens.erc20[symbol].unwrappedSymbol,
                    tokenData.decimals,
                    address
                );
                availableTokens.erc20[symbol].unwrappedBalance = wBalance;
            }
        }
    }
}


export async function getTokenBalance(
    chainName: string,
    chain: any,
    tokenSymbol: string,
    decimals: string,
    address: string
): Promise<string> {
    const tokenContract = chain.erc20.tokens[tokenSymbol];
    const balance = await chain.getERC20Balance(tokenContract, address);
    externalEvents.balance(tokenSymbol, chainName, balance);
    return fromWei(balance, decimals);
}


export async function getWrappedTokens(
    sChain: SChain,
    chainName: string,
    configTokens: interfaces.TokensMap,
    address: string
): Promise<interfaces.TokenDataTypesMap> {
    log('Checking wrapped tokens...');
    const wrappedTokens: interfaces.TokenDataTypesMap = getEmptyTokenDataMap();
    if (configTokens && configTokens[chainName] && configTokens[chainName].erc20) {
        for (const [symbol, configToken] of Object.entries(configTokens[chainName].erc20)) {
            if (!configToken.wraps) continue;
            const tokenKeyname = getTokenKeyname(configToken.symbol, configToken.address);
            const tokenContract = initContract('erc20wrap', configToken.address, sChain.web3);
            sChain.erc20.addToken(
                tokenKeyname,
                tokenContract
            );
            const balance = await sChain.getERC20Balance(
                tokenContract,
                address
            );
            log(`token ${tokenKeyname}, address: ${address}, balance: ${balance}`);
            if (balance !== '0') {
                wrappedTokens.erc20[tokenKeyname] = new TokenData(
                    null,
                    configToken.address,
                    configToken.name,
                    configToken.symbol,
                    configToken.cloneSymbol,
                    false,
                    configToken.iconUrl,
                    configToken.decimals,
                    TokenType.erc20,
                    configToken.wraps.symbol,
                    configToken.wraps.address,
                    configToken.wraps.iconUrl
                );
                wrappedTokens.erc20[tokenKeyname].balance = fromWei(
                    balance,
                    wrappedTokens.erc20[tokenKeyname].decimals
                );
            }
        }
    }
    log('wrappedTokens');
    log(wrappedTokens);
    return wrappedTokens;
}