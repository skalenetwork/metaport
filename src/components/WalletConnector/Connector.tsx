import React from 'react';
import Paper from '@mui/material/Paper';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';

import metamaskLogo from './metamask-fox.svg';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';


export function Connector(props) {
  return (
    <div>
      <p className={styles.mp__p3}>Connect to your wallet</p>
      <ButtonBase
        onClick={props.connectMetamask}
        className={styles.mp__btnConnect}
      >
        <Paper elevation={0}>
          <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
            <img src={metamaskLogo} alt="logo" className={styles.mp__iconConnect} />
            <div className={clsNames(
              styles.mp__flexGrow,
              styles.mp__margTop10,
              styles.mp__margBott10
            )}>
              <h3 className={clsNames(
                styles.mp__noMargTop,
                styles.mp__margBott5
              )}>Metamask</h3>
              <h6 className={clsNames(
                styles.mp__noMarg,
                styles.mp__textGray
              )}>Connect using Metamask</h6>
            </div>
            <ArrowForwardIosIcon className={styles.mp__iconGray} />
          </div>
        </Paper>
      </ButtonBase>
    </div>
  )
}