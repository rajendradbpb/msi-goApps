/**
 * This file is meant for giving the custom errors
 * params @status | @message | @description
 */


var createResponse = function(statusCode,status,message,data) {
  var response = {};

  response.statusCode = statusCode;
  response.status = status;
  response.message = message;
  response.data = data;
  return response;
}
exports.sendResponse = function(res,statusCode,status,message,data) {
  return res.status(statusCode).json(createResponse(statusCode,status,message,data));
}
