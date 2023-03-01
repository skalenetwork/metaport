
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
 * @file SFuelWarning.ts
 * @copyright SKALE Labs 2023-Present
 */

import React, { useEffect } from 'react';
import debug from 'debug';

import Web3 from 'web3';

import Button from '@mui/material/Button';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

import { initChainWeb3 } from '../../core/core';
import { Collapse } from '@mui/material';
import { MAINNET_CHAIN_NAME, SFUEL_CHEKCS_INTERVAL, SFUEL_TEXT } from '../../core/constants';


import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";
import { TransferParams } from 'core/interfaces';
import { View } from '../../core/dataclasses/View';


debug.enable('*');
const log = debug('bridge:components:SFuel');


export default function SFuelWarning(props: {
    chain1: string,
    chain2: string,
    transferRequest: TransferParams,
    config: any,
    address: string,
    setSFuelOk: any,
    view: View
}) {

    let fromChain;
    let toChain;
    let hubChain;

    if (props.transferRequest && props.view !== View.SANDBOX) {
        log('Getting chains from transferRequest');
        fromChain = props.transferRequest.chains[0];
        toChain = props.transferRequest.chains[1];
        hubChain = props.transferRequest.route ? props.transferRequest.route.hub : undefined;
    } else {
        log('Getting chains from props');
        fromChain = props.chain1;
        toChain = props.chain2;
    }

    const [loading, setLoading] = React.useState<boolean>(true);
    const [fromChainWeb3, setFromChainWeb3] = React.useState<Web3>();
    const [toChainWeb3, setToChainWeb3] = React.useState<Web3>();
    const [hubChainWeb3, setHubChainWeb3] = React.useState<Web3>();

    const [updateBalanceTime, setUpdateBalanceTime] = React.useState<number>(Date.now());

    const [fromChainSFuel, setFromChainSFuel] = React.useState<string>();
    const [toChainSFuel, setToChainSFuel] = React.useState<string>();
    const [hubChainSFuel, setHubChainSFuel] = React.useState<string>();

    const [sFuelStatus, setSFuelStatus] = React.useState<'action' | 'warning' | 'error'>('action');

    useEffect(() => {
        if (!fromChain || !toChain || !props.address) return;
        log('Initializing SFuelWarning web3', fromChain, toChain, hubChain, props.address);
        setFromChainWeb3(initChainWeb3(props.config, fromChain));
        setToChainWeb3(initChainWeb3(props.config, toChain));
        if (hubChain) {
            setHubChainWeb3(initChainWeb3(props.config, hubChain));
        }
        const interval = setInterval(() => setUpdateBalanceTime(Date.now()), SFUEL_CHEKCS_INTERVAL * 1000);
        return () => clearInterval(interval);
    }, [fromChain, toChain, hubChain]);

    useEffect(() => {
        getFromChainBalance();
    }, [fromChainWeb3]);

    useEffect(() => {
        getToChainBalance();
    }, [toChainWeb3]);

    useEffect(() => {
        getHubChainBalance();
    }, [hubChainWeb3]);

    useEffect(() => {
        updateBalances();
    }, [updateBalanceTime, props.address]);

    useEffect(() => {
        if (!fromChainSFuel || !toChainSFuel) return;
        setLoading(true);
        if (fromChainSFuel === '0' || (hubChainSFuel && hubChainSFuel === '0')) {
            setSFuelStatus('error');
            props.setSFuelOk(false);
        } else {
            if (toChainSFuel === '0') {
                setSFuelStatus('warning');
            } else {
                setSFuelStatus('action');
            }
            props.setSFuelOk(true);
        }
        setLoading(false);
    }, [fromChainSFuel, toChainSFuel, hubChainSFuel]);

    function updateBalances() {
        getFromChainBalance();
        getToChainBalance();
        getHubChainBalance();
    }

    async function getFromChainBalance() {
        if (!fromChainWeb3) return;
        const balance = await fromChainWeb3.eth.getBalance(props.address);
        log('fromChain sFUEL balance:', balance);
        setFromChainSFuel(balance);
    }

    async function getToChainBalance() {
        if (!toChainWeb3) return;
        const balance = await toChainWeb3.eth.getBalance(props.address);
        log('toChain sFUEL balance:', balance);
        setToChainSFuel(balance);
    }

    async function getHubChainBalance() {
        if (!hubChainWeb3) return;
        const balance = await hubChainWeb3.eth.getBalance(props.address);
        log('hubChain sFUEL balance:', balance);
        setHubChainSFuel(balance);
    }

    const noEth = (fromChainSFuel === '0' && fromChain === MAINNET_CHAIN_NAME);

    return (<Collapse in={!loading && sFuelStatus !== 'action'} className='mp__noMarg'>
        <p className={clsNames(styles.mp__flex, styles.mp__p3, styles.mp__p, styles.mp__flexGrow, styles.mp__margTop20)}>
            ⛽ {noEth ? SFUEL_TEXT['gas'][sFuelStatus] : SFUEL_TEXT['sfuel'][sFuelStatus]}
        </p>
        <Button
            variant="contained" color="primary" size="medium"
            className={clsNames(styles.mp__btnAction, styles.mp__margTop20)}
            target="_blank"
            href='https://sfuel.skale.network/'
        >
            Get sFUEL
        </Button>
    </Collapse>)
}
