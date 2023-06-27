import Tooltip from '@mui/material/Tooltip';

import { getChainIcon } from '../ChainsList/helper';

import { clsNames, getChainAppsMeta } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";
import { MetaportConfig } from '../../core/interfaces';


export default function ChainApps(props: {
  config: MetaportConfig,
  chain: string,
  dark: boolean
}) {

  const apps = getChainAppsMeta(props.chain, props.config.skaleNetwork);
  if (!apps || !Object.keys(apps) || Object.keys(apps).length === 0) return <div></div>;

  return (
    <div className={clsNames(
      styles.sk__chainApps,
      styles.mp__chainIconXs,
      styles.mp__margRi10,
      styles.mp__flex,
      styles.mp__flexCenteredVert
    )}>
      <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert)}>
        {Object.keys(apps).map((key, _) => (
          <Tooltip key={key} title={'App on this chain - ' + apps[key].alias}>
            <div className={clsNames(
              styles.mp__flex,
              styles.mp__flexCenteredVert,
              styles.mp__margRi5,
              styles.mp__margLeft5
            )}>
              {getChainIcon(props.config.skaleNetwork, props.chain, props.dark, key)}
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}