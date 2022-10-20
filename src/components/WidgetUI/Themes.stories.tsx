import React from "react";
import { WidgetUI } from "./WidgetUI";
import { commonProps, defaultTokenData, generateTokenData } from './StoriesHelper';

import PublicOffIcon from '@mui/icons-material/PublicOff';


export default {
  title: "Custom Themes"
};


export const CustomThemeRuby = () => (
  <WidgetUI
    {...generateTokenData('ruby', 'Ruby')}
    {...commonProps}
    theme={{
      primary: '#b01571',
      background: '#f3f2ff',
      mode: 'light'
    }}
  />
);


export const CustomDarkBlue = () => (
  <WidgetUI
    {...generateTokenData('zrx', '0x')}
    {...commonProps}
    theme={{
      primary: '#00d4ff',
      background: '#0a2540',
      mode: 'dark'
    }}
  />
);


export const CustomLightOrange = () => (
  <WidgetUI
    {...generateTokenData('link', 'Chainlink')}
    {...commonProps}
    theme={{
      primary: '#f96300',
      background: '#ffffff',
      mode: 'light'
    }}
  />
);


export const CustomDarkGreen = () => (
  <WidgetUI
    {...generateTokenData('usdt', 'Tether')}
    {...commonProps}
    theme={{
      primary: '#2dcb74',
      background: '#111905',
      mode: 'dark'
    }}
  />
);


export const CustomLightViolet = () => (
  <WidgetUI
    {...generateTokenData('skl', 'Skale')}
    {...commonProps}
    theme={{
      primary: '#9a66ff',
      background: '#fbf8ff',
      mode: 'light'
    }}
  />
);

