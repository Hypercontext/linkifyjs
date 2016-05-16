// Karma Chrome configuration
// Just opens Google Chrome for testing

var
base = require('./amd.conf'),
extend = require('lodash/extend');

module.exports = function (config) {

  config.set(extend(base, {

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    browsers: ['Firefox']
  }));
};
