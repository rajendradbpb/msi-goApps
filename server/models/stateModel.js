var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var stateSchema = new mongoose.Schema({
    name              : {type: String,unique:true},
    createdDate       : {type: Date, default: new Date()},
    isDelete          : {type: Boolean, default:false},
});
stateSchema.plugin(uniqueValidator, {message: "State already exists"});
var stateModel = mongoose.model('state', stateSchema);
module.exports = stateModel;
