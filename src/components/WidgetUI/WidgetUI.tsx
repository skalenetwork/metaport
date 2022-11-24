import React, { useEffect } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import skaleLogo from './skale_logo_short.svg';

import { getWidgetTheme } from './Themes'
import WidgetBody from '../WidgetBody';
import { Connector } from '../WalletConnector';

import { clsNames } from '../../core/helper';
import styles from "./WidgetUI.scss";


export function WidgetUI(props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const divRef = React.useRef();

  const [disabledChains, setDisabledChains] = React.useState(undefined);

  let widgetTheme = getWidgetTheme(props.theme);
  let theme = createTheme({
    zIndex: {
      tooltip: 9998
    },
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
    } else {
      setAnchorEl(null);
    }
  }, [props.open]);


  useEffect(() => {
    if (props.schains.length == 2) {
      props.setChain1(props.schains[0]);
      props.setChain2(props.schains[1]);
      setDisabledChains(true);
    } else {
      setDisabledChains(false);
    }
  }, [props.schains]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    props.setOpen(props.open ? false : true);
  };

  const themeCls = widgetTheme.mode === 'dark' ? styles.darkTheme : styles.lightTheme;

  let fabTop: boolean = false;
  let fabLeft: boolean = false;
  if (props.theme) {
    console.log('props.theme.position.top');
    console.log(props.theme.position.top);
    fabTop = props.theme.position.bottom === 'auto';
    fabLeft = props.theme.position.right === 'auto';
  }

  const fabButton = (<div className={clsNames(styles.mp__flex)}>
    <div className={(fabLeft ? null : clsNames(styles.mp__flexGrow))}></div>
    <div className={styles.mp__flex}>
      <Fab
        color={props.open ? 'secondary' : 'primary'}
        className={props.openButton ? styles.skaleBtn : styles.skaleBtnHidden}
        aria-label="add"
        type="button"
        onClick={handleClick}
      >
        {props.open ? (
          <CloseIcon
            style={{
              color: widgetTheme.mode == 'dark' ? 'white' : 'black'
            }}
          />
        ) : (<img
          className={styles.skaleLogoSm}
          src={skaleLogo}
        />)
        }
      </Fab>
    </div>
  </div>);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div
          className={clsNames(styles.imaWidgetBody, themeCls)}
          style={props.theme ? props.theme.position : null}
        >
          <div className={(props.openButton ? styles.mp__margBott20 : null)}>
            {fabTop ? fabButton : null}
          </div>
          <div className={clsNames(styles.mp__popper, (props.open ? null : styles.noDisplay))}>
            <div className={clsNames(styles.mp__popupWrapper, themeCls)}>
              <Paper elevation={3} className={styles.mp__paper}>
                <div className={styles.mp__popup}>
                  {props.walletConnected ? (
                    <WidgetBody
                      {...props}
                      disabledChains={disabledChains}
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
          </div>
          <div className={(props.openButton ? styles.mp__margTop20 : null)}>
            {fabTop ? null : fabButton}
          </div>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}


export default WidgetUI;
