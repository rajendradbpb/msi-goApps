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
   // blockType         :{type: String,enum:constants.blockTypes},
    block               :{type: String},
    urbanType           :{type: String,enum:constants.urbanTypes},
    village             :{type: String},
    name                :{type: String},
    mobile              : {type: String},
    altMobile           : {type: String},
    email               :{type: String},
    digiMail            :{type: String},
    cscId               :{type: String},
    religion            :{type: String},
     urban              :{type: Boolean,default:false},
     gp                 :{type: String},
     ward               :{type: String},
     gender             :{type: String},
     caste              :{type: String},


    // firstname           : {type: String},
    // lastname            : {type: String},
    // middlename          : {type: String},
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
    //educational details
    matricBoard         : {type: String},
    matricInstitute     : {type: String},
    matricPassout       : {type: String},
    matricPercent       : {type: String},
    interBoard          : {type: String},
    interInstitute      : {type: String},
    interPassout        : {type: String},
    interPercent        : {type: String},
    gradBoard           : {type: String},
    gradInstitute       : {type: String},
    gradPassout         : {type: String},
    gradPercent         : {type: String},
    pgBoard             : {type: String},
    pgInstitute         : {type: String},
    pgPassout           : {type: String},
    pgPercent           : {type: String},
    otherQualification  : {type: String},
    //csc details
    cscBuildingArea     : {type: String},
    personEngaged       : {type: String},
    webCamera           : {type: String},
    furnitureDetails    : {type: String},
    vsatBbDcNofn        : {type: String},
    pmgDishaId          : {type: String},
    kit                 : {type: String},
    providingInsurance  : {type: String},
    eWallet             : {type: String},
    censusCode          : {type: String},
    cscLattitude        : {type: String},
    buildingOwnership   : {type: String},
    noOfLaptop          : {type: String},
    noOfPrinters        : {type: String},
    bioMetric           : {type: String},
    commonBranding      : {type: String},
    powerBackUp         : {type: String},
    tab                 : {type: String},
    ProvidingEDistrictServices  : {type: String},
    cscLocation         : {type: String},
    buildingOwnership   : {type: String},
    cscLongitude        : {type: String},
    cscPin              : {type: String},


    // status
    status            : {type: String,enum: constants.userStatus,default:'pending'},
    isDelete          : {type: Boolean, default:false},
});
userSchema.plugin(uniqueValidator, {message: "Email / Mobile already exists"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
