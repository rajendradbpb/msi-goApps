var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var blockSchema = new mongoose.Schema({
    district        : {type: Schema.Types.ObjectId, ref: 'district'},
    name              : {type: String,unique:true,trim:true},
    createdDate       : {type: Date, default: new Date()},
    isDelete          : {type: Boolean, default:false},
});
blockSchema.plugin(uniqueValidator, {message: "block already exists"});
var blockModel = mongoose.model('block', blockSchema);
module.exports = blockModel;
