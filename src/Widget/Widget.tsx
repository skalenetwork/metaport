import React from "react";
import { createRoot } from 'react-dom/client';

import { schains } from './TestData';
import WidgetUI from '../WidgetUI'

import defaultTokens from '../metadata/tokens.json'


export function Widget(props) {
  // todo: widget core!!!

  // todo: state here!

  // let schains = 111; // todo: get chains list

  // todo: get list of available tokens (FOR REAL!)

  return (<WidgetUI
    schains={props.schains}
    tokens={props.tokens['rapping-zuben-elakrab']}
    schainAliases={props.schainAliases}
    balance='1234'
    amount=''
    open={props.open}
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
          />
    );
  }
}


export default IMAWidget;
