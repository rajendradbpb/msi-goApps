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
router.get('/summary', function(req, res, next) { 
   var summaryArr = [];
   models.districtModel.find().exec()
   .then(function(districts) {
   var summaryArr = [];
   var count = 0;

      createSummary(res,summaryArr,districts,count)
   })
   .catch(function(err) {
    return response.sendResponse(res, 500, "error 1", constants.messages.errors.getData,err);
   })

   function createSummary(res,summaryArr,districts,count){
     console.log(districts.length +"---------"+count);
     if(count >= districts.length){
      console.log("summaryArr ",summaryArr);
      //  return summaryArr; // break recurssion
      return response.sendResponse(res, 200, "success", constants.messages.success.getData,summaryArr);
     }
      var districtObj = {};
      districtObj.district = districts[count].name;
      models.vleModel.find({district:districts[count]}).distinct("block").count().exec()
      .then(function(blockCount) {
        console.log("got block count ",blockCount,districts[count].name);
        districtObj.blockCount = blockCount;
        // get gps 
        models.vleModel.find({district:districts[count]}).distinct("gp").count().exec(function(err,gpCount){
          console.log("gpCount",gpCount,districts[count].name);
          districtObj.gpCount = gpCount;
          models.vleModel.find({district:districts[count],isUrban:true}).count().exec(function(err,urbanCount) {
            console.log("urbanCount",urbanCount,districts[count].name);
            districtObj.urbanCount = urbanCount;
            summaryArr.push(districtObj);
            // call to next recurssion
            createSummary(res,summaryArr,districts,++count);
          });
        })
      })
      .catch(function(err) {
        return response.sendResponse(res, 500, "error2", constants.messages.errors.getData,err);
      })
   }
})

module.exports = router;
