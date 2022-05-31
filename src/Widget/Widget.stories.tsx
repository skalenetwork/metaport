import React from "react";
import { WidgetBody } from "./Widget";
import { schains, tokens } from './TestData';

export default {
  title: "WidgetBody"
};

export const WidgetBodyTest = () => (
  <WidgetBody
    schains={schains}
    tokens={tokens}
    balance='1250.5'
  />
);