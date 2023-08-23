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
 * @file CommunityPool.ts
 * @copyright SKALE Labs 2023-Present
 */

import React, { useEffect } from 'react'

import { useAccount, useWalletClient, useSwitchNetwork } from 'wagmi'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import localStyles from '../AmountInput/AmountInput.module.scss'

import SkPaper from '../SkPaper/SkPaper'
import { TokenBalance } from '../TokenList'

import Button from '@mui/material/Button'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

import { fromWei } from '../../core/convertation'
import { withdraw, recharge } from '../../core/community_pool'
import { DEFAULT_ERC20_DECIMALS } from '../../core/constants'

import { cls } from '../../core/helper'
import cmn from '../../styles/cmn.module.scss'
import styles from '../../styles/styles.module.scss'

import { useCPStore } from '../../store/CommunityPoolStore'
import { useCollapseStore } from '../../store/Store'
import { useMetaportStore } from '../../store/MetaportState'


export default function CommunityPool() {
  const { data: walletClient } = useWalletClient()
  const { switchNetworkAsync } = useSwitchNetwork()

  const cpData = useCPStore((state) => state.cpData)
  const loading = useCPStore((state) => state.loading)
  const setLoading = useCPStore((state) => state.setLoading)
  const amount = useCPStore((state) => state.amount)
  const setAmount = useCPStore((state) => state.setAmount)
  const updateCPData = useCPStore((state) => state.updateCPData)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const token = useMetaportStore((state) => state.token)

  const mpc = useMetaportStore((state) => state.mpc)
  const setErrorMessage = useMetaportStore((state) => state.setErrorMessage)

  const expandedCP = useCollapseStore((state) => state.expandedCP)
  const setExpandedCP = useCollapseStore((state) => state.setExpandedCP)

  const { address } = useAccount()

  let chainName
  if (token) {
    chainName = chainName1
    if (token.connections[chainName2].hub) chainName = token.connections[chainName2].hub
  }

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCP(isExpanded ? panel : false)
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount('')
      return
    }
    setAmount(event.target.value)
  }

  useEffect(() => {
    updateCPData(address, chainName, chainName2, mpc)
  }, [])

  useEffect(() => {
    updateCPData(address, chainName, chainName2, mpc)
    const intervalId = setInterval(() => {
      updateCPData(address, chainName, chainName2, mpc)
    }, 10000)

    return () => {
      clearInterval(intervalId) // Clear interval on component unmount
    }
  }, [chainName, chainName2, address])

  const text = cpData.exitGasOk ? 'Exit gas wallet OK' : 'Recharge exit gas wallet'
  const icon = cpData.exitGasOk ? <CheckCircleIcon color="success" /> : <ErrorIcon color="warning" />
  const accountBalanceEther = cpData.accountBalance ? fromWei(cpData.accountBalance, DEFAULT_ERC20_DECIMALS) : null

  function getRechargeBtnText() {
    if (loading === 'recharge') return 'Recharging...'
    if (loading === 'activate') return 'Activating account...'
    if (Number(amount) > Number(accountBalanceEther)) return 'Insufficient ETH balance'
    if (amount === '' || amount === '0' || !amount) return 'Enter an amount'
    return 'Recharge exit gas wallet'
  }

  function getWithdrawBtnText() {
    if (loading === 'withdraw') return 'Withdrawing...'
    return 'Withdraw all'
  }

  function withdrawCP() {
    withdraw(
      mpc,
      walletClient,
      chainName,
      cpData.balance,
      address,
      switchNetworkAsync,
      setLoading,
      setErrorMessage,
      async () => {
        setLoading(false)
        setErrorMessage(null)
      },
    )
  }

  async function rechargeCP() {
    await recharge(
      mpc,
      walletClient,
      chainName,
      amount,
      address,
      switchNetworkAsync,
      setLoading,
      setErrorMessage,
      async () => {
        setLoading(false)
        setErrorMessage(null)
      }
    )
    setExpandedCP(false)
  }

  return (
    <div className={cls([cmn.mtop10, !expandedCP])}>
      <Accordion
        disabled={!!loading}
        expanded={expandedCP === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          className={cls(styles.accordionSummary, styles.accordionSm)}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={cls(cmn.flex, cmn.fullWidth, cmn.flexcv)}>
            <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>{icon}</div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.cap, cmn.pPrim, cmn.mri10)}>{text}</p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <SkPaper background="transparent" className={cls(styles.accordionContent)}>
            <p className={cls(cmn.flex, cmn.p3, cmn.p, cmn.errorMessage, cmn.flexg)}>
              This wallet is used to pay for Ethereum gas fees from your transactions to the
              Ethereum Mainnet. You may withdraw funds from your SKALE Gas Wallet at anytime.
            </p>
            <div className={cls(cmn.ptop20, cmn.flex)}>
              <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec, cmn.flex, cmn.flexg)}>
                ETH Balance
              </p>
              <div>
                <TokenBalance
                  balance={cpData.accountBalance} symbol="ETH" truncate={4} size="sm" primary />
              </div>
            </div>
            <div className={cls(cmn.ptop0, cmn.flex)}>
              <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec, cmn.flex, cmn.flexg)}>
                Exit wallet Balance
              </p>
              <div>
                <TokenBalance
                  balance={cpData.balance} symbol="ETH" truncate={4} size="sm" primary />
              </div>
            </div>
            <Grid container spacing={0} className={cmn.ptop20}>
              <Grid className={cmn.mtop20s} item xs={12}>
                <SkPaper gray className={cmn.mtop10}>
                  <div className={cls(cmn.flex, cmn.flexcv)}>
                    <div className={cls(cmn.flex, cmn.flexg)}>
                      <TextField
                        className={localStyles.inputAmount}
                        type="number"
                        variant="standard"
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                        disabled={!!loading}
                      />
                    </div>
                    <p className={cls(
                      cmn.p,
                      cmn.p1,
                      cmn.p700,
                      cmn.pPrim,
                      [cmn.pDisabled, loading],
                      cmn.flex,
                      cmn.mri20
                    )}>
                      ETH
                    </p>
                  </div>
                </SkPaper>
                <div className={cls(cmn.mtop10)}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    className={cls(styles.btnAction, cmn.mtop5)}
                    onClick={rechargeCP}
                    disabled={
                      !!loading ||
                      !cpData.accountBalance ||
                      Number(amount) > Number(accountBalanceEther) ||
                      amount === '' ||
                      amount === '0' ||
                      !amount ||
                      !chainName
                    }
                  >
                    {getRechargeBtnText()}
                  </Button>
                </div>
                <div className={cls(cmn.mtop5, cmn.mbott10)}>
                  <Button
                    variant="text"
                    color="warning"
                    size="small"
                    className={cls(styles.btnAction, cmn.mtop5)}
                    onClick={withdrawCP}
                    disabled={!!loading || !chainName}
                  >
                    {getWithdrawBtnText()}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </SkPaper>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
