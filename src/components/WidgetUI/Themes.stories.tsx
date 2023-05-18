import type { Meta, StoryObj } from '@storybook/react';
import React from "react";
import { WidgetUI } from "./WidgetUI";
import { storyDecorator } from "./StorybookHelper";
import { commonProps, generateTokenData } from './StoriesHelper';
import { Positions } from '../../core/dataclasses/Position';


const meta: Meta<typeof WidgetUI> = {
  title: 'Themes/Customization',
  component: WidgetUI,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      description: "The theme to use for the widget",
    },
    "theme.primary": {
      control: {
        type: 'color'
      }
    }
  },
  decorators: [storyDecorator],

};

export default meta;
type Story = StoryObj<typeof WidgetUI>;


export const ThemeRuby: Story = {
  args: {
    ...commonProps,
    ...generateTokenData('ruby', 'Ruby'),
    theme: {
      primary: '#b01571',
      background: '#f3f2ff',
      mode: 'light',
      position: Positions.bottomRight
    }
  }
};


export const DarkBlue: Story = {
  args: {
    ...commonProps,
    ...generateTokenData('zrx', '0x'),
    theme: {
      primary: '#00d4ff',
      background: '#0a2540',
      mode: 'dark',
      position: Positions.bottomLeft
    }
  }
};


export const LightOrange: Story = {
  args: {
    ...commonProps,
    ...generateTokenData('link', 'Chainlink'),
    theme: {
      primary: '#f96300',
      background: '#ffffff',
      mode: 'light',
      position: Positions.topRight
    }
  }
};


export const LightViolet: Story = {
  args: {
    ...commonProps,
    ...generateTokenData('skl', 'Skale'),
    theme: {
      primary: '#9a66ff',
      background: '#fbf8ff',
      mode: 'light',
      position: Positions.bottomRight
    }
  }
};


export const CustomZIndex: Story = {
  args: {
    ...commonProps,
    ...generateTokenData('skl', 'Skale'),
    theme: {
      primary: '#9a66ff',
      background: '#fbf8ff',
      mode: 'light',
      position: Positions.bottomRight,
      zIndex: 9991
    }
  }
};