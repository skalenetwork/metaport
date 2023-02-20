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
    view={View.TRANSFER_REQUEST_SUMMARY}
    amountLocked={true}
  />
);

export const TransferSummary = () => (
  <WidgetUI
    {...commonProps}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_SUMMARY}
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
    view={View.TRANSFER_REQUEST_SUMMARY}
    amountLocked={true}
    transferRequest={generateTransferRequestSimple()}
  />
);

export const TransferSummaryUnwrap = () => (
  <WidgetUI
    {...commonProps}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_SUMMARY}
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
    view={View.TRANSFER_REQUEST_SUMMARY}
    amountLocked={false}
    transferRequest={generateTransferRequest()}
  />
);


export const TransferRequestSteps = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_STEPS}
    amountLocked={true}
    transferRequest={generateTransferRequest()}
    transferRequestLoading={false}
  />
);


export const TransferRequestStepsLoading = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_STEPS}
    amountLocked={true}
    transferRequest={generateTransferRequest(true)}
  />
);




export const TransferRequestStepsApps = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_STEPS}
    amountLocked={true}
    transferRequest={generateTransferRequest(true)}
    transferRequestLoading={false}
    receiveTransferRequest={() => {}}
  />
);


export const TransferRequestSimple = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_STEPS}
    amountLocked={true}
    transferRequest={generateTransferRequestSimple(true)}
    receiveTransferRequest={() => {}}
    transferRequestLoading={false}
  />
);
