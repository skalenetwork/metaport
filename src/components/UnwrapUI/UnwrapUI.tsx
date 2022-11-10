import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';

import Stepper from '../Stepper';
import TokenList from '../TokenList';
import AmountErrorMessage from '../AmountErrorMessage';

import { OperationType } from '../../core/dataclasses/OperationType';


export default function UnwrapUI(props) {
  if (!props.wrappedTokens || !props.wrappedTokens.erc20) return;
  const wrappedTokens = Object.entries(props.wrappedTokens.erc20);
  if (wrappedTokens.length === 0) return (
    <div>
      <div className={clsNames(styles.mp__margTop20Pt, styles.mp__infoIcon)}>
        <RocketLaunchIcon />
      </div>
      <div className={styles.mp__flex}>
        <p className={clsNames(
          styles.mp__p2,
          styles.mp__p,
          styles.mp__flexGrow,
          styles.mp__textCentered,
          styles.mp__margTop10,
          styles.mp__margBott20,
          styles.mp__minContent,
        )}>
          You don't have any wrapped tokens
        </p>
      </div>
      <Button
        variant="contained" color="primary" size="medium"
        className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
        onClick={() => { props.setOperationType(OperationType.transfer) }}
      >
        Go back
      </Button>
    </div>
  );

  return (
    <div className={styles.mp__margTop10}>
      <Collapse in={!props.expandedFrom && !props.expandedTo}>
        <TokenList
          availableTokens={props.wrappedTokens}
          setToken={props.setToken}
          token={props.token}
          expanded={props.expandedTokens}
          setExpanded={props.setExpandedTokens}
        />
        <AmountErrorMessage
          amountErrorMessage={props.amountErrorMessage}
          actionBtnDisabled={props.actionBtnDisabled}
        />
      </Collapse>
      <Collapse in={!props.expandedFrom && !props.expandedTo && !props.expandedTokens && props.token}>
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
    </div >
  )
}