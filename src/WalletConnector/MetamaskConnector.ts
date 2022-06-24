import Web3 from 'web3';


export async function changeMetamaskNetwork(networkParams) {
    try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: networkParams.chainId}],
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
