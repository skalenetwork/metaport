import React from 'react';

import { TokenType } from '../../core/dataclasses/TokenType';
import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


function roundDown(number, decimals) {
    decimals = decimals || 0;
    return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
}


export default function TokenBalance(props) {
    if ([TokenType.erc721, TokenType.erc721meta, TokenType.erc1155].includes(props.token.type)) return;
    return (
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert)}>
            {props.token.unwrappedBalance ? (
                <p className={clsNames(
                    styles.mp__p,
                    styles.mp__p3,
                    styles.mp__flex,
                    styles.mp__flexCenteredVert,
                    styles.mp__margRi5
                )}>
                    {roundDown(props.token.unwrappedBalance, 4)} {props.token.unwrappedSymbol} /
                </p>
            ) : null}
            <p className={clsNames(
                styles.mp__p,
                styles.mp__p3,
                styles.mp__flex,
                styles.mp__flexCenteredVert,
                styles.mp__margRi5
            )}>
                {roundDown(props.token.balance, 4)} {props.token.symbol}
            </p>
        </div>

    )
}