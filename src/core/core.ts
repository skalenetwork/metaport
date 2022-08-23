import Web3 from 'web3';
import { soliditySha3, AbiItem } from 'web3-utils';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import sChainAbi from '../metadata/schianAbi.json';
import mainnetAbi from '../metadata/mainnetAbi.json';
import proxyEndpoints from '../metadata/proxy.json';
import {
  schainNetworkParams,
  mainnetNetworkParams,
  changeMetamaskNetwork
} from '../components/WalletConnector';


import erc20Abi from '../metadata/erc20_abi.json';
import erc20WrapperAbi from '../metadata/erc20_wrapper_abi.json';


export function initERC20(tokenAddress: string, web3: Web3) {
  return new web3.eth.Contract(erc20Abi.abi as AbiItem[], tokenAddress);
}


export function initERC20Wrapper(tokenAddress: string, web3: Web3) {
  return new web3.eth.Contract(erc20WrapperAbi.abi as AbiItem[], tokenAddress);
}


export function initSChain(network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const sChainWeb3 = new Web3(endpoint);
  return new SChain(sChainWeb3, sChainAbi);
}


export async function initSChainMetamask(network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const chainId = calcChainId(schainName);
  const networkParams = schainNetworkParams(schainName, endpoint, chainId);
  await changeMetamaskNetwork(networkParams);
  const sChainWeb3 = new Web3(window.ethereum);
  return new SChain(sChainWeb3, sChainAbi);
}

export function updateWeb3SChain(schain: SChain, network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const sChainWeb3 = new Web3(endpoint);
  schain.updateWeb3(sChainWeb3);
}

export async function updateWeb3SChainMetamask(schain: SChain, network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const chainId = calcChainId(schainName);
  const networkParams = schainNetworkParams(schainName, endpoint, chainId);
  await changeMetamaskNetwork(networkParams);
  const sChainWeb3 = new Web3(window.ethereum);
  schain.updateWeb3(sChainWeb3);
}


export function initMainnet(mainnetEndpoint: string): MainnetChain {
  const web3 = new Web3(mainnetEndpoint);
  return new MainnetChain(web3, mainnetAbi);
}


export async function initMainnetMetamask(network: string, mainnetEndpoint: string): Promise<MainnetChain> {
  const networkParams = mainnetNetworkParams(network, mainnetEndpoint);
  await changeMetamaskNetwork(networkParams);
  const web3 = new Web3(window.ethereum);
  return new MainnetChain(web3, mainnetAbi);
}


function getSChainEndpoint(network: string, sChainName: string): string {
  return getProxyEndpoint(network) + '/v1/' + sChainName;
}


function getProxyEndpoint(network: string) {
  // todo: add network validation
  return proxyEndpoints[network];
}


function calcChainId(sChainName) {
  let h = soliditySha3(sChainName);
  h = remove0x(h).toLowerCase();
  while (h.length < 64)
    h = "0" + h;
  h = h.substr(0, 13);
  h = h.replace(/^0+/, '');
  return "0x" + h;
}


export function remove0x(s: any) {
  if (!s.startsWith('0x')) return s;
  return s.slice(2);
}
