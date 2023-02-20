import styles from '../WidgetUI/WidgetUI.scss';
import { clsNames } from '../../core/helper';


export default function Debug(props) {
  return (props.config.debug ? (<code className={clsNames(styles.mp__code)}>
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
  </code>) : null
  )
}
