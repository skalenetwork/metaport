import React, { useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import ethLogo from '../../icons/eth_white.svg';
import { MAINNET_CHAIN_NAME } from '../../core/constants';


function hashCode(str) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function stringToColour(str, dark) {
  if (dark) {
    // return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
    return 'hsl(120deg 2% 88%)';
  }
  return 'hsl(0deg 0% 15%)';
  // return `hsl(${hashCode(str) % 360}, 55%, 40%)`;
}


export default function ChainsList(props) {
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded(isExpanded ? panel : false);
    };

  const schainNames = [];

  for (let chain of props.schains) {
    if (chain != props.disabledChain && chain != props.chain){
      schainNames.push(chain);
    }
  }

  function handle(schainName) {
    props.setExpanded(false);
    props.setChain(schainName);
  }

  function getChainName(chainName: string) {
    if (chainName == MAINNET_CHAIN_NAME) {
      return 'Ethereum Mainnet';
    }
    if (props.schainAliases && props.schainAliases[chainName]){
      return props.schainAliases[chainName];
    } else {
      return chainName;
    }
  }

  function getChainIcon(chainName: string) {
    if (chainName == MAINNET_CHAIN_NAME) {
      return <img src={ethLogo} className='eth-logo' height='20px' width='20px'/>;
    }
    return (<OfflineBoltIcon sx={{ color: stringToColour(props.chain, props.dark) }} width='20px'/>);
  }

  return (
    <div>
      <Accordion
        expanded={props.expanded === 'panel1'}
        onChange={handleChange('panel1')}
        disabled={props.disabled}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          {props.chain ? (
            <Tooltip title={'SKALE Chain ' + props.chain}>
              <div className="flex-container chain-name-btn">
                <div className="flex-container fl-centered">
                  {getChainIcon(props.chain)}
                </div>
                <p className="schain-name flex-container marg-ri-10">
                  {getChainName(props.chain)}
                </p>
              </div>
            </Tooltip>
          ) : (
            <div className="flex-container chain-name-btn">
              <div className="flex-container fl-centered">
                <OfflineBoltIcon sx={{ color: 'white' }} className='opacityIcon'/>
              </div>
              <p className="schain-name flex-container marg-ri-10">
                Select chain
              </p>
            </div>
          )
          }
        </AccordionSummary>
        <AccordionDetails>
          <div className='chains-list'>
            {schainNames.map((name)  => (
              <Typography key={name}>
                <Button color="secondary" size="small" className='chain-name-btn' onClick={() => handle(name)}>
                  <div className="flex-container chain-name-btn">
                    <div className="flex-container fl-centered">
                    {getChainIcon(name)}
                    </div>
                    <p className="schain-name flex-container marg-ri-10">
                      {getChainName(name)}
                    </p>
                  </div>  
                </Button>
            </Typography>
           ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}