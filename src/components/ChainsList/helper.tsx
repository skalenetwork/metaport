import React, { useEffect } from 'react';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import { iconPath } from '../TokenList/helper';
import { MAINNET_CHAIN_NAME } from '../../core/constants';


function stringToColor(str, dark) {
    if (dark) {
        // return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
        return 'hsl(120deg 2% 88%)';
    }
    return 'hsl(0deg 0% 15%)';
    // return `hsl(${hashCode(str) % 360}, 55%, 40%)`;
}


export function getChainName(chainsMetadata, chainName: string) {
    if (chainName == MAINNET_CHAIN_NAME) {
        return 'Mainnet';
    }
    if (chainsMetadata && chainsMetadata[chainName]) {
        return chainsMetadata[chainName].alias;
    } else {
        return chainName;
    }
}


export function getChainIcon(chainName: string, dark: boolean) {
    if (chainName == MAINNET_CHAIN_NAME) {
        return <img src={iconPath('eth')} className='eth-logo' height='20px' width='20px' />;
    }
    return (<OfflineBoltIcon sx={{ color: stringToColor(chainName, dark) }} width='20px' />);
}
