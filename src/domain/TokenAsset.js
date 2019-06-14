import Asset from './Asset';
import { Tokens } from '../const';

class TokenAsset extends Asset {

    constructor(amount = 0, symbol = Tokens.EOS) {
        super(amount, symbol, 4);
    }
}

export default TokenAsset;