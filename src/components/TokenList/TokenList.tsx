import React, { useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";
import localStyles from "./TokenList.scss";


function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const icons = importAll(require.context('../../icons', false, /\.(png|jpe?g|svg)$/));


function iconPath(name) {
  const key = name.toLowerCase() + '.svg';
  if (icons[key]) {
    return icons[key];
  } else {
    return icons['eth.svg'];
  }
}


function roundDown(number, decimals) {
  decimals = decimals || 0;
  return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
}


export default function TokenList(props) {

  let disabled = Object.keys(props.tokens['erc20']).length == 1 && !props.tokens.eth || Object.keys(props.tokens['erc20']).length == 0 && props.tokens.eth;
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

  let allTokens = props.tokens['erc20'];
  let tokenInfo;

  if (props.tokens.eth) {
    allTokens.eth = props.tokens.eth;
  }

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
            <div className={clsNames(styles.mp__flex, styles.mp__btnChain)}>
              <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
                <img
                  className={clsNames(localStyles.mp__iconToken, localStyles.mp__iconTokenAccent)}
                  src={tokenInfo.iconUrl ? tokenInfo.iconUrl : iconPath(tokenInfo.symbol)}
                />
              </div>
              <p className={clsNames(
                styles.mp__chainName,
                styles.mp__flex,
                styles.mp__flexGrow,
                styles.mp__margRi10
              )}>
                {tokenInfo.name}
              </p>
              {tokenInfo.unwrappedBalance ? (
                <p className={clsNames(
                  styles.mp__p3,
                  styles.mp__flex,
                  styles.mp__flexCenteredVert,
                  styles.mp__margRi5
                )}>
                  {roundDown(tokenInfo.unwrappedBalance, 4)} {tokenInfo.unwrappedSymbol} /
                </p>
              ) : null}
              <p className={clsNames(
                styles.mp__p3,
                styles.mp__flex,
                styles.mp__flexCenteredVert,
                styles.mp__margRi5
              )}>
                {roundDown(tokenInfo['balance'], 4)} {tokenInfo.symbol}
              </p>
            </div>
          ) : (
            <div className={clsNames(styles.mp__flex, styles.mp__btnChain)}>
              <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
                <img className={localStyles.mp__iconToken} src={iconPath('eth')} />
              </div>
              <p className={clsNames(
                styles.mp__chainName,
                styles.mp__flex,
                styles.mp__flexGrow,
                styles.mp__margRi10
              )}>
                Select token
              </p>
            </div>
          )
          }
        </AccordionSummary>
        <AccordionDetails>
          {allTokens ? (<div className={styles.mp__chainsList}>
            {Object.keys(allTokens).map((key, i) => (
              <Typography key={key}>
                <Button
                  color="secondary"
                  size="small"
                  className={styles.mp__btnChain}
                  onClick={() => handle(key)}
                >
                  <div className={clsNames(styles.mp__flex, styles.mp__btnChain)}>
                    <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
                      <img
                        className={clsNames(localStyles.mp__iconToken, localStyles.mp__iconTokenAccent)}
                        src={allTokens[key].iconUrl ? allTokens[key].iconUrl : iconPath(allTokens[key].symbol)}
                      />
                    </div>
                    <p className={clsNames(
                      styles.mp__chainName,
                      styles.mp__flex,
                      styles.mp__flexGrow,
                      styles.mp__margRi10
                    )}>
                      {allTokens[key].name}
                    </p>
                    <p className={clsNames(
                      styles.mp__p3,
                      styles.mp__flex,
                      styles.mp__flexCenteredVert,
                      styles.mp__margRi5
                    )}>
                      {roundDown(allTokens[key].balance, 4)} {allTokens[key].symbol}
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