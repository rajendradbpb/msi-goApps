var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
var models = require("./../models/index");
var response = require("./../component/response");
var constants = require("./../../config/constants");
var passport = require("passport");
var logger = require("./../component/log4j").getLogger('testRoutes');
var component = require("./../component/index");
// console.log(log4j);
// const logger = log4j.getLogger('testRoutes');
var excel = require('node-excel-export');
router.get('/xls', function(req, res, next) {
  models.blockModel.find().populate('district')
    .exec()
    .then(function(blocks) {
      // preparing data set
      var dataset = [];
        blocks.filter(function(block) {
        var obj = {};
        obj.name = block.name;
        obj.district = block.district.name;
        dataset.push(obj);
        return obj;
      })
      // component.utility.downloadXls(res,dataset,['col1','col2'],'sample','block'); // using custom columns as ->'col1','col2'
      component.utility.downloadXls(res,dataset,null,'sample','block'); // using defult values
    })
    .catch(function(err){
       return response.sendResponse(res, 500, "error", constants.messages.errors.getData,err);
    })

});

module.exports = router;
