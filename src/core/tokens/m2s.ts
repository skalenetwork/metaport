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
 * @file m2s.ts
 * @copyright SKALE Labs 2022-Present
 */


import debug from 'debug';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import { initContract } from '../core';

import * as interfaces from '../interfaces/index';
import { TokenType } from '../dataclasses/TokenType';
import TokenData, { getTokenKeyname } from '../dataclasses/TokenData';
import { MAINNET_CHAIN_NAME, ZERO_ADDRESS } from '../constants';
import { isMainnet } from '../helper';


debug.enable('*');
const log = debug('metaport:tokens:m2s');


export async function addM2STokens(
    mainnet: MainnetChain,
    sChain: SChain,
    schainName: string,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap,
    autoLookup: boolean
): Promise<void> {
    autoLookup ? await getM2STokensAutomatic(
        mainnet,
        sChain,
        schainName,
        configTokens,
        availableTokens
    ) : await getM2STokensManual(
        mainnet,
        sChain,
        configTokens,
        availableTokens
    );
}


async function getM2STokensAutomatic(
    mainnet: MainnetChain,
    sChain: SChain,
    schainName: string,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap
): Promise<void> {
    log('Starting automatic lookup for M2S tokens...');
    for (const tokenType in TokenType) {
        await addM2STokensAutomatic(
            tokenType,
            mainnet,
            sChain,
            schainName,
            configTokens,
            availableTokens
        )
    }
}


async function addM2STokensAutomatic(
    tokenType: string,
    mainnet: MainnetChain,
    sChain: SChain,
    destChainName: string,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap
): Promise<void> {
    if (tokenType === TokenType.eth) return;
    log(`Getting token pairs: ${tokenType}`);
    const len = await mainnet[tokenType].getTokenMappingsLength(destChainName);
    log(`Number of ${tokenType} token pairs: ${len}`);
    if (len === '0') {
        log('No linked tokens, exiting.')
        return;
    }
    const tokenAddresses = await mainnet[tokenType].getTokenMappings(
        destChainName,
        0,
        len
    ); // todo: optimize
    for (const address of tokenAddresses) {
        log(`Adding contract: ${address}`);
        const contract = initContract(tokenType, address, mainnet.web3);

        const symbol = await contract.methods.symbol().call();
        const isClone = isMainnet(destChainName);
        const name = await contract.methods.name().call();

        let decimals: string;

        if (tokenType === TokenType.erc20) {
            decimals = await contract.methods.decimals().call();
        }

        const cloneAddress = await sChain[tokenType].getTokenCloneAddress(address);

        const key = getTokenKeyname(symbol, address);
        log('Adding token: ' + key);

        const tokenData = new TokenData(
            cloneAddress,
            address,
            name,
            symbol,
            isClone,
            null,
            decimals,
            tokenType as TokenType,
            null,
            null,
            null
        );
        availableTokens[tokenType][key] = overrideTokenDataFromConfig(
            configTokens,
            tokenData,
            tokenType
        );
        mainnet[tokenType].addToken(key, contract);
        sChain[tokenType].addToken(key, initContract(tokenType, cloneAddress, sChain.web3));
    }
}

function overrideTokenDataFromConfig(
    configTokens: interfaces.TokensMap,
    tokenData: TokenData,
    tokenType: string
): TokenData {
    if (!configTokens[MAINNET_CHAIN_NAME]) return tokenData;
    if (!configTokens[MAINNET_CHAIN_NAME][tokenType]) return tokenData;
    if (!configTokens[MAINNET_CHAIN_NAME][tokenType][tokenData.keyname]) return tokenData;

    const configTokenData = configTokens[MAINNET_CHAIN_NAME][tokenType][tokenData.keyname];
    log(`Overriding token data from config ${tokenData.keyname}: ${configTokenData}`);
    tokenData.iconUrl = configTokenData.iconUrl ? configTokenData.iconUrl : tokenData.iconUrl;
    tokenData.decimals = configTokenData.decimals ? configTokenData.decimals : tokenData.decimals;
    tokenData.name = configTokenData.name ? configTokenData.name : tokenData.name;
    tokenData.symbol = configTokenData.symbol ? configTokenData.symbol : tokenData.symbol;
    return tokenData;
}


async function getM2STokensManual(
    mainnet: MainnetChain,
    sChain: SChain,
    configTokens: interfaces.TokensMap,
    availableTokens: interfaces.TokenDataTypesMap
): Promise<void> {
    log('Starting manual lookup for M2S tokens...');
    if (!configTokens[MAINNET_CHAIN_NAME]) return;
    for (const tokenType in configTokens[MAINNET_CHAIN_NAME]) {
        log(`Adding tokens for tokenType ${tokenType}`);
        for (const tokenSymbol in configTokens[MAINNET_CHAIN_NAME][tokenType]) {
            const tokenInfo = configTokens[MAINNET_CHAIN_NAME][tokenType][tokenSymbol];
            const cloneAddress = await sChain[tokenType].getTokenCloneAddress(tokenInfo.address);
            const tokenKeyname = getTokenKeyname(tokenInfo.symbol, tokenInfo.address);
            if (cloneAddress === ZERO_ADDRESS) {
                log(`No token clone for ${tokenInfo.address}, skipping`);
                continue;
            }

            log(`Adding token: ${tokenKeyname}`);
            availableTokens[tokenType][tokenKeyname] = new TokenData(
                cloneAddress,
                tokenInfo.address,
                tokenInfo.name,
                tokenInfo.symbol,
                false,
                tokenInfo.iconUrl,
                tokenInfo.decimals,
                tokenType as TokenType,
                null,
                null,
                null
            );
            mainnet[tokenType].addToken(
                tokenKeyname, initContract(tokenType, tokenInfo.address, mainnet.web3));
            sChain[tokenType].addToken(
                tokenKeyname, initContract(tokenType, cloneAddress, sChain.web3));
        }
    }
}