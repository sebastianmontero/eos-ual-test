import { Contracts, PriceTypes, Tokens } from '../const';
import { FiatAsset, TokenAsset } from '../domain';
import { TimeUtil } from '../util';
import BaseEosApi from './BaseEosApi';
import { privateDecrypt } from 'crypto';

class TradeApi extends BaseEosApi {

    constructor(activeUser) {
        super(activeUser, 'tradatrada11');
    }

    /**
     * All amounts should be Asset objects
     * TODO change from allow_partial to min_transaction when ready in contract
     */
    async create({
        orderType,
        amount,
        priceType,
        pricePerEos,
        priceVar,
        paymentMethods,
        minTrx,
    }) {

        let actions = [];
        amount = amount.toString();
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
                    price_per_eos: priceType === PriceTypes.EXACT_PRICE ? pricePerEos.toString() : new FiatAsset(),
                    price_var: priceType === PriceTypes.MARKET_VAR ? priceVar : 0,
                    payment_methods: paymentMethods,
                    allow_partial: minTrx ? 1 : 0,
                }
            }),
        );

        await this.transactFull(actions);
    }

    /**
     * All amounts should be asset objects
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
                quantity: quantity.toString(),
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

        const { rows, more } = await this.getTableRows({
            table: 'orders',
            tableKey,
            lowerBound,
            limit,
            reverse,
        });

        const parsedRows = rows.map((row) => {
            return {
                orderKey: row.order_key,
                creator: row.creator,
                counterParty: row.counter_party,
                origAmount: TokenAsset.parse(row.orig_eos_amount),
                amount: TokenAsset.parse(row.eos_amount),
                orderValue: FiatAsset.parse(row.order_value_usd),
                minTrx: TokenAsset.parse(row.min_trx),
                feePaid: TokenAsset.parse(row.fee_paid),
                orderType: row.order_type,
                priceType: row.price_type,
                pricePerEos: FiatAsset.parse(row.price_per_eos),
                quantity: new TokenAsset(row.eos_quantity, Tokens.EOS),
                priceVar: row.price_type === PriceTypes.MARKET_VAR ? Number(row.price_var) : null,
                paymentMethods: row.payment_methods.map(x => x.toUpperCase()),
                orderStatus: row.order_status,
                createdAt: TimeUtil.fromUnixTimestamp(row.created_date),
                updatedAt: TimeUtil.fromUnixTimestamp(row.updated_date),
                creatorApprovedPayAt: row.creator_approved_pay ? TimeUtil.fromUnixTimestamp(row.creator_approved_pay) : null,
                counterPartyApprovedPayAt: row.counterparty_approved_pay ? TimeUtil.fromUnixTimestamp(row.counterparty_approved_pay) : null,
            };
        });

        return {
            rows: parsedRows,
            more,
        };

    }

    async getSellOrders() {
        return await this.getOrders({});
    }

    async getBuyOrders() {
        return await this.getOrders({});
    }


}

export default TradeApi;