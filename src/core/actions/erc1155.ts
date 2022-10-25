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
import { Contract } from 'web3-eth-contract';

import { TransferAction, ApproveAction } from './action';

import { TokenType } from '../dataclasses/TokenType';
import { addressesEqual } from '../helper';

import TokenData from '../dataclasses/TokenData';



debug.enable('*');
const log = debug('metaport:actions:erc1155');


interface CheckRes {
    res: boolean;
    approved: boolean;
    msg?: string;
}


async function checkERC1155(
    address: string,
    approvalAddress: string,
    tokenId: number,
    amount: string,
    tokenData: TokenData,
    tokenContract: Contract
): Promise<CheckRes> {
    const checkRes: CheckRes = { res: true, approved: false };
    if (!tokenId || !amount) return checkRes;

    try {
        const balance = await tokenContract.methods.balanceOf(address, tokenId).call();
        log(`address: ${address}, balanceEther: ${balance}, amount: ${amount}`);
        if (Number(amount) > Number(balance)) {
            checkRes.msg = `Current balance: ${balance} ${tokenData.symbol}`;
        }
        checkRes.approved = await tokenContract.methods.isApprovedForAll(
            address,
            approvalAddress
        ).call();
    } catch (err) {
        console.error(err);
        checkRes.msg = 'Something went wrong, check developer console';
        return checkRes;
    }
    return checkRes;
}


export class ApproveERC1155M extends ApproveAction {
    async execute() {
        await this.mainnet.erc1155.approveAll(
            this.tokenData.keyname,
            { address: this.address }
        )
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
        if (checkRes.approved) this.setActiveStep(1);
    }
}


export class TransferERC1155M2S extends TransferAction {
    async execute() {
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
        log('Transfer transaction done, waiting for tokens to be received');
        await this.sChain2.waitERC1155BalanceChange(
            destTokenContract, this.address, this.tokenId, balanceOnDestination);
        log('Tokens received to destination chain');
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



export class ApproveERC1155S extends ApproveAction {
    async execute() {
        await this.sChain1.erc1155.approveAll(
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        );
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
        if (checkRes.approved) this.setActiveStep(1);
    }
}


export class TransferERC1155S2M extends TransferAction {
    async execute() {
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
        log('Transfer transaction done, waiting for tokens to be received');
        await this.mainnet.waitERC1155BalanceChange(
            destTokenContract, this.address, this.tokenId, balanceOnDestination);
        log('Tokens received to destination chain');
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


export class TransferERC1155S2S extends TransferAction {
    async execute() {
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
        log('Transfer transaction done, waiting for token to be received');
        await this.sChain2.waitERC1155BalanceChange(
            destTokenContract, this.address, this.tokenId, ownerOnDestination);
        log('Token received to destination chain');
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