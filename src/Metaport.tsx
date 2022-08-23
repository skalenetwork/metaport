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

import{ Widget } from './components/Widget';
import { internalEvents } from './core/events';
import defaultTokens from './metadata/tokens.json';


export default class Metaport {
    constructor(params: any) {
      const widgetEl: HTMLElement = document.getElementById('metaport');  
      const root = createRoot(widgetEl);
      // params validation + transformation here

      let tokens = params.tokens ? params.tokens : defaultTokens[params.network];
      let network = params.network ? params.network : 'mainnet';
      
      if (!params['chains']) {
        // todo: ALL network chains (request from proxy!)
      }

      if (params.openButton === undefined) params.openButton = true;

      root.render(
        <Widget
          tokens={tokens}
          chains={params['chains']}
          chainsMetadata={params['chainsMetadata']}
          open={params['open']}
          openButton={params['openButton']}
          network={network}
          theme={params['theme']}
          mainnetEndpoint={params['mainnetEndpoint']}
        />
      );
    }

    transfer(params) { internalEvents.transfer(params) }
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
  