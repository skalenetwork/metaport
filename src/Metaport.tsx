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
 * @file Metaport.ts
 * @copyright SKALE Labs 2022-Present
 */

// @ts-ignore
import React from 'react'
// import { createRoot } from 'react-dom/client';

import { internalEvents } from './core/events'

import * as interfaces from './core/interfaces/index'
export * as dataclasses from './core/dataclasses/index'
export * as interfaces from './core/interfaces/index'

import ChainIcon from './components/ChainIcon'
export { ChainIcon }

import WidgetUI from './components/WidgetUI'
export { WidgetUI }

import Metaport from './components/Metaport'
export { Metaport }

import MetaportProvider from './components/MetaportProvider';
export { MetaportProvider }

import SkPaper from './components/SkPaper';
export { SkPaper }

import SkConnect from './components/SkConnect';
export { SkConnect }

// export * as sfuel from './core/sfuel';

export class InjectedMetaport {
  constructor(config: interfaces.MetaportConfig) {
    if (config.openButton === undefined) config.openButton = true
    if (config.autoLookup === undefined) config.autoLookup = true
    if (config.skaleNetwork === undefined) config.skaleNetwork = 'mainnet'
    if (config.debug === undefined) config.debug = false
    const el = document.getElementById('metaport')
    if (el) {
      // createRoot(el).render(<Widget config={config} />);
    } else {
      console.log('div with id="metaport" does not exist')
    }
  }

  transfer(params: interfaces.TransferParams): void {
    internalEvents.transfer(params)
  }
  // wrap(params) { internalEvents.wrap(params) }
  // unwrap(params) { internalEvents.unwrap(params) }
  // swap(params) { internalEvents.swap(params) }

  // updateParams(params) { internalEvents.updateParams(params) }
  // requestBalance(params) { internalEvents.requestBalance(params) }
  setTheme(theme: any) {
    internalEvents.setTheme(theme)
  }
  close() {
    internalEvents.close()
  }
  open() {
    internalEvents.open()
  }
  reset() {
    internalEvents.reset()
  }
}
