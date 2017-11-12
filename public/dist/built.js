/*! returnFiling - v0.0.0 - Sun Sep 03 2017 22:33:50 */
var app = angular.module("return_file", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngTable','angular-js-xlsx','WebService']);
app.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
  $httpProvider.interceptors.push(function ($q, $location, $window,$localStorage) {
      return {
          request: function (config) {
              var isSignInUrl = config.url.indexOf('login') > -1 ? true : false;
              if($localStorage.token ){
                config.headers = config.headers || {};
                config.headers['Authorization'] = 'bearer '+$localStorage.token;
              }
              return config;
          },
          response: function (response) {
              if (response.status === 401) {
                  $location.path('/');
              }
              return response || $q.when(response);
          }
      };
  });
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('login', {
      templateUrl: 'view/common/login.html',
      url: '/login',
	    controller:'Login_Controller',
      resolve: {
       loggedout: checkLoggedin
      }
  })
  .state('sign-up', {
      templateUrl: 'view/common/sign_up.html',
      url: '/sign-up',
      controller:'User_Controller',
    //resolve: {
      // loggedout: checkLoggedin
     // }
  })
  .state('dashboard', {
    templateUrl: 'view/dashboard.html',
    url: '/dashboard',
    controller:'Main_Controller',
    resolve: {
      loggedout: checkLoggedout
   }
  })
  .state('profile', {
    templateUrl: 'view/profile.html',
    url: '/profile',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('user-profile', {
    templateUrl: 'view/user_profile.html',
    url: '/user-profile/:user_id',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('return-file', {
    templateUrl: 'view/return_file.html',
    url: '/return-file',
    controller:'Return_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
 .state('payment', {
    templateUrl: 'view/payment.html',
    url: '/payment',
    controller:'Payment_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  
  function checkLoggedout($q, $timeout, $rootScope, $state,$http, $localStorage,UserModel) {
    var deferred = $q.defer();
     $http.get('/user/loggedin')
        .success(function (response) {
          $timeout(function(){
            $rootScope.is_loggedin = true;
            // if(UserModel.getUser())
              UserModel.setUser(response.user);
              deferred.resolve();
          },200)

        })
        .error(function (error) {
          $timeout(function(){
            $localStorage.token = null;
            $rootScope.is_loggedin = false;
            deferred.resolve();
            $state.go('login');
          },200)

        })
  }
  function checkLoggedin($q, $timeout, $rootScope,$http, $state, $localStorage) {
    var deferred = $q.defer();
    $http.get('/user/loggedin')
      .success(function(response) {
        $timeout(function(){
          $rootScope.is_loggedin = true;
          deferred.resolve();
          $state.go('dashboard');
        },200)

      })
      .error(function(error){
        $timeout(function(){
          $localStorage.token = null;
          $rootScope.is_loggedin = false;
          deferred.resolve();
        },200)
      })
  }
});
app.constant('CONFIG', {
  'HTTP_HOST': 'server/api.php'
})
app.run(function($http,$rootScope,$localStorage,$timeout,EnvService,Constants){
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    $rootScope.stateName = toState.name;
  })
  EnvService.setSettings(Constants);
});
app.factory('Util', ['$rootScope',  '$timeout' , function( $rootScope, $timeout){
    var Util = {};
    $rootScope.alerts =[];
    Util.alertMessage = function(msgType, message){
        var alert = { type:msgType , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
            $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
    };
    return Util;
}]);

// app.directive('fileModel', ['$parse', function ($parse) {
//     return {
//        restrict: 'A',
//        link: function(scope, element, attrs) {
//           var model = $parse(attrs.fileModel);
//           var modelSetter = model.assign;

//           element.bind('change', function(){
//              scope.$apply(function(){
//                 modelSetter(scope, element[0].files[0]);
//              });
//           });
//        }
//     };
//  }]);
 app.filter('getShortName', function () {
     return function (value) {
       if(value){
         var temp = angular.copy(value);
         temp = temp.split(" ");
         temp = temp[0].charAt(0)+temp[temp.length-1].charAt(0);
         return temp.toUpperCase();
       }
     };
 });
;app.constant("Constants", {
        "debug":true,
        "storagePrefix": "goAppAccount$",
        "getTokenKey" : function() {return this.storagePrefix + "token";},
        "getLoggedIn" : function() {return this.storagePrefix + "loggedin";},
        "alertTime"   : 3000,
        "getUsername" : function() {return this.storagePrefix + "username";},
        "getPassword" : function() {return this.storagePrefix + "password";},
        "getIsRemember" : function() {return this.storagePrefix + "isRemember";},
        "hashKey" : "goAppAccount",
        "envData" : {
          "env":"dev",
          "dev" : {
            "basePath" :"http://localhost:4000",
            "appPath"  :"http://localhost:4000",
          },
          "prod" : {
            "basePath" :"http://localhost:4000",
            "appPath"  :"http://localhost:4000",
          }
        },
});
;angular.module('WebService', [])
    .factory('API', function($http, $resource, EnvService) {
        return {
          getRole: {
            "url": "/role/",
            "method": "GET",
            // "isArray" : true
          },
          postRole: {
            url: "/role",
            method: "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          updateRole: {
            url: "/role/",
            method: "PUT",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          deleteRole: {
            url: "/role/:_id",
            method: "DELETE",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          userLogin : {
            url : "/user/login",
            method : "POST"
          },
          getUser : {
            url:"/user/",
            method: "GET"
          },
          postUser: {
            url: "/user/",
            method: "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          deleteUser: {
              url: "/user/:_id",
              method: "DELETE",
              "headers": {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
          },
          updateUser: {
              url: "/user/",
              method: "PUT",
              "headers": {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
          },
          postClient: {
            url: "/client",
            method: "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          postCaFirm: {
            url: "/caFirm",
            method: "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          getCaFirm : {
            url:"/caFirm/",
            method: "GET"
          },
        }
    })
    .factory('ApiGenerator', function($http, $resource, API, EnvService) {
        return {
          getApi: function(api) {
            var obj = {};
            obj = angular.copy(API[api]);
            // console.log("obj  ",obj,api);
            obj.url = EnvService.getBasePath() + obj.url; // prefix the base path
            return obj;
          }
        }
    })
    .factory('ApiCall', function($http, $resource, API, EnvService,ApiGenerator) {
      return $resource('/',null, {
        getRole: ApiGenerator.getApi('getRole'),
       // postRole: ApiGenerator.getApi('postRole'),
       // deleteRole: ApiGenerator.getApi('deleteRole'),
        //updateRole: ApiGenerator.getApi('updateRole'),
        userLogin : ApiGenerator.getApi('userLogin'),
        getUser: ApiGenerator.getApi('getUser'),
         postUser: ApiGenerator.getApi('postUser'),
        // deleteUser: ApiGenerator.getApi('deleteUser'),
         updateUser: ApiGenerator.getApi('updateUser'),
        // postCaFirm: ApiGenerator.getApi('postCaFirm'),
        // getCaFirm: ApiGenerator.getApi('getCaFirm'),
      })
    })
    .factory('EnvService',function($http,$localStorage){
      var envData = env = {};
      var settings =  {};

      return{
        setSettings : function(setting) {
          settings = setting;
          // setting env
          this.setEnvData(setting.envData);
        },
        getSettings : function(param) {
          if(param){
            return settings[param];
          }
          return null; // default
        },
        setEnvData: function (data) {
          envData = data[data.env];
        },
        getEnvData: function () {
          return envData;
        },
        getBasePath: function (env) {
          return this.getEnvData()['basePath']
        }

      }
    })


;
;app.directive('fileModell', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.directive('updateHeight',function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $ta = element;
            var window_height = $(window).height();
            $ta.css({
              'min-height':window_height - 100+'px'
            })
        }
    };
});
app.directive('fileModel', ['$parse', function ($parse) {
   return {
      restrict: 'A',
      scope: {
         fileread: "=",
         filename: "=",
      },
      link: function(scope, element, attrs) {
         element.bind('change', function(){
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
               scope.$apply(function(){
                  scope.fileread = e.target.result;
                  scope.filename = element[0].files[0].name;
               });
            };
            fileReader.readAsDataURL(element[0].files[0]);
         });
      }
   };
}]);
;/******Main controller ends here******/
  /*******************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,$uibModal){

  $scope.signOut = function(){
    delete $localStorage.token;
    $scope.is_loggedin = false;
    $state.go('login');
  }

  $scope.active_tab = 'income';
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }


  $scope.userList = {};
  $scope.getAllUsers = function(){
    ApiCall.getUser(function(response){
    $scope.userList = response.data;
    $scope.userList.nos = response.data.length;
    console.log($scope.userList);
     $scope.userData = new NgTableParams;
     $scope.userData.settings({
      dataset:$scope.userList
     })
    },function(error){
      console.log("error");
    })
   
  } 

  $scope.checkAdmin = function(){
    var superAdmin = false;
    var loggedIn_user = UserModel.getUser();
    if(loggedIn_user.role._id == "59a67678cc865a0ec49ccc7f"){
      var superAdmin = true;
    }
    return superAdmin;
  }
  $scope.checkUpdate = function(){
    var loggedIn_user = UserModel.getUser();
    if(loggedIn_user.firstname){
      $state.go('user-profile',{'user_id':loggedIn_user._id});
    }
    else{
      
      $state.go('profile');
    }

  }
  $scope.deleteUser = function(data){
    console.log(data);
   $scope.deleteUserId = data._id;
   $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'view/modals/user-delete-modal.html',
      controller : 'daleteUserModalCtrl',
      size: 'md',
      resolve:{
            userDelete : function(){
               return $scope.userDelete;
            }
      }

   })
  }
  $scope.userDelete = function(){
      ApiCall.deleteUser({
        _id: $scope.deleteUserId
      }, function(res) {
        Util.alertMessage('success', res.message);
        $scope.getUserList();
      }, function(error) {
        console.log(err);
      })
    }




});

app.controller('daleteUserModalCtrl',function($scope, $uibModalInstance,userDelete){
  $scope.ok = function () {
        userDelete();
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("User_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,Util,$stateParams){
  $scope.user = {};
  $scope.tempAdhar = {};
  $scope.tempPAN = {};

  $scope.active_tab = 'details';
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }

  /*******************************************************/

  /*********FUNCTION IS USED TO GET ROLE LIST*************/
  /*******************************************************/
  $scope.getRoll = function() {
    ApiCall.getRole(function(response){
      angular.forEach(response.data,function(item){
        if(item.type == "client"){
          $scope.user.role = item._id; 
        }
      })
    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK PASSOWORD***********/
  /*******************************************************/
  $scope.checkPassword = function(password, confirmPassword) {
    if(password != confirmPassword){
      $scope.showPasswordMisMatch = true;
    }
    if(password == confirmPassword){
      $scope.showPasswordMisMatch = false;
    }
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO REGISTER A USER***********/
  /*******************************************************/
  $scope.registerUser = function(){
    $rootScope.showPreloader = true;
    ApiCall.postUser($scope.user, function(response){
      $rootScope.showPreloader = false;
      if(response.statusCode == 200){
        Util.alertMessage('success',"You have successfully register please check your mail");
      }
      else{
        Util.alertMessage('danger',"Something went wrong please try again");
      }
    },function(error){
      $rootScope.showPreloader = false;
    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO REGISTER A USER***********/
  /*******************************************************/
  $scope.getUserDetails = function(){
    $scope.user = UserModel.getUser();
    console.log($scope.user);
  }
  /*******************************************************/
  /********FUNCTION IS USED TO UPDATE PROFILE INFO********/
  /*******************************************************/
  $scope.profileUpdate = function(){
    if($scope.tempAdhar.imageName){
      $scope.user.adharDetails = {
        fileName : $scope.tempAdhar.imageName,
        base64 : $scope.tempAdhar.image.split(";base64,")[1]
      }
    }
    if($scope.tempPAN.imageName){
      $scope.user.panDetails = {
        fileName : $scope.tempPAN.imageName,
        base64 : $scope.tempPAN.image.split(";base64,")[1]
      }
    }
    ApiCall.updateUser($scope.user , function(response){
      console.log(response);
    },function(error){

    })
  }



$scope.userDetails = {};
$scope.getUser = function(){
  var obj = {
    "_id": $stateParams.user_id
  }
  ApiCall.getUser(obj, function(response){
    $scope.userDetails = response.data;
    console.log($scope.userDetails);
  },function(error){
    console.log("error");
  })
}



});
/*******************************************************/
  /******Login controller starts here******/
  /*******************************************************/

app.controller("Login_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){
    $scope.user = {};
    $scope.userLogin = function(){
      ApiCall.userLogin($scope.user ,function(response){
        $rootScope.showPreloader = false;
        $rootScope.is_loggedin = true;
        $localStorage.token = response.data.token;
        console.log("login success");
      $timeout(function() {
        $state.go('dashboard');
      },500);
      },function(error){

      })
    }





});
/*******************************************************/
  /*****Payment controller starts here******/
  /*******************************************************/
app.controller("Payment_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){


});


/*******************************************************/
  /*****Return controller starts here******/
  /*******************************************************/
app.controller("Return_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){

$scope.user = {};
$scope.change = function(){

}
});
/*----------------------------------------------------------------------------------------------------------------------------------*/
                        /*-------------------------------------------------------------------------------*/
;app.factory("UserModel",function() {
  var userModel = {};
  userModel.setUser = function(user){
    userModel.user = user;
  }
  userModel.getUser = function(user){
    return userModel.user;
  }
  userModel.unsetUser = function(user){
    userModel.user = null ;
  }





  return userModel;
})
;app.service('LoginService',function($q,$http){
	return{
		
		jsonLogin : function(user){
			var deffered = $q.defer();
			$http.get('local.json').then(function successCallback(response) {
				console.log(response);
				angular.forEach(response.data.user,function(item){
					console.log(response);
					if(item.user_name == user.username && item.password == user.password){
						deffered.resolve(item);
					

					}
					
				})
	        }, function errorCallback(errorResponse) {
	        
	            deffered.reject(errorResponse);
	        });
	        return deffered.promise;
		}
	}
})
app.service('UserService',function($q,$http){
	return{
				userList : function(){
					var response = $http.get('local.json');
					console.log(response);
					return response;}
			}
})
app.service('ClientService',function($q,$http){
	return{
				clientList : function(){
					var response=$http.get('local.json');
					console.log(response);
					return response;

				}
	}
})
app.service('RoleService',function($q,$http){
	return{
			role : function(){
				var response = $http.get('local.json');
				console.log(response);
				return response
			}

			}
})
