var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");

/* state CRUD starts */
router.post('/state',function(req, res, next) {
  controllers.commonCtrl.addState(req, res);
});
router.get('/state', function(req, res, next) {
  controllers.commonCtrl.getState(req, res);
});
router.put('/state', function(req, res, next) {
  controllers.commonCtrl.udpateState(req, res);
});
router.delete('state/:id', function(req, res, next) {
  controllers.commonCtrl.deleteState(req, res);
});
/* state CRUD starts */







/* district CRUD starts */
router.post('/district',function(req, res, next) {
  controllers.commonCtrl.addDistrict(req, res);
});
router.get('/district', function(req, res, next) {
  controllers.commonCtrl.getDistrict(req, res);
});
router.put('/district', function(req, res, next) {
  controllers.commonCtrl.udpateDistrict(req, res);
});
router.delete('district/:id', function(req, res, next) {
  controllers.commonCtrl.deleteDistrict(req, res);
});
/* state CRUD starts */

module.exports = router;
