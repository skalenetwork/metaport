import React from 'react';

import Chip from '@mui/material/Chip';

import { OperationType } from '../../core/dataclasses/OperationType';

import styles from "../WidgetUI/WidgetUI.scss";
import { clsNames } from '../../core/helper';

import CurrentChain from '../CurrentChain';
import ErrorMessage from '../ErrorMessage';
import UnwrapUI from '../UnwrapUI';
import TransferUI from '../TransferUI';
import WrappedTokensWarning from '../WrappedTokensWarning';
import StepperV2 from '../StepperV2';
import TransferSummary from '../TransferSummary';
import TransferRoute from '../TransferRoute';
import Typography from '@mui/material/Typography';
import { getIconSrc, getTokenName } from "../TokenList/helper";

import MoveDownIcon from '@mui/icons-material/MoveDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import TokenData from '../../core/dataclasses/TokenData';
import EthTokenData from '../../core/dataclasses/EthTokenData';
import { TokenType } from '../../core/dataclasses/TokenType';
import * as interfaces from '../../core/interfaces/index';

import { getChainName, getChainIcon } from '../ChainsList/helper';
import SkeletonLoader from '../SkeletonLoader';



function getTokenDataFromConfig(configTokens: interfaces.TokensMap, transferRequest: interfaces.TransferParams): TokenData {
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
    null,
    null,
    null
  );
}


export default function TransferRequest(props) {
  if (!props.transferRequest) {
    return (<SkeletonLoader />)
  }

  const transferRequest: interfaces.TransferParams = props.transferRequest;
  const token = getTokenDataFromConfig(props.configTokens, transferRequest);

  return (
    <div>
      <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert, styles.mp_flexRow)}>
        <h2 className={clsNames(styles.mp__noMarg)}>Transfer</h2>
        <img
          className={clsNames(styles.mp__amountIcon, styles.mp__margLeft10, styles.mp__margRi5)}
          src={getIconSrc(token)}
        />
        <h2 className={clsNames(styles.mp__noMarg, styles.mp__amount)}>{transferRequest.lockValue ? props.transferRequest.amount + ' ' + token.symbol : token.symbol}</h2>
      </div>
      <div>
       
        <TransferRoute {...props} token={token} />
      </div>
      {props.summaryConfirmed ? <StepperV2 {...props} /> : <TransferSummary {...props} />}
    </div>
  )
}
