import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TokenType } from '../../core/dataclasses/TokenType';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './TransferSummary.scss';
import { getIconSrc, getTokenName } from "../TokenList/helper";
import AmountInput from "../AmountInput";
import MoveDownIcon from '@mui/icons-material/MoveDown';

import { getChainName, getChainIcon } from '../ChainsList/helper';

import TransferETA from '../TransferETA';
import TransferETF from '../TransferETF';


export default function TransferSummary(props) {
  return (
    <Box>
      <div className={clsNames(styles.mp__margTop20, styles.mp__flex)}>
        <TransferETA transferRequest={props.transferRequest} />
        <div className={clsNames(styles.mp__margLeft20)}>
          <TransferETF transferRequest={props.transferRequest} />
        </div>
      </div>

      {props.transferRequest.lockValue ? null : <div className={styles.mp__margTop20}>
        <p className={clsNames(styles.mp_p_desc, styles.mp__p)}>
          Amount
        </p>
        <AmountInput
          amount={props.amount}
          setAmount={props.setAmount}
          token={props.token}
          loading={props.loading}
          activeStep={props.activeStep}
          amountLocked={props.amountLocked}
        />
      </div>
      }

      {props.transferRequest && props.transferRequest.text ? (
        <p className={clsNames(
          styles.mp__flex,
          styles.mp_p_desc,
          styles.mp__p,
          styles.mp__flexGrow,
          styles.mp__margTop20
        )}>
          {props.transferRequest.text}
        </p>) : (<div className={clsNames(styles.mp__margTop10)}></div>)}
      <Button
        variant="contained" color="primary" size="medium"
        className={clsNames(styles.mp__btnAction, styles.mp__margTop20)}
      >
        Continue
      </Button>
    </Box>
  );
}