app.factory("UserModel",function() {
  var userModel = {};
  userModel.setUser = function(user){
    userModel.user = user;
    // userModel.user = {
    //   username:"cuttack",
      

    // };

  }
  userModel.getUser = function(user){
    return userModel.user;
  }
  userModel.unsetUser = function(user){
    userModel.user = null ;
  }
  return userModel;
})
