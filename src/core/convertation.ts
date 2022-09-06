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
 * @file convertation.ts
 * @copyright SKALE Labs 2022-Present
 */

import Web3 from 'web3';
import { Unit } from 'web3-utils';


export function toWei(web3: Web3, value: string, decimals: string): string {
    return web3.utils.toWei(value, decimalsToUnit(web3, decimals));
}

export function fromWei(web3: Web3, value: string, decimals: string): string {
    return web3.utils.fromWei(value, decimalsToUnit(web3, decimals));
}

function decimalsToUnit(web3: Web3, decimals: string): Unit {
    return Object.keys(web3.utils.unitMap).find(key => web3.utils.unitMap[key] === web3.utils.toBN(10).pow(web3.utils.toBN(decimals)).toString()) as Unit;
}