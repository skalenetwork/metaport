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
 * @file TransactionsHistory.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Collapse } from '@mui/material'
import Button from '@mui/material/Button'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import TokenIcon from './TokenIcon'
import ChainIcon from './ChainIcon'
import TransactionData from './TransactionData'

import { useMetaportStore } from '../store/MetaportStore'
import { useCollapseStore } from '../store/Store'
import { cls, styles, cmn } from '../core/css'
import { interfaces, SkPaper } from '../Metaport'

import { getChainAlias } from '../core/helper'

export default function TransactionsHistory() {
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)

  const clearTransactionsHistory = useMetaportStore((state) => state.clearTransactionsHistory)
  const mpc = useMetaportStore((state) => state.mpc)
  const expandedTH = useCollapseStore((state) => state.expandedTH)
  const setExpandedTH = useCollapseStore((state) => state.setExpandedTH)

  function clearTransferHistory() {
    clearTransactionsHistory()
    setExpandedTH(false)
  }

  if (transactionsHistory.length === 0 && transfersHistory.length === 0) return
  return (
    <Collapse in={expandedTH}>
      <div className={cls(cmn.flex, cmn.mbott10, cmn.mtop10)}>
        <Button
          onClick={() => {
            setExpandedTH(false)
          }}
          color="warning"
          size="medium"
          className={cls(styles.btnAction, cmn.mle)}
          startIcon={<CloseRoundedIcon />}
        >
          Close history
        </Button>
        <Button
          onClick={clearTransferHistory}
          color="error"
          size="medium"
          className={cls(styles.btnAction, cmn.mle)}
          startIcon={<DeleteRoundedIcon />}
        >
          Clear history
        </Button>
      </div>
      {transactionsHistory.length !== 0 ? (
        <SkPaper gray className={cls(cmn.nop)}>
          <p
            className={cls(
              cmn.p,
              cmn.p3,
              cmn.p600,
              cmn.pPrim,
              cmn.mbott10,
              cmn.mleft15,
              cmn.ptop15
            )}
          >
            Current transfer
          </p>
          <SkPaper gray>
            {transactionsHistory.map((transactionData: any) => (
              <TransactionData
                key={transactionData.tx.transactionHash}
                transactionData={transactionData}
                config={mpc.config}
              />
            ))}
          </SkPaper>
        </SkPaper>
      ) : null}
      <div>
        {transfersHistory.map((transferHistory: interfaces.TransferHistory, key: number) => (
          <SkPaper gray key={key} className={cls(cmn.mtop10, cmn.mbott10, cmn.nop)}>
            <div className={cls(cmn.flex, cmn.flexcv, cmn.mleft15, cmn.ptop15)}>
              <ChainIcon
                skaleNetwork={mpc.config.skaleNetwork}
                chainName={transferHistory.chainName1}
                size="xs"
              />
              <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.cap, cmn.pPrim, cmn.mleft5)}>
                {getChainAlias(mpc.config.skaleNetwork, transferHistory.chainName1)}
              </p>
              <ArrowForwardRoundedIcon
                className={cls(cmn.pPrim, cmn.mleft5, cmn.mri5, styles.chainIconxs)}
              />
              <ChainIcon
                skaleNetwork={mpc.config.skaleNetwork}
                chainName={transferHistory.chainName2}
                size="xs"
              />
              <p
                className={cls(
                  cmn.p,
                  cmn.p3,
                  cmn.p600,
                  cmn.cap,
                  cmn.pPrim,

                  cmn.mleft5
                )}
              >
                {getChainAlias(mpc.config.skaleNetwork, transferHistory.chainName2)}
              </p>
            </div>
            <div className={cls(cmn.flex, cmn.flexcv, cmn.mleft15, cmn.mtop10, cmn.mbott10)}>
              <div className={cls(cmn.flex, cmn.flexcv)}>
                <TokenIcon tokenSymbol={transferHistory.tokenKeyname} size="xs" />
              </div>
              <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.cap, cmn.pPrim, cmn.upp, cmn.mleft5)}>
                {transferHistory.amount} {transferHistory.tokenKeyname}
              </p>
              <p
                className={cls(cmn.p, cmn.p3, cmn.p600, cmn.cap, cmn.pPrim, cmn.mleft5, cmn.flexg)}
              >
                •{' '}
                {transferHistory.address.substring(0, 6) +
                  '...' +
                  transferHistory.address.substring(transferHistory.address.length - 4)}
              </p>
            </div>
            <SkPaper gray>
              {transferHistory.transactions.map((transactionData: any) => (
                <TransactionData
                  key={transactionData.tx.transactionHash}
                  transactionData={transactionData}
                  config={mpc.config}
                />
              ))}
            </SkPaper>
          </SkPaper>
        ))}
      </div>
    </Collapse>
  )
}
