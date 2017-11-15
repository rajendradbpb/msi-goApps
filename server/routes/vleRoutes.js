var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');


// custom files
response = require("./../component/response");
var controllers = require("./../controllers/index");
router.post('/',function(req, res, next) {
  controllers.vleCtrl.addVle(req, res);
});
router.get('/',function(req, res, next) {
  controllers.vleCtrl.getVle(req, res);
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

module.exports = router;