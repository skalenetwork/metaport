import React from 'react'
import { useCollapseStore } from '../../store/Store'
import { useMetaportStore } from '../../store/MetaportState'

import TokenList from '../TokenList'
import ChainsList from '../ChainsList'
import AmountInput from '../AmountInput'
import SkStepper from '../Stepper'
import SkPaper from '../SkPaper'
import AmountErrorMessage from '../AmountErrorMessage'
import SwitchDirection from '../SwitchDirection'
import TransferETF from '../TransferETF'
import TransferETA from '../TransferETA'

import common from '../../styles/common.module.scss'
import { cls } from '../../core/helper'
import { Collapse } from '@mui/material'

export function WidgetBody(props) {
  const expandedFrom = useCollapseStore((state) => state.expandedFrom)
  const setExpandedFrom = useCollapseStore((state) => state.setExpandedFrom)

  const expandedTo = useCollapseStore((state) => state.expandedTo)
  const setExpandedTo = useCollapseStore((state) => state.setExpandedTo)

  const token = useMetaportStore((state) => state.token)
  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)

  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  return (
    <div>
      <SkPaper gray className={common.noPadd}>
        <SkPaper background="transparent" className={common.noPadd}>
          <ChainsList
            config={props.config}
            expanded={expandedFrom}
            setExpanded={setExpandedFrom}
            chain={chainName1}
            setChain={setChainName1}
            disabledChain={chainName2}
            disabled={transferInProgress}
            from={true}
          />
          <Collapse in={!!chainName1}>
            <div>
              <TokenList />
            </div>
          </Collapse>
        </SkPaper>

        <Collapse in={!!token}>
          <SkPaper gray className={cls()}>
            <AmountInput />
          </SkPaper>
        </Collapse>
      </SkPaper>
      <SwitchDirection />
      <SkPaper gray className={common.noPadd}>
        <ChainsList
          config={props.config}
          expanded={expandedTo}
          setExpanded={setExpandedTo}
          chain={chainName2}
          setChain={setChainName2}
          disabledChain={chainName1}
          disabled={transferInProgress}
        />
      </SkPaper>
      <AmountErrorMessage />
      <SkStepper skaleNetwork={props.config.skaleNetwork} />
    </div>
  )
}

export default WidgetBody
