class Asset {

    constructor(amount, symbol) {
        this.amount = Number(amount);
        this.symbol = symbol;
    }

    toString() {
        return `${this.amount} ${this.symbol}`;
    }
}

export default Asset;