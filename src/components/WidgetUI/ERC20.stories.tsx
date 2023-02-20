import React from "react";
import { WidgetUI } from "./WidgetUI";
import {
  commonProps,
  defaultTokenData,
  generateTokenData,
  getWrapActionSteps,
  getUnwrapActionSteps,
  generateWrappedTokens
} from './StoriesHelper';
import { OperationType } from '../../core/dataclasses/OperationType';
import { getWidgetTheme } from '../WidgetUI/Themes';


export default {
  title: "ERC20 UI"
};

export const TransferUIDark = () => (
  <WidgetUI {...commonProps} {...defaultTokenData} />
);

export const TransferUILight = () => (
  <WidgetUI {...commonProps} {...generateTokenData('usdc', 'usdc')}
    theme={getWidgetTheme({ mode: 'light' })} />
);


export const MainnetTransfer = () => (
  <WidgetUI
    {...generateTokenData('usdt', 'Tether', true)}
    schains={['mainnet', 'staging-severe-violet-wezen']}
    walletConnected={true}
    open={true}

    setChain1={() => { }}
    setChain2={() => { }}
    setToken={() => { }}
    setActiveStep={() => { }}

    chain1='mainnet'
    chain2='staging-severe-violet-wezen'
    theme={getWidgetTheme(null)}
  />
);

export const MainnetTransferLight = () => (
  <WidgetUI
    {...generateTokenData('usdc', 'USDC', true)}
    schains={['mainnet', 'staging-severe-violet-wezen']}
    walletConnected={true}
    open={true}

    setChain1={() => { }}
    setChain2={() => { }}
    setToken={() => { }}
    setActiveStep={() => { }}

    chain1='mainnet'
    chain2='staging-severe-violet-wezen'
    theme={getWidgetTheme({ mode: 'light' })}
  />
);

export const LoadingSteps = () => (
  <WidgetUI
    {...generateTokenData('usdc', 'USDC', true)}
    schains={['staging-perfect-parallel-gacrux', 'staging-severe-violet-wezen']}
    walletConnected={true}
    open={true}

    setChain1={() => { }}
    setChain2={() => { }}
    setToken={() => { }}
    setActiveStep={() => { }}

    loading={true}

    chain1='staging-perfect-parallel-gacrux'
    chain2='staging-severe-violet-wezen'
    theme={getWidgetTheme(null)}
  />
);


export const SelectToken = () => (
  <WidgetUI
    {...commonProps}
    availableTokens={{
      "eth": {
        "eth": {
          "balance": "2045",
          "name": "eth",
          "address": "0x0123",
          "symbol": "eth",
          'type': 'eth'
        }
      },
      "erc721": {
        'skl': {
          "name": "SKALE Space",
          "address": "0x0123",
          "symbol": "skl",
          'type': 'erc721'
        }
      },
      "erc721meta": {
        'skl': {
          "name": "Unicorns Collection",
          "address": "0x0123",
          "symbol": "uni",
          'type': 'erc721meta'
        }
      },
      "erc1155": {},
      "erc20": {
        'usdc': {
          "name": "USDC",
          "address": "0x0123",
          "balance": "1000",
          "symbol": "USDC",
          'type': 'erc20'
        },
        'usdt': {
          "name": "USDT",
          "address": "0x0123",
          "balance": "3500",
          "symbol": "USDT",
          'type': 'erc20'
        }
      }
    }}
  />
);


export const Approved = () => (
  <WidgetUI {...commonProps} {...defaultTokenData} activeStep={1} />
);


export const Loading = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    activeStep={1}
    loading={true}
    amountLocked={true}
  />
);


export const LoadingCustom = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    activeStep={1}
    loading={true}
    amountLocked={true}
    theme={getWidgetTheme({
      primary: '#00d4ff',
      background: '#0a2540',
      mode: 'dark'
    })}
  />
);


export const LoadingLight = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    activeStep={1}
    loading={true}
    amountLocked={true}
    theme={getWidgetTheme({ mode: 'light' })}
  />
);


export const TransferComplete = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    activeStep={2}
    amountLocked={true}
  />
);


export const WrapUI = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
  />
);


export const UnwrapWarning = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    token={null}
    chain2={null}
    setOperationType={(operationType) => { commonProps.operationType = operationType; }}
  />
);


export const UnwrapWarningLight = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    token={null}
    chain2={null}
    theme={getWidgetTheme({ mode: 'light' })}
  />
);


export const UnwrapUINoTokens = () => (
  <WidgetUI
    {...commonProps}
    wrappedTokens={{ 'erc20': {} }}
    availableTokens={{ 'erc20': {} }}
    token={null}
    chain2={null}
    operationType={OperationType.unwrap}
  />
);


export const UnwrapUILoading = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    chain2={null}
    operationType={OperationType.unwrap}
    actionSteps={getUnwrapActionSteps()}
    actionBtnDisabled={true}
  />
);

export const UnwrapUI = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    chain2={null}
    operationType={OperationType.unwrap}
    actionSteps={getUnwrapActionSteps()}
  />
);