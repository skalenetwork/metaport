
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
 * @file TransactionsHistory.ts
 * @copyright SKALE Labs 2023-Present
 */

import React from 'react';

import { Collapse } from '@mui/material';
import Button from '@mui/material/Button';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import { TransactionHistory, MetaportConfig } from '../../core/interfaces';
import TransactionData from '../TransactionData';

import { clsNames } from '../../core/helper';
import styles from "../WidgetUI/WidgetUI.scss";


export default function TransactionsHistory(props: {
    transactionsHistory: TransactionHistory[],
    clearTransactionsHistory: any,
    config: MetaportConfig,
    setExpanded: any,
    expanded: string | false,
    transferRequestView?: boolean
}) {

    const handleChange =
        (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
            props.setExpanded(isExpanded ? panel : false);
        };

    function clearTransferHistory() {
        props.clearTransactionsHistory();
        props.setExpanded(false);
    }

    return (<Collapse
        in={props.transactionsHistory.length !== 0}
        className={clsNames(styles.br__history)}
    >
        <Collapse in={!props.expanded}>
            <div className={clsNames(styles.mp__margTop20)}></div>
        </Collapse>
        <Accordion
            expanded={props.expanded === 'panel1'}
            onChange={handleChange('panel1')}
            className={clsNames(styles.mp__noMarg)}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <div className={clsNames(styles.mp__flex, styles.mp__btnChain)}>
                    <div className={clsNames(styles.mp__flex, styles.mp__flexCentered)}>
                        <HistoryRoundedIcon />
                    </div>
                    <p className={clsNames(styles.mp__flex, styles.mp__chainName, styles.mp__margRi10)}>
                        Completed transactions ({props.transactionsHistory.length})
                    </p>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div className={clsNames(styles.mp__margBottMin10)}>
                    {props.transactionsHistory.map((transactionData: any) => (
                        <TransactionData
                            key={transactionData.tx.transactionHash}
                            transactionData={transactionData}
                            config={props.config}
                        />
                    ))}

                    <div className={clsNames(styles.mp__textCentered)}>
                        <Button
                            onClick={clearTransferHistory}
                            startIcon={<ClearAllIcon />}
                            variant='text'
                            className={clsNames(
                                styles.mp__margTop10,
                                styles.mp__margBott10,
                                styles.sk__smBth
                            )}
                            size='small'
                        >
                            Clear all
                        </Button>
                    </div>

                </div>
            </AccordionDetails>
        </Accordion>
    </Collapse>)
}
