var config = require('config');
var constants = {
  roles:['state-admin','district-admin','vle'],
  userStatus:['active','pending','inactive'],
  messages:{
    errors:{
      //global
      "saveJob"   : "save Job Failure",
      "saveData"   :"save Data Error",
      "getData"   :"Get Data Error",
      "updateData"   :"Update Data Error",
      "deleteData"   :"Delete Data Error",
      "userUnAuthorised"   :"User not authorised",
      "username"   :"username already Exists",
      "undefinedPassword":"Password not defined",
      "saveState":"error in saving state",
      "getState":"error in get state",
      "deleteState":"error in Delete state",
      },
    success:{
      //global
      "saveJob"   : "save Job Success",
      "saveData"   :"save Data Success",
      "getData"   :"Get Data Success",
      "updateData"   :"Update Data Success",
      "deleteData"   :"Delete Data Success",
      "verified":"verified",
      "getData"   :"get Data Success",
      "getUser"                     :"Success in fething user details",
      "saveUser"                 : "Success in saving user",
      "saveState":"success in saving state",
      "getState":"success in get state",
      "deleteState":"success in Delete state",
    },
  },

}
module.exports = constants;
