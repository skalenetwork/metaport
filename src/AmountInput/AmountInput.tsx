import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './AmountInput.scss';

export default function AmountInput(props) {
  return (
    <div className='flex-container amount-input'>
      <div className='flex-container fl-grow'>
        <TextField type="number" id="standard-basic" variant="standard" placeholder="0.00" />
      </div>
      <div className='flex-container'>
        <Button color="secondary" size="small" className='chain-name-btn' >MAX</Button>
      </div>
    </div>
  )
}
