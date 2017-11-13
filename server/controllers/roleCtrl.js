var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('roleCtrl');
exports.addRole = function(req,res){
  try {
    new models.roleModel(req.body).save(function (err) {
      if(err){
        logger.error("addRole ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.saveRole,err);
      }
      else {
        return response.sendResponse(res,200,"success",constants.messages.success.saveRole);
      }
    })

  } catch (e) {
    logger.error("addRole ", e);
  }
}
exports.getRole = function(req,res){
  try {
    var params = {
      isDelete:false,
      //type:{$in:["aa","consultant","bm"]}
    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    models.roleModel.find(params,function(err,data){
      if(err){
        logger.error("getRole ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.fetchRoles,err);
      }
      return response.sendResponse(res,200,"success",constants.messages.success.fetchRoles,data);
    })

  } catch (e) {
    logger.error("getRole ", e);
  }
}
exports.udpateRole = function(req,res){
  try {
    var query = {
      "_id":req.body._id
    }
    delete req.body['_id'];
    var options = {new:true};
    models.roleModel.findOneAndUpdate(query, req.body,options).exec()
    .then(function(data) {
      return response.sendResponse(res,200,"success",constants.messages.success.udpateRole,data);
    })
    .catch(function(err) {
      logger.error("udpateRole ", err);
      return response.sendResponse(res, 500,"error",constants.messages.error.udpateRole,err);
    })

  } catch (e) {
    logger.error("udpateRole ", e);
  }
}
exports.deleteRole = function(req,res){
  try {
    var query = {
      "_id":req.params.id
    }
    delete req.body['_id'];
    models.roleModel.findOneAndUpdate(query,{"isDelete":true},{"new" :true},function(err,data) {
      if(err){
        logger.error("deleteRole ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.deleteRole,err);
      }
      else
      return response.sendResponse(res,200,"success",constants.messages.success.deleteRole);
    })

  } catch (e) {
    logger.error("deleteRole ", e);
  }
}
