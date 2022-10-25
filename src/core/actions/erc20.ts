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

import { externalEvents } from '../events';
import { toWei, fromWei } from '../convertation';
import { MAX_APPROVE_AMOUNT } from '../constants';

import { TransferAction, Action } from './action';


debug.enable('*');
const log = debug('metaport:actions:erc20');


export class ApproveERC20S extends Action {
    static label = 'Approve transfer'
    static buttonText = 'Approve all'
    static loadingText = 'Approving'

    async execute() {
        await this.sChain1.erc20.approve(
            this.tokenData.keyname,
            MAX_APPROVE_AMOUNT,
            this.sChain1.erc20.address,
            { address: this.address }
        );
    }

    async preAction() {
        const tokenContract = this.sChain1.erc20.tokens[this.tokenData.keyname];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.sChain1.erc20.address
        ).call();
        const allowanceEther = fromWei(allowance, this.tokenData.decimals);
        if (Number(allowanceEther) >= Number(this.amount) && this.amount !== '') {
            const step = this.wrap ? 3 : 1;
            this.setActiveStep(step);
        }
    }
}


export class TransferERC20S2S extends TransferAction {
    async execute() {
        const amountWei = toWei(this.amount, this.tokenData.decimals);
        const destTokenContract = this.sChain2.erc20.tokens[this.tokenData.keyname];
        const balanceOnDestination = await this.sChain2.getERC20Balance(destTokenContract, this.address);

        const tx = await this.sChain1.erc20.transferToSchain(
            this.chainName2,
            this.tokenData.originAddress,
            amountWei,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for tokens to be received');
        log(tx);
        await this.sChain2.waitERC20BalanceChange(destTokenContract, this.address, balanceOnDestination);
        log('Tokens received to destination chain');

        const unwrap = !!this.tokenData.unwrappedSymbol && this.tokenData.clone;
        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenData.keyname,
            unwrap
        );
    }

    async preAction() {
        const tokenContract = this.sChain1.erc20.tokens[this.tokenData.keyname];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.sChain1.erc20.address
        ).call();
        const allowanceEther = fromWei(allowance, this.tokenData.decimals);
        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            const step = this.wrap ? 2 : 0;
            this.setActiveStep(step);
        }
    }
}


export class ApproveWrapERC20S extends Action {
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
        const allowanceEther = fromWei(allowance, this.tokenData.decimals);
        if (Number(allowanceEther) >= Number(this.amount) && this.amount !== '') {
            this.setActiveStep(1);
        }
    }
}


export class WrapERC20S extends Action {
    static label = 'Wrap'
    static buttonText = 'Wrap'
    static loadingText = 'Wrapping'

    async execute() {
        const amountWei = toWei(this.amount, this.tokenData.decimals);
        await this.sChain1.erc20.wrap(
            this.tokenData.keyname,
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
        const allowanceEther = fromWei(allowance, this.tokenData.decimals);
        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            this.setActiveStep(0);
        }
    }
}


export class UnWrapERC20S extends Action {
    static label = 'Unwrap'
    static buttonText = 'Unwrap'
    static loadingText = 'Unwrapping'

    async execute() {
        await this.switchMetamaskChain();
        const amountWei = toWei(this.amount, this.tokenData.decimals);
        const tx = await this.sChain2.erc20.unwrap(
            this.tokenData.keyname,
            amountWei,
            { address: this.address }
        );
        externalEvents.unwrapComplete(tx, this.chainName2, this.tokenData.keyname);
    }
}



export class ApproveERC20M extends Action {
    static label = 'Approve transfer'
    static buttonText = 'Approve all'
    static loadingText = 'Approving'

    async execute() {
        await this.mainnet.erc20.approve(
            this.tokenData.keyname,
            MAX_APPROVE_AMOUNT,
            { address: this.address }
        );
    }

    async preAction() {
        const tokenContract = this.mainnet.erc20.tokens[this.tokenData.keyname];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.mainnet.erc20.address
        ).call();
        const allowanceEther = fromWei(allowance, this.tokenData.decimals);
        if (Number(allowanceEther) >= Number(this.amount) && this.amount !== '') {
            this.setActiveStep(1);
        }
    }
}


export class TransferERC20M2S extends TransferAction {
    async execute() {
        const amountWei = toWei(this.amount, this.tokenData.decimals);
        const destTokenContract = this.sChain2.erc20.tokens[this.tokenData.keyname];
        const balanceOnDestination = await this.sChain2.getERC20Balance(
            destTokenContract,
            this.address
        );
        const tx = await await this.mainnet.erc20.deposit(
            this.chainName2,
            this.tokenData.keyname,
            amountWei,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for tokens to be received');
        log(tx);

        await this.sChain2.waitERC20BalanceChange(destTokenContract, this.address, balanceOnDestination);
        log('Tokens received to destination chain');

        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenData.keyname,
            false
        );
    }

    async preAction() {
        const tokenContract = this.mainnet.erc20.tokens[this.tokenData.keyname];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.mainnet.erc20.address
        ).call();
        const allowanceEther = fromWei(allowance, this.tokenData.decimals);
        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            this.setActiveStep(0);
        }
    }
}


export class TransferERC20S2M extends TransferAction {
    async execute() {
        const amountWei = toWei(this.amount, this.tokenData.decimals);
        const destTokenContract = this.mainnet.erc20.tokens[this.tokenData.keyname];
        const balanceOnDestination = await this.mainnet.getERC20Balance(destTokenContract, this.address);

        const tx = await this.sChain1.erc20.withdraw(
            this.tokenData.originAddress,
            amountWei,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for tokens to be received');
        log(tx);
        this.mainnet.waitERC20BalanceChange(destTokenContract, this.address, balanceOnDestination);
        log('Tokens received on destination chain');
        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenData.keyname,
            false
        );
    }

    async preAction() {
        const tokenContract = this.sChain1.erc20.tokens[this.tokenData.keyname];
        const allowance = await tokenContract.methods.allowance(
            this.address,
            this.sChain1.erc20.address
        ).call();
        const allowanceEther = fromWei(allowance, this.tokenData.decimals);
        if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
            this.setActiveStep(0);
        }
    }
}
