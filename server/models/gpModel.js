var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
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
gpSchema.plugin(deepPopulate, {
  whitelist: [
    'block.district'
  ]
});
var gpModel = mongoose.model('gp', gpSchema);
module.exports = gpModel;
