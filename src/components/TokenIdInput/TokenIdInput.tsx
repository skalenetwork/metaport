import React from "react";
import TextField from '@mui/material/TextField';

import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './TokenIdInput.scss';


export default function TokenIdInput(props) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setTokenId(event.target.value);
  };

  if (!props.token) return;
  return (
    <div className={clsNames(styles.mp__flex, localStyles.mp__inputAmount)}>

      <div className={clsNames(styles.mp__flex, styles.mp__flexGrow)}>
        {/* <div className={clsNames(styles.mp__flex, styles.mp__flexCentered, styles.tokenIdIcon)}>
          <DiamondIcon sx={{ color: stringToColor(props.chain, props.dark) }} width='20px'/>
        </div> */}
        <TextField
          type="number"
          variant="standard"
          placeholder="100"
          value={props.tokenId}
          onChange={handleChange}
          disabled={props.loading || props.amountLocked}
        />
      </div>
      <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margRi20)}>
        <p className={clsNames(styles.mp__p3, styles.mp__p)}>
          Token ID
        </p>
      </div>
    </div>
  )
}
