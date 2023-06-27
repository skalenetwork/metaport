import React from 'react';

import Collapse from '@mui/material/Collapse';

import { View } from '../../core/dataclasses/View';
import { isTransferRequestView } from '../../core/views';

import CurrentChain from '../CurrentChain';
import ErrorMessage from '../ErrorMessage';
import UnwrapUI from '../UnwrapUI';
import TransferUI from '../TransferUI';
import WrappedTokensWarning from '../WrappedTokensWarning';
import TransferRequest from '../TransferRequest';
import SFuelWarning from '../SFuelWarning';
import TransactionsHistory from '../TransactionsHistory';


export default function WidgetBody(props) {

  const [expandedFrom, setExpandedFrom] = React.useState<boolean>(false);
  const [expandedTo, setExpandedTo] = React.useState<boolean>(false);
  const [expandedTokens, setExpandedTokens] = React.useState<boolean>(false);
  const [expandedHistory, setExpandedHistory] = React.useState<string | false>(false);
  const [expandedExit, setExpandedExit] = React.useState<string | false>(false);

  // TODO: tmp wrap tokens fix
  const wrapTransferAction = props.actionSteps && props.actionSteps.length === 2 && props.activeStep > 0;

  if (props.errorMessage) {
    return (<ErrorMessage errorMessage={props.errorMessage} />)
  }

  if (isTransferRequestView(props.view)) {
    return <TransferRequest
      disabledChains={props.disabledChains}
      setExpandedHistory={setExpandedHistory}
      expandedHistory={expandedHistory}

      expandedExit={expandedExit}
      setExpandedExit={setExpandedExit}

      theme={props.theme}
      {...props}
    />
  }

  if (props.view === View.UNWRAP) {
    return <div>
      <CurrentChain
        schains={props.config.chains}
        setChain={props.setChain1}
        chain={props.chain1}
        disabledChain={props.chain2}
        fromChain={true}
        config={props.config}
        disabled={props.disabledChains}

        theme={props.theme}
        expanded={expandedFrom}
        setExpanded={setExpandedFrom}

        expandedTo={expandedTo}
        expandedTokens={expandedTokens}

        sFuelData={props.sFuelData1}

        view={props.view}
        setView={props.setView}

        resetWidgetState={props.resetWidgetState}
      />
      <UnwrapUI
        {...props}
        expandedFrom={expandedFrom}
        expandedTo={expandedTo}
        expandedTokens={expandedTokens}
        setExpandedFrom={setExpandedFrom}
        setExpandedTo={setExpandedTo}
        setExpandedTokens={setExpandedTokens}
        btnText={props.btnText}
      />

      <TransactionsHistory
        transactionsHistory={props.transactionsHistory}
        clearTransactionsHistory={props.clearTransactionsHistory}
        config={props.config}
        setExpanded={setExpandedHistory}
        expanded={expandedHistory}
      />
    </div>
  }

  return (
    <div>
      <Collapse in={!expandedHistory}>
        <CurrentChain
          schains={props.config.chains}
          setChain={props.setChain1}
          chain={props.chain1}
          disabledChain={props.chain2}
          fromChain={true}
          config={props.config}
          disabled={props.disabledChains}

          theme={props.theme}
          expanded={expandedFrom}
          setExpanded={setExpandedFrom}

          expandedTo={expandedTo}
          expandedTokens={expandedTokens}
          expandedExit={expandedExit}

          sFuelData={props.sFuelData1}
        />
        <TransferUI
          {...props}
          expandedFrom={expandedFrom}
          expandedTo={expandedTo}
          expandedTokens={expandedTokens}
          setExpandedFrom={setExpandedFrom}
          setExpandedTo={setExpandedTo}
          setExpandedTokens={setExpandedTokens}

          expandedExit={expandedExit}
          setExpandedExit={setExpandedExit}
        />
        <SFuelWarning
          chain1={props.chain1}
          chain2={props.chain2}
          transferRequest={props.transferRequest}
          config={props.config}
          address={props.address}
          setSFuelOk={props.setSFuelOk}
          view={props.view}
        />
        <Collapse in={
          !expandedFrom &&
          !expandedTo &&
          !expandedTokens &&
          !wrapTransferAction
        }>
          <WrappedTokensWarning
            wrappedTokens={props.wrappedTokens}
            setView={props.setView}
          />
        </Collapse>
      </Collapse>
      <Collapse in={
        !expandedFrom &&
        !expandedTo &&
        !expandedTokens &&
        !expandedExit
      }>
        <TransactionsHistory
          transactionsHistory={props.transactionsHistory}
          clearTransactionsHistory={props.clearTransactionsHistory}
          config={props.config}
          setExpanded={setExpandedHistory}
          expanded={expandedHistory}
        />
      </Collapse>
    </div >
  )
}