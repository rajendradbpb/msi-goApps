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
router.post('/',function(req, res, next) {

});
router.get('/', function(req, res, next) {
  models.userModel.findOne({email:"client@yopmail.com"},function(err,data) {
    if(err)
      response.sendResponse(res, 500, "error", constants.messages.errors.saveData, err);
    else {
      response.sendResponse(res, 200, "success", constants.messages.success.saveData, data);

    }
  })
});
router.get('/1', function(req, res, next) {
  throw Error("this is a test Error");
});
router.get('/2', passport.authenticate('token', {session:false}),function(req, res, next) {
  logger.debug("calling from test routes\n ",JSON.stringify(req.user));
  res.send('calling from test routes');
});
router.delete('/:id', function(req, res, next) {

});

module.exports = router;
