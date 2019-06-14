

const parseAssetRegex = /^\s*(-?\d+.?\d*)\s*([a-zA-Z]+)\s*$/;

class Asset {

    constructor(amount, symbol, precision = 4) {
        this.amount = Number(amount);
        this.symbol = symbol;
        this.precision = precision;
    }

    static parse(assetStr) {
        const result = parseAssetRegex.exec(assetStr);
        if (!result) {
            throw new Error('String is not a valid Asset');
        }
        return new this(result[1], result[2]);
    }

    toString() {
        return `${this.amount.toFixed(this.precision)} ${this.symbol}`;
    }
}

export default Asset;