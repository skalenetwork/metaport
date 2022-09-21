import React from 'react';

import Collapse from '@mui/material/Collapse';
import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';

import ChainsList from '../ChainsList';
import SFuelBadge from '../SFuelBadge';


export default function CurrentChain(props) {
  return (
    <Collapse in={!props.expandedTo && !props.expandedTokens}>
      <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margBott5)}>
        <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow)}>
          Current chain
        </p>
        <div className={styles.mp__flex}>
          <SFuelBadge from={true} data={props.sFuelData} />
        </div>
      </div>
      <ChainsList
        schains={props.schains}
        setChain={props.setChain}
        chain={props.chain}
        disabledChain={props.disabledChain}
        disabled={props.disabled}
        expanded={props.expanded}
        setExpanded={props.setExpanded}
        fromChain={true}
        chainsMetadata={props.chainsMetadata}
        dark={props.theme.mode === 'dark'}
      />
    </Collapse>
  )
}