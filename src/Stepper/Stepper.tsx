import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';


const steps = [
  {
    label: 'Approve token transfer',
    button: 'Approve',
    loading: 'Approving'
  },
  {
    label: 'Transfer tokens',
    button: 'Transfer',
    loading: 'Transfering'
  }
];

export default function VerticalLinearStepper(props) {
  const handleNext = async () => {
    props.setLoading(true);
    if (props.activeStep == 0) {
      await props.approveTransfer();
      props.setLoading(false);
    } else {
      await props.transfer();
    }
    props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    props.setActiveStep(0);
    props.setAmount('');
    props.setLoading(false);
    props.setAmountLocked(false);
  };

  useEffect(() => {   
    let allowance = parseInt(props.allowance);
    let amount = parseInt(props.amount);
    if (allowance >= amount && props.amount != '') {
      props.setActiveStep(1);
    } else {
      props.setActiveStep(0);
    }
  }, [props.allowance, props.amount]);

  return (
    <Box>
      <Stepper activeStep={props.activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
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
                      className='transfer-btn marg-top-5'
                    >
                      {step.loading}
                    </LoadingButton>
                  ) : (
                    <Button
                      variant="contained" color="primary" size="medium"
                      className='transfer-btn marg-top-5'
                      onClick={handleNext}
                      disabled={props.amount == ''}
                      style={{
                        color: props.theme.mode == 'dark' ? 'black' : 'white'
                      }}
                    >
                      {step.button}
                    </Button>
                  )}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {props.activeStep === steps.length && (
          <Button
            onClick={handleReset}
            color="primary"
            size="medium"
            className='transfer-btn marg-top-10'
          >
            Start over
          </Button>
      )}
    </Box>
  );
}