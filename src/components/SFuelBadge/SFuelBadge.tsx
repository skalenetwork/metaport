import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ErrorIcon from '@mui/icons-material/Error';
import Tooltip from '@mui/material/Tooltip';

import localStyles from './SFuelBadge.scss';



const BadgeStates = {
  success: {
    tooltip: 'Ok text',
    color: 'success',
    icon: <DoneIcon />
  },
  warning: {
    tooltip: 'You do not have enough sFUEL on the chain',
    color: 'warning',
    icon: <PriorityHighIcon />
  },
  error: {
    tooltip: 'You do not have enough sFUEL on the chain',
    color: 'error',
    icon: <ErrorIcon />
  }
}

export default function SFuelBadge(props) {
  if (!props.data || props.data.ok) return;
  if (Object.keys(props.data).length === 0) return;

  let type = props.from ? 'error' : 'warning';
  let badgeInfo = BadgeStates[type];

  return (
    <Tooltip title={badgeInfo.tooltip} placement="top">
      <div className={localStyles.mp__chip}>
        <Chip
          color={badgeInfo.color}
          onClick={props.data.faucetUrl ? (() => window.open(props.data.faucetUrl, '_blank')?.focus()) : null}
          icon={badgeInfo.icon}
          label="sFUEL"
          size="small"
        />
      </div>
    </Tooltip>
  )
}
