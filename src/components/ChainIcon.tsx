import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded'
import { SkaleNetwork } from '../core/interfaces'
import { chainIconPath } from '../core/metadata'

import { cls, styles, cmn } from '../core/css'

export default function ChainIcon(props: {
  skaleNetwork: SkaleNetwork
  chainName: string
  className?: string
  app?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}) {
  const iconPath = chainIconPath(props.skaleNetwork, props.chainName, props.app)
  const size = props.size ?? 'sm'
  const className = styles[`chainIcon${size}`] + ' ' + props.className
  if (iconPath !== undefined) {
    return <img className={className} src={iconPath.default ?? iconPath} />
  }
  return <OfflineBoltRoundedIcon className={cls(styles.defaultChainIcon, cmn.pPrim, className)} />
}
