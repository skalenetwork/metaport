import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { SChain } from '@skalenetwork/ima-js';

import sChainAbi from '../metadata/schianAbi.json';
import proxyEndpoints from '../metadata/proxy.json';

const erc20Abi = require('../metadata/erc20_abi.json');


const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';


export function initERC20(token: any, web3: Web3) {
  return new web3.eth.Contract(erc20Abi.abi, token['address']);
}


export function initSChain(network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const sChainWeb3 = new Web3(endpoint);
  return new SChain(sChainWeb3, sChainAbi);
}


function getSChainEndpoint(network: string, sChainName: string): string {
  let proxyEndpoint = getProxyEndpoint(network);
  return proxyEndpoint + '/v1/' + sChainName;
}


function getProxyEndpoint(network: string) {
  // todo: add network validation
  return proxyEndpoints[network];
}


async function addToken(
  availableTokens,
  sChain,
  sChainName,
  token,
  tokenSymbol,
  fromChain
) {

  console.log('token token token');
  console.log(token);

  let tokenCloneAddress = await sChain.erc20.getTokenCloneAddress(
    token['address'],
    sChainName
  );
  if (tokenCloneAddress == ZERO_ADDRESS) return;

  if (fromChain) {
    availableTokens[tokenSymbol] = {
      'address': token['address'],
      'name': token['name'],
      'clone': false
    };
  } else {
    availableTokens[tokenSymbol] = {
      'address': tokenCloneAddress,
      'name': token['name'],
      'clone': true
    };
  } 
}

export async function runTokenLookup(
  sChain1: SChain,
  sChain1Name: string,
  sChain2: SChain,
  sChain2Name: string,
  tokens: Object
) {
  console.log('Running tokens lookup...');
  let availableTokens = {};
  if (tokens[sChain1Name]) {
    for (const tokenSymbol in tokens[sChain1Name]['erc20']) {  
      await addToken(
        availableTokens,
        sChain2,
        sChain1Name,
        tokens[sChain1Name]['erc20'][tokenSymbol],
        tokenSymbol,
        true
      )
    }
  }
  if (tokens[sChain2Name]) {
    for (const tokenSymbol in tokens[sChain2Name]['erc20']) {  
      await addToken(
        availableTokens,
        sChain1,
        sChain2Name,
        tokens[sChain2Name]['erc20'][tokenSymbol],
        tokenSymbol,
        false
      )
    }
  }
  return {'erc20': availableTokens};
}
