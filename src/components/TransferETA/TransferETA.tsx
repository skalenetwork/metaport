import React, { useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Skeleton from '@mui/material/Skeleton';

import { isMainnet, clsNames } from '../../core/helper';
import { IMA_M2S_WAIT, IMA_S2S_WAIT, IMA_HUB_WAIT } from '../../core/constants';
import { getAvgWaitTime } from '../../core/gas_station';
import styles from '../WidgetUI/WidgetUI.scss';


export default function TransferETA(props) {
  const [eta, setEta] = React.useState<number>();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

  async function calcETA() {
    setIsLoaded(false);
    let baseETA = 0;
    const fromMainnet = isMainnet(props.transferRequest.chains[0]);
    const toMainnet = isMainnet(props.transferRequest.chains[1]);
    baseETA += fromMainnet || toMainnet ? IMA_M2S_WAIT : IMA_S2S_WAIT;
    if (props.transferRequest.route && props.transferRequest.route.hub) baseETA += IMA_HUB_WAIT;
    if (fromMainnet || toMainnet) baseETA += await getAvgWaitTime();
    setEta(baseETA)
    setIsLoaded(true);
  }

  useEffect(() => {
    if (props.transferRequest) calcETA();
  }, [props.transferRequest]);

  const tooltipText = 'Estimated transfer time (may vary depending on the network load)';

  return (
    <Tooltip arrow title={tooltipText} placement="top">
      <div>
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
          <p className={clsNames(styles.mp_p_desc, styles.mp__p, styles.mp__margRi5)}>
            ETA
          </p>
          <InfoIcon fontSize='small' className={clsNames(styles.mp__iconGray)} />
        </div>
        {isLoaded ? (
          <h4 className={clsNames(styles.mp__noMarg)}>~{eta}-{eta + 2} min</h4>) : (
          <Skeleton animation="wave" height={19} width={100} />
        )}
      </div>
    </Tooltip>
  )
}
