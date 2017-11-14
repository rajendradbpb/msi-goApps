var db = require('./server/db');
var LOG = require("./server/component/LOG");
var models = require("./server/models/index");
var waterfall = require('async-waterfall');
var password = require('password-hash-and-salt');
var Promise = require('promise');
//*********************  Role schema  *************//
var roles = [{
    type: 'state-admin'
  },
  {
    type: 'district-admin'
  },
  {
    type: 'vle'
  }
];
var districts = [
  'district1',
  'district2',
  'district3',
  'district4'
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
  function(arg1, callback) { // saving district
    if (arg1) // error return
      callback(null, arg1);
    else {
      models.districtModel.remove()
        .then(function(doc) {
          LOG.info("deleted prev data for district");
          // preparing district data
          var districtsData = [];
          for (var i in districts) {
            districtsData.push({
              name: districts[i]
            })
          }
          return models.districtModel.insertMany(districtsData);
        })
        .then(function(states) {
          LOG.info("district seeded ! ");
          callback(null, false);
        })
        .catch(function(err) {
          LOG.error("Error occured in saving district", err);
          callback(null, err);
        })


    }
  },
  function(arg1, callback) { // saving users
    if (arg1) // error return
      callback(null, arg1);
    else {
      // preparing users data
      var usersData = [],districtAdminRole,passwordhash="password@123";// passwordhash will be changed in runtime with hash
      models.userModel.remove()
      .then(function(deleteStatus){
        console.error("user deleted\n\n");
        // creating state admin user , this will be a single user
        console.error("Creating state admin \n\n");
        return models.roleModel.findOne({type:"state-admin"})
        .exec()
        .then()
      })
      .then(function(stateAdminRole){
        // state admin user data queued
        usersData.push({
          role:stateAdminRole,
          username:"odisha",
          password:"odisha@123"
        });
        // getting district admin role
        return models.roleModel.findOne({type:"district-admin"}).exec().then();
      })
      .then(function(role) {
        districtAdminRole = role; // this role will be same for all the district admin
        return new Promise(function(resolve,reject) {
          password(passwordhash).hash(function(error, hash) {
            if(error){
              reject(error)
            }
            else{
              resolve(hash);
            }
          });

        })
      })
      .then(function(hash){
        passwordhash = hash;
        return models.districtModel.find({}).exec();
      })
      .then(function(districts) {
        console.log("queuing district admin users \n\n");
        console.log(districts);
        for(var i in districts){
          usersData.push({
            role:districtAdminRole,
            username:districts[i].name,
            password:passwordhash
          });
        }
        // saving all the users
        return models.userModel.insertMany(usersData);
      })
      .then(function(users) {
        console.log("\n\n user saved success \n\n");
        callback(null, true); // return with final callback
      })
      .catch(function(error){
        console.error("error in saving user ",error);
        callback(error, null);
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
