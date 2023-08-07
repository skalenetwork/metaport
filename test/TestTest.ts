
import { Wallet } from "ethers";

import MetaportCore from '../src/core/metaport'
import { TokenType } from "../src/core/dataclasses";
import { MainnetChain } from "@skalenetwork/ima-js";



const METAPORT_CONFIG = require('../src/metadata/metaportConfigStaging.json');
METAPORT_CONFIG.mainnetEndpoint = 'https://cloudflare-eth.com/';


describe("BASE LIB Test", () => {
    let wallet: Wallet;

    before(async () => {


    });

    it("Requests ETH balance for Mainnet chain", async () => {
        const mpc = new MetaportCore(METAPORT_CONFIG);

        const chain1 = 'mainnet';
        const chain2 = 'elated-tan-skat';
        const token = '_SKL_1';
        const tokenType = TokenType.erc20;

        const address = '';

        const tokens = mpc.tokens(chain1, chain2);

        console.log(tokens);

        // const provider1 = mpc.provider(chain1);
        // const provider2 = mpc.provider(chain2);

        const endp1 = mpc.endpoint(chain1);
        const endp2 = mpc.endpoint(chain2);

        const mainnetChain = mpc.mainnet();
        const sChain = mpc.schain(chain2);

        console.log('======');
        console.log(endp1);
        console.log(endp2);
        console.log('======');

        const bnr1 = await mainnetChain.provider.getBlockNumber();
        const bnr2 = await sChain.provider.getBlockNumber();

        // const contract2 = mpc.tokenContract(
        //     token.erc20[tokenKeyname],
        //     provider2
        // );

        const contract2 = mpc.tokenContract(
            chain2,
            token,
            tokenType,
            sChain.provider
        );

        console.log('-----');
        console.log(bnr1);
        console.log(bnr2);
        console.log('-------')
        console.log(await contract2.balanceOf(address));
        console.log('-----');

        console.log('-----');
        console.log(tokens.erc20);

        const tokenContracts = mpc.tokenContracts(
            tokens,
            TokenType.erc20,
            chain1,
            mainnetChain.provider
        );
        const tokenBalances = await mpc.tokenBalances(
            tokenContracts,
            address
        );

        const tokenContractsDest = mpc.tokenContracts(
            tokens,
            TokenType.erc20,
            chain2,
            sChain.provider
        );
        const tokenBalancesDest = await mpc.tokenBalances(
            tokenContractsDest,
            address
        );

        console.log('BALANCES:');
        console.log(tokenBalances);
        console.log(tokenBalancesDest);

        // console.log(await sChain.ethBalance(address));
        // console.log(await mainnetChain.ethBalance(address));
    });

});