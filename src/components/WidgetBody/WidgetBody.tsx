import React from 'react';

import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';

import ChainsList from '../ChainsList';
import TokenList from '../TokenList';
import AmountInput from '../AmountInput';
import TokenIdInput from '../TokenIdInput';
import Stepper from '../Stepper';
import SFuelBadge from '../SFuelBadge';
import CurrentChain from '../CurrentChain';
import ErrorMessage from '../ErrorMessage';
import AmountErrorMessage from '../AmountErrorMessage';

import { TokenType } from '../../core/dataclasses/TokenType';

import ImportExportIcon from '@mui/icons-material/ImportExport';


export default function WidgetBody(props) {
  const [expandedFrom, setExpandedFrom] = React.useState<boolean>(false);
  const [expandedTo, setExpandedTo] = React.useState<boolean>(false);
  const [expandedTokens, setExpandedTokens] = React.useState<boolean>(false);

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
      />
      <Collapse in={props.errorMessage && !expandedFrom}>
        <ErrorMessage
          errorMessage={props.errorMessage}
        />
      </Collapse>
      <Collapse in={!props.errorMessage}>
        <Collapse className={styles.mp__btnSwitch} in={!expandedFrom && !expandedTo && !expandedTokens}>
          <Tooltip title='Switch transfer direction'>
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
                props.cleanData();
                props.setChain1(props.chain2);
                props.setChain2(chain1);
              }}>
              <ImportExportIcon />
            </IconButton>
          </Tooltip>
        </Collapse>

        <Collapse in={!expandedFrom && !expandedTokens}>
          <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margBott5)}>
            <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow, (expandedTo ? styles.mp__transferToFix : null))}>
              Transfer to
            </p>
            <div className={styles.mp__flex}>
              <SFuelBadge from={false} data={props.sFuelData2} />
            </div>
          </div>

          <ChainsList
            schains={props.schains}
            setChain={props.setChain2}
            chain={props.chain2}
            disabledChain={props.chain1}
            expanded={expandedTo}
            setExpanded={setExpandedTo}
            chainsMetadata={props.chainsMetadata}
            disabled={props.disabledChains}
            dark={props.theme.mode === 'dark'}
          />
        </Collapse>

        <Collapse in={props.chain1 && props.chain2}>
          <Collapse in={!!expandedTokens}>
            <p className={clsNames(styles.mp__p3, styles.mp__p, styles.mp__margBott5, styles.mp__margTop20Pt)}>
              Token
            </p>
          </Collapse>
          <Collapse in={!expandedFrom && !expandedTo}>
            <div className={styles.mp__margTop10}>
              {(props.loadingTokens  || props.transferRequest) ? (<Skeleton animation="wave" height={48} />) : (<TokenList
                availableTokens={props.availableTokens}
                setToken={props.setToken}
                token={props.token}
                expanded={expandedTokens}
                setExpanded={setExpandedTokens}
              />)}
            </div>
          </Collapse>
          <Collapse in={(!expandedFrom && !expandedTo && !expandedTokens && props.token) && [TokenType.erc721, TokenType.erc721meta, TokenType.erc1155].includes(props.token.type)}>
            <div className={styles.mp__margTop10}>
              <TokenIdInput
                tokenId={props.tokenId}
                setTokenId={props.setTokenId}
                token={props.token}
                loading={props.loading}
                activeStep={props.activeStep}
                amountLocked={props.amountLocked}
                dark={props.theme.mode === 'dark'}
              />
            </div>
          </Collapse>
          <Collapse in={(!expandedFrom && !expandedTo && !expandedTokens && props.token) && [TokenType.eth, TokenType.erc20, TokenType.erc1155].includes(props.token.type)}>
            <div className={styles.mp__margTop10}>
              <AmountInput
                amount={props.amount}
                setAmount={props.setAmount}
                token={props.token}
                loading={props.loading}
                activeStep={props.activeStep}
                amountLocked={props.amountLocked}
              />
            </div>
          </Collapse>
          <AmountErrorMessage
            amountErrorMessage={props.amountErrorMessage}
            actionBtnDisabled={props.actionBtnDisabled}
          />
        </Collapse>
        <Collapse in={!expandedFrom && !expandedTo && !expandedTokens && props.token}>
          <div className={styles.mp__margTop10}>
            {!props.token ? (
              <div></div>
            ) : (
              <div>
                {(!props.actionSteps) ? (<Skeleton animation="wave" height={48} />) : (<Stepper
                  amount={props.amount}
                  tokenId={props.tokenId}
                  setAmount={props.setAmount}
                  allowance={props.allowance}
                  token={props.token}

                  loading={props.loading}
                  setLoading={props.setLoading}

                  actionBtnDisabled={props.actionBtnDisabled}

                  activeStep={props.activeStep}
                  setActiveStep={props.setActiveStep}

                  setTokenId={props.setTokenId}

                  setAmountLocked={props.setAmountLocked}
                  actionSteps={props.actionSteps}
                  handleNextStep={props.handleNextStep}

                  amountErrorMessage={props.amountErrorMessage}

                  theme={props.theme}

                  cleanData={props.cleanData}
                />)}
              </div>
            )}
          </div>
        </Collapse>
      </Collapse>
    </div >
  )
}