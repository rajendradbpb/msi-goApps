/**
 * This file is meant for Logging in server console in log file
 * https://www.npmjs.com/package/log4js
 * https://log4js-node.github.io/log4js-node/layouts.html
 */
 var log4j = require('log4js');
//  log4j.configure({
//   appenders: { 'out': { type: 'stdout', layout: { type: 'basic' }  } },
//   categories: { default: { appenders: ['out'], level: 'info' } }
// });

log4j.configure({
  appenders: {
    everything: { type: 'file', filename: 'logFile', maxLogSize: 102499, backups: 1, compress: true }
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'debug'}
  }
});

 module.exports = log4j;
