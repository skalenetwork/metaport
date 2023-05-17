import Web3 from 'web3';

export const CHAIN_IDS = {
  'staging': '0x4',
  'staging3': '0x5',
  'legacy': '0x5',
  'qatestnet': '0x4',
  'mainnet': '0x1'
}


export async function changeMetamaskNetwork(networkParams) {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkParams.chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkParams],
        });
        return [0, new Web3(window.ethereum)];
      } catch (addError) {
        return [1, addError];
      }
    }
    return [1, switchError];
  }
  return [0, new Web3(window.ethereum)];
}


export const connect = (connectFallback) => {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(connectFallback)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        // console.log('Please connect to MetaMask.');
      } else {
        // console.error(err);
      }
    });
}


export const addAccountChangedListener = (accountsChangedFallback) => {
  window.ethereum.on('accountsChanged', accountsChangedFallback); // todo: do only once!!!!
  window.ethereum
    .request({ method: 'eth_accounts' })
    .then(accountsChangedFallback)
    .catch((_) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      // console.error(err);
    });
}


export const addChainChangedListener = (chainChangedFallback) => {
  window.ethereum.on('chainChanged', chainChangedFallback);
}


export function schainNetworkParams(
  chainName: string,
  schainChainUrl: string,
  schainChainId: string
) {
  return {
    chainId: schainChainId,
    chainName: "[S] " + chainName,
    rpcUrls: [schainChainUrl],
    nativeCurrency: {
      name: "sFUEL",
      symbol: "sFUEL",
      decimals: 18
    }
  };
}


export function mainnetNetworkParams(network: string, mainnetEndpoint: string) {
  return {
    chainId: CHAIN_IDS[network],
    rpcUrls: [mainnetEndpoint],
  };
}
