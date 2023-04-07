import React from "react";
import { Widget } from "./Widget";

const METAPORT_CONFIG = require('./metaportConfig.json');


export default {
  title: "Functional widget"
};


export const WidgetDemo = () => (
  <Widget config={METAPORT_CONFIG} />
);
