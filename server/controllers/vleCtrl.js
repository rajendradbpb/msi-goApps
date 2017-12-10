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


exports.addVle = function(req, res) {
  try {
    // models.vleModel.preSave();
    console.log("add vle");
    new models.vleModel(req.body).save(function(err) {
      if (err) {
        logger.error("addVle ", err);
        return response.sendResponse(res, 500, "error", constants.messages.errors.saveRole, err);
      } else {
        return response.sendResponse(res, 200, "success", constants.messages.success.saveRole);
      }
    })

  } catch (e) {
    logger.error("addVle ", e);
  }
}
exports.getVle = function(req, res) {
  try {
    var params = {
      isDelete: false,

    };
    if (req.query._id) {
      params['_id'] = req.query._id;
    }
    if (req.query.urban) {
      params['urban'] = req.query.urban;
    }
    if (req.query.district) {
      params['district'] = req.query.district;
    }
    if (req.query.block) {
      params['block'] = req.query.block;
    }
    if (req.query.gp) {
      params['gp'] = req.query.gp;
    }
    models.vleModel.find(params).populate('district block gp').exec()
      .then(function(data) {
        return response.sendResponse(res, 200, "success", constants.messages.success.fetchRoles, data);
      })
      .catch(function(err) {
        return response.sendResponse(res, 500, "error", constants.messages.errors.fetchRoles, err);
      })

  } catch (e) {
    logger.error("getRole ", e);
  }
}
exports.getDistrictCount = function(req, res) {
  try {
    var params = {
      isDelete: false,
      //type:{$in:["aa","consultant","bm"]}
    };
    // if(req.query._id){
    //   params['_id'] = req.query._id;
    // }
    if (req.query.distinct == "district") {
      distinct = 'district';
    }
    if (req.query.distinct == "gp") {
      distinct = 'gp';
    }
    if (req.query.distinct == "Municipality") {
      params['urbanType'] = req.query.urbanType;
      distinct = 'urbanType';
    }

    models.vleModel.find(params).distinct(distinct, function(err, data) {
      if (err) {
        logger.error("getVle ", err);
        return response.sendResponse(res, 500, "error", constants.messages.errors.fetchRoles, err);
      }

      return response.sendResponse(res, 200, "success", constants.messages.success.fetchRoles, data);
    })

  } catch (e) {
    logger.error("getRole ", e);
  }
}

exports.exportVle = function(req, res) {
  var exportProperties = [];
  var params = {
    isDelete: false,
  };
  if (req.query.district == "district") {
    params.district = req.query.district;
  }
  if (req.query.block) {
    params.block = req.query.block;
  }
  if (req.query.gp) {
    params.gp = req.query.gp;
  }
  if (req.query.exportProperties) {
    exportProperties = req.query.exportProperties.split(",");
  }
  if (req.query.distinct == "Municipality") {
    params['urbanType'] = req.query.urbanType;
    distinct = 'urbanType';
  }
  console.log("exportProperties   ", exportProperties);
  models.vleModel.find(params).populate("district block gp").exec()
    .then(function(data) {
      var dataArr = [];
      for (var i in data) {
        var obj = {};
        // obj.district = data[i].district ? data[i].district.name : "NA";
        // obj.block = data[i].block ? data[i].block.name : "NA";
        // obj.gp = data[i].gp ? data[i].gp.name : "NA";
        // obj.name = data[i].name ? data[i].name : "NA";
        // obj.urbanType = data[i].urbanType ? data[i].urbanType : "NA";
        if (exportProperties.indexOf("name") != -1)
          obj.name = data[i].name ? data[i].name : "NA";
        if (exportProperties.indexOf("mobile") != -1)
          obj.mobile = data[i].mobile ? data[i].mobile : "NA";
        if (exportProperties.indexOf("altMobile") != -1)
          obj.altMobile = data[i].altMobile ? data[i].altMobile : "NA";
        if (exportProperties.indexOf("email") != -1)
          obj.email = data[i].email ? data[i].email : "NA";
        if (exportProperties.indexOf("digiMail") != -1)
          obj.digiMail = data[i].digiMail ? data[i].digiMail : "NA";
        if (exportProperties.indexOf("cscId") != -1)
          obj.cscId = data[i].cscId ? data[i].cscId : "NA";
        if (exportProperties.indexOf("religion") != -1)
          obj.religion = data[i].religion ? data[i].religion : "NA";
        if (exportProperties.indexOf("state") != -1)
          obj.state = "Odisha";
        if (exportProperties.indexOf("district") != -1)
          obj.district = data[i].district && data[i].district.name ? data[i].district.name : "NA";
        if (exportProperties.indexOf("block") != -1)
          obj.block = data[i].block && data[i].block.name ? data[i].block.name : "NA";
        if (exportProperties.indexOf("gp") != -1)
          obj.gp = data[i].gp && data[i].gp.name ? data[i].gp.name : "NA";

        if (exportProperties.indexOf("village") != -1)
          obj.village = data[i].village ? data[i].village : "NA";
        if (exportProperties.indexOf("urban") != -1)
          obj.urban = data[i].urban ? data[i].urban : "NA";
        if (exportProperties.indexOf("urbanType") != -1)
          obj.urbanType = data[i].urbanType ? data[i].urbanType : "NA";
        if (exportProperties.indexOf("ward") != -1)
          obj.ward = data[i].ward ? data[i].ward : "NA";
        if (exportProperties.indexOf("dob") != -1)
          obj.dob = data[i].dob ? data[i].dob : "NA";
        if (exportProperties.indexOf("gender") != -1)
          obj.gender = data[i].gender ? data[i].gender : "NA";
        if (exportProperties.indexOf("caste") != -1)
          obj.caste = data[i].caste ? data[i].caste : "NA";
        if (exportProperties.indexOf("pan") != -1)
          obj.pan = data[i].pan ? data[i].pan : "NA";
        if (exportProperties.indexOf("adhar") != -1)
          obj.adhar = data[i].adhar ? data[i].adhar : "NA";
        if (exportProperties.indexOf("plotNo") != -1)
          obj.plotNo = data[i].plotNo ? data[i].plotNo : "NA";
        if (exportProperties.indexOf("lane") != -1)
          obj.lane = data[i].lane ? data[i].lane : "NA";
        if (exportProperties.indexOf("at") != -1)
          obj.at = data[i].at ? data[i].at : "NA";
        if (exportProperties.indexOf("po") != -1)
          obj.po = data[i].po ? data[i].po : "NA";
        if (exportProperties.indexOf("city") != -1)
          obj.city = data[i].city ? data[i].city : "NA";
        if (exportProperties.indexOf("dist") != -1)
          obj.dist = data[i].dist ? data[i].dist : "NA";
        if (exportProperties.indexOf("state") != -1)
          obj.state = data[i].state ? data[i].state : "NA";
        if (exportProperties.indexOf("country") != -1)
          obj.country = "India";
        if (exportProperties.indexOf("pin") != -1)
          obj.pin = data[i].pin ? data[i].pin : "NA";
        if (exportProperties.indexOf("matricBoard") != -1)
          obj.matricBoard = data[i].matricBoard ? data[i].matricBoard : "NA";
        if (exportProperties.indexOf("matricInstitute") != -1)
          obj.matricInstitute = data[i].matricInstitute ? data[i].matricInstitute : "NA";
        if (exportProperties.indexOf("matricPassout") != -1)
          obj.matricPassout = data[i].matricPassout ? data[i].matricPassout : "NA";
        if (exportProperties.indexOf("matricPercent") != -1)
          obj.matricPercent = data[i].matricPercent ? data[i].matricPercent : "NA";
        if (exportProperties.indexOf("interBoard") != -1)
          obj.interBoard = data[i].interBoard ? data[i].interBoard : "NA";
        if (exportProperties.indexOf("interInstitute") != -1)
          obj.interInstitute = data[i].interInstitute ? data[i].interInstitute : "NA";
        if (exportProperties.indexOf("interPassout") != -1)
          obj.interPassout = data[i].interPassout ? data[i].interPassout : "NA";
        if (exportProperties.indexOf("interPercent") != -1)
          obj.interPercent = data[i].interPercent ? data[i].interPercent : "NA";
        if (exportProperties.indexOf("gradBoard") != -1)
          obj.gradBoard = data[i].gradBoard ? data[i].gradBoard : "NA";
        if (exportProperties.indexOf("gradInstitute") != -1)
          obj.gradInstitute = data[i].gradInstitute ? data[i].gradInstitute : "NA";
        if (exportProperties.indexOf("gradPassout") != -1)
          obj.gradPassout = data[i].gradPassout ? data[i].gradPassout : "NA";
        if (exportProperties.indexOf("gradPercent") != -1)
          obj.gradPercent = data[i].gradPercent ? data[i].gradPercent : "NA";
        if (exportProperties.indexOf("pgBoard") != -1)
          obj.pgBoard = data[i].pgBoard ? data[i].pgBoard : "NA";
        if (exportProperties.indexOf("pgInstitute") != -1)
          obj.pgInstitute = data[i].pgInstitute ? data[i].pgInstitute : "NA";
        if (exportProperties.indexOf("pgPassout") != -1)
          obj.pgPassout = data[i].pgPassout ? data[i].pgPassout : "NA";
        if (exportProperties.indexOf("pgPercent") != -1)
          obj.pgPercent = data[i].pgPercent ? data[i].pgPercent : "NA";
        if (exportProperties.indexOf("otherQualification") != -1)
          obj.otherQualification = data[i].otherQualification ? data[i].otherQualification : "NA";
        if (exportProperties.indexOf("cscBuildingArea") != -1)
          obj.cscBuildingArea = data[i].cscBuildingArea ? data[i].cscBuildingArea : "NA";
        if (exportProperties.indexOf("personEngaged") != -1)
          obj.personEngaged = data[i].personEngaged ? data[i].personEngaged : "NA";
        if (exportProperties.indexOf("webCamera") != -1)
          obj.webCamera = data[i].webCamera ? data[i].webCamera : "NA";
        if (exportProperties.indexOf("furnitureDetails") != -1)
          obj.furnitureDetails = data[i].furnitureDetails ? data[i].furnitureDetails : "NA";
        if (exportProperties.indexOf("vsatBbDcNofn") != -1)
          obj.vsatBbDcNofn = data[i].vsatBbDcNofn ? data[i].vsatBbDcNofn : "NA";
        if (exportProperties.indexOf("pmgDishaId") != -1)
          obj.pmgDishaId = data[i].pmgDishaId ? data[i].pmgDishaId : "NA";
        if (exportProperties.indexOf("kit") != -1)
          obj.kit = data[i].kit ? data[i].kit : "NA";
        if (exportProperties.indexOf("providingInsurance") != -1)
          obj.providingInsurance = data[i].providingInsurance ? data[i].providingInsurance : "NA";
        if (exportProperties.indexOf("eWallet") != -1)
          obj.eWallet = data[i].eWallet ? data[i].eWallet : "NA";
        if (exportProperties.indexOf("censusCode") != -1)
          obj.censusCode = data[i].censusCode ? data[i].censusCode : "NA";
        if (exportProperties.indexOf("cscLattitude") != -1)
          obj.cscLattitude = data[i].cscLattitude ? data[i].cscLattitude : "NA";
        if (exportProperties.indexOf("buildingOwnership") != -1)
          obj.buildingOwnership = data[i].buildingOwnership ? data[i].buildingOwnership : "NA";
        if (exportProperties.indexOf("noOfLaptop") != -1)
          obj.noOfLaptop = data[i].noOfLaptop ? data[i].noOfLaptop : "NA";
        if (exportProperties.indexOf("noOfPrinters") != -1)
          obj.noOfPrinters = data[i].noOfPrinters ? data[i].noOfPrinters : "NA";
        if (exportProperties.indexOf("bioMetric") != -1)
          obj.bioMetric = data[i].bioMetric ? data[i].bioMetric : "NA";
        if (exportProperties.indexOf("commonBranding") != -1)
          obj.commonBranding = data[i].commonBranding ? data[i].commonBranding : "NA";
        if (exportProperties.indexOf("powerBackUp") != -1)
          obj.powerBackUp = data[i].powerBackUp ? data[i].powerBackUp : "NA";
        if (exportProperties.indexOf("tab") != -1)
          obj.tab = data[i].tab ? data[i].tab : "NA";
        if (exportProperties.indexOf("ProvidingEDistrictServices") != -1)
          obj.ProvidingEDistrictServices = data[i].ProvidingEDistrictServices ? data[i].ProvidingEDistrictServices : "NA";
        if (exportProperties.indexOf("cscLocation") != -1)
          obj.cscLocation = data[i].cscLocation ? data[i].cscLocation : "NA";
        if (exportProperties.indexOf("ownership") != -1)
          obj.ownership = data[i].ownership ? data[i].ownership : "NA";
        if (exportProperties.indexOf("cscLongitude") != -1)
          obj.cscLongitude = data[i].cscLongitude ? data[i].cscLongitude : "NA";
        if (exportProperties.indexOf("cscPin") != -1)
          obj.cscPin = data[i].cscPin ? data[i].cscPin : "NA";

        dataArr.push(obj);
      };

      // return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
      component.utility.downloadXls(res, dataArr, null, 'vleList', 'vle');
    })
    .catch(function(error) {
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, error);
    })
}
