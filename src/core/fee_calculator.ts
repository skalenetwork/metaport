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
 * @file fee_calculator.ts
 * @copyright SKALE Labs 2022-Present
 */

import { fromWei as _fromWei, toBN } from 'web3-utils';
import debug from 'debug';

import { CoinGeckoClient } from 'coingecko-api-v3';
import * as interfaces from './interfaces/index';

debug.enable('*');
const log = debug('metaport:components:fee_calculator');

export async function getTransactionFee(
    transferRequest: interfaces.TransferParams
): Promise<number> {
    // todo: get actual gas limit for transfer
    // todo: get actual gas price
    log(transferRequest);
    const gasLimit = toBN('250000');
    const gasPrice = toBN('10000000000');

    const amountWei = gasLimit.mul(gasPrice);
    const amountEth = _fromWei(amountWei);

    const client = new CoinGeckoClient({
        timeout: 10000,
        autoRetry: true,
    });
    const res = await client.simplePrice({ ids: 'ethereum', vs_currencies: 'usd' });
    const ethToUsdRate = res.ethereum.usd;
    const amountUSD = Number(amountEth) * ethToUsdRate;
    return amountUSD;
}
