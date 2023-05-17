
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

import Button from '@mui/material/Button';

import LoadingButton from '@mui/lab/LoadingButton';

import { Collapse } from '@mui/material';
import {
    MAINNET_CHAIN_NAME,
    SFUEL_CHEKCS_INTERVAL,
    SFUEL_TEXT,
    DEFAULT_FAUCET_URL
} from '../../core/constants';

import { clsNames } from '../../core/helper';
import { Station, StationData } from '../../core/sfuel';
import styles from "../WidgetUI/WidgetUI.scss";
import { TransferParams } from 'core/interfaces';
import { View } from '../../core/dataclasses/View';

import CustomStationUrl from '../CustomStationUrl';


debug.enable('*');
const log = debug('metaport:components:SFuel');


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
        // log('Getting chains from transferRequest');
        fromChain = props.transferRequest.chains[0];
        toChain = props.transferRequest.chains[1];
        hubChain = props.transferRequest.route ? props.transferRequest.route.hub : undefined;
    } else {
        // log('Getting chains from props');
        fromChain = props.chain1;
        toChain = props.chain2;
    }

    const [loading, setLoading] = React.useState<boolean>(true);
    const [mining, setMining] = React.useState<boolean>(false);

    const [fromChainStation, setFromChainStation] = React.useState<Station>();
    const [toChainStation, setToChainStation] = React.useState<Station>();
    const [hubChainStation, setHubChainStation] = React.useState<Station>();

    const [updateBalanceTime, setUpdateBalanceTime] = React.useState<number>(Date.now());

    const [fromStationData, setFromStationData] = React.useState<StationData>();
    const [toStationData, setToStationData] = React.useState<StationData>();
    const [hubStationData, setHubStationData] = React.useState<StationData>();

    const [sFuelStatus, setSFuelStatus] = React.useState<'action' | 'warning' | 'error'>('action');

    useEffect(() => {
        if (!fromChain || !toChain || !props.address) return;
        log('Initializing SFuelWarning web3', fromChain, toChain, hubChain, props.address);

        setFromChainStation(new Station(
            fromChain,
            props.config.skaleNetwork,
            props.config.mainnetEndpoint,
            props.config.chainsMetadata
        ));

        setToChainStation(new Station(
            toChain,
            props.config.skaleNetwork,
            props.config.mainnetEndpoint,
            props.config.chainsMetadata
        ));

        if (hubChain) {
            setHubChainStation(new Station(
                hubChain,
                props.config.skaleNetwork,
                props.config.mainnetEndpoint,
                props.config.chainsMetadata
            ));
        }

        const interval = setInterval(
            () => setUpdateBalanceTime(Date.now()), SFUEL_CHEKCS_INTERVAL * 1000);
        return () => clearInterval(interval);
    }, [fromChain, toChain, hubChain]);

    useEffect(() => { updateFromStationData(); }, [fromChainStation]);
    useEffect(() => { updateToStationData(); }, [toChainStation]);
    useEffect(() => { updateHubStationData(); }, [hubChainStation]);

    useEffect(() => { updateBalances(); }, [updateBalanceTime, props.address]);

    useEffect(() => {
        if (!fromStationData || !toStationData) return;
        setLoading(true);
        if (!fromStationData.ok || (hubStationData && !hubStationData.ok)) {
            setSFuelStatus('error');
            props.setSFuelOk(false);
        } else {
            if (!toStationData.ok) {
                setSFuelStatus('warning');
            } else {
                setSFuelStatus('action');
            }
            props.setSFuelOk(true);
        }
        setLoading(false);
    }, [fromStationData, toStationData, hubStationData]);

    function updateBalances() {
        updateFromStationData();
        updateToStationData();
        updateHubStationData();
    }

    async function updateFromStationData() {
        if (!fromChainStation) return;
        setFromStationData(await fromChainStation.getData(props.address));
    }

    async function updateToStationData() {
        if (!toChainStation) return;
        setToStationData(await toChainStation.getData(props.address));
    }

    async function updateHubStationData() {
        if (!hubChainStation) return;
        setHubStationData(await hubChainStation.getData(props.address));
    }

    async function doPoW() {
        let fromPowRes;
        let toPowRes;
        let hubPowRes;

        setMining(true);

        if (fromStationData && !fromStationData.ok) {
            log(`Doing PoW on ${fromChainStation.chainName}`);
            fromPowRes = await fromChainStation.doPoW(props.address);
        }
        if (toStationData && !toStationData.ok) {
            log(`Doing PoW on ${toChainStation.chainName}`);
            toPowRes = await toChainStation.doPoW(props.address);
        }
        if (hubStationData && !hubStationData.ok) {
            log(`Doing PoW on ${hubChainStation.chainName}`);
            hubPowRes = await hubChainStation.doPoW(props.address);
        }

        if (
            (fromPowRes && !fromPowRes.ok) ||
            (toPowRes && !toPowRes.ok) ||
            (hubPowRes && !hubPowRes.ok)
        ) {
            log('PoW failed!');
            if (fromPowRes) log(fromChain, fromPowRes.message);
            if (toPowRes) log(toChain, toPowRes.message);
            if (hubPowRes) log(hubChain, hubPowRes.message);
            window.open(DEFAULT_FAUCET_URL, '_blank');
        }

        await updateFromStationData();
        await updateToStationData();
        await updateHubStationData();
        setMining(false);
    }

    const noEth = (fromStationData && !fromStationData.ok && fromChain === MAINNET_CHAIN_NAME);
    const noEthDest = (toStationData && !toStationData.ok && toChain === MAINNET_CHAIN_NAME);

    function getSFuelText() {
        if (noEth || (fromStationData && fromStationData.ok && noEthDest)) {
            return SFUEL_TEXT['gas'][sFuelStatus];
        }
        return SFUEL_TEXT['sfuel'][sFuelStatus];
    }

    return (<Collapse in={!loading && sFuelStatus !== 'action'} className='mp__noMarg'>
        <p className={clsNames(
            styles.mp__flex,
            styles.mp__p3,
            styles.mp__p,
            styles.mp__flexGrow,
            styles.mp__margTop20,
            styles.sk__uppercase
        )}>
            ⛽ {getSFuelText()}
        </p>
        {
            !noEth && ((fromStationData && !fromStationData.ok) || !noEthDest) ? (<div>
                {mining ? <LoadingButton
                    loading
                    loadingPosition="start"
                    size='small'
                    variant='contained'
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop10)}
                >
                    Getting sFUEL...
                </LoadingButton> : <Button
                    variant="contained" color="primary" size="medium"
                    className={clsNames(styles.mp__btnAction, styles.mp__margTop10)}
                    onClick={doPoW}
                >
                    Get sFUEL
                </Button>}
                <CustomStationUrl stationData={fromStationData} type='source' />
                <CustomStationUrl stationData={toStationData} type='destination' />
                <CustomStationUrl stationData={hubStationData} type='hub' />
            </div>
            ) : null
        }
    </Collapse>)
}
