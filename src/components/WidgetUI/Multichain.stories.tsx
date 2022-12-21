import React from "react";
import { WidgetUI } from "./WidgetUI";
import {
  commonProps,
  defaultTokenData,
  generateTokenData,
  getWrapActionSteps,
  getUnwrapActionSteps,
  generateWrappedTokens
} from './StoriesHelper';
import { OperationType } from '../../core/dataclasses/OperationType';
import { getWidgetTheme } from './Themes';


export default {
  title: "Multichain UI"
};


export const TransferSummary = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    v2={true}
    amountLocked={true}
  />
);


export const TransferSummaryUnlocked = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    v2={true}
    amountLocked={false}
  />
);


export const TransferRequest = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    v2={true}
    summaryConfirmed={true}
    amountLocked={true}
  />
);
