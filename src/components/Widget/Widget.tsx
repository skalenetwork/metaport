import React, { useEffect } from 'react';
import debug from 'debug';

import WidgetUI from '../WidgetUI';
import { WrongNetworkMessage, TransactionErrorMessage, CustomErrorMessage } from '../ErrorMessage';

import {
  initSChain,
  initSChainMetamask,
  initMainnet,
  initMainnetMetamask,
  updateWeb3SChain,
  updateWeb3SChainMetamask,
  getChainId
} from '../../core';


import { getAvailableTokens, getTokenBalances } from '../../core/tokens/index';
import { getWrappedTokens } from '../../core/tokens/erc20';
import { getEmptyTokenDataMap, getDefaultToken } from '../../core/tokens/helper';
import { MainnetChain, SChain } from '@skalenetwork/ima-js';

import { connect, addAccountChangedListener, addChainChangedListener } from '../WalletConnector'
import { externalEvents } from '../../core/events';
import { MAINNET_CHAIN_NAME, DEFAULT_ERROR_MSG } from '../../core/constants';
import { getActionName, getActionSteps } from '../../core/actions';
import { ActionType } from '../../core/actions/action';
import { getSFuelData } from '../../core/sfuel';

import * as interfaces from '../../core/interfaces/index';
import TokenData from '../../core/dataclasses/TokenData';
import { OperationType } from '../../core/dataclasses/OperationType';


debug.enable('*');
const log = debug('metaport:Widget');


export function Widget(props) {

  const [configTokens, setConfigTokens] = React.useState<interfaces.TokensMap>(undefined);
  const [availableTokens, setAvailableTokens] = React.useState<interfaces.TokenDataTypesMap>(
    getEmptyTokenDataMap()
  );
  const [wrappedTokens, setWrappedTokens] = React.useState<interfaces.TokenDataTypesMap>(
    getEmptyTokenDataMap()
  );
  const [token, setToken] = React.useState<TokenData>(undefined);

  const [firstOpen, setFirstOpen] = React.useState(props.open);
  const [open, setOpen] = React.useState(props.open);

  const [schains, setSchains] = React.useState([]);

  const [address, setAddress] = React.useState(undefined);
  const [amount, setAmount] = React.useState<string>('');
  const [tokenId, setTokenId] = React.useState<number | null>(undefined);

  const [walletConnected, setWalletConnected] = React.useState(undefined);

  const [chainName1, setChainName1] = React.useState(undefined);
  const [chainName2, setChainName2] = React.useState(undefined);

  const [chainId, setChainId] = React.useState(undefined);
  const [extChainId, setExtChainId] = React.useState(undefined);

  const [errorMessage, setErrorMessage] = React.useState(undefined);
  const [amountErrorMessage, setAmountErrorMessage] = React.useState<string>(undefined);

  const [sChain1, setSChain1] = React.useState<SChain>(undefined);
  const [sChain2, setSChain2] = React.useState<SChain>(undefined);

  const [mainnetEndpoint, setMainnetEndpoint] = React.useState<string>(undefined);
  const [mainnet, setMainnet] = React.useState<MainnetChain>(undefined);

  const [loading, setLoading] = React.useState(false);
  const [amountLocked, setAmountLocked] = React.useState(false);
  const [actionBtnDisabled, setActionBtnDisabled] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [actionName, setActionName] = React.useState<string>(undefined);
  const [actionSteps, setActionSteps] = React.useState(undefined);

  const [operationType, setOperationType] = React.useState<OperationType>(OperationType.transfer);

  const [loadingTokens, setLoadingTokens] = React.useState(false);

  const [theme, setTheme] = React.useState(props.theme);

  const [sFuelData1, setSFuelData1] = React.useState(undefined);
  const [sFuelData2, setSFuelData2] = React.useState(undefined);

  const [transferRequest, setTransferRequest] = React.useState<interfaces.TransferParams>(undefined);

  useEffect(() => {
    setWalletConnected(false);
    setSchains(props.chains);
    setMainnetEndpoint(props.mainnetEndpoint);
    setConfigTokens(props.tokens);
    addAccountChangedListener(accountsChangedFallback);
    addChainChangedListener(chainChangedFallback);
    addinternalEventsListeners();
  }, []);

  function addinternalEventsListeners() {
    window.addEventListener("_metaport_transfer", transferHandler, false);
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
    log("updateBalanceHandler done");
  }

  function closeWidget(e) {
    setOpen(false);
    setActiveStep(0);
    setAmountLocked(false);
    log('closeWidget event processed');
  }

  function openWidget(e) {
    setOpen(true);
    setAmountLocked(false);
    log('openWidget event processed');
  }

  function resetWidget(e) {
    setChainName1(null);
    setChainName2(null);

    setSChain1(null);
    setSChain2(null);
    setMainnet(null);

    setAmount('');
    setLoading(false);
    setToken(undefined);
    setAmountLocked(false);
    setActiveStep(0);
    setActionSteps(undefined);
    setActionName(undefined)
    setAmountErrorMessage(undefined);
    setActionBtnDisabled(false);
    log('resetWidget event processed');
  }

  function transferHandler(e) {
    const params: interfaces.TransferParams = e.detail;
    setTransferRequest(params);
  }

  function transfer(params: interfaces.TransferParams): void {
    log('Transfer request');
    log(params);
    setOpen(true);
    setAmountLocked(!!params.lockValue);
    if (params.chains) {
      if (params.chains.length != 2) {
        log(`Incorrect number of chains: ${params.chains.length} (must be 2)`);
        setErrorMessage(new CustomErrorMessage('Incorrect number of chains'));
        return
      }
      if (!schains.includes(params.chains[0]) || !schains.includes(params.chains[1])) {
        setErrorMessage(new CustomErrorMessage(`Reqested chains are not found in the list: ${params.chains}`));
        return
      }
      if (chainName1 == params.chains[0] && chainName2 == params.chains[1]) {
        finishTransferRequest();
      } else {
        setChainName1(params.chains[0]);
        setChainName2(params.chains[1]);
      }
    }
  }

  function updateParamsHandler(e) {
    if (e.detail.chains) {
      setSchains(e.detail.chains);
    }
    if (e.detail.tokens) {
      setConfigTokens(e.detail.tokens);
    }
    log('params updated');
    log(e.detail.chains);
  }

  async function tokenLookup() {
    setLoadingTokens(true);
    try {
      let tokens = await getAvailableTokens(
        mainnet,
        sChain1,
        sChain2,
        chainName1,
        chainName2,
        configTokens,
        props.autoLookup
      );
      await getTokenBalances(
        tokens,
        chainName1,
        mainnet,
        sChain1,
        address
      );
      setAvailableTokens(tokens);
    } catch (err) {
      log('_MP_ERROR: tokenLookup failed');
      log(err);
    }

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
      address
    );
    setAvailableTokens(tokens);
    checkWrappedTokens();
  }

  async function emitBalanceEvent(schainName, tokenSymbol) {
    if (schainName === chainName1) {
      let tokenContract = sChain1.erc20.tokens[tokenSymbol];
      let balance = await sChain1.getERC20Balance(tokenContract, address);
      return externalEvents.balance(tokenSymbol, chainName1, balance);
    }

    if (schainName === chainName2) {
      let tokenContract = sChain2.erc20.tokens[tokenSymbol]; // TODO: check token exist!
      let balance = await sChain2.getERC20Balance(tokenContract, address);
      return externalEvents.balance(tokenSymbol, chainName2, balance);
    }
    console.error('_MP_ERROR: can request balance only for active chains!'); // TODO: replace with error!
  }

  function requestBalanceHandler(e) {
    if (!sChain1 || !sChain2) {
      console.error('chains are not inited yet'); // TODO: replace with error
      return
    }
    emitBalanceEvent(e.detail.schainName, e.detail.tokenSymbol);
  }

  async function initSchain1() {
    log('Running initSchain1...');
    setSChain1(await initSChainMetamask(
      props.network,
      chainName1
    ))
  }

  async function initMainnet1() {
    setMainnet(await initMainnetMetamask(props.network, mainnetEndpoint))
  }

  async function enforceMetamaskNetwork() {
    if (chainName1 === MAINNET_CHAIN_NAME) {
      await initMainnet1();
    } else {
      await initSchain1();
    }
  }

  async function switchMetamaskChain(switchBack: boolean): Promise<void> {
    // TODO: tmp fix
    if (chainName2 === MAINNET_CHAIN_NAME || chainName1 === MAINNET_CHAIN_NAME) return;
    updateWeb3SChain(
      switchBack ? sChain2 : sChain1,
      props.network,
      switchBack ? chainName2 : chainName1
    );
    await updateWeb3SChainMetamask(
      switchBack ? sChain1 : sChain2,
      props.network,
      switchBack ? chainName1 : chainName2
    );
  }

  useEffect(() => {
    if (!open && !firstOpen) return;
    cleanData();
    if (chainName1 !== MAINNET_CHAIN_NAME && chainName2 !== MAINNET_CHAIN_NAME) setMainnet(null);
    if (chainName1) setChainId(getChainId(props.network, chainName1));
    if (address && chainName1) {
      if (chainName1 == MAINNET_CHAIN_NAME) {
        initMainnet1();
      } else {
        initSchain1();
      }
    }
  }, [chainName1, address]);

  useEffect(() => {
    if (open && !firstOpen) setFirstOpen(true);
  }, [open]);

  useEffect(() => {
    cleanData();
    if (chainName1 !== MAINNET_CHAIN_NAME && chainName2 !== MAINNET_CHAIN_NAME) setMainnet(null);
    if (address && chainName2) {
      if (chainName2 == MAINNET_CHAIN_NAME) {
        setMainnet(initMainnet(props.network, mainnetEndpoint))
      } else {
        log('Running initSchain2...');
        setSChain2(initSChain(
          props.network,
          chainName2
        ));
      }
      log(`chain2 changed ${chainName2}`);
    }
  }, [chainName2, address]);

  useEffect(() => {
    if (sChain1 && configTokens) checkWrappedTokens();
    initSFuelData();
    if (((sChain1 && sChain2) || (sChain1 && mainnet) || (mainnet && sChain2)) && configTokens) {
      externalEvents.connected();
      setToken(undefined);
      setLoading(false);
      setActiveStep(0);
      tokenLookup();
    }
  }, [sChain1, sChain2, mainnet, configTokens]);

  useEffect(() => {
    setActiveStep(0);
    setAmount('');
    setTokenId(0);
  }, [token]);

  useEffect(() => {
    setAmountErrorMessage(undefined);
    if (token === undefined) return;
    let actionName = getActionName(chainName1, chainName2, token, operationType);
    setActionName(actionName);
  }, [chainName1, chainName2, token, availableTokens]);

  useEffect(() => {
    if (transferRequest) return finishTransferRequest();
    // setAmountLocked(false);
    const defaultToken = getDefaultToken(availableTokens);
    if (defaultToken) setToken(defaultToken);
  }, [availableTokens]);

  useEffect(() => {
    setDefaultWrappedToken();
  }, [wrappedTokens]);

  useEffect(() => {
    setToken(undefined);
    setAmount('');
    setActiveStep(0);
    setActionSteps(undefined);
    setLoading(false);
    setDefaultWrappedToken();
  }, [operationType]);

  useEffect(() => {
    setAmountErrorMessage(undefined);
    runPreAction();
  }, [actionSteps, activeStep, amount, tokenId]);

  useEffect(() => {
    // TODO: tmp fix for unwrap
    const isUnwrapActionSteps = activeStep === 2 || activeStep === 3;
    const isUwrapAction = token && token.unwrappedSymbol && token.clone && isUnwrapActionSteps;
    if (extChainId && chainId && extChainId !== chainId && !isUwrapAction) {
      log('_MP_INFO: setting WrongNetworkMessage');
      setErrorMessage(new WrongNetworkMessage(enforceMetamaskNetwork));
    } else {
      setErrorMessage(undefined);
    }
  }, [extChainId, chainId, token, activeStep]);

  useEffect(() => {
    if (transferRequest) transfer(transferRequest);
  }, [transferRequest]);

  useEffect(() => {
    if (!actionName || !token) return;
    setActionSteps(getActionSteps(actionName, token));
    if (actionName === 'erc20_unwrap') { // TODO: tmp fix to unwrap
      log('Setting max amount for unwrap: ' + token.balance);
      setAmount(token.balance);
    }
  }, [actionName, token]);

  function cleanData() {
    setAmountErrorMessage(undefined);
    setActionBtnDisabled(false);
    setTokenId(undefined);
    setAmount('');
    setLoading(false);
    setActiveStep(0);
  }

  async function checkWrappedTokens() {
    log('_MP_INFO: Running checkWrappedTokens');
    try {
      const wrappedTokens = await getWrappedTokens(sChain1, chainName1, configTokens, address);
      if (Object.entries(wrappedTokens).length === 0 && operationType !== OperationType.transfer) {
        setAmount('');
        setOperationType(OperationType.transfer);
      }
      setWrappedTokens(wrappedTokens);
    } catch (err) {
      log('_MP_ERROR: checkWrappedTokens failed!');
      log(err);
    }
  }

  function setDefaultWrappedToken() {
    const defaultToken = getDefaultToken(wrappedTokens);
    if (defaultToken && operationType === OperationType.unwrap) {
      log(`Setting defaultToken: ${defaultToken.keyname} from wrappedTokens`)
      setToken(defaultToken);
    }
  }

  function finishTransferRequest() {
    log('Running finishTransferRequest');
    log(transferRequest);
    const tokenData = availableTokens[transferRequest.tokenType][transferRequest.tokenKeyname];
    if (!tokenData) {
      log(`No token data: ${transferRequest.tokenKeyname}`);
      log(availableTokens);
      return
    }
    setErrorMessage(undefined);
    setAmount(transferRequest.amount);
    setTokenId(transferRequest.tokenId);
    setToken(tokenData);
    setTransferRequest(undefined);
  }

  async function runPreAction() {
    if (actionSteps && actionSteps[activeStep] && token) {
      log('Running preAction');
      setActionBtnDisabled(true);
      const ActionClass: ActionType = actionSteps[activeStep];
      try {
        await new ActionClass(
          mainnet,
          sChain1,
          sChain2,
          chainName1,
          chainName2,
          address,
          amount,
          tokenId,
          token,
          switchMetamaskChain,
          setActiveStep,
          activeStep,
          setAmountErrorMessage
        ).preAction();
      } catch (e) {
        console.error(e);
      } finally {
        setActionBtnDisabled(false);
        log('preAction done');
      }
    }
  }

  function chainChangedFallback(_extChainId: string): void {
    setExtChainId(_extChainId);
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

  function errorMessageClosedFallback() {
    setLoading(false);
    setAmountLocked(false);
    setErrorMessage(undefined);
  }

  const handleNextStep = async () => {
    setLoading(true);
    const ActionClass: ActionType = actionSteps[activeStep];

    try {
      await new ActionClass(
        mainnet,
        sChain1,
        sChain2,
        chainName1,
        chainName2,
        address,
        amount,
        tokenId,
        token,
        switchMetamaskChain,
        setActiveStep,
        activeStep,
        setAmountErrorMessage
      ).execute();
    } catch (err) {
      console.error(err);
      const msg = err.message ? err.message : DEFAULT_ERROR_MSG;
      setErrorMessage(new TransactionErrorMessage(msg, errorMessageClosedFallback));
      return;
    }
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
    if (sChain1 && chainName1) {
      log(`_MP_INFO: initSFuelData - ${chainName1}`);
      try {
        const sFuelData1 = await getSFuelData(
          props.chainsMetadata,
          chainName1,
          sChain1.web3,
          address
        );
        setSFuelData1(sFuelData1);
      } catch (err) {
        log(`_MP_ERROR: getSFuelData for ${chainName1} failed`);
        log(err);
        setSFuelData1({});
      }
    } else {
      setSFuelData1({});
    }
    if (sChain2 && chainName2) {
      log(`_MP_INFO: initSFuelData - ${chainName2}`);
      try {
        const sFuelData2 = await getSFuelData(
          props.chainsMetadata,
          chainName2,
          sChain2.web3,
          address
        );
        setSFuelData2(sFuelData2);
      } catch (err) {
        log(`_MP_ERROR: getSFuelData for ${chainName2} failed`);
        log(err);
        setSFuelData2({});
      }
    } else {
      setSFuelData2({});
    }
  }

  return (<WidgetUI
    schains={schains}
    chainsMetadata={props.chainsMetadata}

    amount={amount}
    setAmount={setAmount}
    tokenId={tokenId}
    setTokenId={setTokenId}

    open={open}
    openButton={props.openButton}
    setOpen={setOpen}

    chain1={chainName1}
    chain2={chainName2}
    setChain1={setChainName1}
    setChain2={setChainName2}

    availableTokens={availableTokens}
    token={token}
    setToken={setToken}

    wrappedTokens={wrappedTokens}

    walletConnected={walletConnected}
    connectMetamask={connectMetamask}

    loading={loading}
    setLoading={setLoading}

    actionBtnDisabled={actionBtnDisabled}

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
    position={props.position}

    errorMessage={errorMessage}
    amountErrorMessage={amountErrorMessage}
    setAmountErrorMessage={setAmountErrorMessage}

    cleanData={cleanData}
    transferRequest={transferRequest}

    operationType={operationType}
    setOperationType={setOperationType}
  />)
}