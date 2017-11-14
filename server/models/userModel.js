var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var password = require('password-hash-and-salt');
var userSchema = new mongoose.Schema({
    role                : {type: Schema.Types.ObjectId, ref: 'role',required: true},
    username            : {type: String,unique : true,required: constants.messages.errors.username},
    password            : {type: String,required: constants.messages.errors.undefinedPassword},
    state               :{type: Schema.Types.ObjectId,default:"Odisha"},
    district            :{type: Schema.Types.ObjectId, ref: 'district'},
    blockType           :{type: String,enum:constants.blockTypes},
    block               :{type: String},
    urbanType           :{type: String,enum:constants.urbanTypes},
    urban               :{type: String},
    mobile              : {type: String},
    firstname           : {type: String},
    lastname            : {type: String},
    middlename          : {type: String},
    pan                 : {type: String},
    adhar               : {type: String},
    dob                 : {type: String},
    plotNo              : {type: String},
    lane                : {type: String},
    at                  : {type: String},
    po                  : {type: String},
    city                : {type: String},
    dist                : {type: String},
    state               : {type: String},
    country             : {type: String},
    pin                 : {type: String},
    // status
    status            : {type: String,enum: constants.userStatus,default:'pending'},
    isDelete          : {type: Boolean, default:false},
});
userSchema.plugin(uniqueValidator, {message: "Email / Mobile already exists"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
