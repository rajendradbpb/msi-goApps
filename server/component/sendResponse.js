/**
 * This file is meant for sending response
 * params @status | @message | @description
 */
 var response = require("./response");
 module.exports = function(res,statusCode,status,message,data) {
   return res.status(statusCode).json(response(statusCode,status,message,data));
 }
