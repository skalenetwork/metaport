import React from "react";
import { Widget } from "./Widget";

const METAPORT_CONFIG = require('../../configs/metaportConfigMainnet.json');
METAPORT_CONFIG.mainnetEndpoint = process.env.STORYBOOK_MAINNET_ENDPOINT;


export default {
  title: "Functional widget"
};


export const WidgetDemo = () => (
  <Widget config={METAPORT_CONFIG} />
);
