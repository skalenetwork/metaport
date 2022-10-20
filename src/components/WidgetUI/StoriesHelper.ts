import { getActionSteps } from '../../core/actions';
import TokenData from '../../core/dataclasses/TokenData';
import { TokenType } from '../../core/dataclasses/TokenType';
import { getEmptyTokenDataMap } from '../../core/tokens/helper';
function setMock() { return };


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}


export const commonProps = {
  schains: ['aaa-chain', 'bbb-chain'],
  chainsMetadata: {
    'aaa-chain': {
      alias: 'Europa SKALE Chain', // optional
      minSfuelWei: '27000000000000', // optional
      faucetUrl: 'https://github.com/skalenetwork/skale-network' // optional
    },
    'bbb-chain': {
      alias: 'Block Brawlers'
    }
  },
  open: true,
  openButton: true,
  chain1: 'aaa-chain',
  chain2: 'bbb-chain',
  setChain1: setMock,
  setChain2: setMock,
  setToken: setMock,
  setLoading: setMock,
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
    TokenType.erc20,
    null,
    null
  ))
}


export function generateTokenData(tokenSymbol, tokenName, wrapped = false) {
  const data = {
    token: tokenSymbol,
    amount: getRandomInt(1000, 10000),
    availableTokens: getEmptyTokenDataMap()
  }
  data.availableTokens.erc20[tokenSymbol] = new TokenData(
    '0x0',
    '0x0',
    tokenName,
    tokenSymbol,
    false,
    undefined,
    '18',
    TokenType.erc20,
    undefined,
    undefined
  );
  if (wrapped) {
    data.availableTokens.erc20[tokenSymbol].unwrappedBalance = getRandomInt(10000, 70000).toString();
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
    false,
    undefined,
    undefined,
    TokenType.erc721,
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
    false,
    undefined,
    '18',
    TokenType.erc1155,
    undefined,
    undefined
  );
  // data.availableTokens.erc1155[tokenSymbol].balance = getRandomInt(10000, 70000).toString();
  data.token = data.availableTokens.erc1155[tokenSymbol];
  return data;
}

export const defaultERC1155TokenData = generateERC1155TokenData('XEM', 'SKALIENS');