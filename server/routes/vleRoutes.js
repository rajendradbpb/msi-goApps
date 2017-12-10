var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var component = require('./../component/index');


// custom files
response = require("./../component/response");
var controllers = require("./../controllers/index");
router.post('/',function(req, res, next) {
  controllers.vleCtrl.addVle(req, res);
});
router.get('/',function(req, res, next) {
  controllers.vleCtrl.getVle(req, res);
});
router.get('/district',function(req, res, next) {
  controllers.vleCtrl.getDistrictCount(req, res);
});
router.put('/', function(req, res, next) {
  controllers.userCtrl.udpateUser(req, res);
});
router.put('/changePassword', passport.authenticate('token', {session:false}), function(req, res, next) {
  controllers.userCtrl.changePassword(req, res);
});
router.put('/forgotPassword', function(req, res, next) {
  controllers.userCtrl.forgotPassword(req, res);
});
router.delete('/:id', function(req, res, next) {
  controllers.userCtrl.deleteUser(req, res);
});
router.get('/exportExcel', function(req, res, next) {
  controllers.vleCtrl.exportVle(req, res);
  //component.utility.downloadXls(res,req.body.data,null,'vleList','vle');
});
router.get('/exportVleSummary', function(req, res, next) {
  controllers.vleCtrl.exportVleSummary(req, res);
});

module.exports = router;
