import React from 'react';
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded';
import { SkaleNetwork } from '../../core/interfaces';
import { chainIconPath } from '../../core/metadata';

import { cls } from '../../core/helper';
import styles from "../../styles/styles.module.scss";


export default function ChainIcon(props: {
  skaleNetwork: SkaleNetwork,
  chainName: string,
  className?: string,
  app?: string,
  size?: 'xs' | 'sm' | 'md' | 'lg'
}) {
  const iconPath = chainIconPath(
    props.skaleNetwork,
    props.chainName,
    props.app
  )
  const size = props.size ?? 'sm';
  const className = styles[`chainIcon${size}`] + ' ' + props.className;
  if (iconPath !== undefined) {
    if (iconPath.default) {
      return <img className={className} src={iconPath.default} />;
    }
    return <img className={className} src={iconPath} />;
  }
  return (<OfflineBoltRoundedIcon className={cls(styles.defaultChainIcon, className)} />);
}