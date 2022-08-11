import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './AmountInput.scss';


export default function AmountInput(props) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setAmount(event.target.value);
  };

  const setMaxAmount = () => {
    props.setAmount(props.balance);
  }

  return (
    <div className={clsNames(styles.mp__flex, localStyles.mp__inputAmount)}>
      <div className={clsNames(styles.mp__flex, styles.mp__flexGrow)}>
        <TextField
          type="number"
          variant="standard"
          placeholder="0.00" 
          value={props.amount}
          onChange={handleChange}
          disabled={props.loading || props.activeStep === 2 || props.amountLocked}
        />
      </div>
      <div className={styles.mp__flex}>
        <Button
          color="primary"
          size="small"
          className={styles.mp__btnChain}
          onClick={setMaxAmount}
          disabled={props.loading || props.activeStep === 2 || !props.balance || props.amountLocked}
        >
          MAX
        </Button>
      </div>
    </div>
  )
}
