import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import WidgetUI from '../WidgetUI'
import { initSChain } from '../WidgetCore'

import defaultTokens from '../metadata/tokens.json'


export function Widget(props) {

  const [chain1, setChain1] = React.useState(undefined);
  const [chain2, setChain2] = React.useState(undefined);
  const [token, setToken] = React.useState(undefined);

  const [sChain1, setSChain1] = React.useState(undefined);
  const [sChain2, setSChain2] = React.useState(undefined);

  useEffect(() => {
    if (chain1) {
      setSChain1(initSChain(
        props.network,
        chain1
      ))
      console.log('chain1 changed ' + chain1);
    }
  }, [chain1]);

  useEffect(() => {
    if (chain2) {
      console.log('chain2 changed ' + chain2);
    }
  }, [chain2]);

  // todo: widget core!!!

  // todo: state here!

  // let schains = 111; // todo: get chains list

  // todo: get list of available tokens (FOR REAL!)

  // getSChainEndpoint
  // sChain1 = 

  return (<WidgetUI
    schains={props.schains}
    tokens={props.tokens['rapping-zuben-elakrab']}
    schainAliases={props.schainAliases}
    balance='1234'
    amount=''
    open={props.open}

    chain1={chain1}
    chain2={chain2}
    setChain1={setChain1}
    setChain2={setChain2}

    token={token}
    setToken={setToken}
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

    if (!params['chains'] && !params['chainsFrom'] && !params['chainsTo']) {
      // todo: ALL network chains (request here???)
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
