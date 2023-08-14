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

import * as MAINNET_CHAIN_ICONS from '../meta/mainnet/icons';
import * as STAGING_CHAIN_ICONS from '../meta/staging/icons';
import * as LEGACY_CHAIN_ICONS from '../meta/legacy/icons';
import * as REGRESSION_CHAIN_ICONS from '../meta/regression/icons';

const icons = {};
const CHAIN_ICONS = {
    'mainnet': MAINNET_CHAIN_ICONS,
    'staging': STAGING_CHAIN_ICONS,
    'legacy': LEGACY_CHAIN_ICONS,
    'regression': REGRESSION_CHAIN_ICONS
}


export function chainIconPath(skaleNetwork: SkaleNetwork, name: string, app?: string) {
    if (!name) return;
    let filename = name.toLowerCase()
    if (app) filename += `-${app}`;
    if (name === MAINNET_CHAIN_NAME) {
        return CHAIN_ICONS[skaleNetwork]['mainnet'];
    }
    filename = filename.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
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