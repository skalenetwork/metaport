import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import WidgetUI from '../WidgetUI'
import { initSChain, initSChainMetamask, initERC20, runTokenLookup } from '../WidgetCore'
import { SChain } from '@skalenetwork/ima-js';

import { connect, addListeners } from '../WalletConnector'

import defaultTokens from '../metadata/tokens.json'


export function Widget(props) {

  const [availableTokens, setAvailableTokens] = React.useState({'erc20': {}});

  const [open, setOpen] = React.useState(props.open);

  const [schains, setSchains] = React.useState([]);

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

  const [loading, setLoading] = React.useState(false);
  const [amountLocked, setAmountLocked] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const [loadingTokens, setLoadingTokens] = React.useState(false);

  async function getTokenBalance(tokenName) {
    console.log('getting token balance: ' + tokenName);
    let tokenContract = sChain1.erc20.tokens[tokenName];
    let balance = await sChain1.getERC20Balance(tokenContract, address);
    balanceEvent(tokenName, chain1, balance);
    return sChain1.web3.utils.fromWei(balance);
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
    setSchains(props.schains);
    addListeners(accountsChangedFallback);

    window.addEventListener(
      "requestTransfer",
      requestTransfer,
      false
    );

    window.addEventListener(
      "closeWidget",
      closeWidget,
      false
    );

    window.addEventListener(
      "openWidget",
      openWidget,
      false
    );

    window.addEventListener(
      "resetWidget",
      resetWidget,
      false
    );
  }, []);

  function updateBalanceHandler() { // todo: refactor
    window.addEventListener(
      "requestBalance",
      requestBalanceHandler,
      false
    );
    console.log("updateBalanceHandler done");
  }


  function closeWidget(e) {
    setOpen(false);
    console.log('closeWidget event processed')
  }

  function openWidget(e) {
    setOpen(true);
    console.log('openWidget event processed')
  }

  function resetWidget(e) {
    setAmount('');
    setLoading(false);
    setAmountLocked(false);
    setActiveStep(0);
    console.log('resetWidget event processed')
  }

  function requestTransfer(e) {
    setOpen(true);
    setAmountLocked(true);
    setAmount(e.detail.amount);
    setSchains(e.detail.schains);

    console.log("requestTransfer from: " + e.detail.schains[0], ", to: " + e.detail.schains[1]);
    console.log("amount inside react " + e.detail.amount);
  }

  async function tokenLookup() {
    setLoadingTokens(true);
    let tokens = await runTokenLookup(
      sChain1,
      chain1,
      sChain2,
      chain2,
      props.tokens
    );
    console.log('tokens tokens');
    console.log(tokens);
    await getTokenBalances(tokens);
    setAvailableTokens(tokens);
    updateBalanceHandler();
    setLoadingTokens(false);
  }

  async function emitBalanceEvent(schainName, tokenName) {
    console.log(chain1);
    if (schainName === chain1) {
      let tokenContract = sChain1.erc20.tokens[tokenName];
      let balance = await sChain1.getERC20Balance(tokenContract, address);
      return balanceEvent(tokenName, chain1, balance);
    }

    if (schainName === chain2) {
      let tokenContract = sChain2.erc20.tokens[tokenName]; // todo: check token exist!
      let balance = await sChain2.getERC20Balance(tokenContract, address);
      return balanceEvent(tokenName, chain2, balance);
    }
    console.log('Error: can request balance only for active chains!'); // todo: replace with error!
  }

  function requestBalanceHandler(e) {
    if (!sChain1 || !sChain2) {
      console.log('chains are not inited yet'); // todo: replace with error
    }
    emitBalanceEvent(e.detail.schainName, e.detail.tokenName);
  }

  async function getTokenBalances(tokens) {
    for (let [tokenName, tokenInfo] of Object.entries(tokens['erc20'])) {
      if (!sChain1.erc20.tokens[tokenName]) {
        addERC20Token(tokenName, tokenInfo);
      }
      let balance = await getTokenBalance(tokenName);
      tokens['erc20'][tokenName]['balance'] = balance;
    }
  }

  function addERC20Token(tokenName, tokenInfo) {
    if (tokenInfo.clone) {
      sChain1.erc20.addToken(tokenName, initERC20(tokenInfo.cloneAddress, sChain1.web3));
      sChain2.erc20.addToken(tokenName, initERC20(tokenInfo.originAddress, sChain2.web3));
    } else {
      sChain1.erc20.addToken(tokenName, initERC20(tokenInfo.originAddress, sChain1.web3));
      sChain2.erc20.addToken(tokenName, initERC20(tokenInfo.cloneAddress, sChain2.web3));
    }
  }

  async function initSchain1() {
    setSChain1(await initSChainMetamask(
      props.network,
      chain1
    ))
  }

  useEffect(() => {
    if (address && chain1) {
      initSchain1()
      console.log('chain1 changed ' + chain1);
    }
  }, [chain1, address]);

  useEffect(() => {
    if (address && chain2) {
      setSChain2(initSChain(
        props.network,
        chain2
      ))
      console.log('chain2 changed ' + chain2);
    }
  }, [chain2, address]);

  useEffect(() => {
    // const currentToken = token;

    if (sChain1 && sChain2) {
      // setAmount('');
      setToken(undefined);
      setLoading(false);
      setActiveStep(0);
      tokenLookup();
      // if (availableTokens['erc20'][currentToken]){
      //   setToken(currentToken);
      // }
    }
  }, [sChain1, sChain2]);


  useEffect(() => {
    setBalance('');
    if (sChain1 && token && availableTokens['erc20'][token] && address) {
      let tokenInfo = availableTokens['erc20'][token];
      addERC20Token(token, tokenInfo);
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
    
    let destTokenContract = sChain2.erc20.tokens[token];
    let balanceOnDestination = await sChain2.getERC20Balance(destTokenContract, address);
    
    await sChain1.erc20.transferToSchain(
      chain2,
      availableTokens['erc20'][token]['originAddress'],
      amountWei,
      {address: address}
    );
    console.log('Transfer transaction done, waiting for money to be received');
    await sChain2.waitERC20BalanceChange(destTokenContract, address, balanceOnDestination);
    console.log('Money to be received to destination chain');

    await getTokenBalances(availableTokens);
    setAvailableTokens(availableTokens);
    transferCompleteEvent();
  }

  function transferCompleteEvent() {
    var transferCompleteEvent = new CustomEvent(
      "transferComplete",
      {detail: {"tx": "0x1234"}} // todo
    );
    window.dispatchEvent(transferCompleteEvent);
    console.log('transferComplete event sent');
  }

  function balanceEvent(tokenName, schainName, balance) {
    var balanceEvent = new CustomEvent(
      "balanceEvent",
      {detail: {
        "tokenName": tokenName,
        "schainName": schainName,
        "balance": balance
      }}
    );
    window.dispatchEvent(balanceEvent);
    // console.log('balanceEvent event emitted: ', tokenName + ', schainName: ' + schainName + ', balance: ' + balance);
  }

  function emitConnectedEvent() {
    window.dispatchEvent(new CustomEvent("widgetConnected"));
  }

  function networkConnectFallback(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask!');
    }
    // todo: handle accounts in Metamask module

    setAddress(accounts[0]);
    setWalletConnected(true);
    emitConnectedEvent();
  }

  function connectMetamask() {
    console.log('connectMetamask...');
    connect(networkConnectFallback);
    emitConnectedEvent();
    console.log('Done: connectMetamask...');
  }

  return (<WidgetUI
    schains={schains}
    tokens={availableTokens}
    schainAliases={props.schainAliases}
    balance={balance}
    amount={amount}
    setAmount={setAmount}
    allowance={allowance}
    open={open}
    setOpen={setOpen}

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

    loading={loading}
    setLoading={setLoading}

    loadingTokens={loadingTokens}

    activeStep={activeStep}
    setActiveStep={setActiveStep}

    setAmountLocked={setAmountLocked}
    amountLocked={amountLocked}
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

  requestTransfer(params) {
    var requestTransferEvent = new CustomEvent(
      "requestTransfer",
      {detail: {
        "amount": params.amount,
        "schains": params.schains
      }}
    );
    window.dispatchEvent(requestTransferEvent);
    console.log('requestTransfer event sent -> amount: ' + params.amount);
  }

  close() {
    window.dispatchEvent(new CustomEvent("closeWidget"));
    console.log('closeWidget event sent');
  }

  open() {
    window.dispatchEvent(new CustomEvent("openWidget"));
    console.log('openWidget event sent');
  }

  reset() {
    window.dispatchEvent(new CustomEvent("resetWidget"));
    console.log('resetWidget event sent');
  }

  requestBalance(schainName, tokenName) {
    window.dispatchEvent(new CustomEvent(
      "requestBalance",
      {
        detail: {
          "schainName": schainName,
          "tokenName": tokenName
        }
      }
    ));
  }

}


export default IMAWidget;
