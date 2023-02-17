import React, { useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Skeleton from '@mui/material/Skeleton';

import { isMainnet, clsNames } from '../../core/helper';
import { IMA_M2S_WAIT, IMA_S2S_WAIT, IMA_HUB_WAIT } from '../../core/constants';
import { getTransactionFee } from '../../core/fee_calculator';
import styles from '../WidgetUI/WidgetUI.scss';


function roundDown(number, decimals) {
  decimals = decimals || 0;
  return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
}


export default function TransferETF(props) {
  const [etf, setEtf] = React.useState<number>();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

  async function calcETF() {
    setIsLoaded(false);
    const fromMainnet = isMainnet(props.transferRequest.chains[0]);
    let baseETF = 0;
    if (fromMainnet) baseETF = await getTransactionFee(props.transferRequest);
    setEtf(baseETF)
    setIsLoaded(true);
  }

  useEffect(() => {
    if (props.transferRequest) calcETF();
  }, [props.transferRequest]);

  const tooltipText = 'Estimated transaction fee (You pay only for Mainnet transactions, all transfers within SKALE are free)';
  const etfText = (etf === 0) ? 'Free' : `~${roundDown(etf, 3)} USD`

  return (
    <Tooltip arrow title={tooltipText} placement="top">
      <div>
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
          <p className={clsNames(styles.mp_p_desc, styles.mp__p, styles.mp__margRi5)}>
            Estimated Transaction Fee
          </p>
          <InfoIcon fontSize='small' className={clsNames(styles.mp__iconGray)} />
        </div>
        {isLoaded ? (
          <h4 className={clsNames(styles.mp__noMarg)}>{etfText}</h4>) : (
          <Skeleton animation="wave" height={19} width={100} />
        )}
      </div>
    </Tooltip>
  )
}
