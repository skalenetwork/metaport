

import debug from 'debug';

import TokenData from './dataclasses/TokenData';
import * as interfaces from './interfaces/index';
import { MetaportConfig } from './interfaces/index';

import { getChainName, getChainIcon } from '../components/ChainsList/helper';
import { MAINNET_CHAIN_NAME } from './constants';


debug.enable('*');
const log = debug('metaport:core:transferSteps');


export function getTransferSteps(trReq: interfaces.TransferParams, config: MetaportConfig, theme: any, token: TokenData) {

    // TODO: refactor this function

    const steps = [];

    const toChain = trReq.route ? trReq.route.hub : trReq.chains[1];
    const toApp = trReq.route ? null : trReq.toApp;

    log('adding transfer step');
    steps.push(getTransferStep(
        trReq.chains[0],
        toChain,
        trReq.fromApp,
        toApp,
        token.symbol,
        config,
        theme
    ));

    if (trReq.route) {
        if (!token.clone) {
            log('adding wrap+transfer steps');
            steps.push(getWrapStep(
                trReq.route.hub,
                null,
                config,
                theme
            ));
            steps.push(getTransferStep(
                trReq.route.hub,
                trReq.chains[1],
                null,
                trReq.toApp,
                token.symbol,
                config,
                theme
            ));

        } else {
            log('adding unwrap+transfer steps');
            steps.push(getUnwrapStep(
                trReq.route.hub,
                null,
                config,
                theme
            ));
            steps.push(getTransferStep(
                trReq.route.hub,
                trReq.chains[1],
                null,
                toApp,
                token.symbol,
                config,
                theme
            ));
        }
    } else {
        if (token.unwrappedSymbol) {
            if (!token.clone) {
                log('adding wrap step');
                steps.unshift(getWrapStep(
                    trReq.chains[0],
                    trReq.fromApp,
                    config,
                    theme
                ));
            } else {
                log('adding unwrap step');
                steps.push(getUnwrapStep(
                    trReq.chains[1],
                    trReq.toApp,
                    config,
                    theme
                ));
            }
        }
    };
    if (trReq.chains[1] === MAINNET_CHAIN_NAME && (trReq.tokenKeyname === 'eth' || (trReq.route && trReq.route.tokenKeyname === 'eth'))) {
        log('adding unlock step');
        steps.push(getUnlockStep(
            trReq.chains[1],
            null,
            config,
            theme
        ))
    }
    return steps;
}


function getWrapStep(
    chain: string,
    app: string,
    config: MetaportConfig,
    theme: any
) {
    const chainName = getChainName(config.chainsMetadata, chain, app);
    const chainIcon = getChainIcon(chain, theme.dark, app);
    return {
        chainName: chainName,
        chainIcon: chainIcon,
        headline: 'Wrap on',
        text: `Wrap on ${chainName}. You may need to approve first.`,
        btnText: 'Wrap',
        btnLoadingText: 'Wrapping'
    }
}


function getUnwrapStep(
    chain: string,
    app: string,
    config: MetaportConfig,
    theme: any
) {
    const chainName = getChainName(config.chainsMetadata, chain, app);
    const chainIcon = getChainIcon(chain, theme.dark, app);
    return {
        chainName: chainName,
        chainIcon: chainIcon,
        headline: 'Unwrap on',
        text: `Unwrap on ${chainName}.`,
        btnText: 'Unwrap',
        btnLoadingText: 'Unwrapping'
    }
}


function getUnlockStep(
    chain: string,
    app: string,
    config: MetaportConfig,
    theme: any
) {
    const chainName = getChainName(config.chainsMetadata, chain, app);
    const chainIcon = getChainIcon(chain, theme.dark, app);
    return {
        chainName: chainName,
        chainIcon: chainIcon,
        headline: 'Unlock on',
        text: `You have to unlock your assets to be able to use it on ${chainName}.`,
        btnText: 'Unlock',
        btnLoadingText: 'Unlocking'
    }
}


function getTransferStep(
    fromChain: string,
    toChain: string,
    fromApp: string,
    toApp: string,
    tokenSymbol: string,
    config: MetaportConfig,
    theme: any
) {
    const fromChainName = getChainName(config.chainsMetadata, fromChain, fromApp);
    const toChainName = getChainName(config.chainsMetadata, toChain, toApp);
    const toChainIcon = getChainIcon(toChain, theme.dark, toApp);
    return {
        chainName: toChainName,
        chainIcon: toChainIcon,
        headline: 'Transfer to',
        text: `Transfer ${tokenSymbol.toUpperCase()} from ${fromChainName} to ${toChainName}.
            You may need to approve first.`,
        btnText: 'Transfer',
        btnLoadingText: 'Transferring'
    }
}