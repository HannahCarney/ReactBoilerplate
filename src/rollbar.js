/* global __COMMIT_SHA__ */

import Rollbar from 'rollbar';
import merge from 'lodash.merge';
import config from 'config';
import {TokenExpiredError} from './api.js';

const defaultConfig = {
    captureUncaught: true,
    captureUnhandledRejections: false,
    enabled: false,
    payload: {
        client: {
            javascript: {
                source_map_enabled: true,
                code_version: __COMMIT_SHA__
            }
        }
    }
};

const mergedConfig = merge({}, defaultConfig, config.ROLLBAR);

let instance;

if (mergedConfig.enabled) {
    instance = new Rollbar(mergedConfig);
    window.addEventListener('unhandledrejection', (event) => {
        let reason = event.reason;
        let promise = event.promise;
        let detail = event.detail;

        if (!reason && detail) {
            reason = detail.reason;
            promise = detail.promise;
        }

        if (reason instanceof TokenExpiredError) {
            //don't report token expired errors to rollbar
            return;
        }

        let requestConfig = reason.config;
        if (requestConfig) {
            let response = reason.response;
            instance.error('unhandled response error', {
                url: requestConfig.url,
                data: response ? response.data : undefined,
                status: response ? response.status : undefined
            });
        } else {
            instance.handleUnhandledRejection(reason, promise);
        }
    });
}

export default {
    error: (...args) => instance ? instance.error(...args) : null   
};