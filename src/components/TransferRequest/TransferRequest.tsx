import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';

import styles from "../WidgetUI/WidgetUI.scss";
import { clsNames, getChainName } from '../../core/helper';

import ErrorMessage from '../ErrorMessage';
import StepperV2 from '../StepperV2';
import TransferSummary from '../TransferSummary';
import Route from '../Route';
import { getIconSrc } from "../TokenList/helper";

import TokenData from '../../core/dataclasses/TokenData';
import EthTokenData from '../../core/dataclasses/EthTokenData';
import { TransferRequestStatus } from '../../core/dataclasses';
import { TokenType } from '../../core/dataclasses/TokenType';
import * as interfaces from '../../core/interfaces/index';
import { isTransferRequestSteps } from '../../core/views';

import TransactionsHistory from '../TransactionsHistory';
import SkeletonLoader from '../SkeletonLoader';
import WrappedTokensWarning from '../WrappedTokensWarning';
import SFuelWarning from '../SFuelWarning';
import AmountErrorMessage from '../AmountErrorMessage';


function getTokenDataFromConfig(
  configTokens: interfaces.TokensMap,
  transferRequest: interfaces.TransferParams
): TokenData {
  // TODO: refactor!

  if (transferRequest.tokenType === TokenType.eth) {
    return new EthTokenData(false);
  }

  let configToken;
  let isClone = false;

  const fromChainName = transferRequest.chains[0];
  const toChainName = transferRequest.route ? transferRequest.route.hub : transferRequest.chains[1];

  if (configTokens[fromChainName] &&
    configTokens[fromChainName][transferRequest.tokenType] &&
    configTokens[fromChainName][transferRequest.tokenType][transferRequest.tokenKeyname]) {
    configToken = configTokens[fromChainName][transferRequest.tokenType][transferRequest.tokenKeyname];
  }
  if (configTokens[toChainName] &&
    configTokens[toChainName][transferRequest.tokenType] &&
    configTokens[toChainName][transferRequest.tokenType][transferRequest.tokenKeyname]) {
    configToken = configTokens[toChainName][transferRequest.tokenType][transferRequest.tokenKeyname];
    isClone = true;
  }
  if (!configToken) return;

  let unwrappedSymbol;
  let unwrappedAddress;
  let unwrappedIconUrl;
  if (configToken.wraps) {
    unwrappedSymbol = configToken.wraps.symbol;
    unwrappedAddress = configToken.wraps.address;
    unwrappedIconUrl = configToken.wraps.iconUrl;
  }

  return new TokenData(
    null,
    configToken.address,
    configToken.name,
    configToken.symbol,
    configToken.cloneSymbol,
    isClone,
    configToken.iconUrl,
    configToken.decimals,
    transferRequest.tokenType,
    unwrappedSymbol,
    unwrappedAddress,
    unwrappedIconUrl
  );
}


export default function TransferRequest(props) {
  if (!props.transferRequest) {
    return (<SkeletonLoader header={true} />)
  }

  const trReq: interfaces.TransferParams = props.transferRequest;
  const token = getTokenDataFromConfig(props.config.tokens, trReq);

  const fromChainName = getChainName(
    props.config.chainsMetadata,
    trReq.chains[0],
    props.config.skaleNetwork,
    trReq.fromApp
  );
  const toChainName = getChainName(
    props.config.chainsMetadata,
    trReq.chains[1],
    props.config.skaleNetwork,
    trReq.toApp
  );

  let explanationText = 'Transfer assets from ' + fromChainName + ' to ' + toChainName + '.';
  if (trReq.route) {
    const hubChainName = getChainName(
      props.config.chainsMetadata,
      trReq.route.hub,
      props.config.skaleNetwork
    );
    if (token.clone) {
      explanationText += ' Tokens will be unwrapped on ' + hubChainName + '.';
    } else {
      explanationText += ' Tokens will be wrapped on ' + hubChainName + '.';
    }
  };

  const showAmount = trReq.lockValue && trReq.amount;
  let amountText = showAmount ? `${trReq.amount} ${token.symbol}` : token.symbol;
  amountText += trReq.tokenId ? ` (#${trReq.tokenId})` : '';

  return (
    <div>
      <Collapse in={!props.expandedHistory}>
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
          <h2 className={clsNames(styles.mp__noMarg)}>Transfer</h2>
          <img
            className={clsNames(styles.mp__amountIcon, styles.mp__margLeft10, styles.mp__margRi5)}
            src={getIconSrc(token)}
          />
          <h2 className={clsNames(styles.mp__noMarg, styles.mp__amount, styles.mp__flexGrow)}>
            {amountText}
          </h2>
        </div>
        <Route
          config={props.config}
          transferRequest={props.transferRequest}
          theme={props.theme}
          explanationText={explanationText}
          size={isTransferRequestSteps(props.view) ? 'small' : 'medium'}
        />
        <Collapse in={props.errorMessage}>
          <ErrorMessage errorMessage={props.errorMessage} />
        </Collapse>

        <Collapse in={!props.errorMessage && props.transferRequestStatus !== TransferRequestStatus.DONE}>
          {isTransferRequestSteps(props.view) ?
            <StepperV2 {...props} token={token} /> :
            <TransferSummary {...props} explanationText={explanationText} />
          }
        </Collapse>

        <Collapse in={props.transferRequestStatus === TransferRequestStatus.DONE}>
          <p className={clsNames(styles.mp__margTop20, styles.mp__margBott10, styles.mp__p, styles.mp__completeText)}>
            💫 You've successfully transferred {amountText} from {fromChainName} to {toChainName}.
          </p>
          <Button
            onClick={() => {
              props.setTransferRequest
              props.resetWidgetState();
            }}
            color="primary"
            size="medium"
            className={clsNames(styles.mp__btnAction, styles.mp__margTop10)}
          >
            Go to Sandbox
          </Button>
        </Collapse>

        {props.transferRequestStep === 0 ? (<WrappedTokensWarning
          wrappedTokens={props.wrappedTokens}
          setView={props.setView}
        />) : null}

        <AmountErrorMessage
          amountErrorMessage={props.amountErrorMessage}
          actionBtnDisabled={props.actionBtnDisabled}
        />
        <SFuelWarning
          chain1={props.chain1}
          chain2={props.chain2}
          transferRequest={props.transferRequest}
          config={props.config}
          address={props.address}
          setSFuelOk={props.setSFuelOk}
          view={props.view}
        />
      </Collapse>
      <TransactionsHistory
        transactionsHistory={props.transactionsHistory}
        clearTransactionsHistory={props.clearTransactionsHistory}
        config={props.config}
        setExpanded={props.setExpandedHistory}
        expanded={props.expandedHistory}
        transferRequestView={true}
      />
    </div>
  )
}
