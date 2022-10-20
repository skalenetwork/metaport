import React from "react";
import TextField from '@mui/material/TextField';
import DiamondIcon from '@mui/icons-material/Diamond';
import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';
import localStyles from './TokenIdInput.scss';



function stringToColor(str, dark) {
  if (dark) {
    // return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
    return 'hsl(120deg 2% 88%)';
  }
  return 'hsl(0deg 0% 15%)';
  // return `hsl(${hashCode(str) % 360}, 55%, 40%)`;
}

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
