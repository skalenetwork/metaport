import React from 'react';

import Chip from '@mui/material/Chip';

import { OperationType } from '../../core/dataclasses/OperationType';

import styles from "../WidgetUI/WidgetUI.scss";
import { clsNames } from '../../core/helper';

import CurrentChain from '../CurrentChain';
import ErrorMessage from '../ErrorMessage';
import UnwrapUI from '../UnwrapUI';
import TransferUI from '../TransferUI';
import WrappedTokensWarning from '../WrappedTokensWarning';
import StepperV2 from '../StepperV2';
import TransferSummary from '../TransferSummary';
import Typography from '@mui/material/Typography';
import { getIconSrc, getTokenName } from "../TokenList/helper";

import MoveDownIcon from '@mui/icons-material/MoveDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


import calypso from '../../iconsTmp/calypso.svg';
import ruby from '../../iconsTmp/ruby.png';

import { getChainName, getChainIcon } from '../ChainsList/helper';

export default function WidgetBodyV2(props) {
  return (
    <div>
      {/* <h2 className={clsNames(styles.mp__noMargTop, styles.mp__margBott10)}>
        Transfer assets
      </h2>
      <p className={clsNames(styles.mp__flex, styles.mp_p_desc, styles.mp__p, styles.mp__flexGrow)}>
        Your assets will be routed though Europa Hub - all transactions on Europa and Calypso are free.
      </p> */}
      {/* <p className={clsNames(styles.mp__flex, styles.mp_p_desc, styles.mp__p, styles.mp__flexGrow)}>
        Optional custom message about this transfer request
      </p> */}
      {/* <div className={styles.mp__margTop5}>
        
      </div> */}


      <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
        <h2 className={clsNames(styles.mp__noMarg)}>Transfer</h2>
        <img
          className={clsNames(styles.mp__amountIcon, styles.mp__margLeft10, styles.mp__margRi5)}
          src={getIconSrc(props.token)}
        />
        <h2 className={clsNames(styles.mp__noMarg, styles.mp__amount)}>{props.amountLocked ? props.amount + ' ' + props.token.symbol : props.token.symbol}</h2>
      </div>

      <div>
        <p className={clsNames(styles.mp_p_desc, styles.mp__p, styles.mp__margTop20)}>
          Route
        </p>
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
          <div className={clsNames(styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
            {getChainIcon('mainnet', props.theme.dark)}
          </div>
          <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>{getChainName(props.chainsMetadata, 'mainnet')}</h4>
          <div className={clsNames(styles.mp__margRi5, styles.mp__margLeft5, styles.mp__flex, styles.mp__routeIcon)}>
            <MoreHorizIcon />
          </div>
          <div className={clsNames(styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
            <img src={ruby} className='eth-logo' height='20px' width='20px' />
            {/* {getChainIcon(props.chain2, props.theme.dark)} */}
          </div>
          <div className={clsNames(styles.mp__margRi5, styles.mp__flex)}>
            <MoveDownIcon style={{ 'width': '14pt' }} />
          </div>
          <div className={clsNames(styles.mp__margRi5, styles.mp__margLeft5, styles.mp__flex, styles.mp__routeIcon)}>
            <MoreHorizIcon style={{ 'width': '14pt' }} />
          </div>
          <div className={clsNames(styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
            <img src={calypso} className='eth-logo' height='20px' width='20px' />
            {/* {getChainIcon(props.chain2, props.theme.dark)} */}

          </div>
          <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>{getChainName(props.chainsMetadata, props.chain2)}</h4>
        </div>
      </div>

      {props.summaryConfirmed ? <StepperV2 {...props} /> : <TransferSummary {...props} />}



    </div>
  )
}