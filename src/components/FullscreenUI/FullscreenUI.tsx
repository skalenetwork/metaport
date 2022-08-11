import React, { useEffect } from 'react';

// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import skaleLogo from './skale_logo_short.svg';
import WidgetBody from '../WidgetBody';
import { Connector } from '../WalletConnector';

import { getWidgetTheme } from '../WidgetUI/Themes'

import "./Widget.scss";


export function WidgetUI(props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const divRef = React.useRef();

  const [disabledChains, setDisabledChains] = React.useState(undefined);

  let widgetTheme = getWidgetTheme(props.theme);
  let theme = createTheme({
    palette: {
    mode: widgetTheme.mode,
    background: {
        paper: widgetTheme.background
    },
    primary: {
        main: widgetTheme.primary,
    },
    secondary: {    
        main: widgetTheme.background
    },
    },
  });

  useEffect(() => {
    if (props.open) {
      setAnchorEl(divRef.current);  
    }

    if (props.schains.length == 2) {
        props.setChain1(props.schains[0]);
        props.setChain2(props.schains[1]);
        setDisabledChains(true);
    }
  }, []);

  useEffect(() => {
    if (props.tokens == undefined) return;
    if (Object.keys(props.tokens['erc20']).length == 1) {
      props.setToken(Object.keys(props.tokens['erc20'])[0]);
    }
  }, [props.tokens]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // setAnchorEl(anchorEl ? null : event.currentTarget);
    setAnchorEl(anchorEl ? null : divRef.current);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'widget-body-popup' : undefined;

  return (
    <ThemeProvider theme={theme}>
          <div className={"ima-widget-fullscreen-wrapper " + (widgetTheme.mode == 'dark' ? 'dark-theme' : 'light-theme')}>
            <Paper elevation={3} className='ima-widget-fullscreen widget-paper'>
              <div className='mp__popup'>
                {props.walletConnected ? (
                  <WidgetBody
                    schains={props.schains}
                    setChain1={props.setChain1}
                    setChain2={props.setChain2}
                    chain1={props.chain1}
                    chain2={props.chain2}

                    chainsMetadata={props.chainsMetadata}

                    setToken={props.setToken}
                    token={props.token}
                    tokens={props.tokens}

                    balance={props.balance}
                    allowance={props.allowance}

                    disabledChains={disabledChains}

                    amount={props.amount}
                    setAmount={props.setAmount}

                    approveTransfer={props.approveTransfer}
                    transfer={props.transfer}

                    loading={props.loading}
                    setLoading={props.setLoading}
                
                    activeStep={props.activeStep}
                    setActiveStep={props.setActiveStep}

                    theme={widgetTheme}
                  />
                ) : (
                <Connector
                  connectMetamask={props.connectMetamask}
                />
              )}
              </div>
            </Paper>
          </div>
    </ThemeProvider>
  );
}


export default WidgetUI;
