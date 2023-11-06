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
 * @file Chain.ts
 * @copyright SKALE Labs 2023-Present
 */

import ChainIcon from './ChainIcon'

import { cls, cmn, dec } from '../core/css'
import { getChainAlias } from '../core/metadata'
import { SkaleNetwork, Size } from '../core/interfaces'

export default function Chain(props: {
  skaleNetwork: SkaleNetwork
  chainName: string
  className?: string
  bold?: boolean
  app?: string
  size?: Size
  decIcon?: boolean
  prim?: boolean
}) {
  const size = props.size ?? 'sm'
  const prim = props.prim ?? true
  return (
    <div className={cls(cmn.flex, cmn.flexcv)}>
      <ChainIcon
        skaleNetwork={props.skaleNetwork}
        chainName={props.chainName}
        app={props.app}
        size={props.decIcon ? dec(props.size) : props.size}
      />
      <p
        className={cls(
          cmn.p,
          [cmn.p4, size === 'xs'],
          [cmn.p3, size === 'sm'],
          [cmn.p2, size === 'md'],
          [cmn.p1, size === 'lg'],
          [cmn.mleft5, size === 'xs'],
          [cmn.mleft10, size === 'sm'],
          [cmn.mleft10, size === 'md'],
          [cmn.mleft15, size === 'lg'],
          [cmn.p600, !props.bold],
          [cmn.p700, props.bold],
          cmn.cap,
          [cmn.pPrim, prim],
          [cmn.pSec, !prim]
        )}
      >
        {getChainAlias(props.skaleNetwork, props.chainName, props.app)}
      </p>
    </div>
  )
}
