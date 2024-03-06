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
 * @file MetaportProvider.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ReactElement, useEffect } from 'react'

import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, goerli, holesky } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { PaletteMode } from '@mui/material'

import {
  injectedWallet,
  coinbaseWallet,
  metaMaskWallet,
  enkryptWallet,
  rainbowWallet
} from '@rainbow-me/rainbowkit/wallets'

import { MetaportConfig, ActionStateUpdate } from '../core/interfaces'

import { StyledEngineProvider } from '@mui/material/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import '@rainbow-me/rainbowkit/styles.css'

import { constructWagmiChain, getWebSocketUrl } from '../core/wagmi_network'

import { getWidgetTheme, getMuiZIndex } from '../core/themes'

import { cls, cmn, styles } from '../core/css'

import { useUIStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import MetaportCore from '../core/metaport'

export default function MetaportProvider(props: {
  config: MetaportConfig
  className?: string
  children?: ReactElement | ReactElement[]
}) {
  const skaleChains = props.config.chains.map((chain) =>
    constructWagmiChain(props.config.skaleNetwork, chain)
  )
  const { chains, webSocketPublicClient } = configureChains(
    [mainnet, goerli, holesky, ...skaleChains],
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: chain.rpcUrls.default.http[0],
          webSocket: getWebSocketUrl(chain, props.config.skaleNetwork)
        })
      })
    ]
  )

  const wallets = [
    enkryptWallet({ chains }),
    injectedWallet({ chains }),
    coinbaseWallet({ chains, appName: 'SKALE Metaport' })
  ]

  if (props.config.projectId) {
    wallets.push(metaMaskWallet({ chains, projectId: props.config.projectId }))
    wallets.push(rainbowWallet({ chains, projectId: props.config.projectId }))
  }

  const connectors = connectorsForWallets([
    {
      groupName: 'Supported Wallets',
      wallets: wallets
    }
  ])

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient: webSocketPublicClient
  })

  const widgetTheme = getWidgetTheme(props.config.theme)

  const setTheme = useUIStore((state) => state.setTheme)
  const setMpc = useMetaportStore((state) => state.setMpc)
  const addTransaction = useMetaportStore((state) => state.addTransaction)
  const setOpen = useUIStore((state) => state.setOpen)
  const metaportTheme = useUIStore((state) => state.theme)

  const themeCls = widgetTheme.mode === 'dark' ? styles.darkTheme : styles.lightTheme
  const commonThemeCls = widgetTheme.mode === 'dark' ? cmn.darkTheme : cmn.lightTheme

  useEffect(() => {
    setOpen(props.config.openOnLoad)
    window.addEventListener('metaport_actionStateUpdated', actionStateUpdated, false)
  }, [])

  useEffect(() => {
    setTheme(widgetTheme)
  }, [setTheme])

  useEffect(() => {
    setMpc(new MetaportCore(props.config))
  }, [setMpc])

  function actionStateUpdated(e: CustomEvent) {
    const actionStateUpdate: ActionStateUpdate = e.detail
    if (actionStateUpdate.transactionHash) {
      let chainName = actionStateUpdate.actionData.chainName1
      if (
        actionStateUpdate.actionState === 'unlockDone' ||
        actionStateUpdate.actionState === 'unwrapDone'
      ) {
        chainName = actionStateUpdate.actionData.chainName2
      }
      addTransaction({
        transactionHash: actionStateUpdate.transactionHash,
        timestamp: actionStateUpdate.timestamp,
        chainName,
        txName: actionStateUpdate.actionState
      })
    }
  }

  let theme = createTheme({
    zIndex: getMuiZIndex(widgetTheme),
    palette: {
      mode: widgetTheme.mode as PaletteMode,
      background: {
        paper: widgetTheme.background
      },
      primary: {
        main: widgetTheme.primary
      },
      secondary: {
        main: widgetTheme.background
      }
    }
  })

  if (!metaportTheme) return <div></div>

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        coolMode
        appInfo={{
          appName: 'SKALE Metaport',
          learnMoreUrl: 'https://portal.skale.space/other/faq'
        }}
        showRecentTransactions={true}
        chains={chains}
        theme={widgetTheme.mode === 'dark' ? darkTheme() : lightTheme()}
      >
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <div className={cls(themeCls, commonThemeCls, styles.metaport)}>{props.children}</div>
          </ThemeProvider>
        </StyledEngineProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
