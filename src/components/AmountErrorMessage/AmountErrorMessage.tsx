import Collapse from '@mui/material/Collapse';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


export default function AmountErrorMessage(props) {
  return (
    <Collapse in={props.amountErrorMessage} className='mp__noMarg'>
      <p className={clsNames(
        styles.mp__flex,
        styles.mp__p3,
        styles.mp__p,
        styles.mp__errorMessage,
        styles.mp__flexGrow,
        styles.mp__margTop20
      )}>
        🔴 {props.amountErrorMessage}
      </p>
    </Collapse>)
}
