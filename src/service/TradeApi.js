import { Contracts } from '../const';
import BaseEosApi from './BaseEosApi';

class TradeApi extends BaseEosApi {

    constructor(activeUser) {
        super(activeUser, 'tradatrada11');
    }

    /**
     * 
     * TODO change from allow_partial to min_transaction when ready in contract
     */
    async create({
        orderType,
        amount,
        priceType,
        pricePerEos,
        priceVar,
        paymentMethods,
        minTransaction,
    }) {

        let actions = [];
        actions.push(
            await this._formatAction({
                account: Contracts.EOSIO_TOKEN,
                name: 'transfer',
                data: {
                    from: await this.getAccountName(),
                    to: Contracts.TRADA,
                    quantity: amount,
                    memo: 'Offer creation',
                }
            }),
        );

        actions.push(
            await this._formatAction({
                name: 'create',
                data: {
                    account: await this.getAccountName(),
                    order_type: orderType,
                    amount,
                    price_type: priceType,
                    price_per_eos: pricePerEos,
                    price_var: priceVar,
                    payment_methods: paymentMethods,
                    allow_partial: minTransaction ? 1 : 0,
                }
            }),
        );

        await this.transactFull(actions);
    }

    /**
     * 
     * TODO include acceptedPaymentMethod when added in contract
     */
    async accept({
        orderKey,
        quantity,
        acceptedPaymentMethod,//Not yet in action
    }) {

        await this.transact({
            name: 'accept',
            data: {
                order_key: orderKey,
                counterparty: await this.getAccountName(),
                quantity,
            }
        });
    }

    /**
     * 
     * TODO include acceptedPaymentMethod when added in contract
     */
    async approvePayment({
        orderKey,
    }) {

        await this.transact({
            name: 'approvepay',
            data: {
                order_key: orderKey,
                approver: await this.getAccountName(),
            }
        });
    }

    async cancel({
        orderKey,
    }) {

        await this.transact({
            name: 'cancel',
            data: {
                order_key: orderKey,
            }
        });
    }

    async getOrders({
        tableKey,
        lowerBound,
        limit,
        reverse,
    }) {
        return await this.getTableRows({
            table: 'orders',
            tableKey,
            lowerBound,
            limit,
            reverse,
        });
    }

    async getSellOrders() {
        return await this.getOrders({});
    }

    async getBuyOrders() {
        return await this.getOrders({});
    }


}

export default TradeApi;