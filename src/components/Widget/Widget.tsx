import React, { useEffect } from 'react';
import debug from 'debug';

import WidgetUI from '../WidgetUI';
import { getWidgetTheme } from '../WidgetUI/Themes';
import { WrongNetworkMessage, TransactionErrorMessage } from '../ErrorMessage';

import {
  initSChain,
  initSChainMetamask,
  initMainnet,
  initMainnetMetamask,
  updateWeb3SChain,
  updateWeb3SChainMetamask,
  updateWeb3Mainnet,
  updateWeb3MainnetMetamask,
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
import { isTransferRequestActive } from '../../core/helper';
import { getTransferSteps } from '../../core/transferSteps';

import * as interfaces from '../../core/interfaces/index';
import TokenData from '../../core/dataclasses/TokenData';
import { OperationType } from '../../core/dataclasses/OperationType';
import { TransferRequestStatus } from '../../core/dataclasses/TransferRequestStatus';
import { View } from '../../core/dataclasses/View';
import { MetaportTheme } from '../../core/interfaces/Theme';


debug.enable('*');
const log = debug('metaport:WidgetV2');


export function Widget(props) {

  // STATE

  const [walletConnected, setWalletConnected] = React.useState(undefined);

  const [availableTokens, setAvailableTokens] = React.useState<interfaces.TokenDataTypesMap>(
    getEmptyTokenDataMap()
  );
  const [wrappedTokens, setWrappedTokens] = React.useState<interfaces.TokenDataTypesMap>(
    getEmptyTokenDataMap()
  );

  const [chainId, setChainId] = React.useState(undefined);
  const [extChainId, setExtChainId] = React.useState<string>(undefined);

  const [amountLocked, setAmountLocked] = React.useState(false);

  const [address, setAddress] = React.useState<string>(undefined);

  const [amount, setAmount] = React.useState<string>('');
  const [tokenId, setTokenId] = React.useState<number>();

  const [sFuelData1, setSFuelData1] = React.useState(undefined);
  const [sFuelData2, setSFuelData2] = React.useState(undefined);

  const [chainName1, setChainName1] = React.useState(undefined);
  const [chainName2, setChainName2] = React.useState(undefined);

  const [sChain1, setSChain1] = React.useState<SChain>(undefined);
  const [sChain2, setSChain2] = React.useState<SChain>(undefined);
  const [mainnet, setMainnet] = React.useState<MainnetChain>(undefined);

  const [token, setToken] = React.useState<TokenData>(undefined);

  const [activeStep, setActiveStep] = React.useState(0);
  const [actionName, setActionName] = React.useState<string>(undefined);
  const [actionSteps, setActionSteps] = React.useState(undefined);

  const [loading, setLoading] = React.useState(false);
  const [loadingTokens, setLoadingTokens] = React.useState(false);
  const [actionBtnDisabled, setActionBtnDisabled] = React.useState<boolean>(false);

  const [open, setOpen] = React.useState(props.open);
  const [firstOpen, setFirstOpen] = React.useState(props.open);

  const [view, setView] = React.useState<View>(View.SANDBOX);

  const [theme, setTheme] = React.useState<interfaces.MetaportTheme>(getWidgetTheme(props.config.theme));

  const [transferRequest, setTransferRequest] = React.useState<interfaces.TransferParams>(
    undefined);
  const [transferRequestStatus, setTransferRequestStatus] = React.useState<TransferRequestStatus>(
    TransferRequestStatus.NO_REQEST);
  const [transferRequestStep, setTransferRequestStep] = React.useState<number>(0);
  const [transferRequestSteps, setTransferRequestSteps] = React.useState<Array<any>>();
  const [transferRequestLoading, setTransferRequestLoading] = React.useState<boolean>(true);

  const [errorMessage, setErrorMessage] = React.useState(undefined);
  const [amountErrorMessage, setAmountErrorMessage] = React.useState<string>(undefined);


  // EFFECTS

  useEffect(() => {
    setWalletConnected(false);
    addAccountChangedListener(accountsChangedFallback);
    addChainChangedListener(chainChangedFallback);
    addinternalEventsListeners();
  }, []);

  useEffect(() => {
    if (open && !firstOpen) setFirstOpen(true);
  }, [open]);

  useEffect(() => {
    if (!open && !firstOpen) return;
    if (chainName1 !== MAINNET_CHAIN_NAME && chainName2 !== MAINNET_CHAIN_NAME) setMainnet(null);
    if (chainName1) setChainId(getChainId(props.config.skaleNetwork, chainName1));
    if (address && chainName1) {
      if (chainName1 == MAINNET_CHAIN_NAME) {
        initMainnet1();
      } else {
        initSchain1();
      }
    }
  }, [chainName1, address]);

  useEffect(() => {
    if (chainName1 !== MAINNET_CHAIN_NAME && chainName2 !== MAINNET_CHAIN_NAME) setMainnet(null);
    if (address && chainName2) {
      if (chainName2 == MAINNET_CHAIN_NAME) {
        setMainnet(initMainnet(props.config.skaleNetwork, props.config.mainnetEndpoint))
      } else {
        log(`Running initSchain2: ${chainName2}`);
        setSChain2(initSChain(
          props.config.skaleNetwork,
          chainName2
        ));
      }
      log(`chain2 changed ${chainName2}`);
    }
  }, [chainName2, address]);

  useEffect(() => {
    if (props.config.tokens) checkWrappedTokens();
    initSFuelData();
    if (((sChain1 && sChain2) || (sChain1 && mainnet) || (mainnet && sChain2))) {
      externalEvents.connected();
      setToken(undefined);
      setLoading(false);
      setActiveStep(0);
      tokenLookup();
    }
  }, [sChain1, sChain2, mainnet]);

  useEffect(() => {
    if (isTransferRequestActive(transferRequestStatus)) {
      const tokenKeyname = (transferRequest.route && transferRequestStatus === TransferRequestStatus.IN_PROGRESS_HUB) ? transferRequest.route.tokenKeyname : transferRequest.tokenKeyname;
      const tokenType = (transferRequest.route && transferRequestStatus === TransferRequestStatus.IN_PROGRESS_HUB) ? transferRequest.route.tokenType : transferRequest.tokenType;
      log(`Loading transfer request - ${tokenKeyname}, ${transferRequest.amount}, ${transferRequest.tokenId}`);
      const tokenData = availableTokens[tokenType][tokenKeyname];
      if (!tokenData) {
        setTransferRequestStatus(TransferRequestStatus.ERROR);
        log(`No token data: ${tokenKeyname}`);
        log(availableTokens);
        return
      }
      setToken(tokenData);
      setAmount(transferRequest.amount);
      setTokenId(transferRequest.tokenId);
      // setTransferRequestStatus(TransferRequestStatus.IN_PROGRESS);
      setTransferRequestLoading(false);
      log(`Loading transfer request - DONE`);
    }
  }, [availableTokens]);

  useEffect(() => {
    setDefaultWrappedToken();
  }, [wrappedTokens]);

  useEffect(() => {
    setAmountErrorMessage(undefined);
    if (token === undefined) return;
    const operationType = view === View.UNWRAP ? OperationType.unwrap : OperationType.transfer;
    let actionName = getActionName(chainName1, chainName2, token.type, operationType);
    setActionName(actionName);
  }, [chainName1, chainName2, token, availableTokens]);

  useEffect(() => {
    if (!actionName || !token) return;
    setActionSteps(getActionSteps(actionName, token));
    if (actionName === 'erc20_unwrap') { // TODO: tmp fix to unwrap
      log('Setting max amount for unwrap: ' + token.balance);
      setAmount(token.balance);
    }
  }, [actionName, token]);

  useEffect(() => {
    setAmountErrorMessage(undefined);
    runPreAction();
  }, [actionSteps, activeStep, amount, tokenId]);

  useEffect(() => {
    if (transferRequestStatus === TransferRequestStatus.DONE) {
      log('Transfer request completed');
      externalEvents.transferRequestCompleted(transferRequest);
      setTransferRequestStep(0);
    }
  }, [transferRequestStatus]);

  useEffect(() => {
    if (token && transferRequest) {
      if (transferRequestStatus === TransferRequestStatus.IN_PROGRESS) {
        setTransferRequestSteps(getTransferSteps(transferRequest, props.config, theme, token));
      }
    }
  }, [token, transferRequest]);

  // FALLBACKS & HANDLERS

  function addinternalEventsListeners() {
    window.addEventListener("_metaport_transfer", transferHandler, false);
    window.addEventListener("_metaport_close", closeHandler, false);
    window.addEventListener("_metaport_open", openHandler, false);
    window.addEventListener("_metaport_reset", resetHandler, false);
    window.addEventListener("_metaport_setTheme", themeHandler, false);
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

  function transferHandler(e) {
    resetWidgetState();
    const params: interfaces.TransferParams = e.detail.params;
    setTransferRequestStatus(TransferRequestStatus.RECEIVED);
    setTransferRequest(params);
    setView(View.TRANSFER_REQUEST_SUMMARY);
    setOpen(true);
  }

  function closeHandler(e) {
    setOpen(false);
    log('closeWidget event processed');
  }

  function openHandler(e) {
    setOpen(true);
    log('openWidget event processed');
  }

  function resetHandler(e) {
    resetWidgetState();
    log('resetWidget event processed');
  }

  function themeHandler(e) {
    const theme: MetaportTheme = e.detail.theme;
    setTheme(getWidgetTheme(theme));
    log('setTheme event processed');
  }

  function connectMetamask() {
    console.log('connectMetamask...');
    connect(networkConnectFallback);
    externalEvents.connected();
    console.log('Done: connectMetamask...');
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
    setTransferRequestStep((prevTrReqStep) => prevTrReqStep + 1);
    if (transferRequestStatus === TransferRequestStatus.IN_PROGRESS && transferRequest.route) {
      // TODO: tmp fix for unwrap
      if (actionSteps.length !== 2 || (actionSteps.length === 2 && transferRequestStep === 1)) {
        moveToHub();
      }
    }
    if (transferRequestSteps.length !== 0 && transferRequestStep === transferRequestSteps.length - 1) {
      setTransferRequestStatus(TransferRequestStatus.DONE);
    }
  };

  function errorMessageClosedFallback() {
    setLoading(false);
    setAmountLocked(false);
    setErrorMessage(undefined);
  }

  // CORE FUNCTIONS

  function confirmSummary() {
    setView(View.TRANSFER_REQUEST_STEPS);
    setTransferRequestStatus(TransferRequestStatus.IN_PROGRESS);
    const fromChain = transferRequest.chains[0];
    const toChain = transferRequest.route ? transferRequest.route.hub : transferRequest.chains[1];
    log(`confirmSummary - fromChain: ${fromChain}, toChain: ${toChain}`);
    setChainName1(fromChain);
    setChainName2(toChain);
  }

  function moveToHub() {
    setTransferRequestLoading(true);
    setTransferRequestStatus(TransferRequestStatus.IN_PROGRESS_HUB);
    const fromChain = transferRequest.route.hub;
    const toChain = transferRequest.chains[1];
    log(`moveToHub - fromChain: ${fromChain}, toChain: ${toChain}`);
    setChainName1(fromChain);
    setChainName2(toChain);
  }

  async function initSchain1() {
    log('Running initSchain1...');
    setSChain1(await initSChainMetamask(
      props.config.skaleNetwork,
      chainName1
    ))
  }

  async function initMainnet1() {
    log(`Running initSchain1: ${chainName1}`);
    setMainnet(await initMainnetMetamask(props.config.skaleNetwork, props.config.mainnetEndpoint))
  }

  async function checkWrappedTokens() {
    if (!sChain1 || !chainName1) {
      log('No chainName1 or sChain1, skipping checkWrappedTokens');
      setWrappedTokens(getEmptyTokenDataMap());
      return;
    }
    log('_MP_INFO: Running checkWrappedTokens');
    try {
      const wrappedTokens = await getWrappedTokens(sChain1, chainName1, props.config.tokens, address);
      if (Object.entries(wrappedTokens).length === 0 && view !== View.SANDBOX) {
        setAmount('');
        setView(View.SANDBOX);
      }
      setWrappedTokens(wrappedTokens);
    } catch (err) {
      log('_MP_ERROR: checkWrappedTokens failed!');
      log(err);
    }
  }

  function setDefaultWrappedToken() {
    const defaultToken = getDefaultToken(wrappedTokens);
    if (defaultToken && view === View.UNWRAP) {
      log(`Setting defaultToken: ${defaultToken.keyname} from wrappedTokens`)
      setToken(defaultToken);
    }
  }

  async function initSFuelData() {
    if (sChain1 && chainName1) {
      log(`_MP_INFO: initSFuelData - ${chainName1}`);
      try {
        const sFuelData1 = await getSFuelData(
          props.config.chainsMetadata,
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
          props.config.chainsMetadata,
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

  async function tokenLookup() {
    setLoadingTokens(true);
    try {
      let tokens = await getAvailableTokens(
        mainnet,
        sChain1,
        sChain2,
        chainName1,
        chainName2,
        props.config.tokens,
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

  function resetWidgetState() {
    setAvailableTokens(getEmptyTokenDataMap());
    setWrappedTokens(getEmptyTokenDataMap());
    setToken(undefined);

    setAmount('');
    setTokenId(0);

    setChainName1(null);
    setChainName2(null);

    setTransferRequestStep(0);

    setSChain1(null);
    setSChain2(null);
    setMainnet(null);

    setLoading(false);

    setView(View.SANDBOX);

    setSFuelData1({});
    setSFuelData2({});

    setAmountLocked(false);
    setActiveStep(0);
    setActionSteps(undefined);
    setActionName(undefined)
    setAmountErrorMessage(undefined);
    setActionBtnDisabled(false);
    setTransferRequestLoading(true);
    setTransferRequestStatus(TransferRequestStatus.NO_REQEST);
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

  async function switchMetamaskChain(switchBack?: boolean): Promise<void> {
    // if (chainName1 === MAINNET_CHAIN_NAME) {
    //   updateWeb3SChain(
    //     switchBack ? sChain2 : sChain1,
    //     props.network,
    //     switchBack ? chainName2 : chainName1
    //   );
    //   await updateWeb3SChainMetamask(
    //     switchBack ? sChain1 : sChain2,
    //     props.network,
    //     switchBack ? chainName1 : chainName2
    //   );  
    // }
    if (chainName2 === MAINNET_CHAIN_NAME) {
      updateWeb3SChain(
        sChain1,
        props.config.skaleNetwork,
        chainName1
      )
      await updateWeb3MainnetMetamask(
        mainnet,
        props.config.skaleNetwork,
        props.config.mainnetEndpoint
      )
      return;
    }
    updateWeb3SChain(
      switchBack ? sChain2 : sChain1,
      props.config.skaleNetwork,
      switchBack ? chainName2 : chainName1
    );
    await updateWeb3SChainMetamask(
      switchBack ? sChain1 : sChain2,
      props.config.skaleNetwork,
      switchBack ? chainName1 : chainName2
    );
  }

  return (<WidgetUI
    config={props.config}

    amount={amount}
    setAmount={setAmount}
    tokenId={tokenId}
    setTokenId={setTokenId}

    open={open}
    setOpen={setOpen}

    walletConnected={walletConnected}
    connectMetamask={connectMetamask}

    chain1={chainName1}
    chain2={chainName2}
    setChain1={setChainName1}
    setChain2={setChainName2}

    availableTokens={availableTokens}
    wrappedTokens={wrappedTokens}
    token={token}
    setToken={setToken}

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

    actionName={actionName}

    errorMessage={errorMessage}
    amountErrorMessage={amountErrorMessage}
    setAmountErrorMessage={setAmountErrorMessage}

    // cleanData={cleanData}

    theme={theme}
    view={view}
    setView={setView}

    transferRequest={transferRequest}
    transferRequestStatus={transferRequestStatus}
    transferRequestStep={transferRequestStep}
    transferRequestSteps={transferRequestSteps}
    transferRequestLoading={transferRequestLoading}

    confirmSummary={confirmSummary}
  />)
}