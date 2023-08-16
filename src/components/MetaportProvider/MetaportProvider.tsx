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

import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { PaletteMode } from '@mui/material'

import { injectedWallet, coinbaseWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'

import { MetaportConfig } from '../../core/interfaces'

import { StyledEngineProvider } from '@mui/material/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import '@rainbow-me/rainbowkit/styles.css'

import { constructWagmiChain, getWebSocketUrl } from '../../core/wagmi_network'

import { getWidgetTheme, getMuiZIndex } from '../../core/themes'

import { cls } from '../../core/helper'

import { useUIStore } from '../../store/Store'
import { useMetaportStore } from '../../store/MetaportState'
import MetaportCore from '../../core/metaport'

import styles from '../../styles/styles.module.scss'
import common from '../../styles/common.module.scss'

const { chains, webSocketPublicClient } = configureChains(
  [
    mainnet,
    goerli,
    constructWagmiChain('staging', 'staging-legal-crazy-castor'),
    constructWagmiChain('staging', 'staging-utter-unripe-menkar'),
    constructWagmiChain('staging', 'staging-faint-slimy-achird'),
    constructWagmiChain('staging', 'staging-perfect-parallel-gacrux'),
    constructWagmiChain('staging', 'staging-severe-violet-wezen'),
    constructWagmiChain('staging', 'staging-weepy-fitting-caph'),

    constructWagmiChain('mainnet', 'honorable-steel-rasalhague'),
    constructWagmiChain('mainnet', 'elated-tan-skat'),
    constructWagmiChain('mainnet', 'affectionate-immediate-pollux'),
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
        webSocket: getWebSocketUrl(chain),
      }),
    }),
  ],
)

const connectors = connectorsForWallets([
  {
    groupName: 'Supported Wallets',
    wallets: [
      metaMaskWallet({ chains, projectId: '' }),
      injectedWallet({ chains }),
      coinbaseWallet({ chains, appName: 'TEST' }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: webSocketPublicClient,
})

export default function MetaportProvider(props: {
  config: MetaportConfig
  className?: string
  children?: ReactElement | ReactElement[]
}) {
  const widgetTheme = getWidgetTheme(props.config.theme)

  const setTheme = useUIStore((state) => state.setTheme)
  const setMpc = useMetaportStore((state) => state.setMpc)
  const setOpen = useUIStore((state) => state.setOpen)
  const metaportTheme = useUIStore((state) => state.theme)

  const themeCls = widgetTheme.mode === 'dark' ? styles.darkTheme : styles.lightTheme
  const commonThemeCls = widgetTheme.mode === 'dark' ? common.darkTheme : common.lightTheme

  useEffect(() => {
    setOpen(props.config.openOnLoad)
  }, [])

  useEffect(() => {
    setTheme(widgetTheme)
  }, [setTheme])

  useEffect(() => {
    setMpc(new MetaportCore(props.config))
  }, [setMpc])

  let theme = createTheme({
    zIndex: getMuiZIndex(widgetTheme),
    palette: {
      mode: widgetTheme.mode as PaletteMode,
      background: {
        paper: widgetTheme.background,
      },
      primary: {
        main: widgetTheme.primary,
      },
      secondary: {
        main: widgetTheme.background,
      },
    },
  })

  if (!metaportTheme) return <div></div>

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        coolMode
        appInfo={{
          appName: 'SKALE Metaport',
        }}
        showRecentTransactions={true}
        chains={chains}
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
