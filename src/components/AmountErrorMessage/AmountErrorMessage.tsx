import React from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


export default function AmountErrorMessage(props) {
  if (props.actionBtnDisabled) {
    return (<Box className={clsNames(styles.mp__margTop10, styles.mp__margLeft10, styles.mp__margRi10)}>
      <LinearProgress />
    </Box>)
  }
  if (!props.amountErrorMessage) return
  return (
    <div className={styles.mp__flex}>
      <p className={clsNames(
        styles.mp__p3,
        styles.mp__p,
        styles.mp__flexGrow,
        styles.mp__textCentered,
        styles.mp__margTop10,
        styles.mp__minContent,
        styles.mp__errorMessage
      )}>
        {props.amountErrorMessage}
      </p>
    </div>)
}
