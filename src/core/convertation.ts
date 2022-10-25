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

import { Unit, toWei as _toWei, fromWei as _fromWei, unitMap, toBN } from 'web3-utils';


export function toWei(value: string, decimals: string): string {
    return _toWei(value, decimalsToUnit(decimals));
}

export function fromWei(value: string, decimals: string): string {
    return _fromWei(value, decimalsToUnit(decimals));
}

function decimalsToUnit(decimals: string): Unit {
    return Object.keys(unitMap).find(key => unitMap[key] === toBN(10).pow(toBN(decimals)).toString()) as Unit;
}