import LinearProgress from '@mui/material/LinearProgress';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


export default function AmountErrorMessage(props) {
  if (props.actionBtnDisabled) {
    return (<div className={clsNames(styles.mp__amountErrorMessage)}>
      <div className={clsNames(styles.mp__paddTop10)}>
        <LinearProgress className={clsNames(styles.mp__margLeft10, styles.mp__margRi10)} />
      </div>
    </div>)
  }
  if (!props.amountErrorMessage) return (<div className={styles.mp__amountErrorMessage}></div>)
  return (
    <div className={clsNames(styles.mp__flex, styles.mp__amountErrorMessage)}>
      <p className={clsNames(
        styles.mp__p3,
        styles.mp__p,
        styles.mp__flexGrow,
        styles.mp__textCentered,
        styles.mp__margTop5,
        styles.mp__noMargBott,
        styles.mp__minContent,
        styles.mp__errorMessage
      )}>
        {props.amountErrorMessage}
      </p>
    </div>)
}
