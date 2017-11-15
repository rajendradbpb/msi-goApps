var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var LOG = require('./../component/LOG');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var vleModel = require("./../models/vleModel");
var password = require('password-hash-and-salt');
var jwt = require('jsonwebtoken');
var config = require('config');
var validator = require('validator');
var component = require('./../component/index');
var logger = require("./../component/log4j").getLogger('vleCtrl');
var models = require('./../models/index');
var waterfall = require('async-waterfall');
// var async = require('async');
var utility = require('./../component/utility');
var passwordHash = require('password-hash-and-salt');
/*
 * this will be executed if authentication passes
 */


exports.addVle = function(req,res){
  try {
    new models.vleModel(req.body).save(function (err) {
      if(err){
        logger.error("addVle ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.saveRole,err);
      }
      else {
        return response.sendResponse(res,200,"success",constants.messages.success.saveRole);
      }
    })

  } catch (e) {
    logger.error("addVle ", e);
  }
}
exports.getVle = function(req,res){
  try {
    var params = {
      isDelete:false,
      //type:{$in:["aa","consultant","bm"]}
    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    if(req.query.district){
      params['district'] = req.query.district;
    }
    models.vleModel.find(params,function(err,data){
      if(err){
        logger.error("getVle ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.fetchRoles,err);
      }
      return response.sendResponse(res,200,"success",constants.messages.success.fetchRoles,data);
    })

  } catch (e) {
    logger.error("getRole ", e);
  }
}
// exports.verifiedUser = function(req, res, isError) {
//   console.log("verified in ctrl");
//   if (!isError) {
//     response.sendResponse(res, 200, "success", constants.messages.success.verified);
//   } else {
//     console.log(isError);
//     response.sendResponse(res, 200, "success", constants.messages.errors.verified);
//   }
// }
// var refreshToken = function(_id,callback){
//   var user;
//   models.userModel.findById(_id).populate('role')
//   .exec()
//   .then(function(data){
//     user = data;
//     return jwt.sign(user, config.token.secret, {
//             expiresIn: config.token.expiry
//           })
//     //callback(false,user);
//   })
//   .then(function(token){
//     var data = {
//       user:user,
//       token:token
//     }
//     callback(false,data);
//   })
//   .catch(function(err){
//     callback(err,false);
//   })

// }
// exports.login = function(req, res) {
//   console.log("coming to server side control");
//   // creating token that will send to the client side

//   try {
//     var token = jwt.sign(req.user, config.token.secret, {
//         expiresIn: config.token.expiry
//       },

//       function(token) {
//         var data = {
//           user:req.user,
//           token: token
//         }
//         response.sendResponse(res, 200, "success", constants.messages.success.login, data);
//       });

//   } catch (e) {
//     LOG.error(e);
//     logger.error("login  "+e);
//     response.sendResponse(res, 500, "error", constants.messages.errors.login, e);
//   }
// }
// exports.addVle = function(req, res) {
//   LOG.info("add vle");
//   // cheking validation
//   try {

//     // if (
//     //   component.utility.isEmpty(req.body.password) ||
//     //   component.utility.isEmpty(req.body.email) ||
//     //   component.utility.isEmpty(req.body.mobile) ||
//     //   component.utility.isEmpty(req.body.role)
//     // ) {
//     //   return response.sendResponse(res, 400, "error", constants.statusCode['400']);
//     // }
//     var rawPassword = req.body.password;
//     models.roleModel.findById(req.body.role)
//     .then(function(role) {
//       console.log(role + ">>>>>");
//       if (!role) {
//         return response.sendResponse(res, 400, "error", constants.statusCode['400']);
//       }
//       password(req.body.password).hash(function(error, hash) {
//         req.body.password = hash; // encrypting the password
//         new userModel(req.body).save(function(err, user) {
//           if (err) {
//             LOG.error(err.message);
//             logger.error("addUser  "+err);
//             return response.sendResponse(res, 500, "error", constants.messages.errors.saveUser, err);
//           } else {
//             LOG.info("User saved !!!!");
//             response.sendResponse(res, 200, "success", constants.messages.success.saveUser);
//             // sending email verification
//             var data = {
//               templateType: "new_user",
//               email: user.email,
//               mobile: user.mobile,
//               name: user.firstName && user.lastName ? user.firstName + " "+ user.lastName : user.email.split("@")[0],
//               company: constants.companyDetails.name,
//               password : rawPassword
//             }
//             utility.sendVerificationMail(data, function(err, success) {
//               if (err) {
//                 LOG.error("mail error send  error"+err);
//                 logger.error("addUser  "+err);
//                 // return response.sendResponse(res, 500, "error", constants.messages.errors.forgetPasswordFailed, err);
//               } else {
//                 LOG.info("mail error send  success");
//                 // return response.sendResponse(res, 200, "success", constants.messages.success.verificationMailSent);
//               }
//             })
//           }
//         })
//       })
//     })
//     .catch(function(err) {
//       logger.error("addUser  "+err);
//       response.sendResponse(res, 500, "error", constants.messages.errors.saveUser, err);
//     })
//   } catch (e) {
//     logger.error("addUser  "+e);
//   }


// }
// this only send client users only , for admin perspective
// exports.getUser = function(req, res) {
//   try {
//     var params = {
//       isDelete: false
//     };

//     if (req.query.role) {
//       params['role'] = req.query.role;
//     }
//     // console.log("req.query._id   " + req.query._id);
//     if (req.query._id) {
//       var filter = {};
//         params['_id'] = req.query._id;

//       if(req.query.viewType == "list"){
//         filter = 'firstName lastName email';
//       }
//       userModel.findOne(params,function(err,user) {
//         return response.sendResponse(res, 200, "success", constants.messages.success.getUser, user);
//       })
//       // .catch(function(error) {
//       //   return response.sendResponse(res, 200, "error", constants.messages.errors.getUser, error);
//       // })
//     } else {
//       // listing service
//       var populateObj = {
//         path : "role"
//       };
//       // if(req.query.userType == "in") // external user - client
//       // {
//       //   populateObj["match"] =  { "type": { "$eq": 'client' } }
//       // }
//       if(!req.query.role && req.query.userType == "in") // internal user - except client
//       {
//         populateObj["match"] =  { "type": { "$ne": 'client' } }
//       }
//       else if(!req.query.role && req.query.userType == "clients") // client user
//       {
//         populateObj["match"] =  { "type": { "$eq": 'client' } }
//       }
//       // else if(!req.query.role &&  (req.query.userType == "in" || !req.query.userType) ) {
//       //   populateObj["match"] =  { "type": { "$eq": 'client' } }
//       // }
//       userModel.find(params)
//       .populate(populateObj)
//       .select('username email role mobile firstname lastname middlename status ')
//       .then(function(users) {
//         users = users.filter(function(user) {
//           if (user.role)
//           return user; // return only users with email matching 'type: "Gmail"' query
//         });
//         return response.sendResponse(res, 200, "success", constants.messages.success.getUser, users);
//       })
//       .catch(function(error) {
//         logger.error("getUser  "+error);
//         return response.sendResponse(res, 200, "error", constants.messages.errors.getUser, error);
//       })
//     }

//   } catch (e) {
//     logger.error("getUser  "+error);
//   }

// }
// exports.udpateUser = function(req, res) {
//   try {
//     var query = {
//       "_id": req.body._id
//     }
//     delete req.body['_id'];
//     var options = {
//       new: true
//     };
//     // check for the base64 data in request to upload Failed

//     waterfall([
//       function(callback) {
//         if(!req.body.panDetails)
//         callback(null);
//         else{
//           // upload base 64 file
//           utility.uploadImage(req.body.panDetails,function(err,imagePath){
//             if(err){
//               logger.error("udpateUser  "+err);
//               callback(err);
//             }
//             else{
//               req.body.pan = imagePath;
//               callback(null);
//             }
//           })
//         }
//         //callback(Error('Demo Error'), 'one', 'two');
//       },
//       function(callback) {
//         if(!req.body.adharDetails)
//         callback(null);
//         else{
//           // upload base 64 file
//           utility.uploadImage(req.body.adharDetails,function(err,imagePath){
//             if(err){
//               logger.error("udpateUser  "+err);
//               callback(err);
//             }
//             else{
//               req.body.adhar = imagePath;
//               callback(null);
//             }
//           })
//         }
//       }
//     ], function(err, result) {
//       if (err) {
//         logger.error("udpateUser  "+err);
//         LOG.error(err)
//       }
//       else{
//         userModel.findOneAndUpdate(query, req.body, options).exec()
//         .then(function(data) {

//           refreshToken(data._id,function(err,data){
//             if(err){
//               logger.error("udpateUser  "+err);
//               return response.sendResponse(res,500, "error", constants.messages.errors.saveUser, err);
//             }
//             else
//             return response.sendResponse(res, 200, "success", "rrrrrrr", data);
//           })
//           // return response.sendResponse(res, 200, "success", constants.messages.success.saveUser, data);
//         })
//         .catch(function(err) {
//           logger.error("udpateUser  "+err);
//           return response.sendResponse(res, 500, "error", "qqqqqq", err);
//         })
//       }
//     });

//   } catch (e) {
//     logger.error("udpateUser  "+err);
//   }
// }
// exports.deleteUser = function(req, res) {
//   try {
//     var query = {
//       "_id": req.params.id
//     }
//     delete req.body['_id'];
//     userModel.findOneAndUpdate(query, {
//       "isDelete": true
//     }, {
//       "new": true
//     }, function(err, data) {
//       if (err){
//         logger.error("deleteUser  "+err);
//         response.sendResponse(res, 500, "error", constants.messages.errors.deleteRole, err);
//       }
//       else
//       response.sendResponse(res, 200, "success", constants.messages.success.deleteRole);
//     })

//   } catch (e) {
//     logger.error("deleteUser  "+err);
//   }
// }

// exports.changePassword = function(req,res){
//   try {
//     component.utility.validateNull(req,res,"body","oldPassword","newPassword");
//     userModel.findOne({ $or: [{"email":req.user._doc.email},{'mobile':req.user._doc.mobile}]}).populate('role').exec(function (err, user) {
//       if (err) {
//         logger.error("changePassword  "+err);
//         return done(err);
//        }
//       if (!user) { return done(null, false); }
//       passwordHash(req.body.oldPassword).verifyAgainst(user.password,function(error, verified) {
//         console.log("after verification ",error,user);
//         if (error) {
//           // db error
//           logger.error("changePassword  "+error);
//           response.sendResponse(res, 500, "error", constants.messages.errors.changePassword, err);
//         }
//         else if (!verified) {
//           // password not matched
//           response.sendResponse(res, 401, "error", constants.messages.errors.oldPasswordError);
//         }
//         else {
//           // update new password
//           password(req.body.newPassword).hash(function(error, hash) {
//             userModel.findByIdAndUpdate(user._id, { $set: { password: hash }}, { new: true }, function (err, user) {
//               if (err){
//                 logger.error("changePassword  "+error);
//                 response.sendResponse(res, 500, "error", constants.messages.errors.changePassword, err);
//               }
//               else{
//                 response.sendResponse(res, 200, "success", constants.messages.success.changePasswordSuccess);
//               }
//             });

//           })
//         }
//       })
//     });

//   } catch (e) {
//     logger.error("changePassword  "+e);
//   }
// }

// exports.forgotPassword = function(req,res) {
//   try {

//     if(!req.body.email){
//       return response.sendResponse(res, 400, "error", constants.statusCode['400']);
//     }
//     else{
//       models.userModel.find({email:req.body.email}).exec()
//       .then(function(user) {
//         console.log(user);
//         if(!user.length){
//           // no data found.
//           return response.sendResponse(res, 402, "warning", constants.messages.errors.emailNotFound);
//         }
//         else{
//           // get the random PASSOWORD
//           var alphaNumeric = utility.getAlphaNumeric();
//           password(alphaNumeric).hash(function(error, hash) {
//             if(error){
//               logger.error("forgotPassword  "+error);
//               return response.sendResponse(res, 500, "error", constants.messages.errors.saveData);
//             }
//             else{
//               // saving user password with random password
//               var query = {
//                 email : req.body.email
//               }
//               var update = {
//                 password : hash
//               }
//               var option = {
//                 new:true
//               }
//               models.userModel.findOneAndUpdate(query,update,option,function(error,user){
//                 if(error){
//                   logger.error("forgotPassword  "+error);
//                   return response.sendResponse(res, 500, "error", constants.messages.errors.saveData);
//                 }
//                 else{

//                   // sending email verification
//                   var data = {
//                     templateType: "forgot_password",

//                     email: user.email,
//                     mobile: user.mobile,
//                     name: user.firstName && user.lastName ? user.firstName + " "+ user.lastName : user.email.split("@")[0],
//                     company: constants.companyDetails.name,
//                     password : alphaNumeric
//                   }
//                   console.log('data >>>>>>>>',data);
//                   utility.sendVerificationMail(data, function(err, success) {
//                     if (err) {
//                       logger.error("forgotPassword  "+err);
//                       LOG.error("mail error send  error"+err);
//                       return response.sendResponse(res, 500, "error", constants.messages.errors.mailSend);
//                       // return response.sendResponse(res, 500, "error", constants.messages.errors.forgetPasswordFailed, err);
//                     } else {
//                       LOG.info("mail error send  success");
//                       return response.sendResponse(res, 200, "success", constants.messages.success.mailSend);
//                       // return response.sendResponse(res, 200, "success", constants.messages.success.verificationMailSent);
//                     }
//                   })
//                 }
//               })
//             }
//           })
//         }
//       })
//       .catch(function(error) {
//         logger.error("forgotPassword  "+error);
//         return response.sendResponse(res, 500, "error", constants.messages.errors.saveData,error);
//       })
//     }
//   } catch (e) {
//     logger.error("forgotPassword  "+e);
//   }
// }

// exports.getReferral = function(req,res) {
//   var params = {};
//   if(req.user._doc.role.type !="superAdmin"){
//     params['referredBy'] = req.user._doc._id;
//   }
//   models.referralModel.find(params).populate("returnFile","itrId tranStatus tranVerification fileDate client status")
//   .exec()
//   .then(function(referral) {
//     return response.sendResponse(res, 200, "success", constants.messages.success.getData,referral);
//   })
//   .catch(function(error) {
//     return response.sendResponse(res, 500, "error", constants.messages.errors.getData,error);
//   })
// }
