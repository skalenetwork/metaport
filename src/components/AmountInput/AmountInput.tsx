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
    props.setAmount(props.token.balance);
  }

  if (!props.token) return;
  return (
    <div className={clsNames(styles.mp__flex, localStyles.mp__inputAmount)}>
      <div className={clsNames(styles.mp__flex, styles.mp__flexGrow)}>
        <TextField
          type="number"
          variant="standard"
          placeholder="0.00"
          value={props.amount}
          onChange={handleChange}
          disabled={props.loading || props.amountLocked}
        />
      </div>
      <div className={styles.mp__flex}>
        <Button
          color="primary"
          size="small"
          className={clsNames(styles.mp__btnChain, localStyles.mp__btnMax)}
          onClick={setMaxAmount}
          disabled={props.loading || !props.token.balance || props.amountLocked}
        >
          MAX
        </Button>
      </div>
    </div>
  )
}
