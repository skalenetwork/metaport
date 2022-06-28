import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import WidgetUI from '../WidgetUI'
import { initSChain, initSChainMetamask, initERC20, runTokenLookup } from '../WidgetCore'
import { SChain } from '@skalenetwork/ima-js';

import { connect, addListeners } from '../WalletConnector'

import defaultTokens from '../metadata/tokens.json'


export function Widget(props) {

  const [availableTokens, setAvailableTokens] = React.useState({'erc20': {}});

  const [address, setAddress] = React.useState(undefined);
  const [amount, setAmount] = React.useState<string>('');
  const [allowance, setAllowance] = React.useState<string>('');

  const [walletConnected, setWalletConnected] = React.useState(undefined);

  const [chain1, setChain1] = React.useState(undefined);
  const [chain2, setChain2] = React.useState(undefined);
  const [token, setToken] = React.useState(undefined);

  const [sChain1, setSChain1] = React.useState<SChain>(undefined);
  const [sChain2, setSChain2] = React.useState<SChain>(undefined);

  const [balance, setBalance] = React.useState(undefined);

  async function getTokenBalance() {
    console.log('getting token balance: ' + token);
    let tokenContract = sChain1.erc20.tokens[token];
    let balance = await sChain1.getERC20Balance(tokenContract, address);
    let balanceEther = sChain1.web3.utils.fromWei(balance);
    setBalance(balanceEther);
  }

  async function getTokenAllowance() {
    console.log('getting token allowance: ' + token);
    let tokenContract = sChain1.erc20.tokens[token];
    let allowance = await tokenContract.methods.allowance(
      address,
      sChain1.erc20.address
    ).call();
    let allowanceEther = sChain1.web3.utils.fromWei(allowance);
    setAllowance(allowanceEther);
  }

  useEffect(() => {
    setWalletConnected(false);
    addListeners(accountsChangedFallback);
  }, []);

  async function tokenLookup() {
    let tokens = await runTokenLookup(
      sChain1,
      chain1,
      sChain2,
      chain2,
      props.tokens
    );
    setAvailableTokens(tokens);
  }

  async function initSchain1() {
    setSChain1(await initSChainMetamask(
      props.network,
      chain1
    ))
  }

  useEffect(() => {
    if (chain1) {
      initSchain1()
      console.log('chain1 changed ' + chain1);
    }
  }, [chain1]);

  useEffect(() => {
    if (chain2) {
      setSChain2(initSChain(
        props.network,
        chain2
      ))
      console.log('chain2 changed ' + chain2);
    }
  }, [chain2]);

  useEffect(() => {
    // setBalance('');
    if (sChain1 && sChain2) {
      tokenLookup()
    }
  }, [sChain1]);


  useEffect(() => {
    setBalance('');
    if (sChain1 && token && availableTokens['erc20'][token] && address) {
      let tokenInfo = availableTokens['erc20'][token];
      sChain1.erc20.addToken(token, initERC20(tokenInfo, sChain1.web3));
      getTokenBalance();
      getTokenAllowance();
    }
  }, [token, availableTokens, address]);

  function accountsChangedFallback(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask!');
    } else {
      setAddress(accounts[0]);
      setWalletConnected(true);
    }
  }

  async function approveTransfer() {
    const amountWei = sChain1.web3.utils.toWei(amount);
    await sChain1.erc20.approve(token, amountWei, {address: address});
    getTokenAllowance();
  }

  async function transfer() {
    const amountWei = sChain1.web3.utils.toWei(amount);
    await sChain1.erc20.transferToSchain(
      chain2,
      availableTokens['erc20'][token]['originAddress'],
      amountWei,
      {address: address}
    );
    getTokenBalance();
  }

  function networkConnectFallback(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask!');
    }
    // todo: handle accounts in Metamask module

    setAddress(accounts[0]);
    setWalletConnected(true);
  }

  function connectMetamask() {
    console.log('connectMetamask...');
    connect(networkConnectFallback);
    console.log('Done: connectMetamask...');
  }

  return (<WidgetUI
    schains={props.schains}
    tokens={availableTokens}
    schainAliases={props.schainAliases}
    balance={balance}
    amount={amount}
    setAmount={setAmount}
    allowance={allowance}
    open={props.open}

    chain1={chain1}
    chain2={chain2}
    setChain1={setChain1}
    setChain2={setChain2}

    token={token}
    setToken={setToken}

    walletConnected={walletConnected}
    connectMetamask={connectMetamask}

    approveTransfer={approveTransfer}
    transfer={transfer}
  />)
}


class IMAWidget {
  constructor(params: any) {
    const widgetEl: HTMLElement = document.getElementById('ima-widget');  
    const root = createRoot(widgetEl);

    // params validation + transformation here

    if (params['chains']) {
      params['chainsFrom'] = params['chains'];
      params['chainsTo'] = params['chains'];
    }

    let tokens;
    if (params['tokens']) {
      tokens = params['tokens'];
    } else {
      tokens = defaultTokens[params['network']];
    }

    if (!params['chains']) {
      // todo: ALL network chains (request from proxy!)
    }

    root.render(
          <Widget
            tokens={tokens}
            schains={params['schains']}
            schainAliases={params['schainAliases']}
            open={params['open']}
            network={params['network']}
          />
    );
  }
}


export default IMAWidget;
