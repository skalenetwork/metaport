import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import { iconPath } from '../TokenList/helper';
import { MAINNET_CHAIN_NAME } from '../../core/constants';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


function stringToColor(_, dark) {
  if (dark) {
    // return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
    return 'hsl(120deg 2% 88%)';
  }
  return 'hsl(0deg 0% 15%)';
  // return `hsl(${hashCode(str) % 360}, 55%, 40%)`;
}


export default function ChainsList(props) {
  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded(isExpanded ? panel : false);
    };

  const schainNames = [];

  for (let chain of props.config.chains) {
    if (chain != props.disabledChain && chain != props.chain) {
      schainNames.push(chain);
    }
  }

  function handle(schainName) {
    props.setExpanded(false);
    props.setChain(schainName);
  }

  function getChainName(chainName: string) {
    if (chainName == MAINNET_CHAIN_NAME) {
      return 'Mainnet';
    }
    if (props.config.chainsMetadata && props.config.chainsMetadata[chainName]) {
      return props.config.chainsMetadata[chainName].alias;
    } else {
      return chainName;
    }
  }

  function getChainIcon(chainName: string) {
    if (chainName == MAINNET_CHAIN_NAME) {
      return <img src={iconPath('eth')} className='eth-logo' height='20px' width='20px' />;
    }
    return (<OfflineBoltIcon sx={{ color: stringToColor(props.chain, props.dark) }} width='20px' />);
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
              <div className={clsNames(styles.mp__flex, styles.mp__btnChain)}>
                <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
                  {getChainIcon(props.chain)}
                </div>
                <p className={clsNames(
                  styles.mp__flex,
                  styles.mp__chainName,
                  styles.mp__margRi10
                )}>
                  {getChainName(props.chain)}
                </p>
              </div>
            </Tooltip>
          ) : (
            <div className={clsNames(styles.mp__flex, styles.mp__btnChain)}>
              <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
                <OfflineBoltIcon sx={{ color: stringToColor(props.chain, props.dark) }} />
              </div>
              <p className={clsNames(styles.mp__flex, styles.mp__chainName, styles.mp__margRi10)}>
                Select chain
              </p>
            </div>
          )
          }
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.mp__chainsList}>
            {schainNames.map((name) => (
              <Typography key={name}>
                <Button
                  color="secondary"
                  size="small"
                  className={clsNames(styles.mp__btnChain)}
                  onClick={() => handle(name)}
                >
                  <div className={clsNames(styles.mp__flex, styles.mp__btnChain)}>
                    <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
                      {getChainIcon(name)}
                    </div>
                    <p className={clsNames(styles.mp__flex, styles.mp__chainName, styles.mp__margRi10)}>
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