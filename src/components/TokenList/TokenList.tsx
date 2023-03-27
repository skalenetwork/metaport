import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getAvailableTokensTotal, getDefaultToken } from '../../core/tokens/helper';

import { clsNames } from '../../core/helper';

import ErrorMessage, { NoTokenPairsMessage } from '../ErrorMessage';

import TokenListSection from '../TokenListSection';
import TokenBalance from './TokenBalance';

import styles from "../WidgetUI/WidgetUI.scss";
import localStyles from "./TokenList.scss";
import { getIconSrc, iconPath, getTokenName } from "./helper";


export default function TokenList(props) {
  let availableTokensTotal = getAvailableTokensTotal(props.availableTokens);
  let disabled = availableTokensTotal === 1;
  let noTokens = availableTokensTotal === 0;

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded(isExpanded ? panel : false);
    };

  if (noTokens) {
    return (<ErrorMessage
      errorMessage={new NoTokenPairsMessage()}
    />)
  }

  const defaultToken = getDefaultToken(props.availableTokens);
  if (defaultToken) {
    props.setToken(defaultToken);
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
                  src={getIconSrc(props.token)}
                />
              </div>
              <p className={clsNames(
                styles.mp__chainName,
                styles.mp__flex,
                styles.mp__flexGrow,
                styles.mp__margRi10
              )}>
                {getTokenName(props.token)}
              </p>
              <TokenBalance token={props.token} />
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
          <TokenListSection
            tokens={props.availableTokens.eth}
            type='ETH'
            setToken={props.setToken}
            setExpanded={props.setExpanded}
          />
          <TokenListSection
            tokens={props.availableTokens.erc20}
            type='ERC20'
            setToken={props.setToken}
            setExpanded={props.setExpanded}
          />
          <TokenListSection
            tokens={props.availableTokens.erc721}
            type='ERC721'
            setToken={props.setToken}
            setExpanded={props.setExpanded}
          />
          <TokenListSection
            tokens={props.availableTokens.erc721meta}
            type='ERC721 with Metadata'
            setToken={props.setToken}
            setExpanded={props.setExpanded}
          />
          <TokenListSection
            tokens={props.availableTokens.erc1155}
            type='ERC1155'
            setToken={props.setToken}
            setExpanded={props.setExpanded}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}