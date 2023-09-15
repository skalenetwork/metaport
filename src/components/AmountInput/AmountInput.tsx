import React from 'react'
import { useAccount } from 'wagmi'

import TextField from '@mui/material/TextField'

import { cls, cmn } from '../../core/css'
import localStyles from './AmountInput.module.scss'

import TokenList from '../TokenList'
import { useMetaportStore } from '../../store/MetaportStore'
import { useCollapseStore } from '../../store/Store'

export default function AmountInput() {
  const { address } = useAccount()
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  const setAmount = useMetaportStore((state) => state.setAmount)
  const amount = useMetaportStore((state) => state.amount)
  const expandedTokens = useCollapseStore((state) => state.expandedTokens)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount('', address)
      return
    }
    setAmount(event.target.value, address)
  }

  return (
    <div className={cls(cmn.flex, localStyles.inputAmount)}>
      {expandedTokens ? null : (
        <div className={cls(cmn.flex, cmn.flexg, cmn.flexcv)}>
          <TextField
            type="number"
            variant="standard"
            placeholder="0.00"
            value={amount}
            onChange={handleChange}
            disabled={transferInProgress}
          />
        </div>
      )}
      <div className={cls([cmn.fullWidth, expandedTokens])}>
        <TokenList />
      </div>
    </div>
  )
}
