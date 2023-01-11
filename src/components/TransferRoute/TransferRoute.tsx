import React from 'react';

import styles from "../WidgetUI/WidgetUI.scss";
import { clsNames } from '../../core/helper';

import MoveDownIcon from '@mui/icons-material/MoveDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import * as interfaces from '../../core/interfaces/index';

import { getChainName, getChainIcon } from '../ChainsList/helper';


export default function TransferRoute(props) {
  const transferRequest: interfaces.TransferParams = props.transferRequest;

  const fromChainName = getChainName(props.chainsMetadata, props.transferRequest.chains[0]);
  const toChainName = getChainName(props.chainsMetadata, props.transferRequest.chains[1]);

  let tooltipText = 'Transferring assets from ' + fromChainName + ' to ' + toChainName + '.';
  if (transferRequest.route) {
    const hubChainName = getChainName(props.chainsMetadata, transferRequest.route.hub);
    if (props.token.clone) {
      tooltipText += ' Tokens will be unwrapped on ' + hubChainName + '.';
    } else {
      tooltipText += ' Tokens will be wrapped on ' + hubChainName + '.';
    }
  };

  return (
    <Tooltip arrow title={tooltipText} placement="top">
      <div className={clsNames(styles.mp__margTop20)}>
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
          <p className={clsNames(styles.mp_p_desc, styles.mp__p, styles.mp__margRi5)}>
            Route
          </p>
          <InfoIcon fontSize='small' className={clsNames(styles.mp__iconGray)} />
        </div>

        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
          <div className={clsNames(styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
            {getChainIcon(transferRequest.chains[0], props.theme.dark)}
          </div>
          <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>
            {getChainName(props.chainsMetadata, props.transferRequest.chains[0])}
          </h4>
          {transferRequest.route ? <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert)}>
            <div className={clsNames(styles.mp__margRi5, styles.mp__margLeft5, styles.mp__flex, styles.mp__routeIcon)}>
              <MoreHorizIcon />
            </div>
            <div className={clsNames(styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
              {getChainIcon(transferRequest.route.hub, props.theme.dark)}
            </div>
            <div className={clsNames(styles.mp__margRi5, styles.mp__flex)}>
              <MoveDownIcon style={{ 'width': '14pt' }} />
            </div>
          </div> : <div></div>}
          <div className={clsNames(styles.mp__margRi5, styles.mp__margLeft5, styles.mp__flex, styles.mp__routeIcon)}>
            <MoreHorizIcon style={{ 'width': '14pt' }} />
          </div>
          <div className={clsNames(styles.mp__margRi5, styles.mp__chainIcon, styles.mp__flex)}>
            {getChainIcon(transferRequest.chains[1], props.theme.dark)}
          </div>
          <h4 className={clsNames(styles.mp__noMarg, styles.mp__flex)}>
            {getChainName(props.chainsMetadata, props.transferRequest.chains[1])}
          </h4>
        </div>
      </div>
    </Tooltip >
  )
}
