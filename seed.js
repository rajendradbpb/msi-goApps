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
var districts = require('./seeds/districts');
var blocks = require("./seeds/blocks");
var gps = require("./seeds/gp");
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
      var usersData = [],
        districtAdminRole, passwordhash = "password@123"; // passwordhash will be changed in runtime with hash
      models.userModel.remove()
        .then(function(deleteStatus) {
          console.error("user deleted\n\n");
          // creating state admin user , this will be a single user
          console.error("Creating state admin \n\n");
          return models.roleModel.findOne({
              type: "state-admin"
            })
            .exec()
            .then()
        })
        .then(function(stateAdminRole) {
          // state admin user data queued
          usersData.push({
            role: stateAdminRole,
            username: "odisha",
            password: "odisha@123"
          });
          // getting district admin role
          return models.roleModel.findOne({
            type: "district-admin"
          }).exec().then();
        })
        .then(function(role) {
          districtAdminRole = role; // this role will be same for all the district admin
          return new Promise(function(resolve, reject) {
            password(passwordhash).hash(function(error, hash) {
              if (error) {
                reject(error)
              } else {
                resolve(hash);
              }
            });

          })
        })
        .then(function(hash) {
          passwordhash = hash;
          return models.districtModel.find({}).exec();
        })
        .then(function(districts) {
          console.log("queuing district admin users \n\n");
          console.log(districts);
          for (var i in districts) {
            usersData.push({
              role: districtAdminRole,
              username: districts[i].name,
              password: passwordhash
            });
          }
          // saving all the users
          return models.userModel.insertMany(usersData);
        })
        .then(function(users) {
          console.log("\n\n user saved success \n\n");
          callback(null, true); // return with final callback
        })
        .catch(function(error) {
          console.error("error in saving user ", error);
          callback(error, null);
        })
    }
  },

], function(err, result) {
  if (err) {
    LOG.error(err);
  } else
    console.log("seeding complete as following \n \
     1. State admin \n \
     2. District Created \n \
     3. District Admin Created \n \n ");
  models.blockModel.remove()
  .then(function(data) {
    console.log("######################### starts seeding blocks ########################");
    seedBlocks(blocks);
  })
  .catch(function(err){
    console.error(err);
  })
  console.log("******************************");
});


/**
 * create blocks starts
 */


var blocksData = [];
function seedBlocks(blocks) {
  if(blocks[0] && blocks[0].district){

    models.districtModel.findOne({name:blocks[0].district.trim()}).exec()
    .then(function(district) {
      // looping in blocks under current district
      for(var i in blocks[0].blocks){
        blocksData.push({
          district:district,
          name:blocks[0].blocks[i]
        })
      }
      blocks.splice(0,1);// remove fist index,after pushing data in query data
      seedBlocks(blocks);// recurssion
    })
    .catch(function(err){
      console.error(err);
      return;
    })

  }
  else {
    // saving blocks information
    models.blockModel.insertMany(blocksData)
    .then(function(data) {
      console.log("######################### end seeding blocks ########################\n\n\n\n");
      console.log("######################### start seeding gps ########################\n\n\n\n");
      console.log(gps);
      seedGps(gps);
    })
    .catch(function(err) {
      console.error(err);
      return;

    })
  }
}

/**
 * create blocks ends
 */








 /**
  * create gps starts
  */


 var gpData = [];
 var count = 0;
 console.log();
 function seedGps(gps) {
   console.log('count >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> '+ ++count);
   if(gps[0] && gps[0].block){

     models.blockModel.findOne({name:gps[0].block.trim()}).exec()
     .then(function(block) {
       // looping in gps under current block
       for(var i in gps[0].gps){
         gpData.push({
           block:block,
           name:gps[0].gps[i]
         })
       }
       gps.splice(0,1);// remove fist index,after pushing data in query data
       seedGps(gps);// recurssion
     })
     .catch(function(err){
       console.error(err);
       return;
     })

   }
   else {
     // saving blocks information
     models.gpModel.insertMany(gpData)
     .then(function(data) {
       console.log("######################### end seeding gps ########################");
     })
     .catch(function(err) {
       console.error(err);
       return;

     })
   }
 }

 /**
  * create gps ends
  */
