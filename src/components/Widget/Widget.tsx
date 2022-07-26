import React, { useEffect } from 'react';

import WidgetUI from '../WidgetUI'
import {
  initSChain,
  initSChainMetamask,
  initMainnet,
  initMainnetMetamask,
  initERC20
} from '../../core'
import { getAvailableTokens } from '../../core/tokens';
import { MainnetChain, SChain } from '@skalenetwork/ima-js';

import { connect, addListeners } from '../WalletConnector'
import { internalEvents } from '../../core/events';
import { MAINNET_CHAIN_NAME } from '../../core/constants';
import { isChainMainnet, getActionName, getActionSteps } from '../../core/actions';


export function Widget(props) {

  const [extTokens, setExtTokens] = React.useState({'erc20': {}});
  const [availableTokens, setAvailableTokens] = React.useState({'erc20': {}});

  const [open, setOpen] = React.useState(props.open);

  const [schains, setSchains] = React.useState([]);

  const [address, setAddress] = React.useState(undefined);
  const [amount, setAmount] = React.useState<string>('');
  const [allowance, setAllowance] = React.useState<string>('');

  const [walletConnected, setWalletConnected] = React.useState(undefined);

  const [chainName1, setChainName1] = React.useState(undefined);
  const [chainName2, setChainName2] = React.useState(undefined);

  const [token, setToken] = React.useState(undefined);

  const [sChain1, setSChain1] = React.useState<SChain>(undefined);
  const [sChain2, setSChain2] = React.useState<SChain>(undefined);

  const [mainnetEndpoint, setMainnetEndpoint] = React.useState<string>(undefined);
  const [mainnet, setMainnet] = React.useState<MainnetChain>(undefined);

  const [balance, setBalance] = React.useState(undefined);

  const [loading, setLoading] = React.useState(false);
  const [amountLocked, setAmountLocked] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [actionSteps, setActionSteps] = React.useState(undefined);

  const [loadingTokens, setLoadingTokens] = React.useState(false);

  const [theme, setTheme] = React.useState(props.theme);

  async function getTokenBalance(tokenSymbol) {
    console.log('getting token balance: ' + tokenSymbol);
    let tokenContract = sChain1.erc20.tokens[tokenSymbol];
    let balance = await sChain1.getERC20Balance(tokenContract, address);
    internalEvents.balance(tokenSymbol, chainName1, balance);
    return sChain1.web3.utils.fromWei(balance);
  }
  
  useEffect(() => {
    setWalletConnected(false);
    setSchains(props.schains);
    setMainnetEndpoint(props.mainnetEndpoint);
    setExtTokens(props.tokens);
    addListeners(accountsChangedFallback);
    addExternalEventsListeners();
  }, []);

  function addExternalEventsListeners() {
    window.addEventListener("metaport_updateParams", updateParamsHandler, false);
    window.addEventListener("metaport_requestTransfer", requestTransfer, false);
    window.addEventListener("metaport_close", closeWidget, false);
    window.addEventListener("metaport_open", openWidget, false);
    window.addEventListener("metaport_reset",resetWidget, false);
    window.addEventListener("metaport_setTheme", handleSetTheme, false);
  }

  function handleSetTheme(e){
    setTheme(e.detail.theme);
  }

  function updateBalanceHandler() { // todo: refactor
    window.addEventListener("metaport_requestBalance", requestBalanceHandler, false);
    console.log("updateBalanceHandler done");
  }

  function closeWidget(e) {
    setOpen(false);
    setActiveStep(0);
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

    if (e.detail.tokens) {
      setExtTokens(e.detail.tokens);
    }

    console.log("requestTransfer from: " + e.detail.schains[0], ", to: " + e.detail.schains[1]);
    console.log("amount inside react " + e.detail.amount);
  }

  function updateParamsHandler(e){
    if (e.detail.schains) {
      setSchains(e.detail.schains);
    }
    if (e.detail.tokens) {
      setExtTokens(e.detail.tokens);
    }
  }

  async function tokenLookup() {
    setLoadingTokens(true);
    let tokens = await getAvailableTokens(
      mainnet,
      sChain1,
      sChain2,
      chainName1,
      chainName2,
      extTokens
    );
    await getTokenBalances(tokens);
    setAvailableTokens(tokens);
    updateBalanceHandler();
    setLoadingTokens(false);
  }

  async function updateTokenBalances() {
    let tokens = availableTokens;
    await getTokenBalances(tokens);
    setAvailableTokens(tokens);
  }

  async function emitBalanceEvent(schainName, tokenSymbol) {
    if (schainName === chainName1) {
      let tokenContract = sChain1.erc20.tokens[tokenSymbol];
      let balance = await sChain1.getERC20Balance(tokenContract, address);
      return internalEvents.balance(tokenSymbol, chainName1, balance);
    }

    if (schainName === chainName2) {
      let tokenContract = sChain2.erc20.tokens[tokenSymbol]; // todo: check token exist!
      let balance = await sChain2.getERC20Balance(tokenContract, address);
      return internalEvents.balance(tokenSymbol, chainName2, balance);
    }
    console.log('Error: can request balance only for active chains!'); // todo: replace with error!
  }

  function requestBalanceHandler(e) {
    if (!sChain1 || !sChain2) {
      console.log('chains are not inited yet'); // todo: replace with error
    }
    emitBalanceEvent(e.detail.schainName, e.detail.tokenSymbol);
  }

  async function getTokenBalances(tokens) {
    for (let [tokenSymbol, tokenData] of Object.entries(tokens['erc20'])) {
      let balance = await getTokenBalance(tokenSymbol);
      tokens['erc20'][tokenSymbol]['balance'] = balance;

      if (tokenData['unwrappedSymbol'] && !tokenData['clone']) {
        let balance = await getTokenBalance(tokenData['unwrappedSymbol']);
        tokens['erc20'][tokenSymbol]['unwrappedBalance'] = balance;
      }
    }
    if (tokens['eth']) {
      let ethBalance = isChainMainnet(chainName1) ? await mainnet.ethBalance(address) : await sChain1.ethBalance(address);
      internalEvents.balance('eth', chainName1, ethBalance);
      tokens.eth.balance = mainnet ? mainnet.web3.utils.fromWei(ethBalance) : sChain1.web3.utils.fromWei(ethBalance); // todo: fix!
    }
  }

  async function initSchain1() {
    setSChain1(await initSChainMetamask(
      props.network,
      chainName1
    ))
  }

  async function initMainnet1() {
    setMainnet(await initMainnetMetamask(props.network, mainnetEndpoint))
  }

  async function switchMetamaskChain() {
    if (chainName1 === MAINNET_CHAIN_NAME) {
      return
    };
    if (chainName2 === MAINNET_CHAIN_NAME) {
      return
    };
    let chain1 = initSChain(
      props.network,
      chainName1
    );
    let chain2 = await initSChainMetamask(
      props.network,
      chainName2
    );

    setSChain1(chain1);
    setSChain2(chain2);

    await tokenLookup();

    return [sChain1, sChain2];
  }

  useEffect(() => {
    if (address && chainName1) {
      if (chainName1 == MAINNET_CHAIN_NAME) {
        initMainnet1();
      } else {
        initSchain1();
      }
    }
  }, [chainName1, address]);

  useEffect(() => {
    if (address && chainName2) {
      if (chainName2 == MAINNET_CHAIN_NAME) {
        setMainnet(initMainnet(mainnetEndpoint))
      } else {
        setSChain2(initSChain(
          props.network,
          chainName2
        ));
      }
      console.log('chain2 changed ' + chainName2);
    }
  }, [chainName2, address]);

  useEffect(() => {
    if (((sChain1 && sChain2) || (sChain1 && mainnet) || (mainnet && sChain2)) && extTokens) {
      internalEvents.connected();
      setToken(undefined);
      setLoading(false);
      setActiveStep(0);
      tokenLookup();
    }
  }, [sChain1, sChain2, mainnet, extTokens]);

  useEffect(() => {
    setActiveStep(0);
  }, [token]);

  useEffect(() => {
    let actionName = getActionName(chainName1, chainName2, token);
    if (actionName && availableTokens['erc20'] && availableTokens['erc20'][token]) {
      setActionSteps(getActionSteps(actionName, availableTokens['erc20'][token]));
    }
    if (actionName && availableTokens['eth']) {
      setActionSteps(getActionSteps(actionName, availableTokens['eth']));
    }
  }, [chainName1, chainName2, token, availableTokens]);

  useEffect(() => {
    runPreAction();
  }, [actionSteps, activeStep, token, address, amount]);

  async function runPreAction() {
    if (actionSteps && actionSteps[activeStep]) {
      const ActionClass = actionSteps[activeStep];
      await new ActionClass(
        mainnet,
        sChain1,
        sChain2,
        chainName1,
        chainName2,
        address,
        amount,
        token,
        availableTokens['erc20'][token],
        switchMetamaskChain,
        setActiveStep,
        activeStep
      ).preAction();
    }
  }

  function accountsChangedFallback(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask!');
    } else {
      setAddress(accounts[0]);
      setWalletConnected(true);
    }
  }

  const handleNextStep = async () => {
    setLoading(true);
    const ActionClass = actionSteps[activeStep];
    await new ActionClass(
      mainnet,
      sChain1,
      sChain2,
      chainName1,
      chainName2,
      address,
      amount,
      token,
      availableTokens['erc20'][token],
      switchMetamaskChain
    ).execute();
    await updateTokenBalances();
    setLoading(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  function networkConnectFallback(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask!');
    }
    // todo: handle accounts in Metamask module

    setAddress(accounts[0]);
    setWalletConnected(true);
    internalEvents.connected();
  }

  function connectMetamask() {
    console.log('connectMetamask...');
    connect(networkConnectFallback);
    internalEvents.connected();
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

    chain1={chainName1}
    chain2={chainName2}
    setChain1={setChainName1}
    setChain2={setChainName2}

    token={token}
    setToken={setToken}

    walletConnected={walletConnected}
    connectMetamask={connectMetamask}

    loading={loading}
    setLoading={setLoading}

    loadingTokens={loadingTokens}

    activeStep={activeStep}
    setActiveStep={setActiveStep}

    actionSteps={actionSteps}
    handleNextStep={handleNextStep}

    setAmountLocked={setAmountLocked}
    amountLocked={amountLocked}

    theme={theme}
  />)
}