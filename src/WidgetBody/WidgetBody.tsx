import React, { useEffect } from 'react';

import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';

import ChainsList from '../ChainsList';
import TokenList from '../TokenList';
import AmountInput from '../AmountInput';
import Stepper from '../Stepper';

import SwapVertIcon from '@mui/icons-material/SwapVert';
import IconButton from '@mui/material/IconButton';


function roundBalance(balance) {
  return balance;
  // return Math.floor(balance * 100) / 100;
}


export default function WidgetBody(props) {
  const [expandedFrom, setExpandedFrom] = React.useState<boolean>(false);
  const [expandedTo, setExpandedTo] = React.useState<boolean>(false);
  const [expandedTokens, setExpandedTokens] = React.useState<boolean>(false);

  // let tokensList = Object.keys(props.tokens['erc20']).length != 0;
  let currentTokenBalance;

  // todo: optimize
  if (props.token && props.tokens['erc20'][props.token]) {
    currentTokenBalance = props.tokens['erc20'][props.token]['balance'];
  }

  return (
    <div>
      <div>
        <Collapse in={!expandedTo && !expandedTokens}>
          <div>
            <p className='no-marg-top sm-gr-text'>Transfer from</p>
            <ChainsList
              schains={props.schains}
              setChain={props.setChain1}
              chain={props.chain1}
              disabledChain={props.chain2}
              expanded={expandedFrom}
              setExpanded={setExpandedFrom}
              fromChain={true}
              schainAliases={props.schainAliases}
              disabled={props.disabledChains}
              dark={props.theme.mode === 'dark'}
            />
          </div>
        </Collapse>
      </div>
      
      <div>
      <Collapse className='arrow-down-icon' in={!expandedFrom && !expandedTo && !expandedTokens}>
        <IconButton
          size="small"
          color="primary"
          style={{
            backgroundColor: props.theme.primary,
            borderColor: props.theme.background,
          }}

          disabled={props.amountLocked}
          
          onClick={() => {
            let chain1 = props.chain1;
            props.setChain1(props.chain2);
            props.setChain2(chain1);
            props.setAmount(0);
            props.setLoading(false);
            props.setActiveStep(0);
          }}>
          <SwapVertIcon/>
        </IconButton>
      </Collapse>

      <Collapse in={!expandedFrom && !expandedTokens}>
        <p className='sm-gr-text marg-top-20-pt'>To</p>
        <ChainsList
          schains={props.schains}
          setChain={props.setChain2}
          chain={props.chain2}
          disabledChain={props.chain1}
          expanded={expandedTo}
          setExpanded={setExpandedTo}
          schainAliases={props.schainAliases}
          disabled={props.disabledChains}
          dark={props.theme.mode === 'dark'}
        />
      </Collapse>

      <Collapse in={props.chain1 && props.chain2}>
        <Collapse in={!!expandedTokens}>
          <h5 className='token-text'>Token</h5>
        </Collapse>
        <Collapse in={!expandedFrom && !expandedTo}>
          <div className='marg-top-10'>
            {props.loadingTokens ? (<Skeleton animation="wave" height={48} />) : (<TokenList
              tokens={props.tokens}
              setToken={props.setToken}
              token={props.token}
              expanded={expandedTokens}
              setExpanded={setExpandedTokens}
            />)}
         
          </div>
      </Collapse>

        <Collapse in={!expandedFrom && !expandedTo && !expandedTokens && props.token}>
            <div className='marg-top-10'>
              <AmountInput
                amount={props.amount}
                setAmount={props.setAmount}
                balance={currentTokenBalance}
                loading={props.loading}
                activeStep={props.activeStep}
                amountLocked={props.amountLocked}
              />
            </div>
        </Collapse>
      </Collapse>

      <Collapse in={!expandedFrom && !expandedTo && !expandedTokens && props.token}>
        <div className='marg-top-10'>
          {!props.token ? (
            <div></div>
          ) : (
            <Stepper
              approveTransfer={props.approveTransfer}
              transfer={props.transfer}
              amount={props.amount}
              setAmount={props.setAmount}
              allowance={props.allowance}

              loading={props.loading}
              setLoading={props.setLoading}

              activeStep={props.activeStep}
              setActiveStep={props.setActiveStep}

              setAmountLocked={props.setAmountLocked}

              theme={props.theme}
            />
          )}
        </div>
      </Collapse>
      </div>
    </div>
  )
}