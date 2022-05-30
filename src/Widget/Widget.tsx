import React from "react";
import { createRoot } from 'react-dom/client';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import skaleLogo from './skale_logo_short.svg';
import WidgetCore from '../WidgetCore'

import "./Widget.scss";

let theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#000000'
    },
    primary: {
      main: '#000000',
    },
    secondary: {
      // main: '#edf2ff',
      main: '#d9e021',
    },
  },
});


export function WidgetBody(props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [chain1, setChain1] = React.useState(undefined);
  const [chain2, setChain2] = React.useState(undefined);
  const [token, setToken] = React.useState(undefined);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'widget-body-popup' : undefined;

  return (
    <ThemeProvider theme={theme}>
      <div className="ima-widget-body">
        <Fab color="primary" aria-label="add" aria-describedby={id} type="button" onClick={handleClick}>
          {open ? (
            <CloseIcon />
          ) : (
            <img className='skale-logo-sm' src={skaleLogo}/>
          )
          }
        </Fab>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <div className="ima-widget-popup-wrapper">
            <Paper elevation={3} className='widget-paper'>
              <div className='ima-widget-popup'>
                <WidgetCore
                  schains={props.schains}
                  setChain1={setChain1}
                  setChain2={setChain2}
                  chain1={chain1}
                  chain2={chain2}

                  setToken={setToken}
                  token={token}
                  tokens={props.tokens}
                />
              </div>
            </Paper>
          </div>
        </Popper>
      </div>
    </ThemeProvider>
  );
}


class IMAWidget {
  constructor(params: any) {
    const widgetEl: HTMLElement = document.getElementById('ima-widget');  
    const root = createRoot(widgetEl);
    root.render(
        <WidgetBody />
    );
  }
}

export default IMAWidget;
