import 'mocha';
import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import { initSChain } from '../../src/core/core';
import { CHAIN_NAME_SCHAIN, CHAIN_NAME_SCHAIN_2, NETWORK_NAME } from '../test_utils';

import { getAvailableTokens } from '../../src/core/tokens';


describe("Test for tokens core module", () => {
    let sChainName1: string;
    let sChainName2: string;

    let sChain1: SChain;
    let sChain2: SChain;
    let mainnet: MainnetChain;

    let tokens: Object;

    before(async () => {
        sChain1 = initSChain(NETWORK_NAME, CHAIN_NAME_SCHAIN);
        sChain2 = initSChain(NETWORK_NAME, CHAIN_NAME_SCHAIN_2);

        tokens = {
            'rapping-zuben-elakrab': {
                'erc20': {
                'skEth': {
                        'address': '0xD8AA84EbC1CfafFa4968cDd493235A0ae0872b73',
                        'name': 'skETH',
                        'wraps': {
                        'address': '0xD2Aaa00700000000000000000000000000000000',
                        'symbol': 'ETHC'
                        }
                    }
                }
            }
        }
    });

    it.only("Test getAvailableTokens", async () => {
        const availableTokens = await getAvailableTokens(
            sChain1,
            sChain2,
            CHAIN_NAME_SCHAIN,
            CHAIN_NAME_SCHAIN_2,
            tokens
        );
        console.log(availableTokens);
    })
})