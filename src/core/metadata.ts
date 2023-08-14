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
 * @file metadata.ts
 * @copyright SKALE Labs 2023-Present
 */

import { TokenData } from './dataclasses';
import { SkaleNetwork } from './interfaces';
import { MAINNET_CHAIN_NAME } from './constants';


function importAll(r) {
    const images = {};
    r.keys().map((item, _) => { images[item.replace('./', '')] = r(item); });
    return images;
}


const icons = {};
const CHAIN_ICONS = {
    'mainnet': {},
    'staging': {},
    'legacy': {},
    'regression': {}
}


export function chainIconPath(skaleNetwork: SkaleNetwork, name: string, app?: string) {
    if (!name) return;
    let filename = name.toLowerCase();
    if (app)
        filename += `-${app}`;
    filename += '.svg';
    if (name === MAINNET_CHAIN_NAME) {
        return icons['eth.svg'];
    }
    if (CHAIN_ICONS[skaleNetwork][filename]) {
        return CHAIN_ICONS[skaleNetwork][filename];
    }
}


export function tokenIcon(name: string): string {
    if (!name) return;
    const key = name.toLowerCase() + '.svg';
    if (icons[key]) {
        return icons[key];
    } else {
        return icons['eth.svg'];
    }
}


export function tokenIconPath(token: TokenData): string {
    return token.meta.iconUrl ?? tokenIcon(token.meta.symbol);
}


export function getTokenName(token: TokenData): string {
    return token.meta.name ?? token.meta.symbol;
}