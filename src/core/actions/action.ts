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
 * @file action.ts
 * @copyright SKALE Labs 2022-Present
 */

import { MainnetChain, SChain } from '@skalenetwork/ima-js';
import TokenData from '../dataclasses/TokenData';
import { externalEvents } from '../events';
import { toWei, fromWei } from '../convertation';


export type ActionType = typeof Action;


export class Action {
    execute(): void { return; };
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
    amountWei: string
    tokenId: number
    tokenData: TokenData

    switchMetamaskChain: () => void
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
    activeStep: number

    setAmountErrorMessage: React.Dispatch<React.SetStateAction<string>>

    wrap: boolean

    constructor(
        mainnet: MainnetChain,
        sChain1: SChain,
        sChain2: SChain,
        chainName1: string,
        chainName2: string,
        address: string,
        amount: string,
        tokenId: number,
        tokenData: TokenData,
        switchMetamaskChain: () => void,
        setActiveStep: React.Dispatch<React.SetStateAction<number>>,
        activeStep: number,
        setAmountErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    ) {
        this.mainnet = mainnet;
        this.sChain1 = sChain1;
        this.sChain2 = sChain2;
        this.chainName1 = chainName1;
        this.chainName2 = chainName2;
        this.address = address;
        this.amount = amount;
        if (amount) this.amountWei = toWei(amount, tokenData.decimals);
        this.tokenId = Number(tokenId);
        this.tokenData = tokenData;
        this.switchMetamaskChain = switchMetamaskChain;

        this.setActiveStep = setActiveStep;
        this.activeStep = activeStep;

        this.setAmountErrorMessage = setAmountErrorMessage;

        if (this.tokenData) this.wrap = !!this.tokenData.unwrappedSymbol && !this.tokenData.clone;
    }
}


export abstract class TransferAction extends Action {
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


export abstract class ApproveAction extends Action {
    static label = 'Approve transfer'
    static buttonText = 'Approve'
    static loadingText = 'Approving'
}
