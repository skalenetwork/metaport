import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './AmountInput.scss';

export default function AmountInput(props) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setAmount(event.target.value);
  };

  const setMaxAmount = () => {
    props.setAmount(props.balance);
  }

  return (
    <div className='flex-container amount-input'>
      <div className='flex-container fl-grow'>
        <TextField
          type="number"
          variant="standard"
          placeholder="0.00" 
          value={props.amount}
          onChange={handleChange}
          disabled={props.loading || props.activeStep === 2 || props.amountLocked}
        />
      </div>
      <div className='flex-container'>
        <Button
          color="secondary"
          size="small"
          className='chain-name-btn'
          onClick={setMaxAmount}
          disabled={props.loading || props.activeStep === 2 || !props.balance || props.amountLocked}
        >
          MAX
        </Button>
      </div>
    </div>
  )
}
