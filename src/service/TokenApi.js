import BaseEosApi from './BaseEosApi';

class TokenApi extends BaseEosApi {

    constructor(activeUser) {
        super(activeUser, 'eosio.token');
    }

    async transfer({
        to,
        quantity,
        memo
    }) {
        return await this.transact({
            name: 'transfer',
            data: {
                from: await this.getAccountName(),
                to,
                quantity,
                memo
            }
        });
    }
}

export default TokenApi;