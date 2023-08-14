import React from 'react'
import { cls, getChainAppsMeta, getChainAlias } from '../../core/helper'

import styles from '../../styles/styles.module.scss'
import common from '../../styles/common.module.scss'
import { SkaleNetwork } from '../../core/interfaces'

import ChainIcon from '../ChainIcon'

export default function ChainApps(props: { skaleNetwork: SkaleNetwork; chain: string }) {
  const apps = getChainAppsMeta(props.chain, props.skaleNetwork)
  if (!apps || !Object.keys(apps) || Object.keys(apps).length === 0) return <div></div>

  return (
    <div className={cls(styles.sk__chainApps, common.margRi10, common.flex, common.flexCenteredVert)}>
      <div className={cls(common.fldex, common.flexCenteredVert)}>
        {Object.keys(apps).map((key, _) => (
          <div
            className={cls(
              common.flex,
              common.flexCenteredVert,
              common.margRi5,
              common.margLeft5,
              common.margBott10,
              common.margTop10,
            )}
          >
            <ChainIcon
              className={cls(common.margLeft20)}
              skaleNetwork={props.skaleNetwork}
              chainName={props.chain}
              app={key}
              size="xs"
            />
            <p className={cls(common.p, common.p4, common.pSecondary, common.p600, common.margLeft10)}>
              {getChainAlias(props.skaleNetwork, props.chain, key)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
