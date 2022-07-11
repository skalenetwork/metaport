import React from "react";
import { WidgetUI } from "./WidgetUI";
import defaultTokens from '../metadata/tokens.json'

export default {
  title: "Widget UI"
};


function setMock() {}


export const WidgetUITestConnect = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain']}
    tokens={defaultTokens['staging']['rapping-zuben-elakrab']}
    balance='3250.5'
    walletConnected={false}
    open={true}
  />
);


export const WidgetUITestConnectLight = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain']}
    tokens={defaultTokens['staging']['rapping-zuben-elakrab']}
    balance='3250.5'
    walletConnected={false}
    open={true}
    theme={{
      mode: 'light'
    }}
  />
);

export const WidgetUITestClosedLight = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain']}
    tokens={defaultTokens['staging']['rapping-zuben-elakrab']}
    balance='3250.5'
    walletConnected={false}
    open={false}
    theme={{
      mode: 'light'
    }}
  />
);


export const WidgetUITestDefault = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain']}
    tokens={{
      "erc20": {
        "usdt": {
          "name": "Tether",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "111.2"
        },
        "usdc": {
          "name": "USDC",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "1237"
        },
        "skl": {
          "name": "SKALE",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "870.5"
        }
      }
    }}
    balance='3250.5'
    amount=''

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}
    open={open}
    setOpen={() => {}}
  />
);



export const WidgetUITestLoadingTokens = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    schainAliases={{
      'aaa-chain': 'Europa SKALE Chain',
      'bbb-chain': 'Block Brawlers'
    }}
    tokens={{
      "erc20": {
      }
    }}
    loadingTokens={true}
    balance='3250.5'
    amount='1200'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}


    walletConnected={true}

    loading={false}
    setLoading=''

    activeStep={1}
    setActiveStep={() => {}}

  />
);


export const WidgetUITestPreset = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    tokens={{
      "erc20": {
        "usdt": {
          "name": "Tether",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "111.2"
        },
        "usdc": {
          "name": "USDC",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "1237"
        },
        "skl": {
          "name": "SKALE",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "870.5"
        }
      }
    }}
    balance='3250.5'
    amount=''
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}
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
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "3250"
        }
      }
  }}
    amount='1200'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='usdt'

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}
  />
);



export const WidgetUITestApproved = () => (
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
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "3250"
        }
      }
  }}
    amount='1200'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='usdt'

    walletConnected={true}

    loading={false}
    setLoading=''

    activeStep={1}
    setActiveStep={() => {}}

  />
);

export const WidgetUITestLoading = () => (
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
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "3250"
        }
      }
  }}
    amount='1200'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='usdt'

    walletConnected={true}

    loading={true}
    setLoading=''

    activeStep={1}
    setActiveStep={() => {}}

    amountLocked={true}

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
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "3250"
        }
      }
  }}
    amount='1200'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='usdt'

    walletConnected={true}

    loading={false}
    setLoading=''

    activeStep={2}
    setActiveStep={() => {}}
  />
);




export const WidgetUITestCustom = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    schainAliases={{
      'aaa-chain': 'Europa SKALE Chain',
      'bbb-chain': 'Block Brawlers'
    }}
    tokens={{
      "erc20": {
        "ruby": {
          "name": "Ruby",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "750000"
        }
      }
  }}
    amount='2500'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='ruby'

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}

    theme={{
      primary: '#b01571',
      background: '#f3f2ff',
      mode: 'light'
    }}
  />
);




export const WidgetUITestCustomDark = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    schainAliases={{
      'aaa-chain': 'Europa SKALE Chain',
      'bbb-chain': 'Block Brawlers'
    }}
    tokens={{
      "erc20": {
        "zrx": {
          "name": "0x",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "3250.5"
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
    token='zrx'

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}

    theme={{
      primary: '#00d4ff',
      background: '#0a2540',
      mode: 'dark'
    }}
  />
);



export const WidgetUITestCustomLight = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    schainAliases={{
      'aaa-chain': 'Europa SKALE Chain',
      'bbb-chain': 'Block Brawlers'
    }}
    tokens={{
      "erc20": {
        "link": {
          "name": "Chainlink",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "32222"
        }
      }
  }}
    amount='950'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='link'

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}

    theme={{
      primary: '#f96300',
      background: '#ffffff',
      mode: 'light'
    }}
  />
);


export const WidgetUITestCustomDark2 = () => (
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
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "1115"
        }
      }
  }}
    amount='10'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='usdt'

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}

    theme={{
      primary: '#2dcb74',
      background: '#111905',
      mode: 'dark'
    }}
  />
);

export const WidgetUITestCustomLight2 = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    schainAliases={{
      'aaa-chain': 'Europa SKALE Chain',
      'bbb-chain': 'Block Brawlers'
    }}
    tokens={{
      "erc20": {
        "skl": {
          "name": "Skale",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "3000.5"
        }
      }
  }}
    amount='250'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='skl'

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}

    theme={{
      primary: '#9a66ff',
      background: '#fbf8ff',
      mode: 'light'
    }}
  />
);

export const WidgetUITestLightDefault = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain']}
    schainAliases={{
      'aaa-chain': 'Europa SKALE Chain',
      'bbb-chain': 'Block Brawlers'
    }}
    tokens={{
      "erc20": {
        "usdc": {
          "name": "usdc",
          "address": "0x6e64b56869Ce34efAfF3D936CE67a24fD7618b8E",
          "balance": "888.8"
        }
      }
  }}
    amount='11.1'
    open={true}

    chain1='aaa-chain'
    chain2='bbb-chain'
    setChain1={setMock}
    setChain2={setMock}

    setToken={setMock}
    token='usdc'

    walletConnected={true}

    loading={false}
    activeStep={0}
    setActiveStep={() => {}}

    theme={{mode: 'light'}}
  />
);