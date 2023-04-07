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
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Widget } from './components/Widget';
import { internalEvents } from './core/events';

import * as interfaces from './core/interfaces/index';
export * as dataclasses from './core/dataclasses/index';
export * as interfaces from './core/interfaces/index';


export class Metaport {
  constructor(config: interfaces.MetaportConfig) {
    if (config.openButton === undefined) config.openButton = true;
    if (config.autoLookup === undefined) config.autoLookup = true;
    if (config.skaleNetwork === undefined) config.skaleNetwork = 'mainnet';
    if (config.debug === undefined) config.debug = false;
    createRoot(document.getElementById('metaport')).render(<Widget config={config} />);
  }

  transfer(params: interfaces.TransferParams): void {
    internalEvents.transfer(params)
  }
  // wrap(params) { internalEvents.wrap(params) }
  // unwrap(params) { internalEvents.unwrap(params) }
  // swap(params) { internalEvents.swap(params) }

  // updateParams(params) { internalEvents.updateParams(params) }
  // requestBalance(params) { internalEvents.requestBalance(params) }
  setTheme(theme) { internalEvents.setTheme(theme) }
  close() { internalEvents.close() }
  open() { internalEvents.open() }
  reset() { internalEvents.reset() }
}
