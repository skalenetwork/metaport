import React from "react";
import { useAccount } from 'wagmi'

import TextField from '@mui/material/TextField';

import { cls } from '../../core/helper';
import common from '../../styles/common.scss';
import localStyles from './AmountInput.scss';

import { useMetaportStore } from '../../store/MetaportState'


export default function AmountInput() {

  const { address } = useAccount()

  const token = useMetaportStore((state) => state.token);
  const transferInProgress = useMetaportStore((state) => state.transferInProgress);
  const setAmount = useMetaportStore((state) => state.setAmount);
  const amount = useMetaportStore((state) => state.amount);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount('', address);
      return;
    }
    setAmount(event.target.value, address);
  };

  // const setMaxAmount = () => {
  //   if (token && !token.clone &&
  //     (token.wrapsSFuel || token.type === TokenType.eth)) {
  //     const adjustedAmount = Number(token.balance) - SFUEL_RESERVE_AMOUNT;
  //     if (adjustedAmount > 0) {
  //       props.setAmount(adjustedAmount.toString());
  //     }
  //   } else {
  //     if (token && !token.clone && token.unwrappedBalance) {
  //       props.setAmount(token.unwrappedBalance);
  //     } else {
  //       props.setAmount(token.balance);
  //     }
  //   }
  // }

  if (!token) return;
  return (
    <div className={cls(common.flex, localStyles.mp__inputAmount)}>
      <div className={cls(common.flex, common.flexGrow)}>
        <TextField
          type="number"
          variant="standard"
          placeholder="0.00"
          value={amount}
          onChange={handleChange}
          disabled={transferInProgress}
        />
      </div>

      <div className={cls(
        common.p,
        common.pMain,
        [common.pDisabled, transferInProgress],
        common.flex,
        common.flexCenteredVert,
        common.margRi20,
        localStyles.tokenSymbol,
        [localStyles.tokenSymbolPlaceholder, !amount]
      )}>
        {token.meta.symbol}
      </div>

      {/* {props.maxBtn ? <div className={common.flex}>
        <Button
          color="primary"
          size="small"
          className={cls(styles.btnChain, localStyles.mp__btnMax)}
        // onClick={setMaxAmount}
        // disabled={props.loading || !token.balance || props.amountLocked}
        >
          MAX
        </Button>
      </div> : null} */}
    </div>
  )
}
