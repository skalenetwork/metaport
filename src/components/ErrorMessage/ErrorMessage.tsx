import React from "react";

import Button from '@mui/material/Button';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


export default function ErrorMessage(props) {
  if (!props.errorMessage) return
  return (
    <div>
      <div className={clsNames(styles.mp__margTop20Pt, styles.mp__infoIcon)}>
        {props.errorMessage.icon}
      </div>
      <div className={styles.mp__flex}>
        <p className={clsNames(
          styles.mp__p2,
          styles.mp__p,
          styles.mp__flexGrow,
          styles.mp__textCentered,
          styles.mp__margTop10,
          styles.mp__margBott20,
          styles.mp__minContent,
        )}>
          {props.errorMessage.text}
        </p>
      </div>

      {props.errorMessage.fallback ? (<Button
        variant="contained" color="primary" size="medium"
        className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
        onClick={() => { props.errorMessage.fallback() }}
      >
        {props.errorMessage.btnText}
      </Button>) : null}
    </div>
  )
}
