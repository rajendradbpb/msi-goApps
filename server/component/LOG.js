/**
 * This file is meant for Logging in server console
 *   - type of logs
 @messsge - content
 */
var colors = require('colors');

exports.dedug = function(message) {
  console.log("DEBUG "+ message);
}
exports.info = function(message) {
  console.log(colors.green("INFO "+ message));
}
exports.error = function(message) {
  console.log(colors.red("ERROR "+ message));
}
