import React from 'react'
import Button from '@mui/material/Button'

import { TokenData, TokenType } from '../../core/dataclasses'
import { TokenBalancesMap, TokenDataMap } from '../../core/interfaces'
import { cls } from '../../core/helper'

import TokenBalance from '../TokenList/TokenBalance'
import TokenIcon from '../TokenIcon'

import cmn from '../../styles/cmn.module.scss'

import { getTokenName } from '../../core/metadata'

export default function TokenListSection(props: {
  setExpanded: (expanded: string | false) => void
  setToken: (token: TokenData) => void
  tokens: TokenDataMap
  type: TokenType
  tokenBalances?: TokenBalancesMap
}) {
  function handle(tokenData: TokenData): void {
    props.setExpanded(false)
    props.setToken(tokenData)
  }

  if (Object.keys(props.tokens).length === 0) return

  return (
    <div className={cls(cmn.chainsList, cmn.mbott10, cmn.mri10)} style={{ marginLeft: '8px' }}>
      <p
        className={cls(cmn.flex, cmn.upp, cmn.p4, cmn.p, cmn.pSec, cmn.flexg, cmn.mbott10)}
        style={{ marginLeft: '16px' }}
      >
        {props.type}
      </p>
      {Object.keys(props.tokens).map((key, _) => (
        <Button
          key={key}
          color="secondary"
          size="small"
          className={cmn.fullWidth}
          onClick={() => handle(props.tokens[key])}
        >
          <div className={cls(cmn.flex, cmn.flexcv, cmn.fullWidth, cmn.mtop5, cmn.mbott5)}>
            <div className={cls(cmn.flex, cmn.flexc, cmn.mleft10)}>
              <TokenIcon tokenSymbol={props.tokens[key]?.meta.symbol} iconUrl={props.tokens[key]?.meta.iconUrl} />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.pPrim, cmn.flex, cmn.flexg, cmn.mri10, cmn.mleft10)}>
              {getTokenName(props.tokens[key])}
            </p>
            <div className={cmn.mri10}>
              <TokenBalance
                balance={props.tokenBalances[props.tokens[key].keyname]}
                symbol={props.tokens[key].meta.symbol}
                decimals={props.tokens[key].meta.decimals}
              />
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}
