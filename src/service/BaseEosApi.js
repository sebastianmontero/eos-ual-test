import eosJsRpc from "./EosRpc";
import RequestError from "../error/RequestError";
import { Util } from '../util';

class BaseEosApi {
    constructor(activeUser, contractAccount) {
        this.setActiveUser(activeUser);
        this.rpc = eosJsRpc;
        this.contractAccount = contractAccount;
    }

    setActiveUser(activeUser) {
        this.activeUser = activeUser;
    }

    async getAccountName() {
        return await this.activeUser.getAccountName();
    }

    async transactFull(actions) {
        console.log(actions);

        try {
            await this.activeUser.signTransaction(
                {
                    actions
                },
                {
                    broadcast: true
                }
            );
        } catch (err) {
            const { cause } = err;
            if (cause) {
                const code = Util.getProperty(cause, 'json.code', 0);
                throw new RequestError(cause.message, code, err);
            }
            throw err;
        }
    }

    async transact({
        name,
        data,
    }) {
        const action = await this._formatAction({
            name,
            data,
        });
        await this.transactFull([action]);
    }


    async _formatAction({
        account,
        name,
        data
    }) {
        account = account || this.contractAccount;
        return {
            account,
            name,
            authorization: [{
                actor: await this.getAccountName(),
                permission: 'active',
            }],
            data,
        };
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

        code = code || this.contractAccount;
        scope = scope || this.contractAccount;

        return await this.rpc.getTableRows({
            code,
            scope,
            table,
            tableKey,
            lowerBound,
            limit,
            reverse
        });
    }
}

export default BaseEosApi;
