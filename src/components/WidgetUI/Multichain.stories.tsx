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
  generateConfigTokens,
  generateTransferRequestSteps
} from './StoriesHelper';
import { getWidgetTheme } from '../WidgetUI/Themes';

import { View } from '../../core/dataclasses/View';


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

export const TransferSummaryLight = () => (
  <WidgetUI
    {...commonProps}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_SUMMARY}
    amountLocked={true}
    transferRequest={generateTransferRequest()}
    configTokens={generateConfigTokens()}
    theme={getWidgetTheme({ mode: 'light' })}
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

export const TransferSummaryApps = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_SUMMARY}
    amountLocked={true}
    transferRequest={generateTransferRequest(true)}
    transferRequestLoading={false}
    transferRequestSteps={generateTransferRequestSteps(true)}
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
    transferRequestSteps={generateTransferRequestSteps()}
  />
);

export const TransferRequestStepsLight = () => (
  <WidgetUI
    {...commonProps}
    {...generateWrappedTokens()}
    actionSteps={getWrapActionSteps()}
    view={View.TRANSFER_REQUEST_STEPS}
    amountLocked={true}
    transferRequest={generateTransferRequest()}
    transferRequestLoading={false}
    transferRequestSteps={generateTransferRequestSteps()}
    theme={getWidgetTheme({ mode: 'light' })}
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
    transferRequestLoading={true}
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
    transferRequestSteps={generateTransferRequestSteps(true)}
  />
);