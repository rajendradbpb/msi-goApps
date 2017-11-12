angular.module('WebService', [])
.factory('API', function($http, $resource, EnvService) {
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
    postClient: {
      url: "/client",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    postReturnFile: {
      url: "/returnFile",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getcount : {
      url:"/returnFile/count",
      method: "GET"
    },
    getReferral : {
      url:"/referral/count",
      method: "GET"
    },
    getReferralList : {
      url:"/referral",
      method: "GET"
    },
     getOverview : {
      url:"/referral/overview",
      method: "GET"
    },
    getReturnList : {
      url:"/returnFile",
      method: "GET"
    },
    getItr : {
      url:"/returnFile/itr",
      method: "GET"
    },
    postTransaction: {
      url: "/returnFile/transaction",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getFiscalYear: {
      url:"/returnFile/fiscalYear",
      method: "GET"
    },
    getReturnFile: {
      url:"/returnFile",
      method: "GET"
    },
    updateReturnFile: {
        url: "/returnFile/",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    getPaymentList: {
      url:"/returnFile/transaction/payment",
      method: "GET"
    },
    postTemplate: {
      url: "/template",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    putTemplate: {
      url: "/template",
      method: "PUT",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getTemplate: {
      url: "/template",
      method: "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    jobcategoryList:{
      url:"/job",
      method: "GET"
    },
    postAssignment: {
      url: "/jobAssignment",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getjobAssignments:{
      url:"/jobAssignment",
      method: "GET"
    },
    updateJobAssignment: {
        url: "/jobAssignment/",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
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
  }
})
.factory('ApiCall', function($http, $resource, API, EnvService,ApiGenerator) {
  return $resource('/',null, {
    getRole: ApiGenerator.getApi('getRole'),
    userLogin : ApiGenerator.getApi('userLogin'),
    getUser: ApiGenerator.getApi('getUser'),
    postUser: ApiGenerator.getApi('postUser'),
    getFiscalYear: ApiGenerator.getApi('getFiscalYear'),
    deleteUser: ApiGenerator.getApi('deleteUser'),
    updateUser: ApiGenerator.getApi('updateUser'),
    postReturnFile: ApiGenerator.getApi('postReturnFile'),
    getcount: ApiGenerator.getApi('getcount'),
    getReturnList:ApiGenerator.getApi('getReturnList'),
    getReturnFile:ApiGenerator.getApi('getReturnFile'),
    getItr:ApiGenerator.getApi('getItr'),
    postTransaction: ApiGenerator.getApi('postTransaction'),
    updateReturnFile: ApiGenerator.getApi('updateReturnFile'),
    getPaymentList: ApiGenerator.getApi('getPaymentList'),
    getReferral: ApiGenerator.getApi('getReferral'),
    getTemplate: ApiGenerator.getApi('getTemplate'),
    postTemplate: ApiGenerator.getApi('postTemplate'),
    putTemplate: ApiGenerator.getApi('putTemplate'),
    getReferralList : ApiGenerator.getApi('getReferralList'),
    getOverview:  ApiGenerator.getApi('getOverview'),
    jobcategoryList :  ApiGenerator.getApi('jobcategoryList'),
    postAssignment:  ApiGenerator.getApi('postAssignment'),
    getjobAssignments:  ApiGenerator.getApi('getjobAssignments'),
    updateJobAssignment:  ApiGenerator.getApi('updateJobAssignment'),
    forgotPassword:  ApiGenerator.getApi('forgotPassword'),
    changePassword:  ApiGenerator.getApi('changePassword'),
  })
})

.factory('ApiGenerator', function($http, $resource, API, EnvService) {
    return {
      getApi: function(api) {
        var obj = {};
        obj = angular.copy(API[api]);
        obj.url = EnvService.getBasePath() + obj.url;
        return obj;
      }
    }
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
});
