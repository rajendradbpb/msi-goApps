var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
var models = require("./../models/index");
var response = require("./../component/response");
var constants = require("./../../config/constants");
var passport = require("passport");
var logger = require("./../component/log4j").getLogger('testRoutes');
// console.log(log4j);
// const logger = log4j.getLogger('testRoutes');
var excel = require('node-excel-export');
router.get('/xls', function(req, res, next) {
  console.log(">>>>>>>>>>>>>>>>>>>");
  models.stateModel.find().select('name')
    .exec()
    .then(function(states) {
      var dataset = [{name:"name1"},{name:"name2"},{name:"name3"}];
      const heading = [['state']];
      // states.filter(function(state) {
      //   console.log("**** ",state.name);
      //   dataset.push(state.name);
      //
      //   return state.name;
      // })
      // console.log(dataset);
      var specification = {
        name: { // <- the key should match the actual data key
          displayName: 'State', // <- Here you specify the column header
          width: 120 // <- width in pixels
        }
      };
      var report = excel.buildExport(
        [{
          name: 'State',
          heading: heading,
          specification: specification,
          data: dataset // <-- Report data
        }]
      );
      res.attachment('state.xlsx');
      return res.send(report);

    })
    .catch(function(err) {
      console.log(err);
      return res.sendStatus(500).json({
        error: err
      });
    })
});


module.exports = router;
