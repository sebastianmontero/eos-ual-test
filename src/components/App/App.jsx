import React, { Component } from 'react';
import { JsonRpc } from 'eosjs';

const defaultState = {
    activeUser: null,
    accountName: '',
    accountBalance: null,
};

class App extends Component {

    static displayName = 'DefaultAppName';

    constructor(props) {
        super(props);
        this.state = {
            ...defaultState,
            rpc: new JsonRpc('http://127.0.0.1:8888'),
        };
        this.updateAccountBalance = this.updateAccountBalance.bind(this);
        this.updateAccountName = this.updateAccountName.bind(this);
        this.renderTransferButton = this.renderTransferButton.bind(this);
        this.transfer = this.transfer.bind(this);
        this.renderModalButton = this.renderModalButton.bind(this);
    }

    componentDidUpdate() {
        const { ual: { activeUser } } = this.props;
        if (activeUser && !this.state.activeUser) {
            this.setState({ activeUser }, this.updateAccountName);
        } else if (!activeUser && this.state.activeUser) {
            this.setState(defaultState);
        }
    }

    async updateAccountName() {
        try {
            const accountName = await this.state.activeUser.getAccountName();
            this.setState({ accountName }, this.updateAccountBalance);
        } catch (e) {
            console.warn(e);
        }
    }

    async updateAccountBalance() {
        try {
            const account = await this.state.rpc.get_account(this.state.accountName);
            console.log(account);
            const accountBalance = account.core_liquid_balance;
            this.setState({ accountBalance });
        } catch (e) {
            console.warn(e);
        }
    }

    async transfer() {
        const { accountName, activeUser } = this.state;

        try {
            await activeUser.signTransaction({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: accountName, // use account that was logged in
                        permission: 'active',
                    }],
                    data: {
                        from: accountName, // use account that was logged in
                        to: 'seb2',
                        memo: 'UAL rocks!',
                        quantity: '1.0000 EOS',
                    },
                }],
            },
                { broadcast: true });
            this.updateAccountBalance();
        } catch (err) {
            console.warn(err);
        }
    }

    renderModalButton() {
        return (
            <p className='ual-btn-wrapper'>
                <span
                    role='button'
                    onClick={this.props.ual.showModal}
                    className='ual-generic-button'> Show UAL Modal</span>
            </p>
        );
    }

    renderTransferButton() {
        return (
            <p className='ual-btn-wrapper'>
                <span
                    role='button'
                    onClick={this.transfer}
                    className='ual-generic-button blue'>
                    Transfer 1 eos to example
                </span>
            </p>
        );
    }

    renderLogoutButton() {
        const { ual: { activeUser, activeAuthenticator, logout } } = this.props;
        if (!!activeUser && !!activeAuthenticator) {
            return (
                <p className='ual-btn-wrapper'>
                    <span
                        role='button'
                        onClick={logout}
                        className='ual-generic-button red'>
                        Logout
                </span>
                </p>
            );
        }
    }

    render() {
        const { ual: { activeUser } } = this.props;
        const { accountBalance, accountName } = this.state;
        console.log(`balance: ${accountBalance}, name: ${accountName}`);
        const modalButton = !activeUser && this.renderModalButton();
        const loggedIn = accountName ? `Logged in as ${accountName}` : '';
        const myBalance = accountBalance ? `Balance: ${accountBalance}` : '';
        const transferBtn = accountBalance && this.transferBtn();

        return (
            <div style={{ textAlign: 'center' }}>
                {modalButton}
                <h3 className='ual-subtitle'>{loggedIn}</h3>
                <h4 className='ual-subtitle'>{myBalance}</h4>
                {transferBtn}
                {this.renderLogoutButton()}
            </div>
        );

    }
}

export default App;