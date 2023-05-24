import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './StepperV2.scss';
import SkeletonLoader from "../SkeletonLoader";


export default function StepperV2(props) {
  if (props.transferRequestLoading || !props.transferRequestSteps) return (<SkeletonLoader />);
  return (
    <Box className={clsNames(styles.mp__margTop20)}>
      <Stepper className={localStyles.mp__stepper} activeStep={props.transferRequestStep} orientation="vertical">
        {props.transferRequestSteps.map((step, i) => (<Step key={i} >
          <StepLabel className={localStyles.mp__labelStep}>
            <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
              <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
                <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>{step.headline}</h4>
                <div className={clsNames(styles.mp__margLeft5, styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
                  {step.chainIcon}
                </div>
                <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>{step.chainName}</h4>
              </div>
            </div>
          </StepLabel>
          <StepContent className={styles.mp__margTop}>
            <Box sx={{ mb: 2 }} >
              <p className={clsNames(styles.mp__flex, styles.mp_p_desc, styles.mp__p, styles.mp__flexGrow)}>
                {step.text}
              </p>
              <div className={styles.mp__margTop10}>
                {props.loading || props.loadingTokens ? (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                  >
                    {props.loadingTokens ? 'Loading...' : props.btnText}
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                    onClick={props.handleNextStep}
                    disabled={props.amountErrorMessage ||
                      props.actionBtnDisabled ||
                      props.loading ||
                      props.loadingTokens ||
                      !props.communityPoolData.exitGasOk
                    }
                  >
                    {step.btnText}
                  </Button>
                )}
              </div>
            </Box>
          </StepContent>
        </Step>))}
      </Stepper>
    </Box>
  );
}