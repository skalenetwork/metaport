import type { Meta, StoryObj } from '@storybook/react';
import Metaport from "./Metaport";

import * as interfaces from '../../core/interfaces'
// import { storyDecorator } from "../WidgetUI/StorybookHelper";

import METAPORT_CONFIG from '../../metadata/metaportConfigStaging.json';
const config = METAPORT_CONFIG as interfaces.MetaportConfig;

// METAPORT_CONFIG.mainnetEndpoint = process.env.STORYBOOK_MAINNET_ENDPOINT;

const meta: Meta<typeof Metaport> = {
  title: "Functional/Metaport",
  component: Metaport,
  // decorators: [storyDecorator],
};

export default meta;
type Story = StoryObj<typeof Metaport>;


export const WidgetDemo: Story = {
  args: {
    config: config
  }
};