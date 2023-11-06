import React from 'react'
import { useAccount } from 'wagmi'

import TextField from '@mui/material/TextField'

import { cls, cmn, styles } from '../core/css'

import TokenList from './TokenList'
import { useMetaportStore } from '../store/MetaportStore'
import { useCollapseStore } from '../store/Store'

export default function AmountInput() {
  const { address } = useAccount()
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  const currentStep = useMetaportStore((state) => state.currentStep)
  const setAmount = useMetaportStore((state) => state.setAmount)
  const amount = useMetaportStore((state) => state.amount)
  const expandedTokens = useCollapseStore((state) => state.expandedTokens)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount('', address)
      return
    }
    if (event.target.value.length > 12) {
      let initialSize = 22 - event.target.value.length / 3
      initialSize = initialSize <= 12 ? 12 : initialSize
      event.target.style.fontSize = initialSize + 'px'
    } else {
      event.target.style.fontSize = '22px'
    }
    setAmount(event.target.value, address)
  }

  return (
    <div className={cls(cmn.flex, styles.inputAmount)}>
      {expandedTokens ? null : (
        <div className={cls(cmn.flex, cmn.flexg, cmn.flexcv)}>
          <TextField
            type="number"
            variant="standard"
            placeholder="0.00"
            value={amount}
            onChange={handleChange}
            disabled={transferInProgress || currentStep !== 0}
            style={{ width: '100%' }}
          />
        </div>
      )}
      <div className={cls([cmn.fullWidth, expandedTokens])}>
        <TokenList />
      </div>
    </div>
  )
}
