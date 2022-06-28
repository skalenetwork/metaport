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
  // {
  //   label: 'Transaction broadcasted',
  //   button: 'Transfer again',
  //   loading: ''
  // }
];

export default function VerticalLinearStepper(props) {
  const [loading, setLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = async () => {
    setLoading(true);
    if (activeStep == 0) {
      await props.approveTransfer()
    } else {
      await props.transfer()
    }
    setLoading(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // allowance={props.allowance}

  useEffect(() => {
    if (props.allowance >= props.amount && props.amount != '') {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [props.allowance, props.amount]);

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <div>
                  {loading ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      variant="contained" color="secondary" size="medium"
                      className='transfer-btn marg-top-5'
                    >
                      {step.loading}
                    </LoadingButton>
                  ) : (
                    <Button
                      variant="contained" color="secondary" size="medium"
                      className='transfer-btn marg-top-5'
                      onClick={handleNext}
                      disabled={props.amount == ''}
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
      {activeStep === steps.length && (
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }} color="secondary" size="medium">
            Reset
          </Button>
      )}
    </Box>
  );
}