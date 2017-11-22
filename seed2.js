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
var stateAdminRole, districtAdminRole, districtsArr, userArr = [], passwordhash='password@123';
init();

function init() {
  seedRoles(roles)
    .then(function(data) {
      console.log('role seeded');
      // get state admin role
      return models.roleModel.findOne({
        type: "state-admin"
      }).exec();
    })
    .then(function(stateAdminRole) {
      stateAdminRole = stateAdminRole;
      // get district admin role
      return models.roleModel.findOne({
        type: "district-admin"
      }).exec();
    })
    .then(function(districtAdmRole) {
      districtAdminRole = districtAdmRole;
      // creating same password for all the users
      return new Promise(function(resolve, reject) {
        password(passwordhash).hash(function(error, hash) {
          passwordhash = hash;
          if (error) {
            reject(error)
          } else {
            resolve(hash);
          }
        });

      })
    })
    .then(function(password) {
     passwordhash = password; // overide raw passowrd with hash
      return models.userModel.remove();
    })
    .then(function(data) {
      return models.districtModel.remove();
    })
    .then(function(data) {
      // adding district and distruct admin users respt.
      var districtCount = districts.length - 1;
      seedDistricts(districtCount);
    })

    .catch(function(err) {
      console.log("Seeds failed ",err);
    })
}

function seedRoles(roles) {
  return new Promise(function(resolve, reject) {
    models.roleModel.remove()
      .then(function() {
        // roles removed
        // seed roles
        return models.roleModel.insertMany(roles);
      })
      .then(function(rolesData) {
        resolve(rolesData);
      })
      .catch(function(err) {
        reject(error);
      })

  })
}

/*
 * seedDistricts starts
 */
function seedDistricts(districtCount) {
  try {
    if (districtCount < 0) {
      // save user
      //console.log(userArr);
      models.userModel.insertMany(userArr,function(err,users){
        if(err){
          console.error(err);
          return;
        }
        else{
          // seed blocks
          models.blockModel.remove()
          .then(function(data) {
            console.log("######################### starts seeding blocks ########################");
            
            seedBlocks(blocks);
          })
          .catch(function(err){
            console.error(err);
            return;
          })
        }
      })
      return;
    } else {
      // create district
      new models.districtModel({
        name: districts[districtCount].toLocaleUpperCase()
      }).save(function(err, district) {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log('saved district is ',district.name);
          userArr.push({
              username: district.name,
              password: passwordhash,
              role: districtAdminRole,
              district: district
            })
            seedDistricts(--districtCount);
        }
      });
    }

  } catch (e) {
    console.log(e);
    return ;
  }
}
/*
 * seedDistricts starts
 */

/**
 * create blocks starts
 */


var blocksData = [];

function seedBlocks(blocks) {
  
  // console.log('blocks[0] && blocks[0].district',blocks[0] && blocks[0].district);
  if (blocks[0] && blocks[0].district) {

    models.districtModel.findOne({
        name: blocks[0].district.trim().toLocaleUpperCase()
      }).exec()
      .then(function(district) {
        // looping in blocks under current district
        for (var i in blocks[0].blocks) {
          blocksData.push({
            district: district,
            name: blocks[0].blocks[i].toLocaleUpperCase()
          })
        }
        blocks.splice(0, 1); // remove fist index,after pushing data in query data
        console.log('blocks >>>>>',blocks.length);
        if(blocks.length > 0)
         {
           seedBlocks(blocks); // recurssion

         } 
       else {
            // saving blocks information
            // console.log('blocksData.length  ',blocksData.length);
            models.blockModel.insertMany(blocksData)
              .then(function(data) {
                console.log("######################### end seeding blocks ########################\n\n\n\n");
                return models.gpModel.remove();
        
              })
              .then(function(data) {
                console.log("######################### start seeding gps ########################\n\n\n\n");
                // console.log(gps);
                seedGps(gps);
              })
              .catch(function(err) {
                console.error(err);
                return;
        
              })
          }
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

function seedGps(gps) {
  console.log('count >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + ++count);
  if (gps[0] && gps[0].block) {

    models.blockModel.findOne({
        name: gps[0].block.trim().toLocaleUpperCase()
      }).exec()
      .then(function(block) {
        // looping in gps under current block
        for (var i in gps[0].gps) {
          gpData.push({
            block: block,
            name: gps[0].gps[i].toLocaleUpperCase()
          })
        }
        gps.splice(0, 1); // remove fist index,after pushing data in query data
        seedGps(gps); // recurssion
      })
      .catch(function(err) {
        console.error(err);
        return;
      })

  } else {
    // saving blocks information
    //console.log('gpData  ',gpData);
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
