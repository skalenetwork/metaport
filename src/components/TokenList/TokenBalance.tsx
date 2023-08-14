import React from 'react'
import { formatUnits } from 'ethers'

import { TokenType, TokenData } from '../../core/dataclasses'
import { TokenBalancesMap } from '../../core/interfaces'

import { cls } from '../../core/helper'
import common from '../../styles/common.module.scss'

function formatBalance(balance: bigint, token: TokenData): string {
  return formatUnits(balance, parseInt(token.meta.decimals))
}

export default function TokenBalance(props: { token: TokenData; tokenBalances: TokenBalancesMap }) {
  if ([TokenType.erc721, TokenType.erc721meta, TokenType.erc1155].includes(props.token.type)) return

  const balance = props.tokenBalances[props.token.keyname]

  if (balance === undefined || balance === null) return
  return (
    <div className={cls(common.flex, common.flexCenteredVert)}>
      <p className={cls(common.p, common.p4, common.pSecondary, common.flex, common.flexCenteredVert, common.margRi5)}>
        {formatBalance(balance, props.token)} {props.token.meta.symbol}
      </p>
    </div>
  )
}
