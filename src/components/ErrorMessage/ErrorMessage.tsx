import Button from '@mui/material/Button';

import { cls } from '../../core/helper';
import common from "../../styles/common.scss";
import styles from "../../styles/styles.scss";

import { ErrorMessage } from '../../core/dataclasses';

import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded';
import PublicOffRoundedIcon from '@mui/icons-material/PublicOffRounded';
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';


const ERROR_ICONS = {
  'link-off': <LinkOffRoundedIcon />,
  'public-off': <PublicOffRoundedIcon />,
  'sentiment': <SentimentDissatisfiedRoundedIcon />,
  'error': <ErrorRoundedIcon />
};


export default function Error(props: { errorMessage: ErrorMessage }) {
  if (!props.errorMessage) return
  return (
    <div>
      <div className={cls(common.margTop20Pt, styles.infoIcon, common.pMain)}>
        {ERROR_ICONS[props.errorMessage.icon]}
      </div>
      <p style={{ wordBreak: 'break-all' }} className={cls(
        common.p1,
        common.p,
        common.p600,
        common.pMain,
        common.flexGrow,
        common.textCentered,
        common.margTop10
      )}>
        Error occured
      </p>
      <p  className={cls(
        common.p4,
        common.p,
        common.p600,
        common.pSecondary,
        common.flexGrow,
        common.textCentered,
        common.margBott10
      )}>
        Please check logs in developer console
      </p>
      <div className={common.flex}>
        <p style={{ wordBreak: 'break-all' }} className={cls(
          common.p3,
          common.p,
          common.pMain,
          common.flexGrow,
          common.textCentered,
          common.margTop10,
          common.margBott20
        )}>
          {props.errorMessage.text}
        </p>
      </div>

      {props.errorMessage.fallback ? (<Button
        variant="contained" color="primary" size="medium"
        className={cls(styles.btnAction, common.margTop5)}
        onClick={() => { props.errorMessage.fallback() }}
      >
        {props.errorMessage.btnText}
      </Button>) : null}
    </div>
  )
}
