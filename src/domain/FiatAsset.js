import Asset from './Asset';
import { Currencies } from '../const';

class FiatAsset extends Asset {

    constructor(amount = 0, symbol = Currencies.USD) {
        super(amount, symbol, 2);
    }
}

export default FiatAsset;