import React, { useEffect } from 'react';

import WidgetUI from '../WidgetUI'
import {
  initSChain,
  initSChainMetamask,
  initMainnet,
  initMainnetMetamask,
  initERC20,
  updateWeb3SChain,
  updateWeb3SChainMetamask
} from '../../core'
import { getAvailableTokens, getTokenBalances } from '../../core/tokens';
import { MainnetChain, SChain } from '@skalenetwork/ima-js';

import { connect, addListeners } from '../WalletConnector'
import { externalEvents } from '../../core/events';
import { MAINNET_CHAIN_NAME } from '../../core/constants';
import { getActionName, getActionSteps } from '../../core/actions';
import { getSFuelData } from '../../core/sfuel';


export function Widget(props) {

  const [extTokens, setExtTokens] = React.useState({ 'erc20': {} });
  const [availableTokens, setAvailableTokens] = React.useState({ 'erc20': {} });

  const [open, setOpen] = React.useState(props.open);

  const [schains, setSchains] = React.useState([]);

  const [address, setAddress] = React.useState(undefined);
  const [amount, setAmount] = React.useState<string>('');

  const [walletConnected, setWalletConnected] = React.useState(undefined);

  const [chainName1, setChainName1] = React.useState(undefined);
  const [chainName2, setChainName2] = React.useState(undefined);

  const [token, setToken] = React.useState(undefined);

  const [sChain1, setSChain1] = React.useState<SChain>(undefined);
  const [sChain2, setSChain2] = React.useState<SChain>(undefined);

  const [mainnetEndpoint, setMainnetEndpoint] = React.useState<string>(undefined);
  const [mainnet, setMainnet] = React.useState<MainnetChain>(undefined);

  const [loading, setLoading] = React.useState(false);
  const [amountLocked, setAmountLocked] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [actionSteps, setActionSteps] = React.useState(undefined);

  const [loadingTokens, setLoadingTokens] = React.useState(false);

  const [theme, setTheme] = React.useState(props.theme);

  const [sFuelData1, setSFuelData1] = React.useState(undefined);
  const [sFuelData2, setSFuelData2] = React.useState(undefined);

  useEffect(() => {
    setWalletConnected(false);
    setSchains(props.chains);
    setMainnetEndpoint(props.mainnetEndpoint);
    setExtTokens(props.tokens);
    addListeners(accountsChangedFallback);
    addinternalEventsListeners();
  }, []);

  function addinternalEventsListeners() {
    window.addEventListener("_metaport_transfer", requestTransfer, false);
    window.addEventListener("_metaport_unwrap", unwrap, false);

    window.addEventListener("_metaport_updateParams", updateParamsHandler, false);
    window.addEventListener("_metaport_close", closeWidget, false);
    window.addEventListener("_metaport_open", openWidget, false);
    window.addEventListener("_metaport_reset", resetWidget, false);
    window.addEventListener("_metaport_setTheme", handleSetTheme, false);
  }

  function unwrap(e) {
    // todo
    e.detail.amount
    e.detail.token
  }

  function handleSetTheme(e) {
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
    setChainName1(null);
    setChainName2(null);

    setSChain1(null);
    setSChain2(null);
    setMainnet(null);

    setAmount('');
    setLoading(false);
    setToken(null);
    setAmountLocked(false);
    setActiveStep(0);
    setActionSteps(undefined);
    console.log('resetWidget event processed')
  }

  function requestTransfer(e) {
    setOpen(true);
    setAmount(e.detail.amount);
    setSchains(e.detail.schains);
    setAmountLocked(!!e.detail.lockAmount);

    if (e.detail.tokens) {
      setExtTokens(e.detail.tokens);
    }

    console.log("requestTransfer from: " + e.detail.schains[0], ", to: " + e.detail.schains[1]);
    console.log("amount inside react " + e.detail.amount);
  }

  function updateParamsHandler(e) {
    if (e.detail.chains) {
      setSchains(e.detail.chains);
    }
    if (e.detail.tokens) {
      setExtTokens(e.detail.tokens);
    }
    console.log('params updated');
    console.log(e.detail.chains);
  }

  async function tokenLookup() {
    setLoadingTokens(true);
    let tokens = await getAvailableTokens(
      mainnet,
      sChain1,
      sChain2,
      chainName1,
      chainName2,
      extTokens,
      false
    );
    await getTokenBalances(
      tokens,
      chainName1,
      mainnet,
      sChain1,
      token,
      address
    );
    setAvailableTokens(tokens);
    updateBalanceHandler();
    setLoadingTokens(false);
  }

  async function updateTokenBalances() {
    let tokens = availableTokens;
    await getTokenBalances(
      tokens,
      chainName1,
      mainnet,
      sChain1,
      token,
      address
    );

    console.log("getTokenBalances -> ->");
    console.log(availableTokens);

    setAvailableTokens(tokens);
  }

  async function emitBalanceEvent(schainName, tokenSymbol) {
    if (schainName === chainName1) {
      let tokenContract = sChain1.erc20.tokens[tokenSymbol];
      let balance = await sChain1.getERC20Balance(tokenContract, address);
      return externalEvents.balance(tokenSymbol, chainName1, balance);
    }

    if (schainName === chainName2) {
      let tokenContract = sChain2.erc20.tokens[tokenSymbol]; // todo: check token exist!
      let balance = await sChain2.getERC20Balance(tokenContract, address);
      return externalEvents.balance(tokenSymbol, chainName2, balance);
    }
    console.log('Error: can request balance only for active chains!'); // todo: replace with error!
  }

  function requestBalanceHandler(e) {
    if (!sChain1 || !sChain2) {
      console.log('chains are not inited yet'); // todo: replace with error
    }
    emitBalanceEvent(e.detail.schainName, e.detail.tokenSymbol);
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

    updateWeb3SChain(sChain1, props.network, chainName1);
    await updateWeb3SChainMetamask(sChain2, props.network, chainName2);
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
      externalEvents.connected();
      initSFuelData();
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
  }, [actionSteps, activeStep, amount]);

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
    externalEvents.connected();
  }

  function connectMetamask() {
    console.log('connectMetamask...');
    connect(networkConnectFallback);
    externalEvents.connected();
    console.log('Done: connectMetamask...');
  }

  async function initSFuelData() {
    if (sChain1) {
      setSFuelData1(await getSFuelData(
        props.chainsMetadata,
        chainName1,
        sChain1.web3,
        address
      ));
    }
    if (sChain2) {
      setSFuelData2(await getSFuelData(
        props.chainsMetadata,
        chainName2,
        sChain2.web3,
        address
      ));
    }
  }

  return (<WidgetUI
    schains={schains}
    tokens={availableTokens}
    chainsMetadata={props.chainsMetadata}
    amount={amount}
    setAmount={setAmount}

    open={open}
    openButton={props.openButton}
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

    sFuelData1={sFuelData1}
    sFuelData2={sFuelData2}

    theme={theme}
  />)
}