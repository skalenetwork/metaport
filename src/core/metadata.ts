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

import { TokenData } from './dataclasses'
import { SkaleNetwork } from './interfaces'
import { MAINNET_CHAIN_NAME } from './constants'

import * as MAINNET_CHAIN_ICONS from '../meta/mainnet/icons'
import * as STAGING_CHAIN_ICONS from '../meta/staging/icons'
import * as LEGACY_CHAIN_ICONS from '../meta/legacy/icons'
import * as REGRESSION_CHAIN_ICONS from '../meta/regression/icons'

import * as icons from '../icons'

// const icons = { eth: { default: '' }, skl: { default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48Y2lyY2xlIGZpbGw9IiMwMDAiIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIvPjxnIGZpbGw9IiNGRkYiPjxwYXRoIGQ9Ik0yMi41MTQgOC40OTJ2Ljk5MUg5LjgxdjEzLjAzNGgxMi43MDRWMjQuNWwtNy40Mi0uMDU3LTcuNDUtLjA4NS0uMDg2LTguNDQzTDcuNSA3LjVoMTUuMDE0eiIvPjxwYXRoIGQ9Ik0yMy42OTggMTAuOWMxLjEyNi4zMTIgMi4xMDggMS4xOSAyLjQyNSAyLjE4Mi4xNzMuNTk1LjA4Ny42NTEtLjkyNC42NTEtLjc4IDAtMS4yMTItLjE3LTEuNDcyLS41NjYtLjQzMy0uNzA5LTIuMzk3LS43OTQtMi45NzQtLjExNC0uNjM1Ljc2NS4wNTggMS4zMzIgMi4zMSAxLjg0MiAxLjEyNi4yNTUgMi4zMS42OCAyLjYyNy45NjMgMS40NDQgMS4yNzUuODY2IDQuMDgtMS4wMSA0Ljg0NS0xLjI3LjUxLTMuMzUuNTEtNC42MiAwLS44NjYtLjM2OC0xLjg3Ny0xLjY0My0xLjg3Ny0yLjQzNiAwLS41MSAxLjg3Ny0uMzEyIDIuMzY4LjI4MyAxLjA0IDEuMTYyIDMuNDY0Ljk5MiAzLjYzOC0uMjU1LjE0NC0uOTYzLS40MDUtMS4zODgtMi4wNS0xLjU4Ny0yLjY4NS0uMzY4LTMuNjY3LTEuMTktMy42NjctMy4wNiAwLTIuMjEgMi40MjUtMy41MTMgNS4yMjYtMi43NDh6Ii8+PC9nPjwvZz48L3N2Zz4=' } }; // TODO: storybook fix

const CHAIN_ICONS = {
  mainnet: MAINNET_CHAIN_ICONS,
  staging: STAGING_CHAIN_ICONS,
  legacy: LEGACY_CHAIN_ICONS,
  regression: REGRESSION_CHAIN_ICONS,
}

export function chainIconPath(skaleNetwork: SkaleNetwork, name: string, app?: string) {
  if (!name) return
  let filename = name.toLowerCase()
  if (app) filename += `-${app}`
  if (name === MAINNET_CHAIN_NAME) {
    return CHAIN_ICONS[skaleNetwork]['mainnet']
  }
  filename = filename.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
  if (CHAIN_ICONS[skaleNetwork][filename]) {
    return CHAIN_ICONS[skaleNetwork][filename]
  }
}

export function tokenIcon(tokenSymbol: string) {
  if (!tokenSymbol) return
  const key = tokenSymbol.toLowerCase()
  if (icons[key]) {
    return icons[key]
  } else {
    return icons['eth']
  }
}

export function getTokenName(token: TokenData): string {
  return token.meta.name ?? token.meta.symbol
}
