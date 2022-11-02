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
 * @file iconsHelper.ts
 * @copyright SKALE Labs 2022-Present
 */

import TokenData from '../../core/dataclasses/TokenData';


function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const icons = importAll(require.context('../../icons', false, /\.(png|jpe?g|svg)$/));


export function iconPath(name) {
    if (!name) return;
    const key = name.toLowerCase() + '.svg';
    if (icons[key]) {
        return icons[key];
    } else {
        return icons['eth.svg'];
    }
}


export function getIconSrc(token: TokenData): string {
    if (token.unwrappedIconUrl) return token.unwrappedIconUrl;
    return token.iconUrl ? token.iconUrl : iconPath(token.symbol);
}
