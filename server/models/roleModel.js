var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var roleSchema = new mongoose.Schema({
    type              : {type: String,unique:true,enum: constants.roles,trim:true},
    createdDate       : {type: Date, default: new Date()},
    isDelete          : {type: Boolean, default:false},
});
roleSchema.plugin(uniqueValidator, {message: "Role already exists"});
var roleModel = mongoose.model('role', roleSchema);
module.exports = roleModel;
