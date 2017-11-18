var app = angular.module("msi-goApps-goApps", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngTable','angular-js-xlsx','WebService','ui.utils','textAngular','Logger']);
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
    //  resolve: {
    //   loggedout: checkLoggedout
    // }
  })

  function checkLoggedout($q, $timeout, $rootScope, $state,$http, $localStorage,UserModel) {
    var deferred = $q.defer();
    $http.get('/user/loggedin')
    .success(function (response) {
      $timeout(function(){
        $rootScope.is_loggedin = true;
          UserModel.setUser(response.user);
          // if($state.current.name == "dashboard" && UserModel.getUser().role.type == "client") {
          //   $state.go('user-profile');
          // }
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
});
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
