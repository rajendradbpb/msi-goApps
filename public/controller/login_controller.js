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
      console.log("logged in");
      console.log(response);
      if(response.data.user.role.type == "superAdmin" && !response.data.user.father){
         console.log("ist condition in");
           $state.go('profile-update');
      }
      else if(response.data.user.role.type == "superAdmin" && response.data.user.father){
           $state.go('dashboard');
            console.log("2nd condition in");
      }
      else if(response.data.user.father){
        $state.go('user-profile',{'user_id':response.data.user._id});
         console.log("3rd condition in");
      }
       else if((response.data.user.role.type !== "superAdmin" || response.data.user.role.type !== "client") && response.data.user.father){
          $state.go('user-profile',{'user_id':response.data.user._id});
           console.log("4th condition in");
      }
      else{
         console.log("5th condition in");
        $state.go('profile-update');
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger',"Invalid username and password");
    })
  }
});
