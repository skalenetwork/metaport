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
 * @file eth.ts
 * @copyright SKALE Labs 2022-Present
 */


import debug from 'debug';

import { externalEvents } from '../events';
import { toWei } from '../convertation';
import { TransferAction, Action } from './action';
import { checkEthBalance, checkERC20Balance } from './checks';


debug.enable('*');
const log = debug('metaport:actions:eth');


export class TransferEthM2S extends TransferAction {
    async execute() {
        log('TransferEthM2S: started');
        const amountWei = toWei(this.amount, this.tokenData.decimals);
        const sChainBalanceBefore = await this.sChain2.ethBalance(this.address);
        const tx = await this.mainnet.eth.deposit(
            this.chainName2,
            {
                address: this.address,
                value: amountWei
            }
        );
        await this.sChain2.waitETHBalanceChange(this.address, sChainBalanceBefore);
        externalEvents.transferComplete(tx, this.chainName1, this.chainName2, this.tokenData.keyname);
    }

    async preAction() {
        const checkResBalance = await checkEthBalance(
            this.mainnet,
            this.address,
            this.amount,
            this.tokenData
        );
        if (!checkResBalance.res) this.setAmountErrorMessage(checkResBalance.msg);
    }
}


export class TransferEthS2M extends TransferAction {
    async execute() {
        log('TransferEthS2M: started');
        const amountWei = toWei(this.amount, this.tokenData.decimals);
        const lockedETHAmount = await this.mainnet.eth.lockedETHAmount(this.address);
        const tx = await this.sChain1.eth.withdraw(
            amountWei,
            { address: this.address }
        );
        await this.mainnet.eth.waitLockedETHAmountChange(this.address, lockedETHAmount);
        externalEvents.transferComplete(tx, this.chainName1, this.chainName2, this.tokenData.keyname);
    }

    async preAction() {
        const checkResBalance = await checkEthBalance(
            this.sChain1,
            this.address,
            this.amount,
            this.tokenData
        );
        if (!checkResBalance.res) this.setAmountErrorMessage(checkResBalance.msg);
    }
}


export class UnlockEthM extends Action {
    static label = 'Unlock ETH'
    static buttonText = 'Unlock'
    static loadingText = 'Unlocking'

    async execute() {
        log('UnlockEthM: started');
        const tx = await this.mainnet.eth.getMyEth(
            { address: this.address }
        );
        externalEvents.ethUnlocked(tx);
    }
}

