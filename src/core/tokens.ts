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
 * @file tokens.ts
 * @copyright SKALE Labs 2022-Present
 */

import debug from 'debug';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import { ZERO_ADDRESS, ETH_TOKEN_NAME, MAINNET_CHAIN_NAME, ETH_ERC20_ADDRESS } from './constants';
import { externalEvents } from './events';
import { initERC20, initERC20Wrapper } from './core';
import { isChainMainnet } from './actions';


debug.enable('*');
const log = debug('metaport:tokens');


export class TokenData {
    originAddress: string
    cloneAddress: string

    name: string
    symbol: string

    clone: boolean
    type: string
    balance: number

    iconUrl: string

    unwrappedSymbol: string
    unwrappedAddress: string
    unwrappedBalance: number

    constructor(
        cloneAddress: string,
        originAddress: string,
        name: string,
        symbol: string,
        clone: boolean,
        iconUrl: string,
        unwrappedSymbol: string,
        unwrappedAddress: string
    ) {
        this.cloneAddress = cloneAddress;
        this.originAddress = originAddress;

        this.unwrappedAddress = unwrappedAddress;
        this.unwrappedSymbol = unwrappedSymbol;

        this.name = name;
        this.symbol = symbol;
        this.clone = clone;
        this.iconUrl = iconUrl;
        this.type = (name === ETH_TOKEN_NAME) ? 'eth' : 'erc20'
    }
}


export async function getAvailableTokens(
    mainnet: MainnetChain,
    sChain1: SChain,
    sChain2: SChain,
    chainName1: string,
    chainName2: string,
    tokens: object,
    force: boolean,
    autoLookup: boolean
) {
    log('Collecting available tokens for ' + chainName1 + ' -> ' + chainName2);
    const availableTokens = { 'erc20': {} };
    if (mainnet) {
        const sChain = (chainName1 === MAINNET_CHAIN_NAME) ? sChain2 : sChain1;
        const schainName = (chainName1 === MAINNET_CHAIN_NAME) ? chainName2 : chainName1;
        if (autoLookup) {
            log('Starting automatic lookup for M2S tokens...');
            await getM2STokensAutomatic(
                mainnet,
                sChain,
                schainName,
                availableTokens,
                tokens
            );
        } else {
            log('Starting manual lookup for M2S tokens...');
            await getM2STokensManual(
                mainnet,
                sChain,
                schainName,
                availableTokens,
                tokens
            );
        }
    } else {
        log('Starting manual lookup for S2S tokens...');
        await getERC20Tokens(
            sChain1,
            sChain2,
            chainName1,
            chainName2,
            tokens,
            availableTokens,
            force
        );
    }
    log('Adding ETH token...');
    await getETHToken(
        mainnet,
        sChain1,
        sChain2,
        chainName1,
        chainName2,
        tokens,
        availableTokens
    );
    return availableTokens;
}


async function getETHToken(
    mainnet: MainnetChain,
    sChain1: SChain,
    sChain2: SChain,
    chainName1: string,
    chainName2: string,
    tokens: object,
    availableTokens: object
) {
    if (tokens[MAINNET_CHAIN_NAME] && tokens[MAINNET_CHAIN_NAME][ETH_TOKEN_NAME]) {
        if (chainName1 === MAINNET_CHAIN_NAME) {
            availableTokens[ETH_TOKEN_NAME] = new TokenData(
                ETH_ERC20_ADDRESS,
                null,
                ETH_TOKEN_NAME,
                ETH_TOKEN_NAME,
                false,
                null,
                null,
                null
            );
        }
        if (chainName2 === MAINNET_CHAIN_NAME) {
            availableTokens[ETH_TOKEN_NAME] = new TokenData(
                ETH_ERC20_ADDRESS,
                null,
                ETH_TOKEN_NAME,
                ETH_TOKEN_NAME,
                true,
                null,
                null,
                null
            );
        }
    }
}


async function getERC20Tokens(
    sChain1: SChain,
    sChain2: SChain,
    chainName1: string,
    chainName2: string,
    tokens: object,
    availableTokens: object,
    force: boolean
) {
    if (tokens[chainName1] && tokens[chainName1].erc20) {
        for (const tokenSymbol in tokens[chainName1].erc20) {
            if (tokens[chainName1].erc20.hasOwnProperty(tokenSymbol)) {
                await addTokenData(
                    sChain1,
                    sChain2,
                    chainName1,
                    tokens[chainName1].erc20[tokenSymbol],
                    tokenSymbol,
                    availableTokens,
                    false,
                    force
                );
            }
        }
    }
    if (tokens[chainName2] && tokens[chainName2].erc20) {
        for (const tokenSymbol in tokens[chainName2].erc20) {
            if (tokens[chainName2].erc20.hasOwnProperty(tokenSymbol)) {
                await addTokenData(
                    sChain1,
                    sChain2,
                    chainName2,
                    tokens[chainName2].erc20[tokenSymbol],
                    tokenSymbol,
                    availableTokens,
                    true,
                    force
                );
            }
        }
    }
}


async function getM2STokensManual(
    mainnet: MainnetChain,
    sChain: SChain,
    chainName: string,
    availableTokens: any,
    tokens: any
) {
    if (tokens[MAINNET_CHAIN_NAME] && tokens[MAINNET_CHAIN_NAME].erc20) {
        for (const tokenSymbol in tokens[MAINNET_CHAIN_NAME].erc20) {
            if (tokens[MAINNET_CHAIN_NAME].erc20.hasOwnProperty(tokenSymbol)) {
                const tokenInfo = tokens[MAINNET_CHAIN_NAME].erc20[tokenSymbol];
                const cloneAddress = await sChain.erc20.getTokenCloneAddress(tokenInfo.address);
                availableTokens.erc20[tokenSymbol] = new TokenData(
                    cloneAddress,
                    tokenInfo.address,
                    tokenInfo.name,
                    tokenSymbol,
                    false,
                    tokenInfo.iconUrl,
                    null,
                    null
                );
                mainnet.erc20.addToken(tokenSymbol, initERC20(tokenInfo.address, mainnet.web3));
                sChain.erc20.addToken(tokenSymbol, initERC20(cloneAddress, sChain.web3));
            }
        }
    }
}



async function getM2STokensAutomatic(
    mainnet: MainnetChain,
    sChain: SChain,
    chainName: string,
    availableTokens: any,
    tokens: any
) {
    log('Getting token pairs...');
    const erc20Len = await mainnet.erc20.getTokenMappingsLength(chainName);

    if (erc20Len === '0') {
        log('No linked tokens, exiting.')
        return;
    }

    const erc20Tokens = await mainnet.erc20.getTokenMappings(chainName, 0, erc20Len); // todo: opt
    log('Number of token pairs: ' + erc20Len);
    for (const address of erc20Tokens) {
        const tokenContract = initERC20(address, mainnet.web3);
        const symbol = await tokenContract.methods.symbol().call();
        let name = await tokenContract.methods.name().call();
        const cloneAddress = await sChain.erc20.getTokenCloneAddress(address);
        let tokenIcon;

        const key = '_' + symbol + '_' + address;
        log('Adding token: ' + key);

        if (tokens[MAINNET_CHAIN_NAME] && tokens[MAINNET_CHAIN_NAME].erc20 && tokens[MAINNET_CHAIN_NAME].erc20[key]) {
            tokenIcon = tokens[MAINNET_CHAIN_NAME].erc20[key].iconUrl;
            if (tokens[MAINNET_CHAIN_NAME].erc20[key].name) {
                name = tokens[MAINNET_CHAIN_NAME].erc20[key].name
            }
        }

        if (chainName === MAINNET_CHAIN_NAME) {
            availableTokens.erc20[key] = new TokenData(
                cloneAddress,
                address,
                name,
                symbol,
                true,
                tokenIcon,
                null,
                null
            );
        } else {
            availableTokens.erc20[key] = new TokenData(
                cloneAddress,
                address,
                name,
                symbol,
                false,
                tokenIcon,
                null,
                null
            );
        }
        mainnet.erc20.addToken(key, initERC20(address, mainnet.web3));
        sChain.erc20.addToken(key, initERC20(cloneAddress, sChain.web3));
    }
}


async function addTokenData(
    sChain1: SChain,
    sChain2: SChain,
    sChainName: string,
    token: any,
    tokenSymbol: string,
    availableTokens: any,
    isClone: boolean,
    force: boolean
) {
    let cloneAddress;
    if (sChain1 && isClone) {
        cloneAddress = await getCloneAddress(sChain1, token.address, sChainName);
    }

    if (sChain2 && !isClone) {
        cloneAddress = await getCloneAddress(sChain2, token.address, sChainName);;
    }

    if (!cloneAddress) return;
    let unwrappedSymbol;
    let unwrappedAddress;
    if (token.wraps) {
        unwrappedSymbol = token.wraps.symbol;
        unwrappedAddress = token.wraps.address;
    }

    availableTokens.erc20[tokenSymbol] = new TokenData(
        cloneAddress,
        token.address,
        token.name,
        tokenSymbol,
        isClone,
        token.iconUrl,
        unwrappedSymbol,
        unwrappedAddress
    );

    addERC20TokenContracts(
        sChain1,
        sChain2,
        tokenSymbol,
        availableTokens.erc20[tokenSymbol],
        force
    );
}


async function getCloneAddress(
    sChain: SChain,
    originTokenAddress: string,
    originChainName: string
) {
    const tokenCloneAddress = await sChain.erc20.getTokenCloneAddress(
        originTokenAddress,
        originChainName
    );
    if (tokenCloneAddress === ZERO_ADDRESS) return;
    return tokenCloneAddress;
}


function addERC20TokenContracts(
    sChain1: SChain,
    sChain2: SChain,
    tokenSymbol: string,
    tokenData: TokenData,
    force: boolean
) {
    const chain1Address = tokenData.clone ? tokenData.cloneAddress : tokenData.originAddress;
    const chain2Address = tokenData.clone ? tokenData.originAddress : tokenData.cloneAddress;

    if (sChain1) { addERC20Token(sChain1, chain1Address, tokenSymbol, tokenData, force); };
    if (sChain2) { addERC20Token(sChain2, chain2Address, tokenSymbol, tokenData, force); };
}


function addERC20Token(
    sChain: SChain,
    address: string,
    tokenSymbol: string,
    tokenData: TokenData,
    force: boolean
) {
    if (!sChain.erc20.tokens[tokenSymbol] && !force) {
        if (tokenData.unwrappedSymbol) {
            sChain.erc20.addToken(
                tokenSymbol,
                initERC20Wrapper(address, sChain.web3)
            );
            sChain.erc20.addToken(
                tokenData.unwrappedSymbol,
                initERC20(tokenData.unwrappedAddress, sChain.web3)
            );
        } else {
            sChain.erc20.addToken(tokenSymbol, initERC20(address, sChain.web3));
        }
    }
}


export async function getTokenBalance(
    chainName: string,
    chain: any,
    tokenSymbol: string,
    address: string
): Promise<string> {
    const tokenContract = chain.erc20.tokens[tokenSymbol];
    const balance = await chain.getERC20Balance(tokenContract, address);
    externalEvents.balance(tokenSymbol, chainName, balance);
    return chain.web3.utils.fromWei(balance);
}


export async function getEthBalance(
    mainnet: MainnetChain,
    sChain: SChain,
    chainName: string,
    address: string
) {
    const ethBalance = isChainMainnet(chainName) ? await mainnet.ethBalance(address) : await sChain.ethBalance(address);
    externalEvents.balance('eth', chainName, ethBalance);
    return mainnet ? mainnet.web3.utils.fromWei(ethBalance) : sChain.web3.utils.fromWei(ethBalance);
}


export async function getTokenBalances(
    tokens: any,
    chainName: string,
    mainnet: MainnetChain,
    sChain1: SChain,
    sChain2: SChain,
    tokenSymbol: string,
    address: string
) {
    log('Getting token balances...');
    for (const [symbol, _] of Object.entries(tokens.erc20)) {
        if (chainName === MAINNET_CHAIN_NAME) {
            const balance = await getTokenBalance(
                chainName,
                mainnet,
                symbol,
                address
            );
            tokens.erc20[symbol].balance = balance;
        } else {
            const balance = await getTokenBalance(
                chainName,
                sChain1,
                symbol,
                address
            );
            tokens.erc20[symbol].balance = balance;
            if (tokens.erc20[symbol].unwrappedSymbol && !tokens.erc20[symbol].clone) {
                const wBalance = await getTokenBalance(
                    chainName,
                    sChain1,
                    tokens.erc20[symbol].unwrappedSymbol,
                    address
                );
                tokens.erc20[symbol].unwrappedBalance = wBalance;
            }
        }
    }
    if (tokens.eth) {
        tokens.eth.balance = await getEthBalance(
            mainnet,
            sChain1,
            chainName,
            address
        );
    };
    log('tokens with balances:');
    log(tokens);
}
