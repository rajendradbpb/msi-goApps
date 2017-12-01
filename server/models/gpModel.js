var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var gpSchema = new mongoose.Schema({
    block          : {type: Schema.Types.ObjectId, ref: 'block'},
    name           : {type: String,trim:true},
    createdDate    : {type: Date, default: new Date()},
    isCover           : {type: Boolean, default: false},
    isDelete       : {type: Boolean, default:false},
});
gpSchema.plugin(uniqueValidator, {message: "gp already exists"});
var gpModel = mongoose.model('gp', gpSchema);
module.exports = gpModel;
