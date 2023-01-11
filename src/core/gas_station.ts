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
 * @file gas_station.ts
 * @copyright SKALE Labs 2022-Present
 */

import { GAS_STATION_API_ENDPOINT } from './constants';


export async function getAvgWaitTime() {
    const response = await fetch(GAS_STATION_API_ENDPOINT);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.avgWait;
}
