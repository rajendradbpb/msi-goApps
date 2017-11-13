var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
router.post('/',function(req, res, next) {
  controllers.roleCtrl.addRole(req, res);
});
router.get('/', function(req, res, next) {
  controllers.roleCtrl.getRole(req, res);
});
router.put('/', function(req, res, next) {
  controllers.roleCtrl.udpateRole(req, res);
});
router.delete('/:id', function(req, res, next) {
  controllers.roleCtrl.deleteRole(req, res);
});

module.exports = router;
