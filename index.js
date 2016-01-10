'use strict';

const path = require('path');

module.exports = require(path.join(__dirname, 'lib/bitmapTransformer'));
module.exports.getHeaders = require(path.join(__dirname, 'lib/bitmapHeaders'));
