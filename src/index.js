import './rollbar.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {persistStore} from 'redux-persist';

import store from './store.js';
import App from './app.js';
import Api from './api.js';

Api._setStore(store);

persistStore(store, {
    whitelist: ['login'],
    keyPrefix: `${__APP_NAME__}:`
}, () => {
    ReactDOM.render(<App store={store} />, document.getElementById('root'));
});