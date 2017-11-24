var parseXlsx = require('excel');
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
var stateAdminRole,districtAdminRole,userArr = [] ,passwordhash = 'password@123',filePath = './doc/data.xlsx';
var currentDistrict,currentDistrictId,currentBlock,currentBlockId;
var districtIndex = 1,blockIndex = 2 , gpIndex = 3;
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
      return models.blockModel.remove();
    })
    .then(function(data) {
      return models.gpModel.remove();
    })
    .then(function(data) {
      return models.gpModel.remove();
    })
    .then(function(data) {
      parseExcel();
    })

    .catch(function(err) {
      console.log("Seeds failed ",err);
    })
}

function parseExcel(){
  parseXlsx(filePath, function(err, data) {
    if(err)
      {
        console.log("Error reading file ");
        console.log(err);
         throw err;
      }
      // data is an array of arrays
      else {
        console.log('data.length after file read '+data.length);
        initData(data,1);

      }
  });
}

function initData(data,readIndex){
  console.log("Reading record "+readIndex);
  if(readIndex >= data.length)
  {
    models.userModel.insertMany(userArr,function(err,users){
      if(err)
      {
        console.error('error in saving user ',err);
        return;
      }
      else {
        console.log('saving user done');
        return;
      }
    })
    return;
  }
  models.districtModel.findOne({name:data[readIndex][districtIndex].trim()}).exec()
  .then(function(district){
    console.log("search district ",data[readIndex][districtIndex],(currentDistrict ? currentDistrict.name : null) ,(district ? district.name:null));
    if(!district){
      // currentDistrict = district;
      // currentDistrictId = district._id;
      // save district
      new models.districtModel({name:data[readIndex][districtIndex]})
      .save(function(err,district){
        if(err){
          console.log("error saving district 1",err);
          return;
        }
        currentDistrict = district;
        currentDistrictId = district._id;
        userArr.push({
            username: district.name,
            password: passwordhash,
            role: districtAdminRole,
            district: district
          })
        // create new block and new Gp
        // create block
        new models.blockModel({name:data[readIndex][blockIndex],district: currentDistrict})
        .save(function(err,block){
          if(err){
            console.log("error saving block 1",err);
            return;
          }
          currentBlock = block;
          currentBlockId = block._id;
          // create new Gp
          new models.gpModel({name:data[readIndex][gpIndex],block: currentBlock})
          .save(function(err,gp){
              if(err){
                console.log("error saving gp ",err);
                return;
              }
              initData(data,++readIndex);
          })
        })
      })
    }
    else{
      currentDistrict = district;
      currentDistrictId = district._id;
      // look for blocks
      models.blockModel.findOne({name:data[readIndex][blockIndex].trim()}).exec()
      .then(function(block){
        if(!block){
          // currentBlock = block;
          // currentBlockId = block._id;
          // save district
          new models.blockModel({name:data[readIndex][blockIndex],district: currentDistrict})
          .save(function(err,block){
            if(err){
              console.log("error saving block 2",err);
              return;
            }
            currentBlock = block;
            currentBlockId = block._id;
            // create new gp
            new models.gpModel({name:data[readIndex][gpIndex],block: currentBlock})
            .save(function(err,gp){
              if(err){
                console.log("error saving gp ",err);
                return;
              }
              initData(data,++readIndex);
            })
          })
        }
        else{
          currentBlock = block;
          currentBlockId = block._id;
          new models.gpModel({name:data[readIndex][gpIndex],block: currentBlock})
          .save(function(err,gp){
            if(err){
              console.log("error saving gp ",err);
              return;
            }
            initData(data,++readIndex);
          })
        }
      })
      .catch(function(err) {
        console.log("Error saving block 3");
        console.error(err);
        throw err;
      })
    }
  })
  .catch(function(err) {
    console.log("Error saving district 2");
    console.error(err);
    throw err;
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
