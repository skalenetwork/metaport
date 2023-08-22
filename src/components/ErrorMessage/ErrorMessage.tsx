import React from 'react'
import Button from '@mui/material/Button'

import { cls } from '../../core/helper'
import cmn from '../../styles/cmn.module.scss'
import styles from '../../styles/styles.module.scss'

import { ErrorMessage } from '../../core/dataclasses'

import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded'
import PublicOffRoundedIcon from '@mui/icons-material/PublicOffRounded'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'

const ERROR_ICONS = {
  'link-off': <LinkOffRoundedIcon />,
  'public-off': <PublicOffRoundedIcon />,
  sentiment: <SentimentDissatisfiedRoundedIcon />,
  error: <ErrorRoundedIcon />,
}

export default function Error(props: { errorMessage: ErrorMessage }) {
  if (!props.errorMessage) return
  return (
    <div>
      <div className={cls(cmn.mtop20Pt, styles.infoIcon, cmn.pPrim)}>{ERROR_ICONS[props.errorMessage.icon]}</div>
      <p
        style={{ wordBreak: 'break-all' }}
        className={cls(cmn.p1, cmn.p, cmn.p600, cmn.pPrim, cmn.flexg, cmn.pCent, cmn.mtop10)}
      >
        Error occured
      </p>
      <p className={cls(cmn.p4, cmn.p, cmn.p600, cmn.pSec, cmn.flexg, cmn.pCent, cmn.mbott10)}>
        Please check logs in developer console
      </p>
      <div className={cmn.flex}>
        <p
          style={{ wordBreak: 'break-all' }}
          className={cls(cmn.p3, cmn.p, cmn.pPrim, cmn.flexg, cmn.pCent, cmn.mtop10, cmn.mbott20)}
        >
          {props.errorMessage.text}
        </p>
      </div>

      {props.errorMessage.fallback ? (
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className={cls(styles.btnAction, cmn.mtop5)}
          onClick={() => {
            props.errorMessage.fallback()
          }}
        >
          {props.errorMessage.btnText}
        </Button>
      ) : null}
    </div>
  )
}
