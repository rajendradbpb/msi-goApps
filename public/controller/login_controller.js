app.controller("Login_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,UserModel,Util){
  $scope.user = {};
  $scope.user.username = ($localStorage.user) ? $localStorage.user.uname : "";
  $scope.user.password = ($localStorage.user) ? $localStorage.user.password : "";
  /*******************************************************/
  /*********FUNCTION IS USED TO SIGN IN PROFILE***********/
  /*******************************************************/
  $scope.userLogin = function(){
     $rootScope.showPreloader = true;
    
    ApiCall.userLogin($scope.user ,function(response){
      if($scope.user.rememberMe)
        $localStorage.user = {
          "uname":$scope.user.username,
          "password":$scope.user.password
        }
        UserModel.setUser(response.data.user);
        //emit user logged in
      //$scope.$emit("LOGGED_IN");
      $rootScope.showPreloader = false;
      $localStorage.token = response.data.token;
      $rootScope.is_loggedin = true;
     $state.go('dashboard');
    },function(error){
      $rootScope.showPreloader = false;
      console.log(error);
      Util.alertMessage('danger',"Invalid username and password");
    })
  }
});
