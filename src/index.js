import { Lynx } from 'ual-lynx';
import { Scatter } from 'ual-scatter';
import { UALProvider, withUAL } from 'ual-reactjs-renderer';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import './index.css'


const UALApp = withUAL(App);
UALApp.displayName = 'UAL Test App';

const {
    REACT_APP_EOS_HTTP_ENDPOINT_PROTOCOL,
    REACT_APP_EOS_HTTP_ENDPOINT_HOST,
    REACT_APP_EOS_HTTP_ENDPOINT_PORT,
    REACT_APP_EOS_CHAIN_ID
} = process.env;

const network = {
    chainId: REACT_APP_EOS_CHAIN_ID,
    rpcEndpoints: [{
        protocol: REACT_APP_EOS_HTTP_ENDPOINT_PROTOCOL,
        host: REACT_APP_EOS_HTTP_ENDPOINT_HOST,
        port: REACT_APP_EOS_HTTP_ENDPOINT_PORT,
    }]
};

const appName = 'My App';
const lynx = new Lynx([network]);
const scatter = new Scatter([network], { appName });

ReactDOM.render(
    <UALProvider chains={[network]} authenticators={[lynx, scatter]} appName={appName}>
        <UALApp />
    </UALProvider>,
    document.getElementById('root'),
);






