const path = require('path');

const configPath = path.resolve(__dirname, '..', 'src', 'config', 'config.development.js');

module.exports = require('./webpack.config.base.js')(configPath);