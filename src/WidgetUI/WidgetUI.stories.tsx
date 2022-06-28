import React from "react";
import { WidgetUI } from "./WidgetUI";
import defaultTokens from '../metadata/tokens.json'

export default {
  title: "Widget UI"
};


function setMock() {}

export const WidgetUITestDefault = () => (

  // const [chain1, setChain1] = React.useState(undefined);
  // const [chain2, setChain2] = React.useState(undefined);
  // const [token, setToken] = React.useState(undefined);

  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain']}
    tokens={defaultTokens['staging']['rapping-zuben-elakrab']}
    balance='3250.5'
    amount=''

    walletConnected={true}
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
    amount=''
    open={false}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    walletConnected={true}
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
        }
      }
  }}
    balance='3250.5'
    amount='1200'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='usdt'

    walletConnected={true}
  />
);


export const WidgetUITestComplete = () => (
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
        }
      }
  }}
    balance='3250.5'
    amount='1200'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='usdt'

    walletConnected={true}
  />
);

export const WidgetUITestConnect = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain']}
    tokens={defaultTokens['staging']['rapping-zuben-elakrab']}
    balance='3250.5'
    walletConnected={false}
    open={true}
  />
);



// export const WidgetUITestFullscreen = () => (
//   <WidgetUI
//     schains={schains}
//     tokens={tokens}
//     balance='3250.5'
//   />
// );
