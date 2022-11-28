import React from "react";
import { WidgetUI } from "./WidgetUI";
import { commonProps, generateTokenData } from './StoriesHelper';
import { Positions } from '../../core/dataclasses/Position';


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
      mode: 'light',
      position: Positions.bottomRight
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
      mode: 'dark',
      position: Positions.bottomLeft
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
      mode: 'light',
      position: Positions.topRight
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
      mode: 'dark',
      position: Positions.topLeft
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
      mode: 'light',
      position: Positions.bottomRight
    }}
  />
);

export const CustomZIndex = () => (
  <WidgetUI
    {...generateTokenData('skl', 'Skale')}
    {...commonProps}
    theme={{
      primary: '#9a66ff',
      background: '#fbf8ff',
      mode: 'light',
      position: Positions.bottomRight,
      zIndex: 9991
    }}
  />
);

