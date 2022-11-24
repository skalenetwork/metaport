import React from "react";
import { WidgetUI } from "./WidgetUI";
import { commonProps, defaultTokenData, generateTokenData } from './StoriesHelper';
import { getEmptyTokenDataMap } from '../../core/tokens/helper';
import { Positions } from '../../core/dataclasses/Position';


export default {
  title: "Common elements"
};


export const ConnectScreen = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    walletConnected={false}
  />
);


export const ConnectScreenLight = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    walletConnected={false}
    theme={{ mode: 'light' }}
  />
);


export const ClosedLight = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    open={false}
    theme={{
      mode: 'light'
    }}
  />
);


export const TopLeft = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    walletConnected={false}
    theme={{
      mode: 'light',
      position: Positions.topLeft
    }}
  />
);


export const ClosedDark = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    open={false}
    theme={{
      mode: 'dark'
    }}
  />
);


export const SelectChains = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain', 'eee-chain']}
    availableTokens={getEmptyTokenDataMap()}
    walletConnected={true}
    open={true}
  />
);

export const SelectChainsLight = () => (
  <WidgetUI
    schains={['aaa-chain', 'bbb-chain', 'ccc-chain', 'ddd-chain', 'eee-chain']}
    availableTokens={getEmptyTokenDataMap()}
    walletConnected={true}
    open={true}
    theme={{ mode: 'light' }}
  />
);


export const LoadingTokens = () => (
  <WidgetUI loadingTokens={true} {...commonProps} />
);


export const sFuelIcons = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    theme={{ 'mode': 'light' }}

    sFuelData1={{
      faucetUrl: 'https://example.com/',
      minSfuelWei: '200000000000000000',
      balance: '0',
      ok: false
    }}

    sFuelData2={{
      faucetUrl: 'https://example.com/',
      minSfuelWei: '200000000000000000',
      balance: '0',
      ok: false
    }}
  />
);

export const NoButton = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    openButton={false}
  />
);


export const LoadingError = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    actionBtnDisabled={true}
  />
);

