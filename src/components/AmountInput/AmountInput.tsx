import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './AmountInput.scss';

import { TokenType } from '../../core/dataclasses/TokenType';
import { SFUEL_RESERVE_AMOUNT } from "../../core/constants";


export default function AmountInput(props) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setAmount(event.target.value);
  };

  const setMaxAmount = () => {
    if (props.token && (props.token.wrapsSFuel || props.token.type === TokenType.eth)) {
      props.setAmount((Number(props.token.balance) - SFUEL_RESERVE_AMOUNT).toString());
    } else {
      props.setAmount(props.token.balance);
    }
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
      {props.maxBtn ? <div className={styles.mp__flex}>
        <Button
          color="primary"
          size="small"
          className={clsNames(styles.mp__btnChain, localStyles.mp__btnMax)}
          onClick={setMaxAmount}
          disabled={props.loading || !props.token.balance || props.amountLocked}
        >
          MAX
        </Button>
      </div> : null}
    </div>
  )
}
