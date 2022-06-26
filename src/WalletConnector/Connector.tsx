import React from 'react';
import Paper from '@mui/material/Paper';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';

import metamaskLogo from './metamask-fox.svg';


export function Connector(props) {
  return (
    <div>
        <h5 className='no-marg-top'>Connect to your wallet</h5>
        <ButtonBase
          onClick={props.connectMetamask}
          className='MetamaskSurface'
        >
         <Paper>
            <div className='flex-container fl-centered'>
              <div>
                <img src={metamaskLogo} alt="logo" className='surfaceIcon'/>
              </div>
              <div className='fl-grow marg-top-10 marg-bott-10'>
                <h3 className="no-marg-top marg-bott-5">Metamask</h3>
                <h6 className='no-marg gray-text'>Connect using Metamask</h6>
              </div>
              <ArrowForwardIosIcon className='gray-icon'/>
            </div>
          </Paper>
        </ButtonBase>
    </div>
  )
}