import { getActionSteps } from '../../core/actions';
import TokenData from '../../core/dataclasses/TokenData';
import { TokenType } from '../../core/dataclasses/TokenType';
import { getEmptyTokenDataMap } from '../../core/tokens/helper';
import { getWidgetTheme } from '../WidgetUI/Themes';
export * as dataclasses from '../../core/dataclasses/index';
import * as interfaces from '../../core/interfaces/index';
import { View } from '../../core/dataclasses/View';
import { getTransferSteps } from '../../core/transfer_steps';

function setMock() { return };


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}


export const commonConfig: interfaces.MetaportConfig = {
  skaleNetwork: 'staging3',
  openButton: true,
  openOnLoad: true,
  tokens: generateConfigTokens(),
  chains: ['Europa Chain', 'Calypso'],
  chainsMetadata: {
    'staging-perfect-parallel-gacrux': {
      alias: 'Europa Hub', // optional
      minSfuelWei: '27000000000000', // optional
      faucetUrl: 'https://github.com/skalenetwork/skale-network',
      apps: {
        "ruby": {
          "alias": "Ruby Exchange",
          "background": "#02001f",
          "url": "https://ruby.exchange/"
        }
      }
    },
    'staging-severe-violet-wezen': {
      alias: 'Calypso Hub',
      apps: {
        "nftrade": {
          "alias": "NFTrade",
          "background": "#ffffff",
          "url": "https://nftrade.com/"
        }
      }
    }
  }
}


export const commonProps = {
  sFuelOk: true,
  view: View.SANDBOX,
  open: true,
  config: commonConfig,
  chain1: 'staging-perfect-parallel-gacrux',
  chain2: 'staging-severe-violet-wezen',
  setChain1: setMock,
  setChain2: setMock,
  setToken: setMock,
  setLoading: setMock,
  setView: setMock,
  setActiveStep: () => { return },
  walletConnected: true,
  actionSteps: getActionSteps('erc20_s2s', new TokenData(
    '',
    null,
    '',
    'test',
    null,
    null,
    null,
    null,
    TokenType.erc20,
    null,
    null,
    null
  )),
  theme: getWidgetTheme(null),
  transferRequestLoading: true
}



export function getWrapActionSteps() {
  return getActionSteps('erc20_s2s', new TokenData(
    '',
    null,
    '',
    'test',
    null,
    null,
    null,
    null,
    TokenType.erc20,
    'ETHC',
    '0x0',
    null
  ))
}


export function getUnwrapActionSteps() {
  return getActionSteps('erc20_unwrap', new TokenData(
    '',
    null,
    '',
    'test',
    null,
    null,
    null,
    null,
    TokenType.erc20,
    'ETHC',
    '0x0',
    null
  ))
}


export function generateTokenData(tokenSymbol, tokenName, wrapped = false) {
  const data = {
    token: tokenSymbol,
    amount: getRandomInt(1000, 10000),
    availableTokens: getEmptyTokenDataMap(),
    wrappedTokens: getEmptyTokenDataMap(),
    wrappedToken: undefined
  }
  // tslint:disable-next-line
  const unwrappedIconUrl = wrapped ? "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Globe%20showing%20americas/3D/globe_showing_americas_3d.png" : null
  data.availableTokens.erc20[tokenSymbol] = new TokenData(
    '0x0',
    '0x0',
    tokenName,
    tokenSymbol,
    undefined,
    false,
    undefined,
    '18',
    TokenType.erc20,
    undefined,
    undefined,
    unwrappedIconUrl
  );
  if (wrapped) {
    data.availableTokens.erc20[tokenSymbol].unwrappedBalance = getRandomInt(
      10000, 70000).toString();
    data.availableTokens.erc20[tokenSymbol].unwrappedSymbol = 'u' + tokenSymbol;
  };
  data.availableTokens.erc20[tokenSymbol].balance = getRandomInt(10000, 70000).toString();
  data.token = data.availableTokens.erc20[tokenSymbol];
  return data;
}

export const defaultTokenData = generateTokenData('usdt', 'Tether');


export function generateERC721TokenData(tokenSymbol, tokenName) {
  const data = {
    token: tokenSymbol,
    amount: getRandomInt(1000, 10000),
    availableTokens: getEmptyTokenDataMap()
  }
  data.availableTokens.erc721[tokenSymbol] = new TokenData(
    '0x0',
    '0x0',
    tokenName,
    tokenSymbol,
    tokenSymbol,
    false,
    undefined,
    undefined,
    TokenType.erc721,
    undefined,
    undefined,
    undefined
  );
  data.token = data.availableTokens.erc721[tokenSymbol];
  return data;
}

export const defaultERC721TokenData = generateERC721TokenData('skl', 'SKALE Space');


export function generateERC1155TokenData(tokenSymbol, tokenName) {
  const data = {
    token: tokenSymbol,
    amount: getRandomInt(1000, 10000),
    availableTokens: getEmptyTokenDataMap()
  }
  data.availableTokens.erc1155[tokenSymbol] = new TokenData(
    '0x0',
    '0x0',
    tokenName,
    tokenSymbol,
    undefined,
    false,
    undefined,
    '18',
    TokenType.erc1155,
    undefined,
    undefined,
    undefined
  );
  // data.availableTokens.erc1155[tokenSymbol].balance = getRandomInt(10000, 70000).toString();
  data.token = data.availableTokens.erc1155[tokenSymbol];
  return data;
}

export const defaultERC1155TokenData = generateERC1155TokenData('XEM', 'SKALIENS');



export function generateWrappedTokens() {
  const data = generateTokenData('eth', 'ETH');
  data.wrappedTokens.erc20 = data.availableTokens.erc20;
  data.token.balance = undefined;
  return data;
}

export function generateTransferRequest(apps?: boolean) {
  const trReq = {
    toApp: undefined,
    amount: getRandomInt(100, 1000).toString(),
    chains: ['mainnet', 'staging-severe-violet-wezen'],
    tokenKeyname: 'eth',
    tokenType: TokenType.eth,
    lockValue: true,
    route: {
      hub: 'staging-perfect-parallel-gacrux',
      tokenKeyname: '_wrETH_0xBA3f8192e28224790978794102C0D7aaa65B7d70'
    },
    text: 'Your assets will be routed though Europa Hub - all transactions on Europa and\
      Calypso are free.'
  };
  if (apps) {
    trReq.toApp = 'nftrade';
  }
  return trReq;
}

export function generateTransferRequestUnwrap() {
  return {
    amount: getRandomInt(100, 1000),
    chains: ['staging-severe-violet-wezen', 'mainnet'],
    tokenKeyname: 'eth',
    tokenType: TokenType.eth,
    lockValue: true,
    route: {
      hub: 'staging-perfect-parallel-gacrux',
      tokenKeyname: '_wrETH_0xBA3f8192e28224790978794102C0D7aaa65B7d70'
    },
    text: 'Your assets will be routed though Europa Hub - all transactions on Europa and Calypso \
      are free.'
  };
}


export function generateTransferRequestSimple(apps?: boolean) {
  const trReq = {
    fromApp: undefined,
    toApp: undefined,
    amount: getRandomInt(100, 1000),
    chains: ['staging-perfect-parallel-gacrux', 'staging-severe-violet-wezen'],
    tokenKeyname: 'eth',
    tokenType: TokenType.eth,
    lockValue: true
  };
  if (apps) {
    trReq.fromApp = 'ruby';
    trReq.toApp = 'nftrade';
  }
  return trReq;
}


export function generateConfigTokens(): interfaces.TokensMap {
  return {
    mainnet: {
      eth: {
        chains: [
          'staging-perfect-parallel-gacrux'
        ]
      }
    },
    'staging-perfect-parallel-gacrux': {
      'erc20': {
        "WRETH": {
          "address": "0xBA3f8192e28224790978794102C0D7aaa65B7d70",
          "name": "ETH",
          "symbol": "ETH",
          "cloneSymbol": "ETH",
          "wraps": {
            "address": "0xD2Aaa00700000000000000000000000000000000",
            "symbol": "ETH"
          }
        },
        "usdc": {
          "address": "0xBA3f8192e28224790978794102C0D7aaa65B7d70",
          "name": "usdc",
          "symbol": "usdc",
          "cloneSymbol": "usdc"
        }
      }
    }
  }
}


export function generateTransferRequestSteps(apps?: boolean) {
  return getTransferSteps(
    generateTransferRequest(apps) as interfaces.TransferParams,
    commonConfig as interfaces.MetaportConfig, getWidgetTheme(null), new TokenData(
      '',
      null,
      '',
      'test',
      null,
      null,
      null,
      null,
      TokenType.erc20,
      'ETHC',
      '0x0',
      null
    ))
}