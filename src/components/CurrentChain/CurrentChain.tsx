import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { clsNames } from '../../core/helper';
import { View } from '../../core/dataclasses/View';

import styles from '../WidgetUI/WidgetUI.scss';

import ChainsList from '../ChainsList';


export default function CurrentChain(props) {
  return (
    <Collapse in={!props.expandedTo && !props.expandedTokens}>
      <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margBott5)}>
        {props.view === View.UNWRAP ? (<div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => { props.setView(null) }}
          >
            <ArrowBackIosIcon className={styles.mp__backIcon} />
          </IconButton>
          <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow)}>
            Unwrap stuck tokens
          </p>
        </div>) :
          (<p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow)}>
            From
          </p>)}
        {/* <div className={styles.mp__flex}>
          <SFuelBadge from={true} data={props.sFuelData} />
        </div> */}
      </div>
      <ChainsList
        schains={props.config.chains}
        setChain={props.setChain}
        chain={props.chain}
        disabledChain={props.disabledChain}
        disabled={props.disabled}
        expanded={props.expanded}
        setExpanded={props.setExpanded}
        fromChain={true}
        config={props.config}
        dark={props.theme.mode === 'dark'}
      />
    </Collapse >
  )
}