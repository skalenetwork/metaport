import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './Stepper.scss';


export default function VerticalLinearStepper(props) {
  const handleReset = () => {
    props.setActiveStep(0);
    props.setAmount('');
    props.setLoading(false);
    props.setAmountLocked(false);
  };

  // useEffect(() => {   
  //   let allowance = parseInt(props.allowance);
  //   let amount = parseInt(props.amount);
  //   if (allowance >= amount && props.amount != '') {
  //     props.setActiveStep(1);
  //   } else {
  //     props.setActiveStep(0);
  //   }
  // }, [props.allowance, props.amount]);

  return (
    <Box>
      <Stepper className={localStyles.mp__stepper} activeStep={props.activeStep} orientation="vertical">
        {props.actionSteps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel className={localStyles.mp__labelStep}>
              {step}
              {step.label}
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <div>
                  {props.loading ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      variant="contained" color="primary" size="medium"
                      className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                    >
                      {step.loadingText}
                    </LoadingButton>
                  ) : (
                    <Button
                      variant="contained" color="primary" size="medium"
                      className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                      onClick={props.handleNextStep}
                      disabled={props.amount == ''}
                    >
                      {step.buttonText}
                    </Button>
                  )}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {props.activeStep === props.actionSteps.length && (
          <Button
            onClick={handleReset}
            color="primary"
            size="medium"
            className={clsNames(styles.mp__btnAction, styles.mp__margTop10)}
          >
            Start over
          </Button>
      )}
    </Box>
  );
}