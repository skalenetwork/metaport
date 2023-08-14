import { useEffect } from 'react';
import React from 'react';

import { useAccount } from 'wagmi'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getAvailableTokensTotal, getDefaultToken } from '../../core/tokens/helper';

import { cls } from '../../core/helper';

import ErrorMessage from '../ErrorMessage';

import TokenListSection from '../TokenListSection';
import TokenBalance from './TokenBalance';
import TokenIcon from "../TokenIcon";

import styles from "../../styles/styles.module.scss";
import common from "../../styles/common.module.scss";
import { getTokenName } from "../../core/metadata";

import { useCollapseStore } from '../../store/Store';
import { useMetaportStore } from '../../store/MetaportState';
import { TokenType, NoTokenPairsMessage } from '../../core/dataclasses';


export default function TokenList() {

  const token = useMetaportStore((state) => state.token);
  const tokens = useMetaportStore((state) => state.tokens);
  const setToken = useMetaportStore((state) => state.setToken);
  const updateTokenBalances = useMetaportStore((state) => state.updateTokenBalances);
  const tokenContracts = useMetaportStore((state) => state.tokenContracts);

  const tokenBalances = useMetaportStore((state) => state.tokenBalances);
  const transferInProgress = useMetaportStore((state) => state.transferInProgress);

  const expandedTokens = useCollapseStore((state) => state.expandedTokens);
  const setExpandedTokens = useCollapseStore((state) => state.setExpandedTokens);

  const { address } = useAccount();


  useEffect(() => {
    updateTokenBalances(address); // Fetch users immediately on component mount
    const intervalId = setInterval(() => {
      updateTokenBalances(address);
    }, 10000) // Fetch users every 10 seconds

    return () => {
      clearInterval(intervalId) // Clear interval on component unmount
    }
  }, [updateTokenBalances, tokenContracts, address]);

  useEffect(() => {
    const defaultToken = getDefaultToken(tokens);
    if (defaultToken) {
      setToken(defaultToken);
    }
  }, [tokens]);


  let availableTokensTotal = getAvailableTokensTotal(tokens);
  let disabled = availableTokensTotal === 1;
  let noTokens = availableTokensTotal === 0;

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedTokens(isExpanded ? panel : false);
    };

  if (noTokens) {
    return (<ErrorMessage
      errorMessage={new NoTokenPairsMessage()}
    />)
  }

  return (
    <div>
      <Accordion
        expanded={expandedTokens === 'panel1'}
        onChange={handleChange('panel1')}
        disabled={disabled || transferInProgress}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          className={styles.accordionSummary}
          style={{paddingTop: '0'}}
        >
          <div className={cls(common.flex, common.flexCenteredVert, common.fullWidth)}>
            <div className={cls(common.flex, common.flexCentered, common.margRi10)}>
              <TokenIcon token={token} />
            </div>
            <p className={cls(
              common.p,
              common.p3,
              common.p600,
              common.pMain,
              common.flex,
              common.flexGrow,
              common.margRi10
            )}>
              {token ? getTokenName(token) : 'Select token'}
            </p>
            <div className={common.margRi5}>
              {token ? <TokenBalance token={token} tokenBalances={tokenBalances} /> : null}
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {/* <TokenListSection
            tokens={tokens.eth}
            type={TokenType.eth}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          /> */}
          <TokenListSection
            tokens={tokens.erc20}
            type={TokenType.erc20}
            setToken={setToken}
            setExpanded={setExpandedTokens}
            tokenBalances={tokenBalances}
          />
          <TokenListSection
            tokens={tokens.erc721}
            type={TokenType.erc721}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
          <TokenListSection
            tokens={tokens.erc721meta}
            type={TokenType.erc721meta}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
          <TokenListSection
            tokens={tokens.erc1155}
            type={TokenType.erc1155}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}