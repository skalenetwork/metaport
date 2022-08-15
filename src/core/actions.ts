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
 * @file actions.ts
 * @copyright SKALE Labs 2022-Present
 */

import { MainnetChain, SChain } from '@skalenetwork/ima-js';

import debug from './debug';
import { externalEvents } from './events';
import { TokenData } from './tokens';
import {
    MAINNET_CHAIN_NAME,
    ETH_TOKEN_NAME,
    ETH_PREFIX,
    ERC20_PREFIX,
    S2S_POSTFIX,
    M2S_POSTFIX,
    S2M_POSTFIX,
    MAX_APPROVE_AMOUNT
} from './constants';


export function getActionName(chainName1: string, chainName2: string, tokenSymbol: string): string {
    if (!chainName1 || !chainName2 || !tokenSymbol) return;
    let prefix = ERC20_PREFIX;
    let postfix = S2S_POSTFIX;
    if (isChainMainnet(chainName1)) { postfix = M2S_POSTFIX; };
    if (isChainMainnet(chainName2)) { postfix = S2M_POSTFIX; };
    if (isEth(tokenSymbol) && (isChainMainnet(chainName1) || isChainMainnet(chainName2))) {
        prefix = ETH_PREFIX;
    };
    return prefix + postfix;
}


export function isChainMainnet(chainName: string): boolean {
    return chainName === MAINNET_CHAIN_NAME;
}

export function isEth(tokenSymbol: string): boolean {
    return tokenSymbol === ETH_TOKEN_NAME;
}


abstract class Action {
    abstract execute(): void;
    preAction(): void {};

    static label: string = '';
    static buttonText: string = '';
    static loadingText: string = '';

    mainnet: MainnetChain
    sChain1: SChain
    sChain2: SChain
    chainName1: string
    chainName2: string
    address: string
    amount: string
    tokenSymbol: string
    tokenData: TokenData

    switchMetamaskChain: Function

    setActiveStep: Function
    activeStep: number

    constructor(
        mainnet: MainnetChain,
        sChain1: SChain,
        sChain2: SChain,
        chainName1: string,
        chainName2: string,
        address: string,
        amount: string,
        tokenSymbol: string,
        tokenData: TokenData,
        switchMetamaskChain: Function,
        setActiveStep: Function,
        activeStep: number
    ) {
        this.mainnet = mainnet;
        this.sChain1 = sChain1;
        this.sChain2 = sChain2;
        this.chainName1 = chainName1;
        this.chainName2 = chainName2;
        this.address = address;
        this.amount = amount;
        this.tokenSymbol = tokenSymbol;
        this.tokenData = tokenData;
        this.switchMetamaskChain = switchMetamaskChain;

        this.setActiveStep = setActiveStep;
        this.activeStep = activeStep;
    }
}


abstract class TransferAction extends Action {
    static label = 'Transfer'
    static buttonText = 'Transfer'
    static loadingText = 'Transfering'
}


class TransferETH_M2S extends TransferAction {
    async execute() {
        debug('TransferETH_M2S: started');
        const amountWei = this.mainnet.web3.utils.toWei(this.amount);
        let sChainBalanceBefore = await this.sChain2.ethBalance(this.address);
        let tx = await this.mainnet.eth.deposit(
            this.chainName2,
            {
                address: this.address,
                value: amountWei
            }
        );
        await this.sChain2.waitETHBalanceChange(this.address, sChainBalanceBefore);
        externalEvents.transferComplete(tx, this.chainName1, this.chainName2, this.tokenSymbol);
    }
}


class TransferETH_S2M extends TransferAction {
    async execute() {
        debug('TransferETH_S2M: started');
        const amountWei = this.sChain1.web3.utils.toWei(this.amount);
        let lockedETHAmount = await this.mainnet.eth.lockedETHAmount(this.address);
        let tx = await this.sChain1.eth.withdraw(
            amountWei,
            { address: this.address }
        );
        await this.mainnet.eth.waitLockedETHAmountChange(this.address, lockedETHAmount);
        externalEvents.transferComplete(tx, this.chainName1, this.chainName2, this.tokenSymbol);
    }
}


class UnlockETH_M extends Action {
    static label = 'Unlock ETH'
    static buttonText = 'Unlock'
    static loadingText = 'Unlocking'

    async execute() {
        debug('UnlockETH_M: started');
        let tx = await this.mainnet.eth.getMyEth(
            { address: this.address }
        );
        externalEvents.ethUnlocked(tx);
    }
}


class ApproveERC20_S extends Action {
    static label = 'Approve transfer'
    static buttonText = 'Approve all'
    static loadingText = 'Approving'

    async execute() {
        // const amountWei = this.sChain1.web3.utils.toWei(this.amount);
        await this.sChain1.erc20.approve(
            this.tokenSymbol,
            MAX_APPROVE_AMOUNT,
            this.sChain1.erc20.address,
            {address: this.address}
        );
    }

    async preAction() {
        let tokenContract = this.sChain1.erc20.tokens[this.tokenSymbol];
        let allowance = await tokenContract.methods.allowance(
            this.address,
            this.sChain1.erc20.address
        ).call();
        let allowanceEther = this.sChain1.web3.utils.fromWei(allowance);
        if (Number(allowanceEther) >= Number(this.amount) && this.amount !== '') {
            this.setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }
}


class TransferERC20_S2S extends TransferAction {
    async execute() {
        const amountWei = this.sChain1.web3.utils.toWei(this.amount);
        let destTokenContract = this.sChain2.erc20.tokens[this.tokenSymbol];
        let balanceOnDestination = await this.sChain2.getERC20Balance(destTokenContract, this.address);
    
        let tx = await this.sChain1.erc20.transferToSchain(
            this.chainName2,
            this.tokenData.originAddress,
            amountWei,
            {address: this.address}
        );
        console.log('Transfer transaction done, waiting for money to be received');
        await this.sChain2.waitERC20BalanceChange(destTokenContract, this.address, balanceOnDestination);
        console.log('Money to be received to destination chain');

        const unwrap = !!this.tokenData.unwrappedSymbol && this.tokenData.clone;
        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenSymbol,
            unwrap
        );
    }

    async preAction() {
        let tokenContract = this.sChain1.erc20.tokens[this.tokenSymbol];
        let allowance = await tokenContract.methods.allowance(
            this.address,
            this.sChain1.erc20.address
        ).call();
        let allowanceEther = this.sChain1.web3.utils.fromWei(allowance);

        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            this.setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    }
}


class ApproveWrapERC20_S extends Action {
    static label = 'Approve wrap'
    static buttonText = 'Approve all'
    static loadingText = 'Approving'

    async execute() {
        // const amountWei = this.sChain1.web3.utils.toWei(this.amount);        
        await this.sChain1.erc20.approve(
            this.tokenData.unwrappedSymbol,
            MAX_APPROVE_AMOUNT,
            this.tokenData.originAddress,
            {address: this.address}
        );
    }

    async preAction() {
        let tokenContract = this.sChain1.erc20.tokens[this.tokenData.unwrappedSymbol];
        let allowance = await tokenContract.methods.allowance(
            this.address,
            this.tokenData.originAddress
        ).call();
        let allowanceEther = this.sChain1.web3.utils.fromWei(allowance);

        if (Number(allowanceEther) >= Number(this.amount) && this.amount !== '') {
            this.setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }
}


class WrapERC20_S extends Action {
    static label = 'Wrap'
    static buttonText = 'Wrap'
    static loadingText = 'Wrapping'

    async execute() {
        const amountWei = this.sChain1.web3.utils.toWei(this.amount);
        await this.sChain1.erc20.wrap(
            this.tokenSymbol,
            amountWei,
            {address: this.address}
        );
    }

    async preAction() {
        let tokenContract = this.sChain1.erc20.tokens[this.tokenData.unwrappedSymbol];
        let allowance = await tokenContract.methods.allowance(
            this.address,
            this.tokenData.originAddress
        ).call();
        let allowanceEther = this.sChain1.web3.utils.fromWei(allowance);

        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            this.setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    }
}


class UnwrapERC20_S extends Action {
    static label = 'Unwrap'
    static buttonText = 'Unwrap'
    static loadingText = 'Unwrapping'

    async execute() {
        await this.switchMetamaskChain();
        const amountWei = this.sChain2.web3.utils.toWei(this.amount);
        const tx = await this.sChain2.erc20.unwrap(
            this.tokenSymbol,
            amountWei,
            {address: this.address}
        );
        externalEvents.unwrapComplete(tx, this.chainName2, this.tokenSymbol);
    }
}


const wrapActions = [ApproveWrapERC20_S, WrapERC20_S];
const unwrapActions = [UnwrapERC20_S];


export const actions = {
    eth_m2s: [TransferETH_M2S],
    eth_s2m: [TransferETH_S2M, UnlockETH_M],
    erc20_s2s: [ApproveERC20_S, TransferERC20_S2S]
}


export function getActionSteps(
    actionName: string,
    tokenData: TokenData
) {
    let actionsList = [];
    if (tokenData.unwrappedSymbol && !tokenData.clone) {
        actionsList.push(...wrapActions);
    }
    actionsList.push(...actions[actionName]);
    if (tokenData.unwrappedSymbol && tokenData.clone) {
        actionsList.push(...unwrapActions);
    }
    return actionsList;
}

