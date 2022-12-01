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

import { Action } from './action';
import { TokenType } from '../dataclasses/TokenType';
import { externalEvents } from '../events';
import { checkERC721 } from './checks';


debug.enable('*');
const log = debug('metaport:actions:erc721');


class ERC721Action extends Action {
    isMeta(): boolean { return this.tokenData.type === TokenType.erc721meta; };
    mn() { return this.isMeta() ? this.mainnet.erc721meta : this.mainnet.erc721; };
    s1() { return this.isMeta() ? this.sChain1.erc721meta : this.sChain1.erc721; };
    s2() { return this.isMeta() ? this.sChain2.erc721meta : this.sChain2.erc721; };
}

class ERC721Approve extends ERC721Action {
    static label = 'Approve transfer'
    static buttonText = 'Approve'
    static loadingText = 'Approving'
}

class ERC721Transfer extends ERC721Action {
    static label = 'Transfer'
    static buttonText = 'Transfer'
    static loadingText = 'Transferring'

    transferComplete(tx): void {
        externalEvents.transferComplete(
            tx,
            this.chainName1,
            this.chainName2,
            this.tokenData.keyname,
            false
        );
    }
}


export class ApproveERC721M extends ERC721Approve {
    async execute() {
        await this.mn().approve(
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        )
    }
    async preAction() {
        const checkRes = await checkERC721(
            this.address,
            this.mn().address,
            this.tokenId,
            this.mn().tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (checkRes.approved) this.setActiveStep(1);
    }
}


export class TransferERC721M2S extends ERC721Transfer {
    async execute() {
        const destTokenContract = this.s2().tokens[this.tokenData.keyname]
        const ownerOnDestination = await this.sChain2.getERC721OwnerOf(
            destTokenContract,
            this.tokenId
        );
        const tx = await this.mn().deposit(
            this.chainName2,
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for token to be received');
        await this.sChain2.waitERC721OwnerChange(
            destTokenContract, this.tokenId, ownerOnDestination);
        log('Token received to destination chain');
        this.transferComplete(tx);
    }

    async preAction() {
        const checkRes = await checkERC721(
            this.address,
            this.mn().address,
            this.tokenId,
            this.mn().tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (!checkRes.approved) this.setActiveStep(0);
    }
}



export class ApproveERC721S extends ERC721Approve {
    async execute() {
        await this.s1().approve(
            this.tokenData.keyname,
            this.tokenId,
            { address: this.address }
        );
    }
    async preAction() {
        const checkRes = await checkERC721(
            this.address,
            this.s1().address,
            this.tokenId,
            this.s1().tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (checkRes.approved) this.setActiveStep(1);
    }
}


export class TransferERC721S2M extends ERC721Transfer {
    async execute() {
        const destTokenContract = this.mn().tokens[this.tokenData.keyname];
        const ownerOnDestination = await this.mainnet.getERC721OwnerOf(
            destTokenContract,
            this.tokenId
        );
        const tx = await this.s1().withdraw(
            this.tokenData.originAddress,
            this.tokenId,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for token to be received');
        await this.mainnet.waitERC721OwnerChange(
            destTokenContract, this.tokenId, ownerOnDestination);
        log('Token received to destination chain');
        this.transferComplete(tx);
    }

    async preAction() {
        const checkRes = await checkERC721(
            this.address,
            this.s1().address,
            this.tokenId,
            this.s1().tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (!checkRes.approved) this.setActiveStep(0);
    }
}


export class TransferERC721S2S extends ERC721Transfer {
    async execute() {
        const destTokenContract = this.s2().tokens[this.tokenData.keyname];
        const ownerOnDestination = await this.sChain2.getERC721OwnerOf(
            destTokenContract,
            this.tokenId
        );
        const tx = await this.sChain1.erc721.transferToSchain(
            this.chainName2,
            this.tokenData.originAddress,
            this.tokenId,
            { address: this.address }
        );
        log('Transfer transaction done, waiting for token to be received');
        await this.sChain2.waitERC721OwnerChange(
            destTokenContract, this.tokenId, ownerOnDestination);
        log('Token received to destination chain');
        this.transferComplete(tx);
    }

    async preAction() {
        const checkRes = await checkERC721(
            this.address,
            this.s1().address,
            this.tokenId,
            this.s1().tokens[this.tokenData.keyname]
        );
        this.setAmountErrorMessage(checkRes.msg);
        if (!checkRes.approved) this.setActiveStep(0);
    }
}