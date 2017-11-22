var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");

/* state CRUD starts */
// router.post('/state',function(req, res, next) {
//   controllers.commonCtrl.addState(req, res);
// });
// router.get('/state', function(req, res, next) {
//   controllers.commonCtrl.getState(req, res);
// });
// router.put('/state', function(req, res, next) {
//   controllers.commonCtrl.udpateState(req, res);
// });
// router.delete('state/:id', function(req, res, next) {
//   controllers.commonCtrl.deleteState(req, res);
// });
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

/* Block CRUD starts */
router.post('/block',function(req, res, next) {
  controllers.commonCtrl.addBlock(req, res);
});
router.get('/block', function(req, res, next) {
  controllers.commonCtrl.getBlock(req, res);
});
router.put('/block', function(req, res, next) {
  controllers.commonCtrl.updateBlock(req, res);
});
router.delete('block/:id', function(req, res, next) {
  controllers.commonCtrl.deleteBlock(req, res);
});
/* block CRUD starts */


/* GP CRUD starts */
router.post('/gp',function(req, res, next) {
  controllers.commonCtrl.addGP(req, res);
});
router.get('/gp', function(req, res, next) {
  controllers.commonCtrl.getGP(req, res);
});
router.put('/gp', function(req, res, next) {
  controllers.commonCtrl.updateGP(req, res);
});
router.delete('gp/:id', function(req, res, next) {
  controllers.commonCtrl.deleteGP(req, res);
});
/* GP CRUD starts */

module.exports = router;
