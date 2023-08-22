import React, { useEffect } from 'react'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import Skeleton from '@mui/material/Skeleton'

import { isMainnet, cls } from '../../core/helper'
// import { getTransactionFee } from '../../core/fee_calculator';

import cmn from '../../styles/cmn.module.scss'

function roundDown(number, decimals) {
  decimals = decimals || 0
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export default function TransferETF(props: { fromChain: string }) {
  const [etf, setEtf] = React.useState<number>()
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  async function calcETF() {
    setIsLoaded(false)
    const fromMainnet = isMainnet(props.fromChain)
    let baseETF = 0
    // if (fromMainnet) baseETF = await getTransactionFee();
    if (fromMainnet) baseETF = 2.5
    setEtf(baseETF)
    setIsLoaded(true)
  }

  useEffect(() => {
    if (props.fromChain) calcETF()
  }, [props.fromChain])

  const tooltipText =
    'Estimated transaction fee (You pay only for Mainnet transactions, all transfers within SKALE are free)'
  const etfText = etf === 0 ? 'Free' : `~${roundDown(etf, 3)} USD`

  return (
    <Tooltip arrow title={tooltipText} placement="top">
      <div>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.flexRow)}>
          <p className={cls(cmn.pSec, cmn.p, cmn.p4, cmn.mri5)}>Estimated Transaction Fee</p>
          <InfoIcon style={{ width: '14px' }} className={cls(cmn.pSec)} />
        </div>
        {isLoaded ? (
          <p className={cls(cmn.nom, cmn.pPrim, cmn.p, cmn.p2, cmn.p600)}>{etfText}</p>
        ) : (
          <Skeleton animation="wave" height={19} width={100} />
        )}
      </div>
    </Tooltip>
  )
}
