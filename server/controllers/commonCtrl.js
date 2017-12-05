var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('commonCtrl');

/*state crud starts */
exports.addState = function(req,res){
  try {
    new models.stateModel(req.body).save(function (err) {
      if(err){
        logger.error("addState ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.saveState,err);
      }
      else {
        return response.sendResponse(res,200,"success",constants.messages.success.saveState);
      }
    })

  } catch (e) {
    logger.error("addRole ", e);
  }
}
exports.getState = function(req,res){
  try {
    var params = {
      isDelete:false,
      //type:{$in:["aa","consultant","bm"]}
    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    models.stateModel.find(params,function(err,data){
      if(err){
        logger.error("getState ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.getState,err);
      }
      return response.sendResponse(res,200,"success",constants.messages.success.getState,data);
    })

  } catch (e) {
    logger.error("getState ", e);
  }
}
exports.udpateState = function(req,res){
  try {
    var query = {
      "_id":req.body._id
    }
    delete req.body['_id'];
    var options = {new:true};
    models.stateModel.findOneAndUpdate(query, req.body,options).exec()
    .then(function(data) {
      return response.sendResponse(res,200,"success",constants.messages.success.saveState,data);
    })
    .catch(function(err) {
      logger.error("udpateState ", err);
      return response.sendResponse(res, 500,"error",constants.messages.error.saveState,err);
    })

  } catch (e) {
    logger.error("udpateState ", e);
  }
}
exports.deleteState = function(req,res){
  try {
    var query = {
      "_id":req.params.id
    }
    delete req.body['_id'];
    models.stateModel.findOneAndUpdate(query,{"isDelete":true},{"new" :true},function(err,data) {
      if(err){
        logger.error("deleteState ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.deleteState,err);
      }
      else
      return response.sendResponse(res,200,"success",constants.messages.success.deleteState);
    })

  } catch (e) {
    logger.error("deleteState ", e);
  }
}

/*state crud ends */






















/*state crud starts */
exports.addDistrict = function(req,res){
  try {
    new models.districtModel(req.body).save(function (err) {
      if(err){
        logger.error("addDistrict ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.saveData,err);
      }
      else {
        return response.sendResponse(res,200,"success",constants.messages.success.saveData);
      }
    })

  } catch (e) {
    logger.error("addDistrict ", e);
  }
}
exports.getDistrict = function(req,res){
  try {
    var params = {
      isDelete:false,
      //type:{$in:["aa","consultant","bm"]}
    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    if(req.query.isCover && (req.query.isCover == "true" || req.query.isCover == "false") ){
      params['isCover'] = Boolean(req.query.isCover);
    }
    models.districtModel.find(params,function(err,data){
      if(err){
        logger.error("getDistrict ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.getData,err);
      }
      return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
    })

  } catch (e) {
    logger.error("getDistrict ", e);
  }
}
exports.udpateDistrict = function(req,res){
  try {
    var query = {
      "_id":req.body._id
    }
    delete req.body['_id'];
    var options = {new:true};
    models.districtModel.findOneAndUpdate(query, req.body,options).exec()
    .then(function(data) {
      return response.sendResponse(res,200,"success",constants.messages.success.saveData,data);
    })
    .catch(function(err) {
      logger.error("udpateDistrict ", err);
      return response.sendResponse(res, 500,"error",constants.messages.error.saveData,err);
    })

  } catch (e) {
    logger.error("udpateDistrict ", e);
  }
}
exports.deleteDistrict = function(req,res){
  try {
    var query = {
      "_id":req.params.id
    }
    delete req.body['_id'];
    models.districtModel.findOneAndUpdate(query,{"isDelete":true},{"new" :true},function(err,data) {
      if(err){
        logger.error("deleteDistrict ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.deleteData,err);
      }
      else
      return response.sendResponse(res,200,"success",constants.messages.success.deleteData);
    })

  } catch (e) {
    logger.error("deleteDistrict ", e);
  }
}

/*state crud ends */



/*block crud starts */
exports.getBlock = function(req,res){
  console.log("inside server ctrl");
  try {
    var params = {
      isDelete:false,
    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    if(req.query.district){
      params['district'] = req.query.district;
    }
    if(req.query.isCover && (req.query.isCover == "true" || req.query.isCover == "false") ){
      params['isCover'] = Boolean(req.query.isCover);
    }
    models.blockModel.find(params).populate('district').exec()
    .then(function(data){
      return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
    })
    .catch(function(err){
      if(err){
        logger.error("getBlock ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.getData,err);
      }
    })

}
 catch (e) {
    logger.error("getBlock ", e);
  }
}
/*block crud ends */










/*gp crud starts */
exports.getGP = function(req,res){
  console.log("inside server ctrl");
  try {
    var params = {
      isDelete:false,
    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    if(req.query.block){
      params['block'] = req.query.block;
    }
    if(req.query.isCover && (req.query.isCover == "true" || req.query.isCover == "false") ){
      params['isCover'] = Boolean(req.query.isCover);
    }
    models.gpModel.find(params).populate('block').exec()
    .then(function(data){
      return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
    })
    .catch(function(err) {
      if(err){
        logger.error("getGP ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.getData,err);
      }

    })

  } catch (e) {
    logger.error("getGP ", e);
  }
}
