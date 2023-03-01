import React from 'react';

import styles from '../WidgetUI/WidgetUI.scss';
import { clsNames } from '../../core/helper';

import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';


export default function Debug(props) {
  const [open, setOpen] = React.useState(true);

  const handleClick = (_: React.MouseEvent<HTMLElement>) => {
    setOpen(open ? false : true);
  };

  return (props.config.debug ? (
    <div
      className={clsNames(styles.mp__codeWrap, 'mp__codeWrap')}
      style={{
        zIndex: -1
      }}
    >
      <Collapse in={open}>
        <code className={clsNames(styles.mp__code)}>
          transferRequest: {props.transferRequest ? JSON.stringify(props.transferRequest) : null}
          <br />
          transferRequestStatus: {props.transferRequestStatus}
          <br />
          transferRequestStep: {props.transferRequestStep}
          <br />
          transferRequestSteps len: {props.transferRequestSteps ? props.transferRequestSteps.length : null}
          <br />
          transferRequestLoading: {props.transferRequestLoading}
          <br />
          view: {props.view}
          <br />
          amount: {props.amount}
          <br />
          tokenId: {props.tokenId}
          <br />
          token: {props.token ? props.token.keyname : null}
          <br />
          chain1: {props.chain1}
          <br />
          chain2: {props.chain2}
          <br />
          actionName: {props.actionName}
          <br />
          actionSteps len: {props.actionSteps ? props.actionSteps.length : null}
          <br />
          activeStep: {props.activeStep}
          <br />
          sFuelOk: {props.sFuelOk}
          <br />
          chainId: {props.chainId}
          <br />
          extChainId: {props.extChainId}

          <br />
          <br />
        </code>
      </Collapse>
      <Button
        color="primary"
        size="small"
        className={styles.mp__btnChain}
        onClick={handleClick}
      >
        {open ? 'Hide' : 'Show'} Debug
      </Button>
    </div>
  ) : null
  )
}
