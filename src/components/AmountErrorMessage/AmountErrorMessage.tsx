import Collapse from '@mui/material/Collapse';

import { cls } from '../../core/helper';
import common from '../../styles/common.scss';

import { useMetaportStore } from '../../store/MetaportState'


export default function AmountErrorMessage() {
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage);
  return (
    <Collapse in={!!amountErrorMessage || amountErrorMessage === ''} className='mp__noMarg'>
      <p className={cls(
        common.flex,
        common.p3,
        common.p,
        common.pSecondary,
        common.errorMessage,
        common.flexGrow,
        common.margTop10,
        common.margLeft10,
        // common.uppercase
      )}>
        🔴 {amountErrorMessage}
      </p>
    </Collapse>)
}
