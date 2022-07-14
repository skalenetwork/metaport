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
 * @file IMAWidget.ts
 * @copyright SKALE Labs 2022-Present
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import{ Widget } from './components/Widget';
import defaultTokens from './metadata/tokens.json';


export default class IMAWidget {
    constructor(params: any) {
      const widgetEl: HTMLElement = document.getElementById('ima-widget');  
      const root = createRoot(widgetEl);
      // params validation + transformation here
  
      if (params['chains']) {
        params['chainsFrom'] = params['chains'];
        params['chainsTo'] = params['chains'];
      }
  
      let tokens;
      if (params['tokens']) {
        tokens = params['tokens'];
      } else {
        tokens = defaultTokens[params['network']];
      }
  
      if (!params['chains']) {
        // todo: ALL network chains (request from proxy!)
      }
  
      root.render(
        <Widget
          tokens={tokens}
          schains={params['schains']}
          schainAliases={params['schainAliases']}
          open={params['open']}
          network={params['network']}
          theme={params['theme']}
        />
      );
    }

    dispatchEvent(name, data) {
      window.dispatchEvent(new CustomEvent(name, {detail: data}));
      console.log('event sent: ' + name);
    }

    requestTransfer(params) {
      var requestTransferEvent = new CustomEvent(
        "requestTransfer",
        {detail: {
          "amount": params.amount,
          "schains": params.schains
        }}
      );
      window.dispatchEvent(requestTransferEvent);
      console.log('requestTransfer event sent -> amount: ' + params.amount);
    }
  
    close() {
      window.dispatchEvent(new CustomEvent("closeWidget"));
      console.log('closeWidget event sent');
    }
  
    open() {
      window.dispatchEvent(new CustomEvent("openWidget"));
      console.log('openWidget event sent');
    }
  
    reset() {
      window.dispatchEvent(new CustomEvent("resetWidget"));
      console.log('resetWidget event sent');
    }
  
    requestBalance(schainName, tokenName) {
      window.dispatchEvent(new CustomEvent(
        "requestBalance",
        {
          detail: {
            "schainName": schainName,
            "tokenName": tokenName
          }
        }
      ));
    }
  
    setTheme(theme) {
      window.dispatchEvent(new CustomEvent(
        "setTheme",
        {
          detail: {
            "theme": theme
          }
        }
      ));
    }
}
  