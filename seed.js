var db = require('./server/db');
var LOG = require("./server/component/LOG");
var models = require("./server/models/index");
var waterfall = require('async-waterfall');
var password = require('password-hash-and-salt');
//*********************  Role schema  *************//
var roles = [
  {type:'state-admin'},
  {type:'district-admin'},
  {type:'vle'}
];
var states = [
  {name : 'state1'},
  {name : 'state2'},
  {name : 'state3'}
]

//************************************* User schema **************************///

waterfall([
  function(callback) {
    LOG.info("*************  saving Role information ****************");
    models.roleModel.remove()
      .then(function(doc) {
        LOG.info("deleted prev data for role");
        return models.roleModel.insertMany(roles);
      })
      .then(function(roles) {
        LOG.info("Role seeded ! ");
        callback(null, false);
      })
      .catch(function(err) {
        LOG.error("Error occured in saving role", err);
        callback(null, err);
      })
  },
  function(arg1, callback) { // saving states
    if (arg1) // error return
      callback(null, arg1);
    else {
      models.stateModel.remove()
        .then(function(doc) {
          LOG.info("deleted prev data for state");
          return models.stateModel.insertMany(states);
        })
        .then(function(states) {
          LOG.info("states seeded ! ");
          callback(null, false);
        })
        .catch(function(err) {
          LOG.error("Error occured in saving state", err);
          callback(null, err);
        })


    }
  },

], function(err, result) {
  if (err) {
    LOG.error(err);
  } else
    console.log("Seeding completed !!!!");
    LOG.info("********************************* Please terminate session By CTRL + C *************************");
});
