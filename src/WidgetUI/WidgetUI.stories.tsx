import React from "react";
import { WidgetUI } from "./WidgetUI";
import { schains, tokens } from './TestData';
import defaultTokens from '../metadata/tokens.json'

export default {
  title: "Widget UI"
};

export const WidgetUITestDefault = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain']}
    tokens={defaultTokens['staging']['rapping-zuben-elakrab']}
    balance='3250.5'
  />
);


// export const WidgetUITestMainnet = () => (
//   <WidgetUI
//     schains={schains}
//     tokens={tokens}
//     balance='3250.5'
//   />
// );


export const WidgetUITestPreset = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    tokens={{
        "erc20": {
          "usdt": {
            "name": "Tether",
            "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E"
          },
          // "usdc": {
          //   "name": "USDC",
          //   "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E"
          // }
        }
    }}
    balance='3250.5'
    open={true}
  />
);


export const WidgetUITestAliases = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    schainAliases={{
      'aaa-chain': 'Europa SKALE Chain',
      'bbb-chain': 'Block Brawlers'
    }}
    tokens={{
        "erc20": {
          "usdt": {
            "name": "Tether",
            "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E"
          },
          "usdc": {
            "name": "USDC",
            "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E"
          },
          "skl": {
            "name": "SKALE",
            "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E"
          }
        }
    }}
    balance='3250.5'
    open={true}
  />
);

export const WidgetUITestFullscreen = () => (
  <WidgetUI
    schains={schains}
    tokens={tokens}
    balance='3250.5'
  />
);