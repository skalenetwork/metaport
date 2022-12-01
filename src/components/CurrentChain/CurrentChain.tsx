import React from 'react';

import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { clsNames } from '../../core/helper';
import styles from '../WidgetUI/WidgetUI.scss';

import ChainsList from '../ChainsList';
import SFuelBadge from '../SFuelBadge';

import { OperationType } from '../../core/dataclasses/OperationType';


export default function CurrentChain(props) {
  return (
    <Collapse in={!props.expandedTo && !props.expandedTokens}>
      <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp__margBott5)}>
        {props.operationType === OperationType.unwrap ? (<div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => { props.setOperationType(OperationType.transfer) }}
          >
            <ArrowBackIosIcon className={styles.mp__backIcon} />
          </IconButton>
          <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow)}>
            Unwrap stuck tokens
          </p>
        </div>) :
          (<p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow)}>
            Current chain
          </p>)}
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
    </Collapse >
  )
}