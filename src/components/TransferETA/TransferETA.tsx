import React, { useEffect } from 'react'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import Skeleton from '@mui/material/Skeleton'

import { isMainnet, cls } from '../../core/helper'
import { IMA_M2S_WAIT, IMA_S2S_WAIT, IMA_HUB_WAIT } from '../../core/constants'
// import { getAvgWaitTime } from '../../core/gas_station';
import cmn from '../../styles/cmn.module.scss'
import { TokenData } from '../../core/dataclasses'

export default function TransferETA(props: { token: TokenData; toChain: string }) {
  const [eta, setEta] = React.useState<number>()
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  async function calcETA() {
    setIsLoaded(false)
    let baseETA = 0
    const fromMainnet = isMainnet(props.token.chain)
    const toMainnet = isMainnet(props.toChain)
    baseETA += fromMainnet || toMainnet ? IMA_M2S_WAIT : IMA_S2S_WAIT
    if (props.token.connections[props.toChain] && props.token.connections[props.toChain].hub) {
      baseETA += IMA_HUB_WAIT
    }
    setEta(baseETA)
    setIsLoaded(true)
  }

  useEffect(() => {
    if (props.token && props.toChain) calcETA()
  }, [props.token, props.toChain])

  const tooltipText = 'Estimated transfer time (may vary depending on the network load)'

  return (
    <Tooltip arrow title={tooltipText} placement="top">
      <div>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.flexRow)}>
          <p className={cls(cmn.pSec, cmn.p, cmn.p4, cmn.mri5)}>ETA</p>
          <InfoIcon style={{ width: '14px' }} className={cls(cmn.pSec)} />
        </div>
        {isLoaded ? (
          <p className={cls(cmn.nom, cmn.pPrim, cmn.p, cmn.p2, cmn.p600)}>
            ~{eta}-{eta + 1} min
          </p>
        ) : (
          <Skeleton animation="wave" height={19} width={100} />
        )}
      </div>
    </Tooltip>
  )
}
