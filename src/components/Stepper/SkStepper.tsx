import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

import { cls, getChainAlias, getRandom } from '../../core/helper'
import cmn from '../../styles/cmn.module.scss'
import styles from '../../styles/styles.module.scss'
import localStyles from './SkStepper.module.scss'
import ChainIcon from '../ChainIcon'

import { useMetaportStore } from '../../store/MetaportState'
import { useCPStore } from '../../store/CommunityPoolStore'
import { Collapse } from '@mui/material'
import { SkaleNetwork } from '../../core/interfaces'

import { useWalletClient } from 'wagmi'

import SettingsBackupRestoreRoundedIcon from '@mui/icons-material/SettingsBackupRestoreRounded'

import { useSwitchNetwork, useAccount } from 'wagmi'
import { SUCCESS_EMOJIS } from '../../core/constants'

export default function SkStepper(props: { skaleNetwork: SkaleNetwork }) {
  const { address } = useAccount()
  const { switchNetworkAsync } = useSwitchNetwork()

  const { data: walletClient } = useWalletClient()

  const stepsMetadata = useMetaportStore((state) => state.stepsMetadata)
  const currentStep = useMetaportStore((state) => state.currentStep)
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  const actionBtnDisabled = useMetaportStore((state) => state.actionBtnDisabled)
  const loading = useMetaportStore((state) => state.loading)
  const btnText = useMetaportStore((state) => state.btnText)

  const execute = useMetaportStore((state) => state.execute)
  const startOver = useMetaportStore((state) => state.startOver)

  const amount = useMetaportStore((state) => state.amount)

  const cpData = useCPStore((state) => state.cpData)

  const [emoji, setEmoji] = useState<string>()
  useEffect(() => {
    setEmoji(getRandom(SUCCESS_EMOJIS))
  }, [])

  if (stepsMetadata.length === 0) return <div></div>
  return (
    <Collapse in={stepsMetadata && stepsMetadata.length !== 0}>
      <Box className={cls()}>
        <Collapse in={currentStep !== stepsMetadata.length}>
          <Stepper className={localStyles.stepper} activeStep={currentStep} orientation="vertical">
            {stepsMetadata.map((step, i) => (
              <Step key={i}>
                <StepLabel className={localStyles.labelStep}>
                  <div className={cls(cmn.flex, cmn.flexcv, styles.mp_flexRow)}>
                    <div className={cls(cmn.flex, cmn.flexcv, styles.mp_flexRow)}>
                      <h4 className={cls(cmn.nom, cmn.flex)}>{step.headline}</h4>
                      <div className={cls(cmn.mleft5, cmn.mri5, cmn.flex)}>
                        <ChainIcon
                          skaleNetwork={props.skaleNetwork}
                          chainName={step.onSource ? step.from : step.to}
                          size="xs"
                        />
                      </div>
                      <h4 className={cls(cmn.nom, cmn.flex)}>
                        {getChainAlias(props.skaleNetwork, step.onSource ? step.from : step.to)}
                      </h4>
                    </div>
                  </div>
                </StepLabel>
                <StepContent className={cmn.margTop}>
                  <Box sx={{ mb: 2 }}>
                    <p className={cls(cmn.flex, cmn.p, cmn.pSec, cmn.p4, cmn.flexg)}>{step.text}</p>
                    <div className={cmn.mtop10}>
                      {loading ? (
                        <LoadingButton
                          loading
                          loadingPosition="start"
                          variant="contained"
                          color="primary"
                          size="medium"
                          className={cls(styles.btnAction, cmn.mtop5)}
                        >
                          {btnText}
                          {/* {props.loadingTokens ? 'Loading...' : step.btnLoadingText} */}
                        </LoadingButton>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="medium"
                          className={cls(styles.btnAction, cmn.mtop5)}
                          onClick={() => execute(address, switchNetworkAsync, walletClient)}
                          disabled={!!(
                            amountErrorMessage || actionBtnDisabled || loading || amount == '' || !cpData.exitGasOk)}
                        >
                          {step.btnText}
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Collapse>

        {currentStep === stepsMetadata.length && (
          <div>
            <div className={cls(cmn.d)}>
              <p className={cls(cmn.p1, cmn.p, cmn.p600, cmn.pPrim, cmn.flexg, cmn.pCent, cmn.mtop20)}>
                {emoji} Transfer completed
              </p>
            </div>
            <Button
              onClick={startOver}
              color="primary"
              size="medium"
              className={cls(styles.btnAction, cmn.mtop10)}
              startIcon={<SettingsBackupRestoreRoundedIcon />}
            >
              Start over
            </Button>
          </div>
        )}
      </Box>
    </Collapse>
  )
}
