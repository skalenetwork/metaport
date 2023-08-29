import React from 'react'
import { cls, getChainAppsMeta, getChainAlias } from '../../core/helper'

import styles from '../../styles/styles.module.scss'
import cmn from '../../styles/cmn.module.scss'
import { SkaleNetwork } from '../../core/interfaces'

import ChainIcon from '../ChainIcon'

export default function ChainApps(props: {
  skaleNetwork: SkaleNetwork
  chain: string
  size?: 'sm' | 'md'
}) {
  const apps = getChainAppsMeta(props.chain, props.skaleNetwork)
  if (!apps || !Object.keys(apps) || Object.keys(apps).length === 0) return <div></div>

  const size = props.size ?? 'sm'
  const iconSize = props.size === 'sm' ? 'xs' : 'sm'

  return (
    <div className={cls(styles.sk__chainApps, cmn.mri10, cmn.flex, cmn.flexcv)}>
      <div className={cls(cmn.fldex, cmn.flexcv)}>
        {Object.keys(apps).map((key, _) => (
          <div
            className={cls(
              cmn.flex,
              cmn.flexcv,
              cmn.mri5,
              cmn.mleft5,
              [cmn.mbott10, size === 'sm'],
              [cmn.mtop10, size === 'sm'],
              [cmn.mbott20, size === 'md'],
              [cmn.mtop20, size === 'md'],
            )}
          >
            <ChainIcon
              className={cls(cmn.mleft20)}
              skaleNetwork={props.skaleNetwork}
              chainName={props.chain}
              app={key}
              size={iconSize}
            />
            <p
              className={cls(
                cmn.p,
                [cmn.p3, size === 'md'],
                [cmn.p4, size === 'sm'],
                [cmn.pSec, size === 'sm'],
                [cmn.pPrim, size === 'md'],
                cmn.p600,
                cmn.mleft10,
              )}
            >
              {getChainAlias(props.skaleNetwork, props.chain, key)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
