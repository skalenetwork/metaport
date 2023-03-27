import React from "react";
import { WidgetUI } from "./WidgetUI";
import { commonProps, defaultTokenData, commonConfig } from './StoriesHelper';
import { getEmptyTokenDataMap } from '../../core/tokens/helper';
import { Positions } from '../../core/dataclasses/Position';
import { getWidgetTheme } from '../WidgetUI/Themes';


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
    theme={getWidgetTheme({ mode: 'light' })}
  />
);


export const ClosedLight = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    open={false}
    theme={getWidgetTheme({ mode: 'light' })}
  />
);


export const TopLeft = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    walletConnected={false}
    theme={getWidgetTheme({ mode: 'light', position: Positions.topLeft })}
  />
);


export const ClosedDark = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    open={false}
    theme={getWidgetTheme({ mode: 'dark' })}
  />
);


export const SelectChains = () => (
  <WidgetUI
    schains={['staging-perfect-parallel-gacrux', 'staging-severe-violet-wezen', 'ccc-chain', 'ddd-chain', 'eee-chain']}
    availableTokens={getEmptyTokenDataMap()}
    walletConnected={true}
    open={true}
    theme={getWidgetTheme({ mode: 'dark' })}
    config={commonConfig}
  />
);

export const SelectChainsLight = () => (
  <WidgetUI
    schains={['staging-perfect-parallel-gacrux', 'staging-severe-violet-wezen', 'ccc-chain', 'ddd-chain', 'eee-chain']}
    availableTokens={getEmptyTokenDataMap()}
    walletConnected={true}
    open={true}
    theme={getWidgetTheme({ mode: 'light' })}
    config={commonConfig}
  />
);


export const LoadingTokens = () => (
  <WidgetUI loadingTokens={true} {...commonProps} />
);


export const NoButton = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    config={{
      ...commonConfig,
      openButton: false
    }}
  />
);