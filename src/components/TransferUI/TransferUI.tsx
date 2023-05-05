import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';

import ChainsList from '../ChainsList';
import TokenList from '../TokenList';
import AmountInput from '../AmountInput';
import TokenIdInput from '../TokenIdInput';
import Stepper from '../Stepper';
import AmountErrorMessage from '../AmountErrorMessage';

import { TokenType } from '../../core/dataclasses/TokenType';


export default function TransferUI(props) {
  return (
    <div>
      <Collapse
        className={styles.mp__btnSwitch}
        in={!props.expandedFrom && !props.expandedTo && !props.expandedTokens}
      >
        <Tooltip title='Switch transfer direction'>
          <IconButton
            size="small"
            color="primary"
            style={{
              backgroundColor: props.theme.primary,
              borderColor: props.theme.background,
              zIndex: props.theme.zIndex
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

      <Collapse in={!props.expandedFrom && !props.expandedTokens}>
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margBott5)}>
          <p className={clsNames(
            styles.mp__flex,
            styles.mp__p3,
            styles.mp__p,
            styles.mp__flexGrow,
            (props.expandedTo ? styles.mp__transferToFix : null)
          )}>
            TO
          </p>
          {/* <div className={styles.mp__flex}>
            <SFuelBadge from={false} data={props.sFuelData2} />
          </div> */}
        </div>
        <ChainsList
          schains={props.config.chains}
          setChain={props.setChain2}
          chain={props.chain2}
          disabledChain={props.chain1}
          expanded={props.expandedTo}
          setExpanded={props.setExpandedTo}
          config={props.config}
          disabled={props.disabledChains}
          dark={props.theme.mode === 'dark'}
        />
      </Collapse>

      <Collapse in={props.chain1 && props.chain2}>
        <Collapse in={!!props.expandedTokens}>
          <p className={clsNames(
            styles.mp__p3,
            styles.mp__p,
            styles.mp__margBott5,
            styles.mp__margTop20Pt,
            styles.sk__uppercase
          )}>
            Token
          </p>
        </Collapse>
        <Collapse in={!props.expandedFrom && !props.expandedTo}>
          <div className={styles.mp__margTop10}>
            {(props.loadingTokens || props.transferRequest) ? (
              <Skeleton className={styles.sk__skeleton} animation="wave" height={48} />) : (<TokenList
                availableTokens={props.availableTokens}
                setToken={props.setToken}
                token={props.token}
                expanded={props.expandedTokens}
                setExpanded={props.setExpandedTokens}
              />)}
          </div>
        </Collapse>
        <Collapse in={(!props.expandedFrom && !props.expandedTo && !props.expandedTokens && props.token) && [TokenType.erc721, TokenType.erc721meta, TokenType.erc1155].includes(props.token.type)}>
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
        <Collapse in={(!props.expandedFrom && !props.expandedTo && !props.expandedTokens && props.token) && [TokenType.eth, TokenType.erc20, TokenType.erc1155].includes(props.token.type)}>
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
      <Collapse in={!props.expandedFrom && !props.expandedTo && !props.expandedTokens && props.token && props.sFuelOk}>
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
                sFuelData={props.sFuelData1}

                btnText={props.btnText}
              />)}
            </div>
          )}
        </div>
      </Collapse>
    </div >
  )
}