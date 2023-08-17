import type { Meta, StoryObj } from '@storybook/react';
import Metaport from "./Metaport";


import { METAPORT_CONFIG } from '../../metadata/metaportConfigStaging';
METAPORT_CONFIG.mainnetEndpoint = import.meta.env.VITE_MAINNET_ENDPOINT;

const meta: Meta<typeof Metaport> = {
  title: "Functional/Metaport",
  component: Metaport,
  // decorators: [storyDecorator],
};

export default meta;
type Story = StoryObj<typeof Metaport>;


export const WidgetDemo: Story = {
  args: {
    config: METAPORT_CONFIG
  }
};