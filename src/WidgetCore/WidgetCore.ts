import Web3 from 'web3';
// import { SChain } from '@skalenetwork/ima-js';

import sChainAbi from '../metadata/schianAbi.json';
import proxyEndpoints from '../metadata/proxy.json';


export function initSChain(network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const sChainWeb3 = new Web3(endpoint);
  return 1;
  // return new SChain(sChainWeb3, sChainAbi);
}


function getSChainEndpoint(network: string, sChainName: string): string {
  let proxyEndpoint = getProxyEndpoint(network);
  return proxyEndpoint + '/v1/' + sChainName;
}


function getProxyEndpoint(network: string) {
  // todo: add network validation
  return proxyEndpoints[network];
}
