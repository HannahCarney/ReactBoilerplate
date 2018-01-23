import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';

import Routes from './routes.js';

import './styles/core.scss';

export default function App({store}) {
    return (
        <Provider store={store}>
            <Routes />
        </Provider>
    );
}
App.propTypes = {
    store: PropTypes.object.isRequired
};