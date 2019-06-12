import React, { Component } from 'react';
import { eosRpc, TokenApi } from '../../service';

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
            console.log(await eosRpc.getOneTableRow({
                code: 'eosio.token',
                scope: 'seb1',
                table: 'accounts'
            }));

            console.log(await eosRpc.getOneTableRow({
                code: 'eosio.token',
                scope: 'seb2',
                table: 'accounts'
            }));
            const asset = await eosRpc.getCurrencyBalance({
                'account': this.state.accountName
            });
            this.setState({ accountBalance: asset.amount });
        } catch (e) {
            console.warn(e);
        }
    }

    async transfer() {
        const { activeUser } = this.state;

        try {
            const tokenApi = new TokenApi(activeUser);
            await tokenApi.transfer({
                to: 'seb2',
                memo: 'UAL rocks!',
                quantity: '1.0000 EOS',

            });
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
                    className='ual-generic-button'> Log In</span>
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
                    Transfer 1 EOS to Seb2
                </span>
            </p>
        );
    }

    renderLogoutButton() {
        const { ual: { activeAuthenticator, logout } } = this.props;
        if (!!this.state.activeUser && !!activeAuthenticator) {
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
        const myBalance = accountBalance ? `Balance: ${accountBalance} EOS` : '';
        const transferBtn = accountBalance && this.renderTransferButton();

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