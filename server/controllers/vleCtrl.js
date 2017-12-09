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
    // models.vleModel.preSave();
    console.log("add vle");
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

    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    if(req.query.urban){
      params['urban'] = req.query.urban;
    }
    if(req.query.district){
      params['district'] = req.query.district;
    }
    if(req.query.block){
      params['block'] = req.query.block;
    }
    if(req.query.gp){
      params['gp'] = req.query.gp;
    }
    models.vleModel.find(params).populate('district block gp').exec()
    .then(function(data){
        return response.sendResponse(res,200,"success",constants.messages.success.fetchRoles,data);
    })
    .catch(function(err){
        return response.sendResponse(res,500,"error",constants.messages.errors.fetchRoles,err);
    })

  } catch (e) {
    logger.error("getRole ", e);
  }
}
exports.getDistrictCount = function(req,res){
  try {
    var params = {
      isDelete:false,
      //type:{$in:["aa","consultant","bm"]}
    };
    // if(req.query._id){
    //   params['_id'] = req.query._id;
    // }
    if(req.query.distinct == "district"){
      distinct = 'district';
    }
    if(req.query.distinct == "gp"){
      distinct = 'gp';
    }
    if(req.query.distinct == "Municipality"){
      params['urbanType'] = req.query.urbanType;
      distinct = 'urbanType';
    }

    models.vleModel.find(params).distinct(distinct, function(err,data){
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

exports.exportVle = function(req,res){

    var params = {
      isDelete:false,
    };
    if(req.query.district == "district"){
      params.district = req.query.district;
    }
    if(req.query.block){
      params.block = req.query.block;
    }
    if(req.query.gp){
      params.gp = req.query.gp;
    }
    if(req.query.distinct == "Municipality"){
      params['urbanType'] = req.query.urbanType;
      distinct = 'urbanType';
    }

    models.vleModel.find(params).populate("district block gp").exec()
    .then(function(data){
      var dataArr = [];
      for(var i in data){
        var obj = {};
        obj.district = data[i].district ? data[i].district.name : "NA";
        obj.block = data[i].block ? data[i].block.name : "NA";
        obj.gp = data[i].gp ? data[i].gp.name : "NA";
        obj.name = data[i].name ? data[i].name : "NA";
        obj.urbanType = data[i].urbanType ? data[i].urbanType : "NA";
        dataArr.push(obj);
        };

      // return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
      component.utility.downloadXls(res,dataArr,null,'vleList','vle');
    })
    .catch(function(error){
      return response.sendResponse(res,500,"error",constants.messages.errors.getData,error);
    })
}
