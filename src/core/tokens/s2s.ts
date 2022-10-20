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
 * @file s2s.ts
 * @copyright SKALE Labs 2022-Present
 */


import debug from 'debug';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';


import { initContract } from '../core';

import { addETHToken, getEthBalance } from './eth';

import * as interfaces from '../interfaces/index';
import { TokenType } from '../dataclasses/TokenType';
import TokenData, { getTokenKeyname } from '../dataclasses/TokenData';
import { MAINNET_CHAIN_NAME, ZERO_ADDRESS } from '../constants';
import { eqArrays, isMainnet } from '../helper';


debug.enable('*');
const log = debug('metaport:tokens:s2s');


export async function addS2STokens(
    sChain1: SChain,
    sChain2: SChain,
    chainName1: string,
    chainName2: string,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap,
    force: boolean
): Promise<void> {
    log('Add S2S Tokens');
    await collectS2STokens(
        sChain1,
        sChain2,
        chainName1,
        configTokens,
        availableTokens,
        force,
        false
    );
    await collectS2STokens(
        sChain1,
        sChain2,
        chainName2,
        configTokens,
        availableTokens,
        force,
        true
    );
}


async function collectS2STokens(
    sChain1: SChain,
    sChain2: SChain,
    chainName: string,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap,
    force: boolean,
    isClone: boolean
): Promise<void> {
    if (!configTokens[chainName]) return;
    for (const tokenType in configTokens[chainName]) {
        log(`Adding tokens for tokenType ${tokenType}`);
        for (const tokenKeyname in configTokens[chainName][tokenType]) {
            await addTokenData(
                sChain1,
                sChain2,
                chainName,
                configTokens[chainName][tokenType][tokenKeyname],
                availableTokens,
                isClone,
                force,
                tokenType as TokenType
            );
        }
    }
}


async function addTokenData(
    sChain1: SChain,
    sChain2: SChain,
    sChainName: string,
    configToken: interfaces.Token,
    availableTokens: interfaces.TokenDataTypesMap,
    isClone: boolean,
    force: boolean,
    tokenType: TokenType
): Promise<void> {
    let cloneAddress = await getCloneAddress(
        isClone ? sChain1 : sChain2,
        configToken.address,
        sChainName,
        tokenType
    );
    if (!cloneAddress) {
        log(`No token clone for ${configToken.address}, skipping`);
        return;
    }
    let unwrappedSymbol;
    let unwrappedAddress;
    if (configToken.wraps) {
        unwrappedSymbol = configToken.wraps.symbol;
        unwrappedAddress = configToken.wraps.address;
    }

    const tokenKeyname = getTokenKeyname(configToken.symbol, configToken.address);
    availableTokens[tokenType][tokenKeyname] = new TokenData(
        cloneAddress,
        configToken.address,
        configToken.name,
        configToken.symbol,
        isClone,
        configToken.iconUrl,
        configToken.decimals,
        tokenType,
        unwrappedSymbol,
        unwrappedAddress
    );

    addTokenContracts(
        sChain1,
        sChain2,
        tokenKeyname,
        availableTokens[tokenType][tokenKeyname],
        force,
        tokenType
    );
}


async function getCloneAddress(
    sChain: SChain,
    originTokenAddress: string,
    originChainName: string,
    tokenType: TokenType
): Promise<string> {
    const tokenCloneAddress = await sChain[tokenType].getTokenCloneAddress(
        originTokenAddress,
        originChainName
    );
    if (tokenCloneAddress === ZERO_ADDRESS) return;
    return tokenCloneAddress;
}


function addTokenContracts(
    sChain1: SChain,
    sChain2: SChain,
    tokenKeyname: string,
    tokenData: TokenData,
    force: boolean,
    tokenType: TokenType
) {
    const chain1Address = tokenData.clone ? tokenData.cloneAddress : tokenData.originAddress;
    const chain2Address = tokenData.clone ? tokenData.originAddress : tokenData.cloneAddress;

    if (sChain1) { addToken(sChain1, chain1Address, tokenKeyname, tokenData, force, tokenType); };
    if (sChain2) { addToken(sChain2, chain2Address, tokenKeyname, tokenData, force, tokenType); };
}


function addToken(
    sChain: SChain,
    address: string,
    tokenSymbol: string,
    tokenData: TokenData,
    force: boolean,
    tokenType: TokenType
) {
    if (!sChain[tokenType].tokens[tokenSymbol] && !force) {
        if (tokenData.unwrappedSymbol) {
            sChain[tokenType].addToken(
                tokenSymbol,
                initContract('erc20wrap', address, sChain.web3)
            );
            sChain[tokenType].addToken(
                tokenData.unwrappedSymbol,
                initContract(tokenType, tokenData.unwrappedAddress, sChain.web3)
            );
        } else {
            sChain[tokenType].addToken(tokenSymbol, initContract(tokenType, address, sChain.web3));
        }
    }
}
