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
 * @file index.ts
 * @copyright SKALE Labs 2022-Present
 */

export * from './Config'
export * from './ChainsMetadata'
export * from './Theme'
export * from './Tokens'
export * from './TokenDataMap'
export * from './TransferParams'
export * from './CheckRes'
export * from './TransactionHistory'
export * from './CommunityPoolData'
export * from './TokenMetadata'
export * from './ActionStateUpdate'
export * from './ActionState'

export type AddressType = `0x${string}`

export type Size = 'xs' | 'sm' | 'md' | 'lg'
export type SimplifiedSize = 'sm' | 'md'
