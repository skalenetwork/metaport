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

import { SChain } from '@skalenetwork/ima-js';

import { initContract } from '../core';
import * as interfaces from '../interfaces/index';
import { TokenType } from '../dataclasses/TokenType';
import TokenData, { getTokenKeyname } from '../dataclasses/TokenData';
import { ZERO_ADDRESS } from '../constants';


debug.enable('*');
const log = debug('metaport:tokens:s2s');


export async function addS2STokens(
    sChain1: SChain,
    sChain2: SChain,
    chainName1: string,
    chainName2: string,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap,
): Promise<void> {
    log('Add S2S Tokens');
    await collectS2STokens(
        sChain1,
        sChain2,
        chainName1,
        configTokens,
        availableTokens,
        false
    );
    await collectS2STokens(
        sChain1,
        sChain2,
        chainName2,
        configTokens,
        availableTokens,
        true
    );
}


async function collectS2STokens(
    sChain1: SChain,
    sChain2: SChain,
    chainName: string,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap,
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
    tokenType: TokenType
): Promise<void> {
    const cloneAddress = await getCloneAddress(
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
    let unwrappedIconUrl;
    if (configToken.wraps) {
        unwrappedSymbol = configToken.wraps.symbol;
        unwrappedAddress = configToken.wraps.address;
        unwrappedIconUrl = configToken.wraps.iconUrl;
    }

    const tokenKeyname = getTokenKeyname(configToken.symbol, configToken.address);
    availableTokens[tokenType][tokenKeyname] = new TokenData(
        cloneAddress,
        configToken.address,
        configToken.name,
        configToken.symbol,
        configToken.cloneSymbol,
        isClone,
        configToken.iconUrl,
        configToken.decimals,
        tokenType,
        unwrappedSymbol,
        unwrappedAddress,
        unwrappedIconUrl,
        configToken.wrapsSFuel
    );
    addToken(sChain1, availableTokens[tokenType][tokenKeyname], true);
    addToken(sChain2, availableTokens[tokenType][tokenKeyname], false);
}


async function getCloneAddress(
    sChain: SChain,
    originTokenAddress: string,
    originChainName: string,
    tokenType: TokenType
): Promise<string> {
    log(`Getting clone address for ${originTokenAddress} on a chain`);
    try {
        const tokenCloneAddress = await sChain[tokenType].getTokenCloneAddress(
            originTokenAddress,
            originChainName
        );
        if (tokenCloneAddress === ZERO_ADDRESS) return;
        return tokenCloneAddress;
    } catch (e) {
        log(`getCloneAddress for ${originTokenAddress} - ${originChainName} failed`);
        log(e);
    }
}


function addToken(sChain: SChain, token: TokenData, fromChain: boolean): void {
    log(`Adding token to sChain object - ${token.keyname}`);
    const isCloneAddress = (fromChain && token.clone) || (!fromChain && !token.clone);
    const address = isCloneAddress ? token.cloneAddress : token.originAddress;
    if (token.unwrappedSymbol) {
        sChain[token.type].addToken(
            token.keyname,
            initContract('erc20wrap', address, sChain.web3)
        );
        sChain[token.type].addToken(
            token.unwrappedSymbol,
            initContract(token.type, token.unwrappedAddress, sChain.web3)
        );
    } else {
        if (token.wrapsSFuel && !token.clone) {
            sChain[token.type].addToken(
                token.keyname,
                initContract('sfuelwrap', address, sChain.web3)
            );
            return;
        }
        sChain[token.type].addToken(token.keyname, initContract(token.type, address, sChain.web3));
    }
}
