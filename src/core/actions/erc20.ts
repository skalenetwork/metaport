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

import { MainnetChain, SChain } from '@skalenetwork/ima-js';

import { externalEvents } from '../events';
import { toWei } from '../convertation';
import { MAX_APPROVE_AMOUNT } from '../constants';

import { TransferAction, Action } from '../actions/action';
import { checkERC20Balance, checkERC20Allowance, checkSFuelBalance } from './checks';
import { CustomAbiTokenType } from '../dataclasses';


debug.enable('*');
const log = debug('metaport:actions:erc20');


export class TransferERC20S2S extends TransferAction {
    async execute() {
        this.updateState('init');
        const checkResAllowance = await checkERC20Allowance(
            this.address,
            this.sChain1.erc20.address,
            this.amount,
            this.token,
            this.sourceToken
        );
        const sChain = await this.getConnectedChain(
            this.sChain1.provider,
            this.token.wrapper(this.chainName2) ? CustomAbiTokenType.erc20wrap : null,
            this.token.wrapper(this.chainName2) ? this.chainName2 : null
        ) as SChain;
        if (!checkResAllowance.res) {
            this.updateState('approve');
            const approveTx = await sChain.erc20.approve(
                this.token.keyname,
                MAX_APPROVE_AMOUNT,
                sChain.erc20.address,
                { address: this.address }
            );
            const txBlock = await sChain.provider.getBlock(approveTx.blockNumber);
            this.updateState('approveDone', approveTx.hash, txBlock.timestamp);
            externalEvents.transactionCompleted(
                approveTx, txBlock.timestamp, this.chainName1, 'approve');
            log('ApproveERC20S:execute - tx completed: %O', approveTx);
        }

        // main transfer

        this.updateState('transfer');

        const amountWei = toWei(this.amount, this.token.meta.decimals);

        let balanceOnDestination;

        const tokenConnection = this.token.connections[this.chainName2];

        const isDestinationSFuel = tokenConnection.wrapsSFuel && tokenConnection.clone; // TODO!

        if (isDestinationSFuel) {
            balanceOnDestination = await this.sChain2.provider.getBalance(this.address);
        } else {
            balanceOnDestination = await this.sChain2.getERC20Balance(
                this.destToken,
                this.address
            );
        }
        const tx = await sChain.erc20.transferToSchain(
            this.chainName2,
            this.originAddress,
            amountWei,
            { address: this.address }
        );
        const block = await sChain.provider.getBlock(tx.blockNumber);
        this.updateState('transferDone', tx.hash, block.timestamp);
        if (isDestinationSFuel) {
            await this.sChain2.waitETHBalanceChange(
                this.address,
                balanceOnDestination
            );
        } else {
            await this.sChain2.waitERC20BalanceChange(
                this.destToken,
                this.address,
                balanceOnDestination
            );
        }
        this.updateState('received');
    }

    async preAction() {
        const checkResBalance = await checkERC20Balance(
            this.address,
            this.amount,
            this.token,
            this.sourceToken
        );
        if (!checkResBalance.res) {
            this.setAmountErrorMessage(checkResBalance.msg);
            return
        }
        this.setAmountErrorMessage(null);
    }
}


export class WrapSFuelERC20S extends Action {
    async execute() {
        log('WrapSFuelERC20S:execute - starting');
        this.updateState('wrap');
        const tx = await this.sChain1.erc20.fundExit(
            this.token.keyname,
            {
                address: this.address,
                value: this.amountWei
            }
        );
        const block = await this.sChain1.provider.getBlock(tx.blockNumber);
        this.updateState('wrapDone', tx.hash, block.timestamp);
        externalEvents.transactionCompleted(tx, block.timestamp, this.chainName1, 'wrapsfuel');
        log('WrapSFuelERC20S:execute - tx completed %O', tx);
    }

    async preAction() {
        log('WrapSFuelERC20S:preAction - starting');
        const checkResBalance = await checkSFuelBalance(
            this.address,
            this.amount,
            this.sChain1
        );
        if (!checkResBalance.res) {
            this.setAmountErrorMessage(checkResBalance.msg);
            return
        }
        this.setAmountErrorMessage(null);
    }
}


export class WrapERC20S extends Action {
    async execute() {
        this.updateState('init');
        const checkResAllowance = await checkERC20Allowance(
            this.address,
            this.token.connections[this.chainName2].wrapper,
            this.amount,
            this.token,
            this.unwrappedToken
        );
        const sChain = await this.getConnectedChain(this.sChain1.provider) as SChain;
        const wrapperToken = this.mpc.tokenContract(
            this.chainName1,
            this.token.keyname,
            this.token.type,
            sChain.provider,
            CustomAbiTokenType.erc20wrap,
            this.chainName2
        );
        sChain.erc20.addToken(`wrap_${this.token.keyname}`, wrapperToken);
        if (!checkResAllowance.res) {
            this.updateState('approveWrap');
            const approveTx = await sChain.erc20.approve(
                this.token.keyname,
                MAX_APPROVE_AMOUNT,
                this.token.address,
                { address: this.address }
            );
            const txBlock = await this.sChain1.provider.getBlock(approveTx.blockNumber);
            this.updateState('approveWrapDone', approveTx.hash, txBlock.timestamp);
        }
        this.updateState('wrap');
        const amountWei = toWei(this.amount, this.token.meta.decimals);
        const tx = await sChain.erc20.wrap(
            `wrap_${this.token.keyname}`,
            amountWei,
            { address: this.address }
        );
        const block = await this.sChain1.provider.getBlock(tx.blockNumber);
        this.updateState('wrapDone', tx.hash, block.timestamp);
    }

    async preAction() {
        const checkResBalance = await checkERC20Balance(
            this.address,
            this.amount,
            this.token,
            this.unwrappedToken
        );
        if (!checkResBalance.res) {
            this.setAmountErrorMessage(checkResBalance.msg);
            return
        }
        this.setAmountErrorMessage(null);
    }
}


// export class UnWrapERC20S2S123 extends Action {
//     static label = 'Unwrap'
//     static buttonText = 'Unwrap'
//     static loadingText = 'Unwrapping'
//     async execute() {
//         log('UnWrapERC20S2S:execute - starting');

//         const sChain = await this.getConnectedChain(this.sChain2.provider) as SChain;
//         this.updateState('unwrap');
//         try {
//             const amountWei = toWei(this.amount, this.token.meta.decimals);
//             const tx = await sChain.erc20.unwrap(
//                 this.token.keyname,
//                 amountWei,
//                 { address: this.address }
//             );
//             const block = await sChain.provider.getBlock(tx.blockNumber);
//             this.updateState('unwrapDone', tx.hash, block.timestamp);
//             externalEvents.transactionCompleted(tx, block.timestamp, this.chainName2, 'unwrap');
//             externalEvents.unwrapComplete(tx.hash, this.chainName2, this.token.keyname);
//             log('UnWrapERC20S2S:execute - tx completed %O', tx);
//         } finally {
//             // log('UnWrapERC20S2S:execute - switchMetamaskChain back');
//             // this.switchMetamaskChain(true);
//         }
//     }

//     async preAction() {
//         log('preAction: UnWrapERC20S2S');
//         const tokenContract = this.sChain2.erc20.tokens[this.token.keyname];
//         const checkResBalance = await checkERC20Balance(
//             this.address,
//             this.amount,
//             this.token,
//             tokenContract
//         );
//         if (!checkResBalance.res) {
//             this.setAmountErrorMessage(checkResBalance.msg);
//             return
//         }
//     }
// }


export class UnWrapERC20S extends Action {
    async execute() {
        const sChain = await this.getConnectedChain(
            this.sChain2.provider,
            CustomAbiTokenType.erc20wrap,
            this.chainName1
        ) as SChain;
        // const token = this.mpc.tokenContract(
        //     this.chainName2,
        //     this.token.keyname,
        //     this.token.type,
        //     sChain.provider,
        //     CustomAbiTokenType.erc20wrap,
        //     this.chainName1
        // );
        // sChain.erc20.addToken(this.token.keyname, token);
        this.updateState('unwrap');
        let tx;
        if (this.token.connections[this.chainName2].wrapsSFuel) {
            tx = await sChain.erc20.undoExit(
                this.token.keyname,
                { address: this.address }
            );
        } else {
            const amountWei = toWei(this.amount, this.token.meta.decimals);
            tx = await sChain.erc20.unwrap(
                this.token.keyname,
                amountWei,
                { address: this.address }
            );
        }
        log('UnWrapERC20S:execute - tx completed %O', tx);
        const block = await sChain.provider.getBlock(tx.blockNumber);
        this.updateState('unwrapDone', tx.hash, block.timestamp);
        externalEvents.transactionCompleted(tx, block.timestamp, this.chainName1, 'unwrap');
        externalEvents.unwrapComplete(tx, this.chainName2, this.token.keyname);
    }

    async preAction() {
        log('preAction: UnWrapERC20S');
        const tokenContract = this.sChain1.erc20.tokens[this.token.keyname];
        const checkResBalance = await checkERC20Balance(
            this.address,
            this.amount,
            this.token,
            tokenContract
        );
        if (!checkResBalance.res) {
            this.setAmountErrorMessage(checkResBalance.msg);
            return
        }
    }
}


export class TransferERC20M2S extends TransferAction {
    async execute() {
        this.updateState('init');

        // check approve + approve
        const checkResAllowance = await checkERC20Allowance(
            this.address,
            this.mainnet.erc20.address,
            this.amount,
            this.token,
            this.sourceToken
        );
        const mainnet = await this.getConnectedChain(this.mainnet.provider) as MainnetChain;
        if (!checkResAllowance.res) {
            this.updateState('approve');
            const approveTx = await mainnet.erc20.approve(
                this.token.keyname,
                MAX_APPROVE_AMOUNT,
                { address: this.address }
            );
            const txBlock = await mainnet.provider.getBlock(approveTx.blockNumber);
            this.updateState('approveDone', approveTx.hash, txBlock.timestamp);
        }
        this.updateState('transfer');
        const amountWei = toWei(this.amount, this.token.meta.decimals);
        // const destTokenContract = this.sChain2.erc20.tokens[this.token.keyname];
        const balanceOnDestination = await this.sChain2.getERC20Balance(
            this.destToken,
            this.address
        );
        const tx = await await mainnet.erc20.deposit(
            this.chainName2,
            this.token.keyname,
            amountWei,
            { address: this.address }
        );
        const block = await mainnet.provider.getBlock(tx.blockNumber);
        this.updateState('transferDone', tx.hash, block.timestamp);
        externalEvents.transactionCompleted(tx, block.timestamp, this.chainName1, 'deposit');
        log('TransferERC20M2S:execute - tx completed %O', tx);
        await this.sChain2.waitERC20BalanceChange(
            this.destToken, this.address, balanceOnDestination);
        this.updateState('received');
        log('TransferERC20M2S:execute - tokens received to destination chain');
        externalEvents.transferComplete(
            tx.hash,
            this.chainName1,
            this.chainName2,
            this.token.keyname,
            false
        );
    }

    async preAction() {
        const checkResBalance = await checkERC20Balance(
            this.address,
            this.amount,
            this.token,
            this.sourceToken
        );
        if (!checkResBalance.res) {
            this.setAmountErrorMessage(checkResBalance.msg);
            return
        }
        this.setAmountErrorMessage(null);
    }
}


export class TransferERC20S2M extends TransferAction {
    async execute() {
        this.updateState('init');
        // check approve + approve

        const checkResAllowance = await checkERC20Allowance(
            this.address,
            this.sChain1.erc20.address,
            this.amount,
            this.token,
            this.sourceToken
        );
        const sChain = await this.getConnectedChain(this.sChain1.provider) as SChain;
        if (!checkResAllowance.res) {
            this.updateState('approve');
            const approveTx = await sChain.erc20.approve(
                this.token.keyname,
                MAX_APPROVE_AMOUNT,
                sChain.erc20.address,
                { address: this.address }
            );
            const txBlock = await sChain.provider.getBlock(approveTx.blockNumber);
            this.updateState('approveDone', approveTx.hash, txBlock.timestamp);
            externalEvents.transactionCompleted(
                approveTx, txBlock.timestamp, this.chainName1, 'approve');
            log('ApproveERC20S:execute - tx completed: %O', approveTx);
        }
        this.updateState('transfer');
        const amountWei = toWei(this.amount, this.token.meta.decimals);
        const balanceOnDestination = await this.mainnet.getERC20Balance(
            this.destToken, this.address);
        const tx = await sChain.erc20.withdraw(
            this.originAddress,
            amountWei,
            { address: this.address }
        );
        const block = await sChain.provider.getBlock(tx.blockNumber);
        this.updateState('transferDone', tx.hash, block.timestamp);
        externalEvents.transactionCompleted(tx, block.timestamp, this.chainName1, 'withdraw');
        log('TransferERC20S2M:execute - tx completed %O', tx);
        this.mainnet.waitERC20BalanceChange(this.destToken, this.address, balanceOnDestination);
        this.updateState('received');
        log('TransferERC20S2M:execute - tokens received to destination chain');
        externalEvents.transferComplete(
            tx.hash,
            this.chainName1,
            this.chainName2,
            this.token.keyname,
            false
        );
    }

    async preAction() {
        const checkResBalance = await checkERC20Balance(
            this.address,
            this.amount,
            this.token,
            this.sourceToken
        );
        if (!checkResBalance.res) {
            this.setAmountErrorMessage(checkResBalance.msg);
            return
        }
        this.setAmountErrorMessage(null);
    }
}
