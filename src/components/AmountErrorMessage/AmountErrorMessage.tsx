import React from 'react'
import Collapse from '@mui/material/Collapse'

import { cls } from '../../core/helper'
import cmn from '../../styles/cmn.module.scss'

import { useMetaportStore } from '../../store/MetaportState'

export default function AmountErrorMessage() {
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  return (
    <Collapse in={!!amountErrorMessage || amountErrorMessage === ''} className="noMarg">
      <p
        className={cls(
          cmn.flex,
          cmn.p3,
          cmn.p,
          cmn.pSec,
          cmn.errorMessage,
          cmn.flexg,
          cmn.mtop10,
          cmn.mleft10,
          // cmn.upp
        )}
      >
        🔴 {amountErrorMessage}
      </p>
    </Collapse>
  )
}
