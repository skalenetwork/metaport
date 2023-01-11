import React from 'react';

import Collapse from '@mui/material/Collapse';

import { OperationType } from '../../core/dataclasses/OperationType';
import { View } from '../../core/dataclasses/View';

import CurrentChain from '../CurrentChain';
import ErrorMessage from '../ErrorMessage';
import UnwrapUI from '../UnwrapUI';
import TransferUI from '../TransferUI';
import WrappedTokensWarning from '../WrappedTokensWarning';
import TransferRequest from '../TransferRequest';


export default function WidgetBody(props) {

  if (props.view === View.TRANSFER_REQUEST) {
    return <TransferRequest
      disabledChains={props.disabledChains}
      theme={props.theme}
      {...props}
    />
  }

  if (props.view === View.UNWRAP) {
    return <p>UNWRAP!!!!</p>
  }

  const [expandedFrom, setExpandedFrom] = React.useState<boolean>(false);
  const [expandedTo, setExpandedTo] = React.useState<boolean>(false);
  const [expandedTokens, setExpandedTokens] = React.useState<boolean>(false);

  // TODO: tmp wrap tokens fix
  const wrapTransferAction = props.actionSteps && props.actionSteps.length === 4 &&
    (props.activeStep === 2 || props.activeStep === 3);

  return (
    <div>
      <CurrentChain
        schains={props.schains}
        setChain={props.setChain1}
        chain={props.chain1}
        disabledChain={props.chain2}
        fromChain={true}
        chainsMetadata={props.chainsMetadata}
        disabled={props.disabledChains}

        theme={props.theme}
        expanded={expandedFrom}
        setExpanded={setExpandedFrom}

        expandedTo={expandedTo}
        expandedTokens={expandedTokens}

        operationType={props.operationType}
        setOperationType={props.setOperationType}
        sFuelData={props.sFuelData1}
      />
      <Collapse in={props.errorMessage && !expandedFrom}>
        <ErrorMessage errorMessage={props.errorMessage} />
      </Collapse>
      <Collapse in={!props.errorMessage && props.operationType === OperationType.unwrap && !props.expandedFrom}>
        <UnwrapUI
          {...props}
          expandedFrom={expandedFrom}
          expandedTo={expandedTo}
          expandedTokens={expandedTokens}
          setExpandedFrom={setExpandedFrom}
          setExpandedTo={setExpandedTo}
          setExpandedTokens={setExpandedTokens}
        />
      </Collapse>
      <Collapse in={!props.errorMessage && props.operationType !== OperationType.unwrap}>
        <TransferUI
          {...props}
          expandedFrom={expandedFrom}
          expandedTo={expandedTo}
          expandedTokens={expandedTokens}
          setExpandedFrom={setExpandedFrom}
          setExpandedTo={setExpandedTo}
          setExpandedTokens={setExpandedTokens}
        />
      </Collapse>
      <Collapse in={
        props.operationType !== OperationType.unwrap &&
        !expandedFrom &&
        !expandedTo &&
        !expandedTokens &&
        !wrapTransferAction
      }>
        <WrappedTokensWarning
          wrappedTokens={props.wrappedTokens}
          setOperationType={props.setOperationType}
        />
      </Collapse>
    </div >
  )
}