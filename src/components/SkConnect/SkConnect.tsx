/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file WidgetUI.ts
 * @copyright SKALE Labs 2023-Present
 */

import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { cls } from '../../core/helper'

import styles from '../../styles/styles.module.scss'
import cmn from '../../styles/cmn.module.scss'

import skaleLogoFull from '../WidgetUI/skale_logo.svg'
import { useMetaportStore } from '../../store/MetaportState'

import ChainIcon from '../ChainIcon'

export default function SkConnect() {
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div>
                    <div className={cls(cmn.fullWidth, cmn.pCent, cmn.mtop20, cmn.mbott20)}>
                      <img className={styles.skaleLogoLg} src={skaleLogoFull} />
                    </div>
                    <div className={cls(cmn.mbott20, cmn.fullWidth, cmn.flex, cmn.flexc)}>
                      <ChainIcon
                        className={cls(cmn.mri5, cmn.mleft5, styles.skMovingDiv)}
                        skaleNetwork="mainnet"
                        chainName="turbulent-unique-scheat"
                        size="xs"
                      />
                      <ChainIcon
                        className={cls(cmn.mri5, cmn.mleft5, styles.skMovingDiv)}
                        skaleNetwork={'mainnet'}
                        chainName={'frayed-decent-antares'}
                        size="sm"
                      />
                      <ChainIcon
                        className={cls(cmn.mri5, cmn.mleft5, styles.skMovingDiv)}
                        skaleNetwork={'mainnet'}
                        chainName={'elated-tan-skat'}
                        app="ruby"
                        size="md"
                      />
                      <ChainIcon
                        className={cls(cmn.mri5, cmn.mleft5, styles.skMovingDiv)}
                        skaleNetwork={'mainnet'}
                        chainName={'elated-tan-skat'}
                        size="lg"
                      />
                      <ChainIcon
                        className={cls(cmn.mri5, cmn.mleft5, styles.skMovingDiv)}
                        skaleNetwork={'mainnet'}
                        chainName={'honorable-steel-rasalhague'}
                        size="lg"
                      />
                      <ChainIcon
                        className={cls(cmn.mri5, cmn.mleft5, styles.skMovingDiv)}
                        skaleNetwork={'mainnet'}
                        chainName={'honorable-steel-rasalhague'}
                        app="nftrade"
                        size="md"
                      />
                      <ChainIcon
                        className={cls(cmn.mri5, cmn.mleft5, styles.skMovingDiv)}
                        skaleNetwork={'mainnet'}
                        chainName={'affectionate-immediate-pollux'}
                        size="sm"
                      />
                      <ChainIcon
                        className={cls(cmn.mri5, cmn.mleft5, styles.skMovingDiv)}
                        skaleNetwork="mainnet"
                        chainName="wan-red-ain"
                        size="xs"
                      />
                    </div>
                    <p className={cls(cmn.p, cmn.p4, cmn.p500, cmn.pSec, cmn.mbott5, cmn.mleft5, cmn.pCent)}>
                      Connect a wallet to use SKALE Metaport
                    </p>
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      className={cls(styles.btnAction, cmn.mtop5)}
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button
                    variant="contained"
                    color="error"
                    size="medium"
                    className={cls(styles.btnAction, cmn.mtop5, cmn.mbott20)}
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                )
              }
              return (
                <div className={cls(cmn.mri5, cmn.mbott10, cmn.flex)}>
                  <div className={cls(cmn.flexg, cmn.flex)}>
                    {/* <img
                                            className={cls(cmn.mleft10)}
                                            style={{ width: '16px' }}
                                            src={skaleLogo}
                                        /> */}
                  </div>
                  <div>
                    <Button
                      disabled={transferInProgress}
                      size="small"
                      className={cls(styles.btnChain, cmn.flex, cmn.flexcv, cmn.pPrim)}
                      onClick={openAccountModal}
                      style={{ color: 'white' }}
                    >
                      <div className={cls(cmn.mri5, cmn.flex)}>
                        <Jazzicon diameter={16} seed={jsNumberForAddress(account.address)} />
                      </div>
                      {account.displayName}
                      {/* {account.displayBalance
                                                ? ` (${account.displayBalance})`
                                                : ''} */}
                      <ExpandMoreIcon style={{ height: '16px', width: '16px' }} />
                    </Button>
                  </div>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
