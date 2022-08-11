import { getActionSteps } from '../../core/actions';
import { TokenData } from '../../core/tokens';

function setMock() {}


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
  chain1: 'aaa-chain',
  chain2: 'bbb-chain',
  setChain1: setMock,
  setChain2: setMock,
  setToken: setMock,
  setLoading: setMock,
  setActiveStep: () => {},
  walletConnected: true,
  actionSteps: getActionSteps('erc20_s2s', new TokenData(
    '',
    null,
    '',
    true,
    null,
    null,
    null
  ))
}


export function generateTokenData(tokenSymbol, tokenName, wrapped=false) {
  let data = {
    token: tokenSymbol,
    amount: getRandomInt(1000, 10000),
    tokens: {
      "erc20": {
      }
    }
  }
  data.tokens.erc20[tokenSymbol] = {
    "name": tokenName,
    "address": "0x0",
    "balance": getRandomInt(10000, 70000)
  }

  if (wrapped) {
    data.tokens.erc20[tokenSymbol]["unwrappedBalance"] = getRandomInt(10000, 70000);
    data.tokens.erc20[tokenSymbol]["unwrappedSymbol"] = 'u' + tokenSymbol;
  }
  return data;
}

export const defaultTokenData = generateTokenData('usdt', 'Tether');
