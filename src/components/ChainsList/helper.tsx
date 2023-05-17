import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import { chainIconPath } from '../TokenList/helper';


function stringToColor(_, dark) {
    if (dark) {
        // return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
        return 'hsl(120deg 2% 88%)';
    }
    return 'hsl(0deg 0% 15%)';
    // return `hsl(${hashCode(str) % 360}, 55%, 40%)`;
}


export function getChainIcon(skaleNetwork: string, chainName: string, dark: boolean, app?: string) {
    const iconPath = chainIconPath(skaleNetwork, chainName, app);
    if (iconPath !== undefined) {
        if (iconPath.default) {
            return <img src={'./' + iconPath.default} className='eth-logo' height='20px' width='20px' />;
        }
        return <img src={iconPath} className='eth-logo' height='20px' width='20px' />;
    }
    return (<OfflineBoltIcon sx={{ color: stringToColor(chainName, dark) }} width='20px' />);
}
