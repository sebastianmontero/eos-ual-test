import eosJsRpc from "./EosRpc";

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
        await this.activeUser.signTransaction(
            {
                actions
            },
            {
                broadcast: true
            }
        );
    }

    async transact({
        name,
        data
    }) {
        await this.transactFull([{
            account: this.contractAccount,
            name,
            authorization: [{
                actor: await this.getAccountName(),
                permission: 'active',
            }],
            data,
        }]);
    }
}

export default BaseEosApi;
