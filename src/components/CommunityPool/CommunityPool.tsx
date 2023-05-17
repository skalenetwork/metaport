
/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file CommunityPool.ts
 * @copyright SKALE Labs 2023-Present
 */

import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

import AmountInput from '../AmountInput';
import BalanceBlock from "../BalanceBlock";

import { fromWei } from '../../core/convertation';
import { DEFAULT_ERC20_DECIMALS } from '../../core/constants';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";
import { CommunityPoolData } from '../../core/interfaces';
import { getChainIcon } from '../ChainsList/helper';


export default function CommunityPool(props: {
    communityPoolData: CommunityPoolData,
    loading: string | false,
    rechargeAmount: string,
    setRechargeAmount: (amount: string) => {},
    expanded: string | false,
    setExpanded: (expanded: string | false) => {},
    recharge: () => {},
    withdraw: () => {},
    marg: boolean
}) {

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        props.setExpanded(isExpanded ? panel : false);
    };

    const text = props.communityPoolData.exitGasOk ? 'Exit gas wallet OK' : 'Recharge exit gas wallet';
    const icon = props.communityPoolData.exitGasOk ? <CheckCircleIcon color='success' /> : <ErrorIcon color='warning' />
    const accountBalanceEther = props.communityPoolData.accountBalance ? fromWei(
        props.communityPoolData.accountBalance as string,
        DEFAULT_ERC20_DECIMALS
    ) : null;

    function getRechargeBtnText() {
        if (props.loading === 'recharge') return 'Recharging...';
        if (props.loading === 'activate') return 'Activating account...';
        if (Number(props.rechargeAmount) > Number(accountBalanceEther)) return 'Insufficient ETH balance';
        if (props.rechargeAmount === '' || props.rechargeAmount === '0' || !props.rechargeAmount) return 'Enter an amount';
        return 'Recharge exit gas wallet';
    }

    function getWithdrawBtnText() {
        if (props.loading === 'withdraw') return 'Withdrawing...';
        return 'Withdraw all';
    }

    return (<div className={clsNames([styles.mp__margTop10, !props.expanded])}>
        <Accordion
            disabled={!!props.loading}
            expanded={props.expanded === 'panel1'}
            onChange={handleChange('panel1')}
            className={clsNames(
                [styles.mp__margTop40, props.expanded && props.marg])}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <div className={clsNames(styles.mp__flex, styles.mp__btnChain)}>
                    <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
                        {icon}
                    </div>
                    <p className={clsNames(styles.mp__flex, styles.mp__chainName, styles.mp__margRi10)}>
                        {text}
                    </p>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div >
                    <p className={clsNames(
                        styles.mp__flex,
                        styles.mp__p3,
                        styles.mp__p,
                        styles.mp__errorMessage,
                        styles.mp__flexGrow,
                        styles.sk__colorText
                    )}>
                        Exit gas wallet support is in BETA. <br /><br />
                        You need a balance in this wallet to transfer to Ethereum.
                        This wallet is used to pay for gas fees when your transaction is presented
                        to Ethereum. You may withdraw from the wallet at anytime.
                    </p>
                    <Grid container spacing={2} >
                        <Grid className={styles.mp__margTop20} item xs={6}>
                            <BalanceBlock
                                icon={getChainIcon('mainnet', 'mainnet', true)}
                                chainName='Ethereum'
                                balance={props.communityPoolData.accountBalance}
                                token='eth'
                            />
                        </Grid>
                        <Grid className={styles.mp__margTop20} item xs={6}>
                            <BalanceBlock
                                icon={<AccountBalanceWalletRoundedIcon
                                    className={styles.chainIcon} style={{ color: '#b5b5b5' }} />}
                                chainName='exit wallet'
                                balance={props.communityPoolData.balance}
                                token='eth'
                            />
                        </Grid>

                        <Grid className={styles.mp__margTop20d} item xs={12}>
                            <p className={clsNames(
                                styles.mp__margBott5,
                                styles.mp__p,
                                styles.mp__p3
                            )}>
                                Recharge amount
                            </p>
                            <AmountInput
                                amount={props.rechargeAmount}
                                setAmount={props.setRechargeAmount}
                                token={'eth'}
                                maxBtn={false}
                                loading={props.loading}
                            />
                            <div className={clsNames(styles.mp__margTop10)}>
                                <Button
                                    variant="contained" color="primary" size="medium"
                                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                                    onClick={props.recharge}
                                    disabled={
                                        !!props.loading ||
                                        !props.communityPoolData.accountBalance ||
                                        Number(props.rechargeAmount) > Number(accountBalanceEther) ||
                                        props.rechargeAmount === '' ||
                                        props.rechargeAmount === '0' ||
                                        !props.rechargeAmount
                                    }
                                >
                                    {getRechargeBtnText()}
                                </Button>
                            </div>
                            <div className={clsNames(styles.mp__margTop5)}>
                                <Button
                                    variant="text" color="warning" size="small"
                                    className={clsNames(styles.mp__btnAction, styles.mp__margTop5)}
                                    onClick={props.withdraw}
                                    disabled={!!props.loading}
                                >
                                    {getWithdrawBtnText()}
                                </Button>
                            </div>

                        </Grid>
                    </Grid>
                </div>
            </AccordionDetails>
        </Accordion>
    </div>)
}
