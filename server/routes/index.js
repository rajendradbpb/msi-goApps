var express = require('express');
var path = require('path');
var router = express.Router();
var testRoutes = require('./testRoutes');
var roleRoutes = require('./roleRoutes');
var userRoutes = require('./userRoutes');
var vleRoutes = require('./vleRoutes');
var commonRoutes = require('./commonRoutes');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});
router.use('/test', testRoutes);
router.use('/role', roleRoutes);
router.use('/user', userRoutes);
router.use('/vle', vleRoutes);
router.use('/common', commonRoutes);


module.exports = router;
