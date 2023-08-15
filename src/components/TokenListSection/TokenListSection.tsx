import React from 'react'
import Button from '@mui/material/Button'

import { TokenData, TokenType } from '../../core/dataclasses'
import { TokenBalancesMap, TokenDataMap } from '../../core/interfaces'
import { cls } from '../../core/helper'

import TokenBalance from '../TokenList/TokenBalance'
import TokenIcon from '../TokenIcon'

import common from '../../styles/common.module.scss'

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
    <div className={cls(common.chainsList, common.margBott10, common.margRi10)} style={{ marginLeft: '8px' }}>
      <p
        className={cls(
          common.flex,
          common.uppercase,
          common.p4,
          common.p,
          common.pSecondary,
          common.flexGrow,
          common.margBott10,
        )}
        style={{ marginLeft: '16px' }}
      >
        {props.type}
      </p>
      {Object.keys(props.tokens).map((key, _) => (
        <Button
          key={key}
          color="secondary"
          size="small"
          className={common.fullWidth}
          onClick={() => handle(props.tokens[key])}
        >
          <div
            className={cls(common.flex, common.flexCenteredVert, common.fullWidth, common.margTop5, common.margBott5)}
          >
            <div className={cls(common.flex, common.flexCentered, common.margLeft10)}>
              <TokenIcon
                tokenSymbol={props.tokens[key]?.meta.symbol}
                iconUrl={props.tokens[key]?.meta.iconUrl}
              />
            </div>
            <p
              className={cls(
                common.p,
                common.p3,
                common.p600,
                common.pMain,
                common.flex,
                common.flexGrow,
                common.margRi10,
                common.margLeft10,
              )}
            >
              {getTokenName(props.tokens[key])}
            </p>
            <div className={common.margRi10}>
              <TokenBalance token={props.tokens[key]} tokenBalances={props.tokenBalances} />
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}
