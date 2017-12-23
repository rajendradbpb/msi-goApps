/*
* this is used to load the required modules if not loaded else return the same
*/
var color =require("color");
var mongoose = require("mongoose");
var config = require("config");
exports.getConnection = function() {
  // dbserver, hostName, port, dbName
  if(!global.connection)
    createConnection();
  return global.connection;
}
var createConnection = function() {
  // dbserver, hostName, port, dbName
  try {
    global.connection = mongoose.connect(config.get(config.get("env")+".dbserver")+config.get(config.get("env")+".hostName")+config.get(config.get("env")+".port")+"/"+config.get(config.get("env")+".db"));
    console.log("connection created ",config.get(config.get("env")+".dbserver")+config.get(config.get("env")+".hostName")+config.get(config.get("env")+".port")+"/"+config.get(config.get("env")+".db"));
  } catch (e) {
    console.log("error in getConnection ",e);
  }
}
