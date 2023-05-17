import Web3 from 'web3';
import { soliditySha3, AbiItem } from 'web3-utils';

import debug from 'debug';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import sChainAbi from '../metadata/schainAbi.json';
import mainnetAbi from '../metadata/mainnetAbi.json';
import proxyEndpoints from '../metadata/proxy.json';
import {
  schainNetworkParams,
  mainnetNetworkParams,
  changeMetamaskNetwork,
  CHAIN_IDS
} from '../components/WalletConnector';


import erc20Abi from '../metadata/erc20_abi.json';
import erc721Abi from '../metadata/erc721_abi.json';
import erc721MetaAbi from '../metadata/erc721meta_abi.json';
import erc1155Abi from '../metadata/erc1155_abi.json';
import erc20WrapperAbi from '../metadata/erc20_wrapper_abi.json';
import sFuelWrapperAbi from '../metadata/sfuel_wrapper_abi.json';

import mainnetAddresses from '../metadata/addresses/mainnet.json';
import stagingAddresses from '../metadata/addresses/staging.json';
import staging3Addresses from '../metadata/addresses/staging3.json';
import legacyAddresses from '../metadata/addresses/legacy.json';

import { getChainName } from './helper';
import { MAINNET_CHAIN_NAME } from './constants';
import { MetaportConfig } from './interfaces';


const ERC_ABIS = {
  'erc20': erc20Abi,
  'erc20wrap': erc20WrapperAbi,
  'sfuelwrap': sFuelWrapperAbi,
  'erc721': erc721Abi,
  'erc721meta': erc721MetaAbi,
  'erc1155': erc1155Abi
}


debug.enable('*');
const log = debug('metaport:core:core');


export function initContract(tokenType: string, tokenAddress: string, web3: Web3) {
  return new web3.eth.Contract(ERC_ABIS[tokenType].abi as AbiItem[], tokenAddress);
}


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


export async function switchMetamaskNetwork( // TODO: use new function
  network: string,
  chainName: string,
  mainnetEndpoint: string,
  chainsMetadata: any
) {
  if (chainName === MAINNET_CHAIN_NAME) {
    return await initMainnetMetamask(network, mainnetEndpoint);
  } else {
    return await initSChainMetamask(network, chainName, chainsMetadata);
  }
}


export function getChainId(network: string, chainName: string): string { // TODO: use new function
  if (chainName === MAINNET_CHAIN_NAME) return CHAIN_IDS[network];
  return calcChainId(chainName);
}


export async function initSChainMetamask(network: string, schainName: string, chainsMetadata: any) {
  const endpoint = getSChainEndpoint(network, schainName);
  const chainId = calcChainId(schainName);
  const chainName = getChainName(chainsMetadata, schainName, network);
  const networkParams = schainNetworkParams(chainName, endpoint, chainId);
  await changeMetamaskNetwork(networkParams);
  const sChainWeb3 = new Web3(window.ethereum);
  return new SChain(sChainWeb3, sChainAbi);
}

export function updateWeb3SChain(schain: SChain, network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const sChainWeb3 = new Web3(endpoint);
  schain.updateWeb3(sChainWeb3);
}

export async function updateWeb3SChainMetamask(
  schain: SChain,
  network: string,
  schainName: string,
  chainsMetadata: any
): Promise<void> {
  const endpoint = getSChainEndpoint(network, schainName);
  const chainId = calcChainId(schainName);
  const chainName = getChainName(chainsMetadata, schainName, network);
  const networkParams = schainNetworkParams(chainName, endpoint, chainId);
  await changeMetamaskNetwork(networkParams);
  const sChainWeb3 = new Web3(window.ethereum);
  schain.updateWeb3(sChainWeb3);
}


export function updateWeb3Mainnet(mainnet: MainnetChain, mainnetEndpoint: string) {
  const web3 = new Web3(mainnetEndpoint);
  mainnet.updateWeb3(web3);
}


export async function updateWeb3MainnetMetamask(
  mainnet: MainnetChain,
  network: string,
  mainnetEndpoint: string
): Promise<void> {
  const networkParams = mainnetNetworkParams(network, mainnetEndpoint);
  await changeMetamaskNetwork(networkParams);
  const web3 = new Web3(window.ethereum);
  mainnet.updateWeb3(web3);
}


function getMainnetAbi(network: string) {
  if (network === 'staging') {
    return { ...mainnetAbi, ...stagingAddresses }
  }
  if (network === 'staging3') {
    return { ...mainnetAbi, ...staging3Addresses }
  }
  if (network === 'legacy') {
    return { ...mainnetAbi, ...legacyAddresses }
  }
  return { ...mainnetAbi, ...mainnetAddresses }
}


export function initMainnet(network: string, mainnetEndpoint: string): MainnetChain {
  const web3 = new Web3(mainnetEndpoint);
  return new MainnetChain(web3, getMainnetAbi(network));
}


export async function initMainnetMetamask(
  network: string,
  mainnetEndpoint: string
): Promise<MainnetChain> {
  const networkParams = mainnetNetworkParams(network, mainnetEndpoint);
  await changeMetamaskNetwork(networkParams);
  const web3 = new Web3(window.ethereum);
  return new MainnetChain(web3, getMainnetAbi(network));
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


//

export function initChainWeb3(config: MetaportConfig, chainName: string): Web3 {
  log(`Initializing web3 instance for ${chainName}`);
  const endpoint = getChainEndpoint(chainName, config.mainnetEndpoint, config.skaleNetwork);
  return initWeb3(endpoint);
}


export function initWeb3(endpoint: string) {
  const provider = new Web3.providers.HttpProvider(endpoint);
  return new Web3(provider);
}


export function getChainEndpoint(
  chainName: string,
  mainnetEndpoint: string,
  skaleNetwork: string
): string {
  if (chainName === MAINNET_CHAIN_NAME) {
    return mainnetEndpoint;
  }
  return getProxyEndpoint(skaleNetwork) + '/v1/' + chainName;
}