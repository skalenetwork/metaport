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
 * @file erc721.ts
 * @copyright SKALE Labs 2022-Present
 */


import debug from 'debug';

import { TokenType } from '../dataclasses/TokenType';
import { externalEvents } from '../events';
import { toWei, fromWei } from '../convertation';
import { MAX_APPROVE_AMOUNT, ZERO_ADDRESS } from '../constants';

import { TransferAction, ApproveAction } from './action';


debug.enable('*');
const log = debug('metaport:actions:erc721');


export class ApproveERC721M extends ApproveAction {

    isMeta(): boolean {
        return this.tokenData.type === TokenType.erc721meta;
    }

    async execute() {
        this.isMeta() ? await this.mainnet.erc721meta.approve(
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        ) : await this.mainnet.erc721.approve(
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        )
    }
    async preAction() { // TODO: optimize! - reuse this code
        const tokenContract = this.isMeta() ? this.mainnet.erc721meta.tokens[this.tokenData.keyname] : this.mainnet.erc721.tokens[this.tokenData.keyname];
        if (!this.tokenId) {
            this.setAmountErrorMessage(undefined);
            return;
        }
        let approvedAddress: string;
        try {
            approvedAddress = await tokenContract.methods.getApproved(this.tokenId).call();
            log(`approvedAddress: ${approvedAddress}, address: ${this.address}`);
        } catch (err) {
            console.error(err);
            this.setAmountErrorMessage('tokenId does not exist, try again');
            return
        }
        try {
            const currentOwner = await this.mainnet.getERC721OwnerOf(tokenContract, this.tokenId);
            if (currentOwner !== this.address) {
                this.setAmountErrorMessage('This account is not an owner of this tokenId');
                return;
            }
        } catch (err) {
            this.setAmountErrorMessage(err);
            return;
        }
        this.setAmountErrorMessage(undefined);
        if (approvedAddress === this.address) this.setActiveStep(1);
    }
}


export class TransferERC721M2S extends TransferAction {

    isMeta(): boolean { return this.tokenData.type === TokenType.erc721meta; }

    async execute() {
        const destTokenContract = this.isMeta() ? this.sChain2.erc721meta.tokens[this.tokenData.keyname] : this.sChain2.erc721.tokens[this.tokenData.keyname];
        const ownerOnDestination = await this.sChain2.getERC721OwnerOf(
            destTokenContract,
            this.tokenId
        );
        const tx = this.isMeta() ? await this.mainnet.erc721meta.deposit(
            this.chainName2,
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        ) : await this.mainnet.erc721.deposit(
            this.chainName2,
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for token to be received');
        await this.sChain2.waitERC721OwnerChange(
            destTokenContract, this.tokenId, ownerOnDestination);
        log('Token received to destination chain');
        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenData.keyname,
            false
        );
    }

    async preAction() {
        // const tokenContract = this.mainnet.erc20.tokens[this.tokenData.keyname];
        // const allowance = await tokenContract.methods.allowance(
        //     this.address,
        //     this.mainnet.erc20.address
        // ).call();
        // const allowanceEther = fromWei(this.mainnet.web3, allowance, this.tokenData.decimals);
        // if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
        //     this.setActiveStep(0);
        // }
    }
}



export class ApproveERC721S extends ApproveAction {

    isMeta(): boolean { return this.tokenData.type === TokenType.erc721meta; }

    async execute() {
        this.isMeta() ? await this.sChain1.erc721meta.approve(
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        ) : await this.sChain1.erc721.approve(
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        )
    }

    async preAction() { // TODO: optimize! - reuse this code
        const tokenContract = this.isMeta() ? this.sChain1.erc721meta.tokens[this.tokenData.keyname] : this.sChain1.erc721.tokens[this.tokenData.keyname];
        if (!this.tokenId) {
            this.setAmountErrorMessage(undefined);
            return;
        }
        let approvedAddress: string;
        try {
            approvedAddress = await tokenContract.methods.getApproved(this.tokenId).call();
            log(`approvedAddress: ${approvedAddress}, address: ${this.address}`);
        } catch (err) {
            console.error(err);
            this.setAmountErrorMessage('tokenId does not exist, try again');
            return
        }
        try {
            const currentOwner = await this.sChain1.getERC721OwnerOf(tokenContract, this.tokenId);
            if (currentOwner !== this.address) {
                this.setAmountErrorMessage('This account is not an owner of this tokenId');
                return;
            }
        } catch (err) {
            this.setAmountErrorMessage(err);
            return;
        }
        this.setAmountErrorMessage(undefined);
        if (approvedAddress === this.address) this.setActiveStep(1);
    }
}


export class TransferERC721S2M extends TransferAction {
    isMeta(): boolean { return this.tokenData.type === TokenType.erc721meta; }

    async execute() {
        const destTokenContract = this.isMeta() ? this.mainnet.erc721meta.tokens[this.tokenData.keyname] : this.mainnet.erc721.tokens[this.tokenData.keyname];
        const ownerOnDestination = await this.mainnet.getERC721OwnerOf(
            destTokenContract,
            this.tokenId
        );
        const tx = this.isMeta() ? await this.sChain1.erc721meta.withdraw(
            this.tokenData.cloneAddress,
            this.tokenId,
            { address: this.address }
        ) : await this.sChain1.erc721.withdraw(
            this.tokenData.cloneAddress,
            this.tokenId,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for token to be received');
        await this.mainnet.waitERC721OwnerChange(
            destTokenContract, this.tokenId, ownerOnDestination);
        log('Token received to destination chain');
        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenData.keyname,
            false
        );
    }

    async preAction() {
        // const tokenContract = this.mainnet.erc20.tokens[this.tokenData.keyname];
        // const allowance = await tokenContract.methods.allowance(
        //     this.address,
        //     this.mainnet.erc20.address
        // ).call();
        // const allowanceEther = fromWei(this.mainnet.web3, allowance, this.tokenData.decimals);
        // if (Number(allowanceEther) < Number(this.amount) && this.amount !== '') {
        //     this.setActiveStep(0);
        // }
    }
}
