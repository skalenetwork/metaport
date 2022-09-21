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

import debug from 'debug';

import { MainnetChain, SChain } from '@skalenetwork/ima-js';

import { externalEvents } from './events';
import { toWei, fromWei } from './convertation';
import TokenData from './dataclasses/TokenData';
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


debug.enable('*');
const log = debug('metaport:actions');


export function getActionName(chainName1: string, chainName2: string, tokenSymbol: string): string {
    log('Getting action name: ' + chainName1 + ' ' + chainName2 + ' ' + tokenSymbol);
    if (!chainName1 || !chainName2 || !tokenSymbol) return;
    let prefix = ERC20_PREFIX;
    let postfix = S2S_POSTFIX;
    if (isChainMainnet(chainName1)) { postfix = M2S_POSTFIX; };
    if (isChainMainnet(chainName2)) { postfix = S2M_POSTFIX; };
    if (isEth(tokenSymbol) && (isChainMainnet(chainName1) || isChainMainnet(chainName2))) {
        prefix = ETH_PREFIX;
    };
    log('Action name: ' + prefix + postfix);
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
    preAction(): void { return; };

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

    switchMetamaskChain: () => void
    setActiveStep: (stepNumber: number) => void
    activeStep: number

    wrap: boolean

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
        switchMetamaskChain: () => void,
        setActiveStep: () => void,
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

        this.wrap = !!this.tokenData.unwrappedSymbol && !this.tokenData.clone;
    }
}


abstract class TransferAction extends Action {
    static label = 'Transfer'
    static buttonText = 'Transfer'
    static loadingText = 'Transferring'
}


class TransferEthM2S extends TransferAction {
    async execute() {
        // debug('TransferEthM2S: started');
        const amountWei = toWei(this.mainnet.web3, this.amount, this.tokenData.decimals);
        const sChainBalanceBefore = await this.sChain2.ethBalance(this.address);
        const tx = await this.mainnet.eth.deposit(
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


class TransferEthS2M extends TransferAction {
    async execute() {
        // debug('TransferEthS2M: started');
        const amountWei = toWei(this.sChain1.web3, this.amount, this.tokenData.decimals);
        const lockedETHAmount = await this.mainnet.eth.lockedETHAmount(this.address);
        const tx = await this.sChain1.eth.withdraw(
            amountWei,
            { address: this.address }
        );
        await this.mainnet.eth.waitLockedETHAmountChange(this.address, lockedETHAmount);
        externalEvents.transferComplete(tx, this.chainName1, this.chainName2, this.tokenSymbol);
    }
}


class UnlockEthM extends Action {
    static label = 'Unlock ETH'
    static buttonText = 'Unlock'
    static loadingText = 'Unlocking'

    async execute() {
        // debug('UnlockEthM: started');
        const tx = await this.mainnet.eth.getMyEth(
            { address: this.address }
        );
        externalEvents.ethUnlocked(tx);
    }
}


class ApproveERC20S extends Action {
    static label = 'Approve transfer'
    static buttonText = 'Approve all'
    static loadingText = 'Approving'

    async execute() {
        await this.sChain1.erc20.approve(
            this.tokenSymbol,
            MAX_APPROVE_AMOUNT,
            this.sChain1.erc20.address,
            { address: this.address }
        );
    }

    async preAction() {
        const tokenContract = this.sChain1.erc20.tokens[this.tokenSymbol];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.sChain1.erc20.address
        ).call();
        const allowanceEther = fromWei(this.sChain1.web3, allowance, this.tokenData.decimals);
        if (Number(allowanceEther) >= Number(this.amount) && this.amount !== '') {
            const step = this.wrap ? 3 : 1;
            this.setActiveStep(step);
        }
    }
}


class TransferERC20S2S extends TransferAction {
    async execute() {
        const amountWei = toWei(this.sChain1.web3, this.amount, this.tokenData.decimals);
        const destTokenContract = this.sChain2.erc20.tokens[this.tokenSymbol];
        const balanceOnDestination = await this.sChain2.getERC20Balance(destTokenContract, this.address);

        const tx = await this.sChain1.erc20.transferToSchain(
            this.chainName2,
            this.tokenData.originAddress,
            amountWei,
            { address: this.address }
        );
        // debug console.log('Transfer transaction done, waiting for money to be received');
        await this.sChain2.waitERC20BalanceChange(destTokenContract, this.address, balanceOnDestination);
        // debug console.log('Money to be received to destination chain');

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
        const tokenContract = this.sChain1.erc20.tokens[this.tokenSymbol];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.sChain1.erc20.address
        ).call();
        const allowanceEther = fromWei(this.sChain1.web3, allowance, this.tokenData.decimals);
        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            const step = this.wrap ? 2 : 0;
            this.setActiveStep(step);
        }
    }
}


class ApproveWrapERC20S extends Action {
    static label = 'Approve wrap'
    static buttonText = 'Approve all'
    static loadingText = 'Approving'

    async execute() {
        await this.sChain1.erc20.approve(
            this.tokenData.unwrappedSymbol,
            MAX_APPROVE_AMOUNT,
            this.tokenData.originAddress,
            { address: this.address }
        );
    }

    async preAction() {
        const tokenContract = this.sChain1.erc20.tokens[this.tokenData.unwrappedSymbol];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.tokenData.originAddress
        ).call();
        const allowanceEther = fromWei(this.sChain1.web3, allowance, this.tokenData.decimals);
        if (Number(allowanceEther) >= Number(this.amount) && this.amount !== '') {
            this.setActiveStep(1);
        }
    }
}


class WrapERC20S extends Action {
    static label = 'Wrap'
    static buttonText = 'Wrap'
    static loadingText = 'Wrapping'

    async execute() {
        const amountWei = toWei(this.sChain1.web3, this.amount, this.tokenData.decimals);
        await this.sChain1.erc20.wrap(
            this.tokenSymbol,
            amountWei,
            { address: this.address }
        );
    }

    async preAction() {
        const tokenContract = this.sChain1.erc20.tokens[this.tokenData.unwrappedSymbol];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.tokenData.originAddress
        ).call();
        const allowanceEther = fromWei(this.sChain1.web3, allowance, this.tokenData.decimals);
        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            this.setActiveStep(0);
        }
    }
}


class UnWrapERC20S extends Action {
    static label = 'Unwrap'
    static buttonText = 'Unwrap'
    static loadingText = 'Unwrapping'

    async execute() {
        await this.switchMetamaskChain();
        const amountWei = toWei(this.sChain2.web3, this.amount, this.tokenData.decimals);
        const tx = await this.sChain2.erc20.unwrap(
            this.tokenSymbol,
            amountWei,
            { address: this.address }
        );
        externalEvents.unwrapComplete(tx, this.chainName2, this.tokenSymbol);
    }
}



class ApproveERC20M extends Action {
    static label = 'Approve transfer'
    static buttonText = 'Approve all'
    static loadingText = 'Approving'

    async execute() {
        await this.mainnet.erc20.approve(
            this.tokenSymbol,
            MAX_APPROVE_AMOUNT,
            { address: this.address }
        );
    }

    async preAction() {
        const tokenContract = this.mainnet.erc20.tokens[this.tokenSymbol];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.mainnet.erc20.address
        ).call();
        const allowanceEther = fromWei(this.mainnet.web3, allowance, this.tokenData.decimals);
        if (Number(allowanceEther) >= Number(this.amount) && this.amount !== '') {
            this.setActiveStep(1);
        }
    }
}


class TransferERC20M2S extends TransferAction {
    async execute() {
        const amountWei = toWei(this.mainnet.web3, this.amount, this.tokenData.decimals);
        const destTokenContract = this.sChain2.erc20.tokens[this.tokenSymbol];
        const balanceOnDestination = await this.sChain2.getERC20Balance(
            destTokenContract,
            this.address
        );
        const tx = await await this.mainnet.erc20.deposit(
            this.chainName2,
            this.tokenSymbol,
            amountWei,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for money to be received');

        await this.sChain2.waitERC20BalanceChange(destTokenContract, this.address, balanceOnDestination);
        log('Money to be received to destination chain');

        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenSymbol,
            false
        );
    }

    async preAction() {
        const tokenContract = this.mainnet.erc20.tokens[this.tokenSymbol];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.mainnet.erc20.address
        ).call();
        const allowanceEther = fromWei(this.mainnet.web3, allowance, this.tokenData.decimals);
        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            this.setActiveStep(0);
        }
    }
}


class TransferERC20S2M extends TransferAction {
    async execute() {
        const amountWei = toWei(this.sChain1.web3, this.amount, this.tokenData.decimals);
        const destTokenContract = this.mainnet.erc20.tokens[this.tokenSymbol];
        const balanceOnDestination = await this.mainnet.getERC20Balance(destTokenContract, this.address);

        const tx = await this.sChain1.erc20.withdraw(
            this.tokenData.originAddress,
            amountWei,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for money to be received');
        this.mainnet.waitERC20BalanceChange(destTokenContract, this.address, balanceOnDestination);
        log('Money received on destination chain');
        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenSymbol,
            false
        );
    }

    async preAction() {
        const tokenContract = this.sChain1.erc20.tokens[this.tokenSymbol];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.sChain1.erc20.address
        ).call();
        const allowanceEther = fromWei(this.sChain1.web3, allowance, this.tokenData.decimals);
        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            this.setActiveStep(0);
        }
    }
}



const wrapActions = [ApproveWrapERC20S, WrapERC20S];
const unwrapActions = [UnWrapERC20S];


export const actions = {
    eth_m2s: [TransferEthM2S],
    eth_s2m: [TransferEthS2M, UnlockEthM],
    erc20_s2s: [ApproveERC20S, TransferERC20S2S],
    erc20_m2s: [ApproveERC20M, TransferERC20M2S],
    erc20_s2m: [ApproveERC20S, TransferERC20S2M],
}


export function getActionSteps(
    actionName: string,
    tokenData: TokenData
) {
    const actionsList = [];
    if (tokenData.unwrappedSymbol && !tokenData.clone) {
        actionsList.push(...wrapActions);
    }
    actionsList.push(...actions[actionName]);
    if (tokenData.unwrappedSymbol && tokenData.clone) {
        actionsList.push(...unwrapActions);
    }
    return actionsList;
}

