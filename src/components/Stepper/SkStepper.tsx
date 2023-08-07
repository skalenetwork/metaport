import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { cls, getChainAlias, getRandom } from '../../core/helper';
import common from '../../styles/common.scss';
import styles from '../../styles/styles.scss';
import localStyles from './SkStepper.scss';
import ChainIcon from "../ChainIcon";
import SkPaper from "../SkPaper";

import { useMetaportStore } from '../../store/MetaportState'
import { Collapse } from '@mui/material';
import { SkaleNetwork } from '../../core/interfaces';

import { useWalletClient } from 'wagmi'


import SettingsBackupRestoreRoundedIcon from '@mui/icons-material/SettingsBackupRestoreRounded';

import { useSwitchNetwork, useAccount } from 'wagmi'
import { SUCCESS_EMOJIS } from '../../core/constants';


export default function SkStepper(props: {
  skaleNetwork: SkaleNetwork
}) {

  const { address } = useAccount()
  const { switchNetworkAsync } = useSwitchNetwork()

  const { data: walletClient } = useWalletClient()

  const stepsMetadata = useMetaportStore((state) => state.stepsMetadata);
  const currentStep = useMetaportStore((state) => state.currentStep);
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage);
  const actionBtnDisabled = useMetaportStore((state) => state.actionBtnDisabled);
  const loading = useMetaportStore((state) => state.loading);
  const btnText = useMetaportStore((state) => state.btnText);

  const execute = useMetaportStore((state) => state.execute);
  const startOver = useMetaportStore((state) => state.startOver);

  const [emoji, setEmoji] = useState<string>();
  useEffect(() => {
    setEmoji(getRandom(SUCCESS_EMOJIS));
  }, []);

  if (stepsMetadata.length === 0) return (<div></div>);
  return (
    <Collapse in={stepsMetadata && stepsMetadata.length !== 0}>
      <SkPaper>
        <Box className={cls()}>
          <Collapse in={currentStep !== stepsMetadata.length}>
            <Stepper className={localStyles.mp__stepper} activeStep={currentStep} orientation="vertical">
              {stepsMetadata.map((step, i) => (<Step key={i} >
                <StepLabel className={localStyles.mp__labelStep}>
                  <div className={cls(common.flex, common.flexCenteredVert, styles.mp_flexRow)}>
                    <div className={cls(common.flex, common.flexCenteredVert, styles.mp_flexRow)}>
                      <h4 className={cls(common.noMarg, common.flex)}>{step.headline}</h4>
                      <div className={cls(common.margLeft5, common.margRi5, common.flex)}>
                        <ChainIcon
                          skaleNetwork={props.skaleNetwork}
                          chainName={step.onSource ? step.from : step.to}
                          size='xs'
                        />
                      </div>
                      <h4 className={cls(common.noMarg, common.flex)}>{getChainAlias(
                        props.skaleNetwork,
                        step.onSource ? step.from : step.to
                      )}</h4>
                    </div>
                  </div>
                </StepLabel>
                <StepContent className={common.margTop}>
                  <Box sx={{ mb: 2 }} >
                    <p className={cls(common.flex, common.p, common.pSecondary, common.p4, common.flexGrow)}>
                      {step.text}
                    </p>
                    <div className={common.margTop10}>
                      {loading ? (
                        <LoadingButton
                          loading
                          loadingPosition="start"
                          variant="contained" color="primary" size="medium"
                          className={cls(styles.btnAction, common.margTop5)}
                        >
                          {btnText}
                          {/* {props.loadingTokens ? 'Loading...' : step.btnLoadingText} */}
                        </LoadingButton>
                      ) : (
                        <Button
                          variant="contained" color="primary" size="medium"
                          className={cls(styles.btnAction, common.margTop5)}
                          onClick={() => execute(address, switchNetworkAsync, walletClient)}
                          disabled={!!(amountErrorMessage || actionBtnDisabled || loading
                            // !props.communityPoolData.exitGasOk
                          )}
                        >
                          {step.btnText}
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>))}
            </Stepper>
          </Collapse>


          {currentStep === stepsMetadata.length && (
            <div>
              <div className={cls(common.d)}>
                <p className={cls(
                  common.p1,
                  common.p,
                  common.p600,
                  common.pMain,
                  common.flexGrow,
                  common.textCentered,
                  common.margTop20
                )}>
                  {emoji} Transfer completed
                </p>
              </div>
              <Button
                onClick={startOver}
                color="primary"
                size="medium"
                className={cls(styles.btnAction, common.margTop10)}
                startIcon={<SettingsBackupRestoreRoundedIcon />}
              >
                Start over
              </Button>
            </div>

          )}
        </Box>
      </SkPaper>

    </Collapse>
  );
}