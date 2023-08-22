import React, { useRef } from 'react'

import IconButton from '@mui/material/IconButton'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import styles from '../../styles/styles.module.scss'
import cmn from '../../styles/cmn.module.scss'
import { cls } from '../../core/helper'

import { useUIStore } from '../../store/Store'
import { useMetaportStore } from '../../store/MetaportState'

export default function SwitchDirection() {
  const myElement = useRef<HTMLDivElement | null>(null)

  const metaportTheme = useUIStore((state) => state.theme)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)

  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)
  const startOver = useMetaportStore((state) => state.startOver)
  const loading = useMetaportStore((state) => state.loading)
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  return (
    <div className={cls(styles.sk__btnSwitch, cmn.flex)}>
      <div className={cls(cmn.flex, cmn.flexg)}></div>
      <div
        className={cls(cmn.flex, styles.btnSwitchAnimation)}
        ref={myElement}
        style={{
          background: metaportTheme.background,
          borderRadius: '50%',
          zIndex: metaportTheme.zIndex,
        }}
      >
        <IconButton
          size="medium"
          color="primary"
          style={{
            backgroundColor: metaportTheme.primary,
            borderColor: metaportTheme.background,
            zIndex: metaportTheme.zIndex,
          }}
          disabled={loading || transferInProgress}
          onClick={() => {
            const element = myElement.current
            const rotate = () => {
              if (element) {
                element.classList.add('spin')
                setTimeout(() => {
                  element.classList.remove('spin')
                }, 400)
              }
            }
            rotate()
            let chain1 = chainName1
            setChainName1(chainName2)
            setChainName2(chain1)
            startOver()
          }}
        >
          <ArrowDownwardRoundedIcon />
        </IconButton>
      </div>
      <div className={cls(cmn.flex, cmn.flexg)}></div>
    </div>
  )
}
