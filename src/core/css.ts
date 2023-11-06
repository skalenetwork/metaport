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
 * @file css.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Size } from './interfaces'
import styles from '../styles/styles.module.scss'
import cmn from '../styles/cmn.module.scss'

export { styles, cmn }

export function cls(...args: any): string {
  const filteredArgs = args.map((clsName: any) => {
    if (typeof clsName === 'string') return clsName
    if (Array.isArray(clsName) && clsName.length === 2 && clsName[1]) return clsName[0]
  })
  return filteredArgs.join(' ')
}

const sizes: Size[] = ['xs', 'sm', 'md', 'lg']

export function inc(currentSize: Size): Size {
  const currentIndex = sizes.indexOf(currentSize)
  return currentIndex < sizes.length - 1 ? sizes[currentIndex + 1] : currentSize
}

export function dec(currentSize: Size): Size {
  const currentIndex = sizes.indexOf(currentSize)
  return currentIndex > 0 ? sizes[currentIndex - 1] : currentSize
}
