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
 * @file EthTokenData.ts
 * @copyright SKALE Labs 2022-Present
 */

import { ETH_ERC20_ADDRESS } from '../constants';
import { TokenType } from './TokenType';
import TokenData from './TokenData';


export default class EthTokenData extends TokenData {
    constructor(clone: boolean) {
        super(
            ETH_ERC20_ADDRESS,
            null,
            TokenType.eth,
            TokenType.eth,
            clone,
            null,
            null,
            TokenType.eth,
            null,
            null
        );
    }
}