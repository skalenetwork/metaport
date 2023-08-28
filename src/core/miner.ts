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
 * @file miner.ts
 * @copyright SKALE Labs 2023-Present
 */

import BN from "bn.js";
import { isHexString, getNumber, randomBytes, keccak256, hexlify, toBeHex } from 'ethers'


interface Params {
    difficulty?: BN;
}


export default class SkalePowMiner {

    public difficulty: BN = new BN(1);

    constructor(params?: Params) {
        if (params && params.difficulty) this.difficulty = params.difficulty;
    }

    public async mineGasForTransaction(nonce: string | number, gas: string | number, from: string, bytes?: string): Promise<any> {
        let address = from;
        nonce = isHexString(nonce) ? getNumber(nonce) : nonce as number;
        gas = isHexString(gas) ? getNumber(gas) : gas as number;
        return await this.mineFreeGas(gas as number, address, nonce as number, bytes);
    }

    public async mineFreeGas(gasAmount: number, address: string, nonce: number, bytes?: string) {
        let nonceHash = new BN((keccak256(toBeHex(nonce, 32))).slice(2), 16);
        let addressHash = new BN((keccak256(address) as string).slice(2), 16);
        let nonceAddressXOR = nonceHash.xor(addressHash)
        let maxNumber = new BN(2).pow(new BN(256)).sub(new BN(1));
        let divConstant = maxNumber.div(this.difficulty);
        let candidate: BN;
        let _bytes: string;
        let iterations = 0

        while (true) {
            const _bt = hexlify(randomBytes(32))
            _bytes = _bt.slice(2);
            candidate = new BN(bytes ?? _bytes, 16);
            let candidateHash = new BN((keccak256(_bt)).slice(2), 16);
            let resultHash = nonceAddressXOR.xor(candidateHash);
            let externalGas = divConstant.div(resultHash).toNumber();
            if (externalGas >= gasAmount) {
                break;
            }
            // every 2k iterations, yield to the event loop
            if (iterations++ % 2_000 === 0) {
                await new Promise<void>((resolve) => setTimeout(resolve, 0));
            }
        }
        return BigInt(candidate)
    }
}