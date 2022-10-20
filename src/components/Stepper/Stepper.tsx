import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { TokenType } from '../../core/dataclasses/TokenType';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './Stepper.scss';


export default function ActionsStepper(props) {
  const handleReset = () => {
    props.setActiveStep(0);
    props.setAmount('');
    props.setLoading(false);
    props.setAmountLocked(false);
  };

  if (!props.token) return;

  const nextStepDisabledAmount = [TokenType.erc20, TokenType.erc1155].includes(props.token.type) && (props.amount === '' || props.amount === '0');
  const nextStepDisabledTokenId = [TokenType.erc721, TokenType.erc721meta, TokenType.erc1155].includes(props.token.type) && !props.tokenId;
  const nextStepDisabled = nextStepDisabledAmount || nextStepDisabledTokenId || props.loading || props.actionBtnDisabled;

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
                      disabled={nextStepDisabled || props.amountErrorMessage || (Number(props.amount) > Number(props.token.balance) && step.label !== 'Unwrap')} // TODO: tmp unwrap fix!
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