import React from "react";
import { WidgetUI } from "./FullscreenUI";
import defaultTokens from '../metadata/tokens.json'

export default {
  title: "Fullscreen UI"
};


function setMock() {}


export const FullscreenUITest = () => (
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

    loading={false}
    setLoading=''

    activeStep={1}
    setActiveStep={() => {}}

  />
);
