import React from "react";
import Button from '@mui/material/Button';

import ChainsList from '../ChainsList';
import TokenList from '../TokenList';
import AmountInput from '../AmountInput';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function WidgetCore(props) {
  const [expandedFrom, setExpandedFrom] = React.useState<string | false>(false);
  const [expandedTo, setExpandedTo] = React.useState<string | false>(false);
  const [expandedTokens, setExpandedTokens] = React.useState<string | false>(false);

  const chainsSelected = props.chain1 && props.chain2;

  return (
    <div>
      <div className={'hiddable ' + (expandedTo || expandedTokens ? 'hidden' : '')}>
        <h5>From</h5>
        <ChainsList
          schains={props.schains}
          setChain={props.setChain1}
          chain={props.chain1}
          disabledChain={props.chain2}
          expanded={expandedFrom}
          setExpanded={setExpandedFrom}
        />
      </div>

      <div  className={'arrow-down-icon hiddable ' + (expandedFrom || expandedTo || expandedTokens ? 'hidden' : '')}>
        <ArrowDownwardIcon/>
      </div>
    
      <div className={'hiddable ' + (expandedFrom || expandedTokens ? 'hidden' : '')}>
        <h5>To</h5>
        <ChainsList
          schains={props.schains}
          setChain={props.setChain2}
          chain={props.chain2}
          disabledChain={props.chain1}
          expanded={expandedTo}
          setExpanded={setExpandedTo}
        />
      </div>

      <div className={'marg-top-20 hiddable ' + (!chainsSelected ? 'hidden' : '')}>
        <div className={(!expandedTokens ? 'hidden-static' : '')}>
          <h5>Token</h5>
        </div>
        <div className={'hiddable ' + (expandedFrom || expandedTo ? 'hidden' : '')}>
          <div className='marg-top-10'>
              <TokenList
                tokens={props.tokens}
                setToken={props.setToken}
                token={props.token}
                expanded={expandedTokens}
                setExpanded={setExpandedTokens}
              />
          </div>      
        </div>

        <div className={'hiddable ' + (expandedFrom || expandedTo || expandedTokens ? 'hidden' : '')}>
          <div className='marg-top-10'>
            <AmountInput/>
          </div>
        </div>
      </div>

      <div className={'hiddable ' + (expandedFrom || expandedTo || expandedTokens ? 'hidden' : '')}>
        <Button variant="contained" color="secondary" size="large" className='transfer-btn'>
          Transfer
        </Button>
      </div>
    </div>
  )
}