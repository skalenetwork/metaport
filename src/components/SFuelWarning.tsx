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
 * @file SFuelWarning.ts
 * @copyright SKALE Labs 2023-Present
 */

import { useEffect } from 'react'
import debug from 'debug'

import { useAccount } from 'wagmi'

import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { Collapse } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'

import { BALANCE_UPDATE_INTERVAL_MS, MAINNET_CHAIN_NAME, SFUEL_TEXT } from '../core/constants'
import { Station } from '../core/sfuel'
import { isFaucetAvailable } from '../core/faucet'

import { useMetaportStore } from '../store/MetaportStore'
import { useSFuelStore } from '../store/SFuelStore'

import { cls, cmn, styles } from '../core/css'

debug.enable('*')
const log = debug('metaport:components:SFuel')

export default function SFuelWarning(props: {}) {
  const mpc = useMetaportStore((state) => state.mpc)
  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const token = useMetaportStore((state) => state.token)

  const loading = useSFuelStore((state) => state.loading)
  const setLoading = useSFuelStore((state) => state.setLoading)
  const mining = useSFuelStore((state) => state.mining)
  const setMining = useSFuelStore((state) => state.setMining)

  const fromChainStation = useSFuelStore((state) => state.fromChainStation)
  const setFromChainStation = useSFuelStore((state) => state.setFromChainStation)

  const toChainStation = useSFuelStore((state) => state.toChainStation)
  const setToChainStation = useSFuelStore((state) => state.setToChainStation)

  const hubChainStation = useSFuelStore((state) => state.hubChainStation)
  const setHubChainStation = useSFuelStore((state) => state.setHubChainStation)

  const sFuelStatus = useSFuelStore((state) => state.sFuelStatus)
  const setSFuelStatus = useSFuelStore((state) => state.setSFuelStatus)

  const sFuelOk = useSFuelStore((state) => state.sFuelOk)
  const setSFuelOk = useSFuelStore((state) => state.setSFuelOk)

  const { address } = useAccount()

  let hubChain

  if (token && chainName2 && token.connections[chainName2] && token.connections[chainName2].hub) {
    hubChain = token.connections[chainName2].hub
  }

  useEffect(() => {
    if (!chainName1 || !chainName2 || !address) return
    setLoading(true)
    setFromChainStation(null)
    setToChainStation(null)
    setHubChainStation(null)
    setSFuelOk(false)
    log('Initializing SFuelWarning', chainName1, chainName2, hubChain, address)
    createStations()
  }, [chainName1, chainName2, hubChain, address])

  useEffect(() => {
    updateStationsData()
    const intervalId = setInterval(() => {
      updateStationsData()
    }, BALANCE_UPDATE_INTERVAL_MS)
    return () => {
      clearInterval(intervalId) // Clear interval on component unmount
    }
  }, [fromChainStation, toChainStation, hubChainStation])

  function createStations() {
    setFromChainStation(new Station(chainName1, mpc))
    setToChainStation(new Station(chainName2, mpc))
    if (hubChain) setHubChainStation(new Station(hubChain, mpc))
  }

  async function updateStationsData() {
    let fromData
    let toData
    let hubData
    if (fromChainStation) {
      fromData = await fromChainStation.getData(address)
    }
    if (toChainStation) {
      toData = await toChainStation.getData(address)
    }
    if (hubChainStation) {
      hubData = await hubChainStation.getData(address)
    }
    if ((fromData && !fromData.ok) || (hubData && !hubData.ok)) {
      setSFuelStatus('error')
      setSFuelOk(false)
    } else {
      if (toData && !toData.ok) {
        setSFuelStatus('warning')
        setSFuelOk(false)
      } else {
        if (fromData && fromData.ok && toData && toData.ok) {
          setSFuelStatus('action')
          setSFuelOk(true)
        }
      }
    }
    if (fromData && toData) {
      setLoading(false)
    }
  }

  async function doPoW() {
    let fromPowRes
    let toPowRes
    let hubPowRes

    setMining(true)
    if (fromChainStation) {
      const fromData = await fromChainStation.getData(address)
      if (!fromData.ok) {
        log(`Doing PoW on ${fromChainStation.chainName}`)
        fromPowRes = await fromChainStation.doPoW(address)
      }
    }
    if (toChainStation) {
      const toData = await toChainStation.getData(address)
      if (!toData.ok) {
        log(`Doing PoW on ${toChainStation.chainName}`)
        toPowRes = await toChainStation.doPoW(address)
      }
    }
    if (hubChainStation) {
      const hubData = await hubChainStation.getData(address)
      if (!hubData.ok) {
        log(`Doing PoW on ${hubChainStation.chainName}`)
        hubPowRes = await hubChainStation.doPoW(address)
      }
    }
    if (
      (fromPowRes && !fromPowRes.ok) ||
      (toPowRes && !toPowRes.ok) ||
      (hubPowRes && !hubPowRes.ok)
    ) {
      log('PoW failed!')
      if (fromPowRes) log(chainName1, fromPowRes.message)
      if (toPowRes) log(chainName2, toPowRes.message)
      if (hubPowRes) log(hubChain, hubPowRes.message)
    } else {
      await updateStationsData()
      setSFuelStatus('action')
      setSFuelOk(true)
    }
    setMining(false)
  }

  const mainnetTransfer = chainName1 === MAINNET_CHAIN_NAME || chainName2 === MAINNET_CHAIN_NAME
  const noSFuelDest = sFuelStatus === 'warning' && chainName1 === MAINNET_CHAIN_NAME
  const noSFuelSource = sFuelStatus === 'error' && chainName2 === MAINNET_CHAIN_NAME
  const sFuelBtn = noSFuelDest || noSFuelSource || !mainnetTransfer

  function getSFuelText() {
    if (sFuelBtn) {
      return SFUEL_TEXT['sfuel'][sFuelStatus]
    }
    return SFUEL_TEXT['gas'][sFuelStatus]
  }

  if (loading && chainName2)
    return (
      <div className={cls(cmn.mleft10, cmn.mri10, cmn.mtop20, cmn.mbott10)}>
        <LinearProgress />
      </div>
    )

  const sourceFaucetAvailable =
    chainName1 === MAINNET_CHAIN_NAME || isFaucetAvailable(chainName1, mpc.config.skaleNetwork)
  const destFaucetAvailable =
    chainName2 === MAINNET_CHAIN_NAME || isFaucetAvailable(chainName2, mpc.config.skaleNetwork)
  const hubFaucetAvailable = !hubChain || isFaucetAvailable(hubChain, mpc.config.skaleNetwork)
  const faucetsAvailable = sourceFaucetAvailable && destFaucetAvailable && hubFaucetAvailable

  return (
    <Collapse in={!loading && sFuelStatus !== 'action' && !sFuelOk}>
      <div className={cls(cmn.mtop20, cmn.mbott5)}>
        <p className={cls(cmn.flex, cmn.p3, cmn.p, cmn.pPrim, cmn.flexGrow, cmn.mleft10)}>
          ⛽ {getSFuelText()}
        </p>
        {!faucetsAvailable ? (
          <p
            className={cls(
              cmn.flex,
              cmn.p3,
              cmn.p,
              cmn.pPrim,
              cmn.flexGrow,
              cmn.mleft10,
              cmn.mtop10
            )}
          >
            ❗️ Faucet is not available for one of the selected chains, contact with chain owner to
            get sFUEL
          </p>
        ) : null}
        {sFuelBtn && faucetsAvailable ? (
          <div>
            {mining ? (
              <LoadingButton
                loading
                startIcon={<ArrowOutwardRoundedIcon />}
                loadingPosition="start"
                size="small"
                variant="contained"
                className={cls(styles.btnAction, cmn.mtop10)}
              >
                Getting sFUEL...
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                className={cls(styles.btnAction, cmn.mtop10)}
                onClick={doPoW}
              >
                Get sFUEL
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </Collapse>
  )
}
