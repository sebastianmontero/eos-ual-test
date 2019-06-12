import { JsonRpc } from 'eosjs';
import { Asset } from '../domain';
import { EOSUtil } from '../util';

class EosRpc {
    constructor() {
        this.rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    }

    async getCurrencyBalance({
        contract = 'eosio.token',
        account,
        symbol = 'EOS'
    }) {
        const results = await this.rpc.get_currency_balance(contract, account, symbol);
        return results.length ? EOSUtil.stringToAsset(results[0]) : new Asset(0, symbol);
    }

    async getAccount(account) {
        return await this.rpc.get_account(account);
    }

    async getTableRows({
        code,
        scope,
        table,
        tableKey,
        lowerBound,
        limit,
        reverse
    }) {

        return await this.rpc.get_table_rows({
            json: true,
            code,
            scope,
            table,
            table_key: tableKey,
            lower_bound: lowerBound,
            limit,
            reverse
        });
    }

    async getOneTableRow({
        code,
        scope,
        table,
        tableKey,
        lowerBound,
        reverse
    }) {

        const { rows } = await this.getTableRows({
            code,
            scope,
            table,
            tableKey,
            lowerBound,
            reverse,
            limit: 1,
        });

        return rows.length ? rows[0] : null;

    }
}

export default new EosRpc();