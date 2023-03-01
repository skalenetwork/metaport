import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import AmountInput from "../AmountInput";

import TransferETA from '../TransferETA';
import TransferETF from '../TransferETF';
import { Collapse } from '@mui/material';


export default function TransferSummary(props) {
  const text = props.transferRequest && props.transferRequest.text ? props.transferRequest.text : props.explanationText;
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
      <Collapse in={props.sFuelOk}>
        <p className={clsNames(
          styles.mp__flex,
          styles.mp_p_desc,
          styles.mp__p,
          styles.mp__flexGrow,
          styles.mp__margTop20
        )}>
          {text}
        </p>
        <Button
          variant="contained" color="primary" size="medium"
          disabled={!props.sFuelOk}
          className={clsNames(styles.mp__btnAction, styles.mp__margTop20)}
          onClick={() => { props.confirmSummary() }}
        >
          Confirm
        </Button>
      </Collapse>
    </Box>
  );
}