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


import React from 'react';
import { createRoot } from 'react-dom/client';

import { Widget } from './components/Widget';
import { internalEvents } from './core/events';
import { Position } from './core/dataclasses/Position';

import defaultTokens from './metadata/tokens.json';

import * as interfaces from './core/interfaces/index';
export * as interfaces from './core/interfaces/index';

export * as dataclasses from './core/dataclasses/index';


export class Metaport {
  constructor(config: interfaces.MetaportConfig) {
    const widgetEl: HTMLElement = document.getElementById('metaport');
    const root = createRoot(widgetEl);
    // params validation + transformation here

    let tokens = config.tokens ? config.tokens : defaultTokens[config.skaleNetwork];
    let network = config.skaleNetwork ? config.skaleNetwork : 'mainnet';

    if (!config.chains) {
      // todo: ALL network chains (request from proxy!)
    }

    if (config.openButton === undefined) config.openButton = true;
    if (config.autoLookup === undefined) config.autoLookup = true;
    if (config.position === undefined) config.position = Position.bottomRight;

    root.render(
      <Widget
        tokens={tokens}
        chains={config.chains}
        chainsMetadata={config.chainsMetadata}
        open={config.openOnLoad}
        openButton={config.openButton}
        autoLookup={config.autoLookup}
        network={network}
        theme={config.theme}
        mainnetEndpoint={config.mainnetEndpoint}
        position={config.position}
      />
    );
  }

  transfer(params: interfaces.TransferParams): void { internalEvents.transfer(params) }
  wrap(params) { internalEvents.wrap(params) }
  unwrap(params) { internalEvents.unwrap(params) }
  swap(params) { internalEvents.swap(params) }

  updateParams(params) { internalEvents.updateParams(params) }
  requestBalance(params) { internalEvents.requestBalance(params) }
  setTheme(theme) { internalEvents.setTheme(theme) }
  close() { internalEvents.close() }
  open() { internalEvents.open() }
  reset() { internalEvents.reset() }
}
