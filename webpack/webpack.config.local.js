const path = require('path');

const configPath = path.resolve(__dirname, '..', 'src', 'config', 'config.local.js');

module.exports = require('./webpack.config.base.js')(configPath);