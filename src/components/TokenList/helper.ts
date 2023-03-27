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
 * @file helper.ts
 * @copyright SKALE Labs 2022-Present
 */

import { MAINNET_CHAIN_NAME } from '../../core/constants';
import TokenData from '../../core/dataclasses/TokenData';


export function getTokenSymbol(token: TokenData): string {
    let symbol = token.unwrappedSymbol ? token.unwrappedSymbol : token.symbol;
    if (token.clone) symbol = token.cloneSymbol ? token.cloneSymbol : symbol;
    return symbol;
}


export function getTokenName(token: TokenData): string {
    return token.name ? token.name : getTokenSymbol(token);
}


function importAll(r) {
    const images = {};
    r.keys().map((item, _) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const icons = importAll(require.context('../../icons', false, /\.(png|jpe?g|svg)$/));
const CHAIN_ICONS = {
    'mainnet': importAll(require.context('../../meta/mainnet/icons', false, /\.(png|jpe?g|svg)$/)),
    'staging3': importAll(require.context('../../meta/staging/icons', false, /\.(png|jpe?g|svg)$/))
}


export function iconPath(name) {
    if (!name) return;
    const key = name.toLowerCase() + '.svg';
    if (icons[key]) {
        return icons[key];
    } else {
        return icons['eth.svg'];
    }
}


export function chainIconPath(skaleNetwork: string, name: string, app?: string) {
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


export function getIconSrc(token: TokenData): string {
    if (token.unwrappedIconUrl) return token.unwrappedIconUrl;
    return token.iconUrl ? token.iconUrl : iconPath(token.symbol);
}
