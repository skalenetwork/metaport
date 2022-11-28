import React from "react";

import PublicOffIcon from '@mui/icons-material/PublicOff';

import { WidgetUI } from "./WidgetUI";
import { commonProps, defaultTokenData, generateTokenData } from './StoriesHelper';
import { getEmptyTokenDataMap } from '../../core/tokens/helper';
import { getWidgetTheme } from '../WidgetUI/Themes';


export default {
  title: "Errors"
};


export const NoTokenPairs = () => (<WidgetUI {...commonProps} availableTokens={getEmptyTokenDataMap()} />);


export const NoTokenPairsLight = () => (
  <WidgetUI {...commonProps} availableTokens={getEmptyTokenDataMap()} theme={getWidgetTheme({ mode: 'light' })} />
);


export const WrongNetwork = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    openButton={false}
    error={true}
    errorMessage={{
      icon: <PublicOffIcon />,
      text: 'test test test test test test test test test test',
      btnText: 'aaaa',
      fallback: () => { console.log('test test test') }
    }}
  />
);


export const WrongNetworkLight = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    theme={getWidgetTheme({ mode: 'light' })}
    openButton={false}
    errorMessage={{
      icon: <PublicOffIcon />,
      text: 'test test test test test test test test test test',
      btnText: 'aaaa',
      fallback: () => { console.log('test test test') }
    }}
  />
);


export const Error = () => (
  <WidgetUI
    {...commonProps}
    {...defaultTokenData}
    amountErrorMessage='This is an error message'
  />
);

