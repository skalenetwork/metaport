import { Button } from '@mui/material'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'

import { cls, cmn, styles } from '../core/css'
import { SkaleNetwork } from '../core/interfaces'
import { getChainAppsMeta, getChainAlias } from '../core/metadata'

import ChainIcon from './ChainIcon'

export default function ChainApps(props: {
  skaleNetwork: SkaleNetwork
  chainName: string
  handle?: (schainName: string, app?: string) => void
  size?: 'sm' | 'md'
}) {
  const apps = getChainAppsMeta(props.chainName, props.skaleNetwork)
  if (!apps || !Object.keys(apps) || Object.keys(apps).length === 0) return <div></div>

  const size = props.size ?? 'sm'
  const iconSize = props.size === 'sm' ? 'xs' : 'sm'

  return (
    <div className={cls(styles.sk__chainApps, cmn.mri10, cmn.flex, cmn.flexcv)}>
      <div className={cls(cmn.fldex, cmn.flexcv, cmn.mtop10, cmn.mbott10)}>
        {Object.keys(apps).map((key, _) => (
          <Button
            key={key}
            onClick={() => props.handle(props.chainName, key)}
            size="small"
            color="inherit"
            className={cls([cmn.mleft10, size === 'sm'], [cmn.mleft20, size === 'md'], cmn.mbott5)}
          >
            <div
              className={cls(
                cmn.flex,
                cmn.flexcv,
                cmn.mri5,
                [cmn.mleft5, size === 'sm'],
                [cmn.mleft10, size === 'md'],
                [cmn.mbott5, size === 'sm'],
                [cmn.mtop5, size === 'sm'],
                [cmn.mbott10, size === 'md'],
                [cmn.mtop10, size === 'md']
              )}
            >
              <ChainIcon
                className={cls(cmn.mleft20d)}
                skaleNetwork={props.skaleNetwork}
                chainName={props.chainName}
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
                  cmn.mleft10
                )}
              >
                {getChainAlias(props.skaleNetwork, props.chainName, key)}
              </p>
              <div className={cls(cmn.flex, cmn.flexg)}></div>
              <KeyboardArrowRightRoundedIcon
                className={cls(
                  [cmn.pSec, size === 'sm'],
                  [cmn.pPrim, size === 'md'],
                  [styles.chainIconxs, size === 'sm'],
                  [styles.chainIcons, size === 'md']
                )}
              />
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
