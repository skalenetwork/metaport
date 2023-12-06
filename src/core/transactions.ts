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
 * @file transactions.ts
 * @copyright SKALE Labs 2023-Present
 */

import { TRANSFER_ERROR_MSG } from './constants'
import { TxResponse } from './interfaces'


export async function sendTransaction(func: any, args: any[]): Promise<TxResponse> {
  try {
    const response = await func(...args)
    return { status: true, err: undefined, response: response }
  } catch (err) {
    console.error(err)
    const msg = err.message
    let name
    if (err.code && err.code === 'ACTION_REJECTED') {
      name = 'Transaction signing was rejected'
    } else {
      name = TRANSFER_ERROR_MSG
    }
    if (err.info && err.info.error && err.info.error.data && err.info.error.data.message) {
      name = err.info.error.data.message
    }
    if (err.shortMessage) {
      name = err.shortMessage
    }
    return { status: false, err: { name, msg }, response: undefined }
  }
}