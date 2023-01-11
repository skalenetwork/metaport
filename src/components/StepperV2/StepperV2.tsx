import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TokenType } from '../../core/dataclasses/TokenType';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './StepperV2.scss';
import { getIconSrc, getTokenName } from "../TokenList/helper";
import AmountInput from "../AmountInput";

import MoveDownIcon from '@mui/icons-material/MoveDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { getChainName, getChainIcon } from '../ChainsList/helper';

export default function StepperV2(props) {

  return (
    <Box className={clsNames(styles.mp__margTop20)}>
      {/* <p className={clsNames(styles.mp_p_desc, styles.mp__p)}>
        Steps
      </p> */}
      <Stepper className={localStyles.mp__stepper} activeStep={props.activeStep} orientation="vertical">
        <Step key={123}  >
          <StepLabel className={localStyles.mp__labelStep}>
            <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
              <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
                <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>Transfer to</h4>
                <div className={clsNames(styles.mp__margLeft5, styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
                  {getChainIcon(props.chain1, props.theme.dark)}
                </div>
                <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>{getChainName(props.chainsMetadata, props.chain1)}</h4>
              </div>
            </div>
          </StepLabel>
          <StepContent className={styles.mp__margTop}>
            <Box sx={{ mb: 2 }} >
              <p className={clsNames(styles.mp__flex, styles.mp_p_desc, styles.mp__p, styles.mp__flexGrow)}>
                Transfer USDT from Mainnet to Europa Hub.
              </p>
              {props.amountLocked ? null : <div className={styles.mp__margTop10}> <AmountInput
                amount={props.amount}
                setAmount={props.setAmount}
                token={props.token}
                loading={props.loading}
                activeStep={props.activeStep}
                amountLocked={props.amountLocked}
              /></div>

              }
              <div className={styles.mp__margTop10}>
                {props.loading ? (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                  >
                    Transferring
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                  >
                    Transfer
                  </Button>
                )}
              </div>
            </Box>
          </StepContent>
        </Step>


        <Step key={123}>
          <StepLabel className={localStyles.mp__labelStep}>
            <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
              <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
                <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
                  <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>Wrap on</h4>
                  <div className={clsNames(styles.mp__margLeft5, styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
                    {getChainIcon(props.chain1, props.theme.dark)}
                  </div>
                  <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>{getChainName(props.chainsMetadata, props.chain1)}</h4>
                </div>
              </div>
            </div>
          </StepLabel>
          <StepContent className={styles.mp__margTop}>
            <Box sx={{ mb: 2 }} className={styles.mp__margTop10}>
              <div>
                {props.loading ? (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                  >
                    Transferring
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                  >
                    Transfer
                  </Button>
                )}
              </div>
            </Box>
          </StepContent>
        </Step>

        <Step key={123} >
          <StepLabel className={localStyles.mp__labelStep}>
            <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
              <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
                <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
                  <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>Transfer to</h4>
                  <div className={clsNames(styles.mp__margLeft5, styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
                    {getChainIcon(props.chain2, props.theme.dark)}
                  </div>
                  <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>{getChainName(props.chainsMetadata, props.chain2)}</h4>
                </div>
              </div>

            </div>
          </StepLabel>
          <StepContent >
            <Box sx={{ mb: 2 }} >
              <div>
                {props.loading ? (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                  >
                    Transferring
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                  >
                    Transfer
                  </Button>
                )}
              </div>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
}