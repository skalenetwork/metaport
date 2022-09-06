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
 * @file TokenData.ts
 * @copyright SKALE Labs 2022-Present
 */

import { ETH_TOKEN_NAME, DEFAULT_ERC20_DECIMALS } from '../constants';


export default class TokenData {
    originAddress: string
    cloneAddress: string

    name: string
    symbol: string

    clone: boolean
    type: string
    balance: number

    iconUrl: string

    unwrappedSymbol: string
    unwrappedAddress: string
    unwrappedBalance: number

    decimals: string

    constructor(
        cloneAddress: string,
        originAddress: string,
        name: string,
        symbol: string,
        clone: boolean,
        iconUrl: string,
        unwrappedSymbol: string,
        unwrappedAddress: string,
        decimals: string
    ) {
        this.cloneAddress = cloneAddress;
        this.originAddress = originAddress;

        this.unwrappedAddress = unwrappedAddress;
        this.unwrappedSymbol = unwrappedSymbol;

        this.name = name;
        this.symbol = symbol;
        this.clone = clone;
        this.iconUrl = iconUrl;

        this.decimals = decimals ? decimals : DEFAULT_ERC20_DECIMALS;
        this.type = (name === ETH_TOKEN_NAME) ? 'eth' : 'erc20'
    }
}

