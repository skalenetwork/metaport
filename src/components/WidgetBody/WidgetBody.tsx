import React from 'react';

import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';

import ChainsList from '../ChainsList';
import TokenList from '../TokenList';
import AmountInput from '../AmountInput';
import Stepper from '../Stepper';
import SFuelBadge from '../SFuelBadge';


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
  if (props.token && props.tokens.eth && props.token == 'eth') {
    currentTokenBalance = props.tokens.eth.balance;
  }

  return (
    <div>
      <div>
        <Collapse in={!expandedTo && !expandedTokens}>
          <div>
            <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margBott5)}>
              <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__flexGrow)}>
                Transfer from
              </p>
              <div className={styles.mp__flex}>
                <SFuelBadge from={true} data={props.sFuelData1} />
              </div>
            </div>
            <ChainsList
              schains={props.schains}
              setChain={props.setChain1}
              chain={props.chain1}
              disabledChain={props.chain2}
              expanded={expandedFrom}
              setExpanded={setExpandedFrom}
              fromChain={true}
              chainsMetadata={props.chainsMetadata}
              disabled={props.disabledChains}
              dark={props.theme.mode === 'dark'}
            />
          </div>
        </Collapse>
      </div>

      <div>
        <Collapse className={styles.mp__btnSwitch} in={!expandedFrom && !expandedTo && !expandedTokens}>
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
              props.setAmount(null);
              props.setLoading(false);
              props.setActiveStep(0);
            }}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Collapse>

        <Collapse in={!expandedFrom && !expandedTokens}>
          <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margBott5)}>
            <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__flexGrow)}>
              To
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
            <h5 className={clsNames(styles.mp__p3, styles.mp__margBott5, styles.mp__margTop20Pt)}>Token</h5>
          </Collapse>
          <Collapse in={!expandedFrom && !expandedTo}>
            <div className={styles.mp__margTop10}>
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
            <div className={styles.mp__margTop10}>
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
          <div className={styles.mp__margTop10}>
            {!props.token ? (
              <div></div>
            ) : (
              <div>
                {!props.actionSteps ? (<Skeleton animation="wave" height={48} />) : (<Stepper
                  amount={props.amount}
                  setAmount={props.setAmount}
                  allowance={props.allowance}
                  balance={currentTokenBalance}

                  loading={props.loading}
                  setLoading={props.setLoading}

                  activeStep={props.activeStep}
                  setActiveStep={props.setActiveStep}

                  setAmountLocked={props.setAmountLocked}
                  actionSteps={props.actionSteps}
                  handleNextStep={props.handleNextStep}

                  theme={props.theme}
                />)}
              </div>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  )
}