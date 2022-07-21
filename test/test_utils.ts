import Web3 from 'web3';
import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import * as dotenv from "dotenv";


dotenv.config();

export const CHAIN_NAME_SCHAIN = (process.env["CHAIN_NAME_SCHAIN"] as string);
export const CHAIN_NAME_SCHAIN_2 = (process.env["CHAIN_NAME_SCHAIN_2"] as string);

export const MAINNET_CHAIN_NAME = 'Mainnet';

export const NETWORK_NAME = (process.env["NETWORK_NAME"] as string);
