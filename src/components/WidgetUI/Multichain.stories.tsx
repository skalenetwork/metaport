import React from "react";
import { WidgetUI } from "./WidgetUI";
import {
  commonProps,
  defaultTokenData,
  generateTokenData,
  getWrapActionSteps,
  getUnwrapActionSteps,
  generateWrappedTokens,
  generateTransferRequest,
  generateTransferRequestSimple,
  generateTransferRequestUnwrap,
  generateConfigTokens
} from './StoriesHelper';
import { OperationType } from '../../core/dataclasses/OperationType';
import { View } from '../../core/dataclasses/View';

import { getWidgetTheme } from './Themes';


export default {
  title: "Multichain UI"
};



export const TransferSummaryLoading = () => (
  <WidgetUI
    {...commonProps}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST}
    amountLocked={true}
  />
);

export const TransferSummary = () => (
  <WidgetUI
    {...commonProps}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST}
    amountLocked={true}
    transferRequest={generateTransferRequest()}
    configTokens={generateConfigTokens()}
  />
);

export const TransferSummarySimple = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST}
    amountLocked={true}
    transferRequest={generateTransferRequestSimple()}
  />
);

export const TransferSummaryUnwrap = () => (
  <WidgetUI
    {...commonProps}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST}
    amountLocked={true}
    transferRequest={generateTransferRequestUnwrap()}
    configTokens={generateConfigTokens()}
  />
);


export const TransferSummaryUnlocked = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST}
    amountLocked={false}
    transferRequest={generateTransferRequest()}
  />
);


export const TransferRequest = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST}
    summaryConfirmed={true}
    amountLocked={true}
    transferRequest={generateTransferRequest()}
  />
);


