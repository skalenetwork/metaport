import React from 'react'
import { formatUnits } from 'ethers'
import { cls } from '../../core/helper'
import common from '../../styles/common.module.scss'

function formatBalance(balance: bigint, decimals: string): string {
  return formatUnits(balance, parseInt(decimals))
}

export default function TokenBalance(props: { balance: bigint, decimals: string, symbol: string }) {
  if (props.balance === undefined || props.balance === null) return
  return (
    <div className={cls(common.flex, common.flexCenteredVert)}>
      <p className={cls(
        common.p,
        common.p4,
        common.pSecondary,
        common.flex,
        common.flexCenteredVert,
        common.margRi5
      )}>
        {formatBalance(props.balance, props.decimals)} {props.symbol}
      </p>
    </div>
  )
}
