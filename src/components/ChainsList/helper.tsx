import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import { chainIconPath } from '../TokenList/helper';
import { MAINNET_CHAIN_NAME } from '../../core/constants';


function stringToColor(_, dark) {
    if (dark) {
        // return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
        return 'hsl(120deg 2% 88%)';
    }
    return 'hsl(0deg 0% 15%)';
    // return `hsl(${hashCode(str) % 360}, 55%, 40%)`;
}


export function getChainName(chainsMetadata: any, chainName: string, app?: string): string {
    if (chainName == MAINNET_CHAIN_NAME) {
        return 'Mainnet';
    }
    if (chainsMetadata && chainsMetadata[chainName]) {
        if (app && chainsMetadata[chainName]['apps'][app]) {
            return chainsMetadata[chainName]['apps'][app].alias;
        }
        return chainsMetadata[chainName].alias;
    } else {
        return chainName;
    }
}


export function getChainIcon(skaleNetwork: string, chainName: string, dark: boolean, app?: string) {
    const iconPath = chainIconPath(skaleNetwork, chainName, app);
    if (iconPath !== undefined) {
        if (iconPath.default) {
            return <img src={'./' + iconPath.default} />;
        }
        return <img src={iconPath} />;
    }
    return (<OfflineBoltIcon sx={{ color: stringToColor(chainName, dark) }} />);
}
