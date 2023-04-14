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
 * @file erc1155.ts
 * @copyright SKALE Labs 2022-Present
 */


import debug from 'debug';

import { TransferAction } from './action';
import { checkERC1155 } from './checks';
import { externalEvents } from '../events';


debug.enable('*');
const log = debug('metaport:actions:erc1155');


export class TransferERC1155M extends TransferAction {
    async approve(): Promise<void> {
        const checkRes = await checkERC1155(
            this.address,
            this.mainnet.erc1155.address,
            this.tokenId,
            this.amount,
            this.tokenData,
            this.mainnet.erc1155.tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (!checkRes.approved) {
            log(`TransferERC1155M:execute - approving token ${this.tokenId} (${this.chainName1})`);
            const approveTx = await this.mainnet.erc1155.approveAll(
                this.tokenData.keyname,
                { address: this.address }
            )
            const txBlock = await this.mainnet.web3.eth.getBlock(approveTx.blockNumber);
            externalEvents.transactionCompleted(
                approveTx, txBlock.timestamp, this.chainName1, 'approve');
            log('TransferERC1155M:execute - approve tx completed: %O', approveTx);
        }
    }
}


export class TransferERC1155S extends TransferAction {
    async approve(): Promise<void> {
        const checkRes = await checkERC1155(
            this.address,
            this.sChain1.erc1155.address,
            this.tokenId,
            this.amount,
            this.tokenData,
            this.sChain1.erc1155.tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (!checkRes.approved) {
            log(`TransferERC1155S:execute - approving token ${this.tokenId} (${this.chainName1})`);
            const approveTx = await this.sChain1.erc1155.approveAll(
                this.tokenData.keyname,
                this.tokenId,
                { address: this.address }
            );
            const txBlock = await this.sChain1.web3.eth.getBlock(approveTx.blockNumber);
            externalEvents.transactionCompleted(
                approveTx, txBlock.timestamp, this.chainName1, 'approve');
            log('TransferERC1155M:execute - approve tx completed: %O', approveTx);
        }
    }
}


export class TransferERC1155M2S extends TransferERC1155M {
    async execute() {
        await this.approve();
        const destTokenContract = this.sChain2.erc1155.tokens[this.tokenData.keyname]
        const balanceOnDestination = await this.sChain2.getERC1155Balance(
            destTokenContract,
            this.address,
            this.tokenId
        );
        const tx = await this.mainnet.erc1155.deposit(
            this.chainName2,
            this.tokenData.keyname,
            this.tokenId,
            this.amount,
            { address: this.address }
        );
        const block = await this.mainnet.web3.eth.getBlock(tx.blockNumber);
        externalEvents.transactionCompleted(
            tx, block.timestamp, this.chainName1, 'deposit');
        log('TransferERC1155M2S:execute - tx completed %O', tx);
        await this.sChain2.waitERC1155BalanceChange(
            destTokenContract, this.address, this.tokenId, balanceOnDestination);
        log('TransferERC1155M2S:execute - tokens received to destination chain');
        this.transferComplete(tx);
    }

    async preAction() {
        const checkRes = await checkERC1155(
            this.address,
            this.mainnet.erc1155.address,
            this.tokenId,
            this.amount,
            this.tokenData,
            this.mainnet.erc1155.tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (!checkRes.approved) this.setActiveStep(0);
    }
}


export class TransferERC1155S2M extends TransferERC1155S {
    async execute() {
        await this.approve();
        const destTokenContract = this.mainnet.erc1155.tokens[this.tokenData.keyname];
        const balanceOnDestination = await this.mainnet.getERC1155Balance(
            destTokenContract,
            this.address,
            this.tokenId
        );
        const tx = await this.sChain1.erc1155.withdraw(
            this.tokenData.originAddress,
            this.tokenId,
            this.amount,
            { address: this.address }
        );
        const block = await this.sChain1.web3.eth.getBlock(tx.blockNumber);
        externalEvents.transactionCompleted(
            tx, block.timestamp, this.chainName1, 'withdraw');
        await this.mainnet.waitERC1155BalanceChange(
            destTokenContract, this.address, this.tokenId, balanceOnDestination);
        log('TransferERC1155S2M:execute - tokens received to destination chain');
        this.transferComplete(tx);
    }

    async preAction() {
        const checkRes = await checkERC1155(
            this.address,
            this.sChain1.erc1155.address,
            this.tokenId,
            this.amount,
            this.tokenData,
            this.sChain1.erc1155.tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (!checkRes.approved) this.setActiveStep(0);
    }
}


export class TransferERC1155S2S extends TransferERC1155S {
    async execute() {
        await this.approve();
        const destTokenContract = this.sChain2.erc1155.tokens[this.tokenData.keyname];
        const ownerOnDestination = await this.sChain2.getERC1155Balance(
            destTokenContract,
            this.address,
            this.tokenId
        );
        const tx = await this.sChain1.erc1155.transferToSchain(
            this.chainName2,
            this.tokenData.originAddress,
            this.tokenId,
            this.amount,
            { address: this.address }
        );
        const block = await this.sChain1.web3.eth.getBlock(tx.blockNumber);
        externalEvents.transactionCompleted(
            tx, block.timestamp, this.chainName1, 'transferToSchain');
        await this.sChain2.waitERC1155BalanceChange(
            destTokenContract, this.address, this.tokenId, ownerOnDestination);
        log('TransferERC1155S2S:execute - tokens received to destination chain');
        this.transferComplete(tx);
    }

    async preAction() {
        const checkRes = await checkERC1155(
            this.address,
            this.sChain1.erc1155.address,
            this.tokenId,
            this.amount,
            this.tokenData,
            this.sChain1.erc1155.tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (!checkRes.approved) this.setActiveStep(0);
    }
}