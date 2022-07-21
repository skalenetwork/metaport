import React, { useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import './TokenList.scss';


function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const icons = importAll(require.context('../../icons', false, /\.(png|jpe?g|svg)$/));


function iconPath(name) {
  const key = name + '.svg';
  if (icons[key]) {
    return icons[key];
  } else {
    return icons['eth.svg'];
  }
}


function roundDown(number, decimals) {
  decimals = decimals || 0;
  return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
}


export default function TokenList(props) {

  let disabled = Object.keys(props.tokens['erc20']).length == 1 || Object.keys(props.tokens['erc20']).length == 0 && props.tokens.eth;
  useEffect(() => {
    // if (disabled) {
    //   props.setToken(Object.keys(props.tokens['erc20'])[0])
    // }
  }, []);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded(isExpanded ? panel : false);
    };

  function handle(token) {
    props.setExpanded(false);
    props.setToken(token);
  }

  let erc20Tokens = props.tokens['erc20'];
  let tokenInfo;
  if (props.token == 'eth') {
    tokenInfo = props.tokens.eth;
  } else {
    tokenInfo = props.tokens['erc20'][props.token];
  }
  

  return (
    <div>
      <Accordion
        expanded={props.expanded === 'panel1'}
        onChange={handleChange('panel1')}
        disabled={disabled}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          {props.token ? (
            <div className="flex-container chain-name-btn">
              <div className="flex-container fl-centered">
                <img className='token-icon token-icon-accent' src={iconPath(props.token)}/>
              </div>
              <p className="schain-name flex-container fl-grow marg-ri-10">
                {tokenInfo['name']}
              </p>
              
              {tokenInfo.unwrappedBalance ? (
                <p className="sm-gr-text flex-container marg-ri-5">
                {roundDown(tokenInfo.unwrappedBalance, 4)} {tokenInfo.unwrappedSymbol} /
              </p>
              ) : null}
              <p className="sm-gr-text flex-container marg-ri-5">
                {roundDown(tokenInfo['balance'], 4)} {props.token}
              </p>
            </div>
          ) : (
            <div className="flex-container chain-name-btn">
              <div className="flex-container fl-centered">
                <img className='token-icon' src={iconPath('eth')}/>
              </div>
              <p className="schain-name flex-container marg-ri-10">
                Select token
              </p>
            </div>
          )
          }          
        </AccordionSummary>
        <AccordionDetails>
          {erc20Tokens ? (<div className='chains-list'>
            {Object.keys(erc20Tokens).map((key, i)  => (
              <Typography key={key}>
                <Button color="secondary" size="small" className='chain-name-btn' onClick={() => handle(key)}>
                  <div className="flex-container chain-name-btn">
                    <div className="flex-container fl-centered">
                      <img className='token-icon token-icon-accent' src={iconPath(key)}/>
                    </div>
                    <p className="schain-name flex-container fl-grow marg-ri-10">
                      {erc20Tokens[key]['name']}
                    </p>
                    <p className="sm-gr-text flex-container marg-ri-5">
                      {roundDown(erc20Tokens[key]['balance'], 4)} {key}
                    </p>
                  </div>  
                </Button>
            </Typography>
           ))}
          </div>) : (<div></div>)}
          
        </AccordionDetails>
      </Accordion>
     
    </div>
  )
}