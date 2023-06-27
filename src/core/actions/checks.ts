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
import { Contract } from 'web3-eth-contract';
import { MainnetChain, SChain } from '@skalenetwork/ima-js';

import { fromWei } from '../convertation';
import TokenData from '../dataclasses/TokenData';
import * as interfaces from '../interfaces';
import { addressesEqual } from '../helper';
import { DEFAULT_ERC20_DECIMALS, SFUEL_RESERVE_AMOUNT } from '../constants';


debug.enable('*');
const log = debug('metaport:actions:checks');


export async function checkEthBalance( // TODO: optimize balance checks
    chain: MainnetChain | SChain,
    address: string,
    amount: string,
    tokenData: TokenData,
): Promise<interfaces.CheckRes> {
    const checkRes: interfaces.CheckRes = { res: false };

    try {
        const balance = await chain.ethBalance(address);
        log(`address: ${address}, eth balance: ${balance}, amount: ${amount}`);
        const balanceEther = fromWei(balance, tokenData.decimals);
        if (Number(amount) + SFUEL_RESERVE_AMOUNT > Number(balanceEther)) {
            checkRes.msg = `Current balance: ${balanceEther} ${tokenData.symbol}. \
            ${SFUEL_RESERVE_AMOUNT} ETH will be reserved to cover transfer costs.`;
        } else {
            checkRes.res = true;
        }
        return checkRes;
    } catch (err) {
        log(err);
        checkRes.msg = 'Something went wrong, check developer console';
        return checkRes;
    }
}


export async function checkERC20Balance(
    address: string,
    amount: string,
    tokenData: TokenData,
    tokenContract: Contract
): Promise<interfaces.CheckRes> {
    const checkRes: interfaces.CheckRes = { res: false };
    if (!amount || Number(amount) === 0) return checkRes;
    try {
        const balance = await tokenContract.methods.balanceOf(address).call();
        log(`address: ${address}, balanceWei: ${balance}, amount: ${amount}`);
        const balanceEther = fromWei(balance, tokenData.decimals);
        if (Number(amount) > Number(balanceEther)) {
            checkRes.msg = `Current balance: ${balanceEther} ${tokenData.symbol}`;
        } else {
            checkRes.res = true;
        }
        return checkRes;
    } catch (err) {
        log(err);
        checkRes.msg = 'Something went wrong, check developer console';
        return checkRes;
    }
}

export async function checkSFuelBalance(
    address: string,
    amount: string,
    sChain: SChain
): Promise<interfaces.CheckRes> {
    const checkRes: interfaces.CheckRes = { res: false };
    if (!amount || Number(amount) === 0) return checkRes;
    try {
        const balance = await sChain.web3.eth.getBalance(address);
        log(`address: ${address}, balanceWei: ${balance}, amount: ${amount}`);
        const balanceEther = fromWei(balance, DEFAULT_ERC20_DECIMALS);
        if (Number(amount) + SFUEL_RESERVE_AMOUNT > Number(balanceEther)) {
            checkRes.msg = `Current balance: ${balanceEther}. \
            ${SFUEL_RESERVE_AMOUNT} sFUEL will be reserved for transfers.`;
        } else {
            checkRes.res = true;
        }
        return checkRes;
    } catch (err) {
        log(err);
        checkRes.msg = 'Something went wrong, check developer console';
        return checkRes;
    }
}


export async function checkERC20Allowance(
    address: string,
    approvalAddress: string,
    amount: string,
    tokenData: TokenData,
    tokenContract: Contract
): Promise<interfaces.CheckRes> {
    const checkRes: interfaces.CheckRes = { res: false };
    if (!amount || Number(amount) === 0) return checkRes;
    try {
        const allowance = await tokenContract.methods.allowance(
            address,
            approvalAddress
        ).call();
        const allowanceEther = fromWei(allowance, tokenData.decimals);
        log(`allowanceEther: ${allowanceEther}, amount: ${amount}`);
        checkRes.res = Number(allowanceEther) >= Number(amount);
        return checkRes;
    } catch (err) {
        log(err);
        checkRes.msg = 'Something went wrong, check developer console';
        return checkRes;
    }
}


export async function checkERC721(
    address: string,
    approvalAddress: string,
    tokenId: number,
    tokenContract: Contract
): Promise<interfaces.CheckRes> {
    let approvedAddress: string;
    const checkRes: interfaces.CheckRes = { res: true, approved: false };
    if (!tokenId) return checkRes;
    try {
        approvedAddress = await tokenContract.methods.getApproved(tokenId).call();
        log(`approvedAddress: ${approvedAddress}, address: ${address}`);
    } catch (err) {
        log(err);
        checkRes.msg = 'tokenId does not exist, try again'
        return checkRes;
    }
    try {
        const currentOwner = await tokenContract.methods.ownerOf(tokenId).call();;
        log(`currentOwner: ${currentOwner}, address: ${address}`);
        if (!addressesEqual(currentOwner, address)) {
            checkRes.msg = 'This account is not an owner of this tokenId';
            return checkRes;
        }
    } catch (err) {
        log(err);
        checkRes.msg = 'Something went wrong, check developer console';
        return checkRes;
    }
    checkRes.approved = addressesEqual(approvedAddress, approvalAddress);
    return checkRes;
}


export async function checkERC1155(
    address: string,
    approvalAddress: string,
    tokenId: number,
    amount: string,
    tokenData: TokenData,
    tokenContract: Contract
): Promise<interfaces.CheckRes> {
    const checkRes: interfaces.CheckRes = { res: true, approved: false };
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
        log(err);
        checkRes.msg = 'Something went wrong, check developer console';
        return checkRes;
    }
    return checkRes;
}