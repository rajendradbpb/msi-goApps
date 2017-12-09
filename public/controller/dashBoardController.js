app.controller("DashBoardController",function($scope,$rootScope,$state,NgTableParams,ApiCall,UserModel,$stateParams,Util){

  /******** start district *******/
$scope.getDistrict = function(){

  var obj = {};
  if($stateParams.isCover == "true") {
    obj.isCover = true;
  }
  var loggedIn_user = UserModel.getUser();
  if(!loggedIn_user){
    $timeout(function(){
      $scope.getDistrict();
    },1000);
    return;
  }
  else if (loggedIn_user.role.type == "district-admin") {
    obj.district = loggedIn_user.district;
  }
  ApiCall.getDistrict(obj,function(districts) {
    $scope.totalDistrict = new NgTableParams;
    $scope.totalDistrict.settings({
      dataset: districts.data
    });
  }, function(err) {
    Util.alertMessage("danger",err.message);
  })

}


  /******** end district *******/









  /******** start block *******/
  $scope.getBlocks = function(){

    var obj = {};
    if($stateParams.isCover == "true") {
      obj.isCover = true;
    }
    var loggedIn_user = UserModel.getUser();
    if(!loggedIn_user){
      $timeout(function(){
        $scope.getBlocks();
      },1000);
      return;
    }
    else if (loggedIn_user.role.type == "district-admin") {
      obj.district = loggedIn_user.district;
    }
    ApiCall.getBlocks(obj,function(blocks) {
      $scope.totalBlocks = new NgTableParams;
      $scope.totalBlocks.settings({
        dataset: blocks.data
      });
    }, function(err) {
      Util.alertMessage("danger",err.message);
    })

  }



  /******** end block *******/


















  /******** start gp *******/
  $scope.getGPs = function(){

    var obj = {};
    if($stateParams.isCover == "true") {
      obj.isCover = true;
    }
    var loggedIn_user = UserModel.getUser();
    if(!loggedIn_user){
      $timeout(function(){
        $scope.getBlocks();
      },1000);
      return;
    }
    else if (loggedIn_user.role.type == "district-admin") {
      obj.district = loggedIn_user.district;
    }
    ApiCall.getGPs(obj,function(gps) {
      $scope.totalGp = new NgTableParams;
      $scope.totalGp.settings({
        dataset: gps.data
      });
    }, function(err) {
      Util.alertMessage("danger",err.message);
    })

  }


  /******** end gp *******/




})
