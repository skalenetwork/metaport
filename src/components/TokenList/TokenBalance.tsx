import { TokenType } from '../../core/dataclasses/TokenType';
import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


function roundDown(number, decimals) {
    decimals = decimals || 0;
    return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
}


export default function TokenBalance(props) {
    if ([TokenType.erc721, TokenType.erc721meta, TokenType.erc1155].includes(props.token.type)) return;
    let balance = props.token.unwrappedSymbol ? props.token.unwrappedBalance : props.token.balance;
    let symbol = props.token.unwrappedSymbol ? props.token.unwrappedSymbol : props.token.symbol;

    if (props.token.clone) {
        balance = props.token.balance;
        symbol = props.token.cloneSymbol ? props.token.cloneSymbol : symbol;
    }

    if (!balance) return;
    return (
        <div className={clsNames(styles.mp__flex, styles.mp__flexCenteredVert)}>
            <p className={clsNames(
                styles.mp__p,
                styles.mp__p3,
                styles.mp__flex,
                styles.mp__flexCenteredVert,
                styles.mp__margRi5
            )}>
                {roundDown(balance, 8)} {symbol}
            </p>
        </div>
    )
}