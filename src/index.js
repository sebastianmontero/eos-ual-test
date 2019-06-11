import { Lynx } from 'ual-lynx';
import { Scatter } from 'ual-scatter';
import { UALProvider, withUAL } from 'ual-reactjs-renderer';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import './index.css'


const UALApp = withUAL(App);
UALApp.displayName = 'UAL Test App';

const network = {
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    rpcEndpoints: [{
        protocol: 'http',
        host: 'localhost',
        port: 8888,
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






