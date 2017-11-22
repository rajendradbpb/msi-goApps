var app = angular.module("msi-goApps-goApps", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngTable','angular-js-xlsx','WebService','ui.utils','textAngular','Logger']);
app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider,$httpProvider) {
  checkLoggedin.$inject = ["$q", "$timeout", "$rootScope", "$http", "$state", "$localStorage"];
  checkLoggedout.$inject = ["$q", "$timeout", "$rootScope", "$state", "$http", "$localStorage", "UserModel"];
  $httpProvider.interceptors.push(["$q", "$location", "$window", "$localStorage", function ($q, $location, $window,$localStorage) {
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
  }]);
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
  .state('vle', {
    templateUrl: '/view/vle_registration.html',
    url: '/vle',
    controller:'User_Controller',
    resolve: {
     loggedout: checkLoggedin
    }
  })
  .state('dashboard', {
    templateUrl: '/view/dashboard.html',
    url: '/dashboard',
    controller:'User_Controller',
     resolve: {
      loggedout: checkLoggedout
    }

  })

  .state('user-profile', {
    templateUrl: '/view/profile.html',
    url: '/user-profile',
    controller:'User_Controller',
     resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('summary', {
    templateUrl: '/view/summary.html',
    url: '/summary',
    controller:'User_Controller',
     resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('vle-list', {
    templateUrl: '/view/vle_list.html',
    url: '/vle-list',
    controller:'User_Controller',
     resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('thankYou', {
    templateUrl: '/view/thankYou.html',
    url: '/registration-complete',
    controller:'User_Controller',
  })

  function checkLoggedout($q, $timeout, $rootScope, $state,$http, $localStorage,UserModel) {
    var deferred = $q.defer();
    $http.get('/user/loggedin')
    .success(function (response) {
      $timeout(function(){
        $rootScope.is_loggedin = true;
          UserModel.setUser(response.user);
          console.log("$state >>>>> ",$state.current.name)
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
}]);
app.run(["$http", "$rootScope", "$localStorage", "$timeout", "EnvService", "Constants", function($http,$rootScope,$localStorage,$timeout,EnvService,Constants){
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    $rootScope.stateName = toState.name;
  })
  EnvService.setSettings(Constants);
}]);
app.factory('Util', ['$rootScope',  '$timeout' , function( $rootScope, $timeout){
  var Util = {};
  $rootScope.alerts =[];
  Util.alertMessage = function(msgType, message){
    if(!message){
      message = msgType;
    }
    var alert = { type:msgType , msg: message };
    $rootScope.alerts.push( alert );
    $timeout(function(){
      $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
    }, 5000);
  };
  return Util;
}]);
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
;app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("DD MMM, YYYY");
    }
  }
});
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
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0,3).toUpperCase() : '';
    }
});;app.constant("Constants", {
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
            "basePath" :"http://localhost",
            "appPath"  :"http://localhost",
          },
          "prod" : {
            "basePath" :"http://ec2-52-23-158-141.compute-1.amazonaws.com",
            "appPath"  :"http://ec2-52-23-158-141.compute-1.amazonaws.com",
          }
        },
});
;angular.module('Logger', [])
  .factory('LOG', ["$rootScope", "$timeout", function($rootScope,$timeout) {
    return {
      debug: function(message) {
        console.log(message);
      },
      info: function(message) {
        var alert = { type:"success" , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
          $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
      },
      error: function(message) {
        var alert = { type:"error" , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
          $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
      },
    }
  }])
;angular.module('WebService', [])
.factory('API', ["$http", "$resource", "EnvService", function($http, $resource, EnvService) {
  return {
    getRole: {
      "url": "/role/",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
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
    
    getDistrict:{
      url:"/common/district",
       method: "GET",
    },
    getBlocks:{
      url:"/common/block",
       method: "GET",
    },
    getGPs:{
      url:"/common/gp",
       method: "GET",
    },
    getVle: {
      "url": "/vle",
      "method": "GET",
    },
    getAreatCount: {
      "url": "/vle/district",
      "method": "GET",
    },
    forgotPassword: {
        url: "/user/forgotPassword",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    changePassword: {
        url: "/user/changePassword",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    registerVle: {
        url: "/vle",
        method: "POST",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
  }
}])
.factory('ApiCall', ["$http", "$resource", "API", "EnvService", "ApiGenerator", function($http, $resource, API, EnvService,ApiGenerator) {
  return $resource('/',null, {
    getRole: ApiGenerator.getApi('getRole'),
    userLogin : ApiGenerator.getApi('userLogin'),
    getUser: ApiGenerator.getApi('getUser'),
    postUser: ApiGenerator.getApi('postUser'),
   registerVle: ApiGenerator.getApi('registerVle'),
    changePassword:  ApiGenerator.getApi('changePassword'),
    getDistrict:     ApiGenerator.getApi('getDistrict'),
    getBlocks:     ApiGenerator.getApi('getBlocks'),
    getVle:     ApiGenerator.getApi('getVle'),
    getAreatCount:     ApiGenerator.getApi('getAreatCount'),
    getGPs:     ApiGenerator.getApi('getGPs'),
  })
}])

.factory('ApiGenerator', ["$http", "$resource", "API", "EnvService", function($http, $resource, API, EnvService) {
    return {
      getApi: function(api) {
        var obj = {};
        obj = angular.copy(API[api]);
        obj.url = EnvService.getBasePath() + obj.url;
        return obj;
        console.log(obj);
      }
    }
}])

.factory('EnvService',["$http", "$localStorage", function($http,$localStorage){
  var envData = env = {};
  var settings =  {};

  return{
    setSettings : function(setting) {
      settings = setting;
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
}]);
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
;app.controller("Login_Controller",["$scope", "$rootScope", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "$timeout", "UserModel", "Util", function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,UserModel,Util){
  $scope.user = {};
  $scope.user.username = ($localStorage.user) ? $localStorage.user.uname : "";
  $scope.user.password = ($localStorage.user) ? $localStorage.user.password : "";
  $scope.userLogin = function(){
     $rootScope.showPreloader = true;
    
    ApiCall.userLogin($scope.user ,function(response){
      if($scope.user.rememberMe)
        $localStorage.user = {
          "uname":$scope.user.username,
          "password":$scope.user.password
        }
        UserModel.setUser(response.data.user);
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
}]);
;/*****************************************************************************************************************/
app.controller("Main_Controller",["$scope", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "UserModel", "$uibModal", "$stateParams", "Util", "$timeout", function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,$uibModal,$stateParams,Util,$timeout){
   var loggedIn_user = UserModel.getUser();
   $scope.active_tab = 'BD';
   $scope.tabChange = function(tab){
    $scope.active_tab = tab;
   }
  $scope.signOut = function(){
    delete $localStorage.token;
    $rootScope.is_loggedin = false;
    UserModel.unsetUser();
    $state.go('login');
  }
  $scope.checkStateAdmin = function(){
    $scope.stateAdmin = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "state-admin"){
        $scope.stateAdmin = true;
      }
      else{
        $scope.stateAdmin = false;
      }
      return  $scope.stateAdmin;
  }
  $scope.getUserDetails = function(){
    var loggedIn_user = UserModel.getUser();
    var obj = {
        '_id' : loggedIn_user._id,
      }
        ApiCall.getUser(obj, function(response){
          $scope.userDetails = response.data;
        },function(error){
        });
      }
 }]);
app.controller('DatePickerCtrl' , ['$scope', function ($scope) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.toggleMin = function() {
            $scope.minDate = new Date();
            $scope.maxDate = new Date();
            $scope.dateMin = null || new Date();
        };
        $scope.toggleMin();

        $scope.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.mode = 'month';

        $scope.initDate = new Date();
        $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM','shortDate'];
        $scope.format = $scope.formats[4];
        $scope.format1 = $scope.formats[5];

    }
]);
;app.controller("User_Controller",["$scope", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "$timeout", "UserModel", "Util", function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,UserModel,Util){
$scope.vle = {};
$scope.row = {};
$scope.filter = {};
$scope.districtList = [];
$scope.districtCount = {};
$scope.urbanVleList = {};
$scope.vleList = {};
$scope.gpVleList = {};
$scope.municipalityList = {};
$scope.registerVle = function(){
	$rootScope.showProloader = true;
	$scope.vle.role = "5a0baa97721f3f17b86d1119";  
	ApiCall.registerVle($scope.vle,function(response){
		$rootScope.showProloader = false;
		$state.go('thankYou');
	},function(error){
		$rootScope.showProloader = false;
	});	
}
$scope.getVles = function(type){
	var loggedIn_user = UserModel.getUser();
	var obj = {};
	if(loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "district-admin"){
		obj.district = loggedIn_user.district;
	}
	if(type == "urban"){
		obj.urban = true;
	}
	if(type == "gp"){
		obj.urban = false;
	}
	ApiCall.getVle(obj, function(response){
		$scope.row = response.data;
		if(obj.urban == true){
			$scope.urbanVleList = $scope.row;
		}
		if(obj.urban == false){
			$scope.gpVleList = $scope.row;
		}		
		if(obj.urban == undefined){
			$scope.vleList = $scope.row;
		}

		$scope.vleTabledata = new NgTableParams;
		$scope.vleTabledata.settings({
			dataset : $scope.row
		});

	},function(error){
		console.log(error);
	});
}
$scope.filterVles = function(){
	var obj = {};
	var loggedIn_user = UserModel.getUser();
	obj.district = loggedIn_user.district;
	obj.block = $scope.filter.block;
	obj.gp = $scope.filter.gp;
	if(loggedIn_user.role.type = "district-admin"){
		obj.district = loggedIn_user.district;
	}
	ApiCall.getVle(obj, function(response){
		$scope.row = response.data;
		$scope.vleTabledata = new NgTableParams;
		$scope.vleTabledata.settings({
			dataset : $scope.row
		});

	},function(error){
		console.log(error);
	});
}
 $scope.getDistrict = function(row){
	 var loggedIn_user  = UserModel.getUser();
	 var obj = {};
	 if($state.current.name == "vle-list" && row.district){
		 obj._id = row.district;
	 }
	 if(row=="filter" && $state.current.name == "vle-list" ){
		obj._id = loggedIn_user.district;
	}
 	ApiCall.getDistrict(obj, function(response){
		if($state.current.name == "vle-list" && row.district){
			row.districtDetails = response.data[0];
		}
 		$scope.districtList = [];
 		angular.forEach(response.data,function(item){
 			$scope.districtList.push(item);
 		});
 		
 	},function(error){
 		console.log(error);
 	});
 }
 $scope.getBlocks = function(row){
	var loggedIn_user  = UserModel.getUser();
	var obj = {};
	if($state.current.name == "vle" && $scope.vle.district){
		obj.district = $scope.vle.district;
	}
	if($state.current.name == "vle-list" && row.block){
		obj._id = row.block;
	}
	if(row=="blockFilter" && $state.current.name == "vle-list" ){
		obj.district = loggedIn_user.district;
	}
	if(row=="changeBlock" && $scope.filter.district && $state.current.name == "vle-list" ){
		obj.district = $scope.filter.district;
	}
		 ApiCall.getBlocks(obj, function(response){
			if($state.current.name == "vle-list" && row.block){
				row.blockDetails = response.data[0];
			}
			else {
			$scope.blockList = [];
			angular.forEach(response.data,function(item){
				$scope.blockList.push(item);
			 });
			}
		 },function(error){
			 console.log(error);
		 });
	 }
	 $scope.getGps = function(row){
		var obj = {};
		if($state.current.name == "vle" && $scope.vle.block){
			obj.block = $scope.vle.block;
		}
		if($state.current.name == "vle-list" && row.gp){
			obj._id = row.gp;
		}
		if(row=="changeGps" && $scope.filter.block && $state.current.name == "vle-list" ){
			obj.block = $scope.filter.block;
		}
			 ApiCall.getGPs(obj, function(response){
				if($state.current.name == "vle-list" && row.gp){
					row.gpDetails = response.data[0];
				}
				else {
				$scope.gpList = [];
				angular.forEach(response.data,function(item){
					$scope.gpList.push(item);
				 });
				}
			 },function(error){
				 console.log(error);
			 });
		 }
 $scope.getAreaCount = function(areaType){
	 var obj = {};
	 var loggedIn_user = UserModel.getUser();
	 if(loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "district-admin"){
		obj.district = loggedIn_user.district;
	}
 	if(areaType == "district"){
 		obj.distinct = "district";
 	}
 	if(areaType == "gp"){
 		obj.distinct = "gp";
 	}
 	ApiCall.getAreatCount(obj, function(response){
 		if(obj.distinct == "district"){
			$scope.districtCount = response.data;
		}
		if(obj.distinct == "gp"){
			$scope.gpList = response.data;
		}
		if(obj.distinct == "Municipality"){
			$scope.municipalityList = response.data;
		}
		
 	},function(error){

 	});
 }
}]);;app.directive('fileModell', ['$parse', function ($parse) {
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
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('floatsOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                    var transformedInput = text.replace(/[^[0-9\.]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('capitalize', ["uppercaseFilter", "$parse", function(uppercaseFilter, $parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if(inputValue){
            input = inputValue.toLowerCase();
           var capitalized = input.substring(0,3).toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
          }
         }
         var model = $parse(attrs.ngModel);
         modelCtrl.$parsers.push(capitalize);
         capitalize(model(scope));
     }
   };
}]);