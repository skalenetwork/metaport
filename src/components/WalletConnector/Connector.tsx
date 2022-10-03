import React from 'react';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';

import metamaskLogo from './metamask.svg';
import walletconnectLogo from './walletconnect.svg';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';


export function Connector(props) {
  return (
    <div>
      <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow)}>
        Connect a wallet
      </p>
      <ButtonBase
        onClick={props.connectMetamask}
        className={styles.mp__btnConnect}
      >
        <Paper elevation={0} className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
          <h3 className={clsNames(
            styles.mp__flexGrow,
            styles.mp__noMarg,
            styles.mp__btnChain,
          )}>Metamask</h3>
          <img src={metamaskLogo} alt="logo" className={styles.mp__iconConnect} />
        </Paper>
      </ButtonBase>
      {/* <Tooltip title='WalletConnect will be available soon'>
        <div>
          <ButtonBase
            onClick={props.connectMetamask}
            className={styles.mp__btnConnect}
            disabled={true}
          >
            <Paper elevation={0} className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
              <h3 className={clsNames(
                styles.mp__flexGrow,
                styles.mp__noMarg,
                styles.mp__btnChain,
              )}>WalletConnect</h3>
              <img src={walletconnectLogo} alt="logo" className={clsNames(styles.mp__iconConnect)} />
            </Paper>
          </ButtonBase>
        </div>
      </Tooltip> */}
    </div>
  )
}