import type { Meta, StoryObj } from '@storybook/react';
import { Widget } from "./Widget";
import { storyDecorator } from "../WidgetUI/StorybookHelper";


const METAPORT_CONFIG = require('../../configs/metaportConfigMainnet.json');
METAPORT_CONFIG.mainnetEndpoint = process.env.STORYBOOK_MAINNET_ENDPOINT;


const meta: Meta<typeof Widget> = {
  title: "Functional/Widget",
  component: Widget,
  decorators: [storyDecorator],

};

export default meta;
type Story = StoryObj<typeof Widget>;

export const WidgetDemo: Story = {
  args: {
    config: METAPORT_CONFIG
  }
};